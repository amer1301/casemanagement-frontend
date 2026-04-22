import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CaseList.module.css";
import { useAuth } from "../../context/authContext";
import { getUnassignedCases, deleteCase } from "../../api/caseApi";

function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();
  const { role } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getUnassignedCases();
        setCases(res ?? []);
      } catch (err) {
        console.error(err);
        setCases([]);
      }
    };

    fetchCases();
  }, []);

  const handleDelete = async () => {
    if (!selectedCaseId) return;

    try {
      await deleteCase(selectedCaseId);

      setCases((prev) =>
        prev.filter((c) => c.id !== selectedCaseId)
      );

      setShowDeleteModal(false);
      setSelectedCaseId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.h1}>Ärenden</h1>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Titel</span>
            <span>Skapad</span>
            {role !== "MANAGER" && <span>Handläggare</span>}
            <span>Status</span>
          </div>

          {cases.length === 0 ? (
            <p className={styles.empty}>Inga ärenden i kön</p>
          ) : (
            cases.map((c) => (
              <div
                key={c.id}
                className={styles.row}
                onClick={() => navigate(`/cases/${c.id}`)}
              >
                <div className={styles.field}>
                  <span className={styles.label}>Titel</span>
                  <span>{c.title}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Skapad</span>
                  <span>
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                {role !== "MANAGER" && (
                  <div className={styles.field}>
                    <span className={styles.label}>Handläggare</span>
                    <span>{c.assignedToName || "Ej hanterad"}</span>
                  </div>
                )}

                <div className={styles.field}>
                  <span className={styles.label}>Status</span>
                  <span
                    className={`${styles.badge} ${
                      styles[c.status.toLowerCase()]
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {role === "MANAGER" && (
                  <button
                    className={styles.delete}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCaseId(c.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Bekräfta borttagning</h3>
              <p>Är du säker på att du vill ta bort detta ärende?</p>

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
      </div>
    </Layout>
  );
}

export default CaseList;