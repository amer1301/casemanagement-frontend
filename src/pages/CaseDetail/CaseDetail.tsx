import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCaseById,
  getCaseLogs,
  updateCaseStatus,
} from "../../api/caseApi";

import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";
import Layout from "../../components/layout/Layout";
import styles from "./CaseDetail.module.css";

function CaseDetail() {
  const { id } = useParams();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      const caseRes = await getCaseById(id);
      const logsRes = await getCaseLogs(id);

      setCaseData(caseRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

const handleStatus = async (status: string) => {
  if (!id) return;

  try {
    await updateCaseStatus(id, status);

    const updated = await getCaseById(id);
    setCaseData(updated.data);

    const updatedLogs = await getCaseLogs(id);
    setLogs(updatedLogs.data);

  } catch (err) {
    console.error("ERROR:", err);
  }
};

  if (loading) return <p>Laddar...</p>;
  if (!caseData) return <p>Kunde inte hämta ärendet</p>;

  const role = localStorage.getItem("role");

  return (
    <Layout>
      <div className={styles.caseDetail}>
        
        {/* VÄNSTER */}
        <div className={styles.caseMain}>
          <h1 className={styles.title}>{caseData.title}</h1>
          <p className={styles.description}>
            {caseData.description}
          </p>

          <div className={styles.statusBox}>
            <h3>Status</h3>

            <span
              className={`${styles.badge} ${
                styles[caseData.status.toLowerCase()]
              }`}
            >
              {caseData.status}
            </span>
          </div>
        </div>

        {/* HÖGER */}
        <div className={styles.caseSidebar}>
          <h3>Åtgärder</h3>

          {role === "ADMIN" && (
            <>
              <button
                className={styles.approve}
                onClick={() => handleStatus("APPROVED")}
              >
                Godkänn
              </button>

              <button
                className={styles.reject}
                onClick={() => handleStatus("REJECTED")}
              >
                Avslå
              </button>
            </>
          )}

          <h3>Historik</h3>

          {logs.length === 0 ? (
  <p className={styles.empty}>Ingen historik</p>
) : (
            logs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <p>{log.action}</p>
                <small>
                  {log.user?.username}{" "}
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : "Okänt datum"}
                </small>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}

export default CaseDetail;