import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>CaseManagement</h2>

<nav className={styles.nav}>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/cases">Ärenden</Link>
  <Link to="/create">Skapa ärende</Link>
</nav>
      </aside>

      <div className={styles.main}>
        <Header />

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;