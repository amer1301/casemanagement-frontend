import { useState } from "react";
import axios from "axios";
import styles from "./Header.module.css";
import profileImg from "../../assets/Profilbild Default.png";

function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const isLoggedIn = !!token;

  if (!isLoggedIn) return null;

  const requestAdmin = async () => {

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/cases/request-admin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast("Begäran skickad!");
      setShowModal(false);

      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error(err);
      setToast("Något gick fel");

      setTimeout(() => setToast(""), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.header}>
      <p className={styles.welcome}>
        Välkommen tillbaka {name || "Användare"}
      </p>

      <div className={styles.profileWrapper}>
        <img
          src={profileImg}
          alt="profil"
          className={styles.avatar}
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className={styles.dropdown}>
            <button
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <div className={styles.userInfo}>
              <p className={styles.name}>{name || "Användare"}</p>
              <p className={styles.email}>{email || "Ingen e-post"}</p>
              <span className={styles.role}>{role}</span>
            </div>

            {role === "USER" && (
              <button
                className={styles.adminButton}
                onClick={() => setShowModal(true)}
                disabled={loading}
              >
                {loading ? "Skickar..." : "Begär admin-roll"}
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className={styles.overlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h3>Bekräfta</h3>
            <p>Vill du begära admin-roll?</p>

            <button
              className={styles.confirmButton}
              onClick={requestAdmin}
              disabled={loading}
            >
              {loading ? "Skickar..." : "Ja, fortsätt"}
            </button>
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

export default Header;