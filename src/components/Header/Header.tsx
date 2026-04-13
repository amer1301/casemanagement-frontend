import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import profileImg from "../../assets/Profilbild Default.png";

function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!localStorage.getItem("token");

  // 👉 Stäng dropdown när man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <div className={styles.header}>
      <p className={styles.welcome}>
        Välkommen tillbaka, {name || "Användare"}
      </p>

      <div className={styles.profileWrapper} ref={dropdownRef}>
        <img
          src={profileImg}
          alt="profil"
          className={styles.avatar}
          onClick={() => setOpen((prev) => !prev)}
        />

        {open && (
          <div className={styles.dropdown}>
            <p className={styles.name}>
              {name || "Användare"}
            </p>

            <p className={styles.email}>
              {email || "Ingen e-post"}
            </p>

            <p className={styles.role}>
              {role || "Ingen roll"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;