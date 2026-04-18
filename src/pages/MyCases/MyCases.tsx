import { useEffect, useState } from "react";
import { getAssignedCases, deleteCase } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./MyCases.module.css";
import { useNavigate } from "react-router-dom";

function MyCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getAssignedCases();
        setCases(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCases();
  }, []);

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteCase(selectedId);

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

        <div className={styles.header}>
          <h2>Mina ärenden</h2>
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
            <p className={styles.empty}>Inga tilldelade ärenden</p>
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

                <span>{c.assignedToName}</span>

                <div className={styles.statusWrapper}>
                  <span className={styles.label}>Status</span>

                  <span className={`${styles.badge} ${styles[c.status.toLowerCase()]}`}>
                    {c.status}
                  </span>
                </div>

                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
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

      </div>
    </Layout>
  );
}

export default MyCases;