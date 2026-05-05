import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import Header from "../Header/Header";

import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { getUnreadCount } from "../../api/caseApi";

type LayoutProps = {
  children: ReactNode;
};

/**
 * Layout-komponent som definierar sidans struktur.
 *
 * Funktionalitet:
 * - Sidebar-navigation baserad på användarens roll
 * - Header visas endast för inloggade användare
 * - Notifikationsbadge uppdateras dynamiskt
 */
const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role } = useAuth();
  const isLoggedIn = !!token;

  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Hämtar antal olästa notifikationer.
   *
   * location.pathname används som dependency för att
   * trigga uppdatering när användaren navigerar,
   * så att badge alltid visar aktuell data.
   */
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchUnreadCount();
    }
  }, [token, location.pathname]);

  /**
   * Hanterar login/logout.
   * - Tar bort token vid logout
   * - Navigerar till login-sidan
   */
  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.app}>

        <aside className={styles.sidebar}>
          {!isLoggedIn && (
            <p className={styles.loginHint}>
              Logga in för att se innehåll
            </p>
          )}

          {isLoggedIn && (
            <nav className={styles.nav}>

              {(role === "ADMIN" || role === "MANAGER") && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/Dashboard.svg" alt="dashboard" />
                  <span>Översikt</span>
                </NavLink>
              )}

              {(role === "ADMIN" || role === "MANAGER") && (
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/Ärenden.svg" alt="ärenden" />
                  <span>Ärenden</span>
                </NavLink>
              )}

              {role === "MANAGER" && (
                <NavLink
                  to="/admin-requests"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/adminRequest.svg" alt="admin-begäran" />
                  <span>Admin-begäran</span>
                </NavLink>
              )}

              {(role === "USER" || role === "ADMIN") && (
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/notification.svg" alt="notifikationer" />
                  <span>Notifikationer</span>

                  {unreadCount > 0 && (
                    <span className={styles.badge}>
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              {role === "ADMIN" && (
                <NavLink
                  to="/my-cases"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/Ärenden.svg" alt="mina ärenden" />
                  <span>Mina ärenden</span>
                </NavLink>
              )}

              {role === "USER" && (
                <NavLink
                  to="/user/my-cases"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/Ärenden.svg" alt="mina ärenden" />
                  <span>Mina ärenden</span>
                </NavLink>
              )}

              {role === "USER" && (
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <img src="/skapaÄrenden.svg" alt="create" />
                  <span>Skapa ärende</span>
                </NavLink>
              )}

            </nav>
          )}

          <div className={styles.logout} onClick={handleAuthClick}>
            <img
  src={isLoggedIn ? "/logOut.svg" : "/logIn.svg"}
  alt="auth"
/>
<span>{isLoggedIn ? "Logga ut" : "Logga in"}</span>
          </div>
        </aside>

        <div className={styles.main}>
          {isLoggedIn && <Header />}

          <div className={styles.content}>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;