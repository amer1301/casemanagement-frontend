import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import Header from "../Header/Header";
import dashboardIcon from "../../assets/Dashboard.svg";
import casesIcon from "../../assets/Ärenden.svg";
import createIcon from "../../assets/Skapa ärenden.svg";
import logoutIcon from "../../assets/Logout.svg";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

return (
  <div className={styles.page}>
    <div className={styles.app}>

     <aside className={styles.sidebar}>
  <h2 className={styles.logo}>CaseManagement</h2>

<nav className={styles.nav}>
  <div className={styles.navItem} onClick={() => navigate("/dashboard")}>
  <img src={dashboardIcon} alt="dashboard" />
  <span>Dashboard</span>
</div>

<div className={styles.navItem} onClick={() => navigate("/")}>
  <img src={casesIcon} alt="ärenden" />
  <span>Ärenden</span>
</div>

<div className={styles.navItem} onClick={() => navigate("/create")}>
  <img src={createIcon} alt="skapa ärende" />
  <span>Skapa ärende</span>
</div>
</nav>
  <div className={styles.logout} onClick={handleLogout}>
    <img src={logoutIcon} alt="logout" />
    <span>Logga ut</span>
  </div>
</aside>

      <div className={styles.main}>
        <Header />

        <div className={styles.content}>
          {children}
        </div>
      </div>

    </div>
  </div>
);
};

export default Layout;