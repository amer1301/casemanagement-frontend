import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import Header from "../Header/Header";
import dashboardIcon from "../../assets/Dashboard.svg";
import casesIcon from "../../assets/Ärenden.svg";
import createIcon from "../../assets/Skapa ärenden.svg";
import logoutIcon from "../../assets/Logout.svg";
import loginIcon from "../../assets/Logga in.svg";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const { token, role } = useAuth();
  const isLoggedIn = !!token;

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
          <h2 className={styles.logo}>CaseManagement</h2>

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
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                  }
                >
                  <img src={dashboardIcon} alt="dashboard" />
                  <span>Dashboard</span>
                </NavLink>
              )}

              {/* ADMIN + MANAGER */}
              {(role === "ADMIN" || role === "MANAGER") && (
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                  }
                >
                  <img src={casesIcon} alt="ärenden" />
                  <span>Ärenden</span>
                </NavLink>
              )}

              {/* USER */}
              {role === "USER" && (
                <NavLink
                  to="/my-cases"
                  className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                  }
                >
                  <img src={casesIcon} alt="mina ärenden" />
                  <span>Mina ärenden</span>
                </NavLink>
              )}

              {role && role === "USER" && (
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                  }
                >
                  <img src={createIcon} alt="create" />
                  <span>Skapa ärende</span>
                </NavLink>
              )}

            </nav>
          )}

          <div className={styles.logout} onClick={handleAuthClick}>
            <img src={isLoggedIn ? logoutIcon : loginIcon} alt="auth" />
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