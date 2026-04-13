import styles from "./Header.module.css";
import profileImg from "../../assets/Profilbild Default.png";

const Header = () => {
  const username = "Amanda"; // ska ersättas senare med riktig data

  return (
    <div className={styles.header}>
      <p className={styles.welcome}>
        Välkommen tillbaka {username}
      </p>

      <img
        src={profileImg}
        alt="profilbild"
        className={styles.avatar}
      />
    </div>
  );
};

export default Header;