import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  getCaseById,
  getCaseLogs,
  updateCaseStatus,
  assignCase,
} from "../../api/caseApi";

import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";
import Layout from "../../components/layout/Layout";
import styles from "./CaseDetail.module.css";

function CaseDetail() {
  const { id } = useParams();
  const { role } = useAuth();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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

  // ====================
  // STATUS UPDATE
  // ====================
  const handleStatus = async (status: string) => {
    if (!id) return;

    if (status === "REJECTED") {
      setShowRejectModal(true);
      return;
    }

    try {
      await updateCaseStatus(id, status);

      const updated = await getCaseById(id);
      setCaseData(updated.data);

      const updatedLogs = await getCaseLogs(id);
      setLogs(updatedLogs.data);

    } catch (err) {
      console.error(err);
    }
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) return;

    try {
      await updateCaseStatus(id!, "REJECTED", rejectReason);

      setShowRejectModal(false);
      setRejectReason("");

      const updated = await getCaseById(id!);
      setCaseData(updated.data);

      const updatedLogs = await getCaseLogs(id!);
      setLogs(updatedLogs.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ====================
  // ASSIGN TO ADMIN
  // ====================
  const handleAssign = async () => {
    if (!id) return;

    try {
      await assignCase(id);

      const updated = await getCaseById(id);
      setCaseData(updated.data);
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  if (loading) return <p>Laddar...</p>;
  if (!caseData) return <p>Kunde inte hämta ärendet</p>;

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

            <div className={styles.statusRow}>
              <h3>Status</h3>

              <span
                className={`${styles.badge} ${styles[caseData.status.toLowerCase()]}`}
              >
                {caseData.status}
              </span>
            </div>
            {caseData.rejectionReason && (
              <div className={styles.rejectionBox}>
                <h4>Avslagsmotivering</h4>
                <p>{caseData.rejectionReason}</p>
              </div>
            )}
          </div>

          <div className={styles.assignedBox}>
            <h3>Handläggare</h3>
            <p>{caseData.assignedToName || "Ej hanterad"}</p>
          </div>
        </div>

        {/* HÖGER */}
        <div className={styles.caseSidebar}>
          <h3>Åtgärder</h3>

          {role === "ADMIN" && !caseData.assignedToName && (
            <button className={styles.assign} onClick={handleAssign}>
              Ta ärende
            </button>
          )}

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

      {/* 🔥 MODAL SKA LIGGA HÄR (UTANFÖR SIDEBAR) */}
      {showRejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Avslå ärende</h3>

            <textarea
              placeholder="Skriv anledning..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowRejectModal(false)}>
                Avbryt
              </button>

              <button
                onClick={submitReject}
                disabled={!rejectReason.trim()}
              >
                Skicka
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default CaseDetail;