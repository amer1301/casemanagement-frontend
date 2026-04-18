import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import profileImg from "../../assets/Profilbild Default.png";
import { useAuth } from "../../context/authContext";
import { requestAdminRole, getCases } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const navigate = useNavigate();
  const { name, email, role, token } = useAuth();

  useEffect(() => {
    const checkAdminRequest = async () => {
      try {
        const res = await getCases();

        const exists = res.data.some(
          (c: any) =>
            c.type === "ROLE_REQUEST" &&
            c.status === "SUBMITTED"
        );

        setHasActiveRequest(exists);
      } catch (err) {
        console.error(err);
      }
    };

    checkAdminRequest();
  }, []);

  const isLoggedIn = !!token;

  if (!isLoggedIn) return null;

  const requestAdmin = async () => {
    try {
      setLoading(true);

      await requestAdminRole();

      setHasActiveRequest(true);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
              hasActiveRequest ? (
                <p className={styles.info}>
                  Du har redan en aktiv admin-begäran
                </p>
              ) : (
                <button
                  className={styles.adminButton}
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  {loading ? "Skickar..." : "Begär admin-roll"}
                </button>
              )
            )}
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logga ut
            </button>

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