import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <input
        className={styles.search}
        placeholder="Search..."
      />

      <div className={styles.user}>
        <span>🔔</span>
        <span>Admin</span>
      </div>
    </div>
  );
};

export default Header;