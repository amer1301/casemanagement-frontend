import { useEffect, useState } from "react";
import { getMyCases, getAssignedCases, deleteCase } from "../../api/caseApi";
import { useAuth } from "../../context/authContext";
import Layout from "../../components/layout/Layout";
import styles from "./MyCases.module.css";
import { useNavigate } from "react-router-dom";
import { translateStatus } from "../../utils/statusTranslations";

/**
 * MyCases visar ärenden beroende på användarroll:
 *
 * - USER → egna skapade ärenden
 * - ADMIN → tilldelade ärenden
 *
 * Funktionalitet:
 * - Hämtar data baserat på roll
 * - Navigerar till detaljsida
 * - Tillåter borttagning av ärenden
 */
function MyCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { role } = useAuth();
  const navigate = useNavigate();

  /**
   * Hämtar ärenden beroende på roll.
   *
   * - ADMIN → tilldelade ärenden
   * - USER → egna ärenden
   */
  useEffect(() => {
    const fetchCases = async () => {
      try {
        let res;

        if (role === "ADMIN") {
          res = await getAssignedCases();
        } else {
          res = await getMyCases();
        }

        setCases(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCases();
  }, [role]);

  /**
   * Öppnar delete-modal och sparar valt id.
   */
  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  /**
   * Tar bort ärende och uppdaterar listan lokalt.
   */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteCase(selectedId);

      // Uppdaterar UI direkt efter borttagning
      setCases((prev) => prev.filter((c) => c.id !== selectedId));
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>
              {role === "ADMIN" ? "Mina tilldelade ärenden" : "Mina ärenden"}
            </h1>
          </div>

          <div className={styles.table}>

            <div className={styles.tableHeader}>
              <span>Titel</span>
              <span>Skapad</span>
              <span>Handläggare</span>
              <span>Status</span>
              <span></span>
            </div>

            {cases.length === 0 ? (
              <p className={styles.empty}>
                {role === "ADMIN"
                  ? "Inga tilldelade ärenden"
                  : "Inga skapade ärenden"}
              </p>
            ) : (
              cases.map((c) => (
                <div
                  key={c.id}
                  className={styles.row}
                  onClick={() => navigate(`/cases/${c.id}`)}
                >
                  <span>{c.title}</span>

                  <span>
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "—"}
                  </span>

                  <span>{c.assignedToName || "Ej hanterad"}</span>

                  <div className={styles.statusWrapper}>
                    <span className={styles.label}>Status</span>

                    <span
                      className={`${styles.badge} ${
                        styles[c.status.toLowerCase()]
                      }`}
                    >
                      {translateStatus(c.status)}
                    </span>
                  </div>

                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // Förhindrar navigation vid klick på delete
                      openDeleteModal(c.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}

          </div>

          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Bekräfta borttagning</h3>
                <p>
                  Är du säker på att du vill ta bort detta ärende?
                </p>

                <div className={styles.modalActions}>
                  <button onClick={() => setShowDeleteModal(false)}>
                    Avbryt
                  </button>

                  <button
                    className={styles.deleteConfirm}
                    onClick={handleDelete}
                  >
                    Ja, ta bort
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

export default MyCases;