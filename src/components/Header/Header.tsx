import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useAuth } from "../../context/authContext";
import { getMyRoleRequests, requestAdminRole } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";

/**
 * Header-komponent som visar användarinformation och meny.
 *
 * Funktionalitet:
 * - Visar användarens namn, email och roll
 * - Hanterar logout
 * - Tillåter USER att begära admin-roll
 * - Visar dropdown och modal
 */
function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  const navigate = useNavigate();
  const { name, email, role, token } = useAuth();

  const isLoggedIn = !!token;

  /**
   * Hämtar användarens rollbegäranden vid inloggning
   * för att kontrollera om en aktiv (PENDING) begäran finns
   */
  useEffect(() => {
    const checkAdminRequest = async () => {
      try {
        const res = await getMyRoleRequests();

        const exists = res.some(
          (r: any) => r.status === "PENDING"
        );

        setHasActiveRequest(exists);
      } catch (err) {
        console.error(err);
      }
    };

    if (isLoggedIn) {
      checkAdminRequest();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  /**
   * Skickar begäran om admin-roll.
   * Hanterar loading-state och toast-feedback.
   */
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

  /**
   * Loggar ut användaren genom att ta bort token
   * och navigera till login-sidan.
   */
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
          src="/profilbildDefault.png"
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