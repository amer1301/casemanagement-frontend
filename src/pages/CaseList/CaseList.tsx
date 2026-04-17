import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CaseList.module.css";
import { useAuth } from "../../context/authContext";
import {
  getAssignedCases,
  getUnassignedCases,
  getCases,
  deleteCase
} from "../../api/caseApi";

type Props = {
  isMyCases?: boolean;
};

function CaseList({ isMyCases }: Props) {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();
  const { role } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        let res;

        if (isMyCases) {
          if (role === "ADMIN") {
            res = await getAssignedCases();
          } else {
            res = await getCases();
          }
        } else {
          res = await getUnassignedCases();
        }

        // FILTRERING
        let filteredCases = res.data;

        if (role !== "MANAGER") {
          filteredCases = filteredCases.filter(
            (c: any) => c.type !== "ROLE_REQUEST"
          );
        }

        setCases(filteredCases);

      } catch (err) {
        console.error(err);
      }
    };

    fetchCases();
  }, [isMyCases, role]);

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
          <h2>{isMyCases ? "Mina ärenden" : "Ärenden"}</h2>
        </div>

        <div className={styles.table}>

          <div className={styles.tableHeader}>
            <span>Titel</span>
            <span>Skapad</span>

            {role !== "MANAGER" && <span>Handläggare</span>}

            <span>Status</span>
          </div>

          {!cases || cases.length === 0 ? (
            <p className={styles.empty}>Inga ärenden i kön</p>
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

                <span>
                  {c.assignedToName || "Ej hanterad"}
                </span>

                <span
                  className={`${styles.badge} ${styles[c.status.toLowerCase()]
                    }`}
                >
                  {c.status}
                </span>
                {(role === "MANAGER" && c.type === "ROLE_REQUEST") && (
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
              <p>
                Är du säker på att du vill ta bort denna admin-begäran?
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

export default CaseList;