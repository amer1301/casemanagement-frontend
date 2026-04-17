import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  getCaseById,
  getCaseLogs,
  updateCaseStatus,
  assignCase,
  appealCase,
  getNotes,
  addNote
} from "../../api/caseApi";

import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";
import Layout from "../../components/layout/Layout";
import styles from "./CaseDetail.module.css";
import type { Note } from "../../types/Note";
import { translateLog } from "../../utils/logTranslations";

function CaseDetail() {
  const { id } = useParams();
  const { role } = useAuth();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");

  useEffect(() => {
    console.log("RENDER CASE DATA:", caseData);
    if (!id) return;

    const fetchData = async () => {
      try {
        const caseRes = await getCaseById(id);

        console.log("CASE DATA:", caseRes.data);

        const logsRes = await getCaseLogs(id);
        const notesRes = await getNotes(id);

        setCaseData(caseRes.data);
        setLogs(logsRes.data);
        setNotes(notesRes.data);
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
    if (!id || !rejectReason.trim()) return;

    try {
      await updateCaseStatus(id, "REJECTED", rejectReason);

      setShowRejectModal(false);
      setRejectReason("");

      const updated = await getCaseById(id);
      setCaseData(updated.data);

      const updatedLogs = await getCaseLogs(id);
      setLogs(updatedLogs.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!id) return;

    try {
      await assignCase(id);

      const updated = await getCaseById(id);
      setCaseData(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitAppeal = async () => {
    if (!id || !appealReason.trim()) return;

    try {
      await appealCase(id, appealReason);

      const updated = await getCaseById(id);
      setCaseData(updated.data);

      setShowAppealModal(false);
      setAppealReason("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;

    try {
      await addNote(id, newNote);

      const updatedNotes = await getNotes(id);
      setNotes(updatedNotes.data);

      setNewNote("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Laddar...</p>;
  if (!caseData) return <p>Kunde inte hämta ärendet</p>;

  return (
    <Layout>
      <div className={styles.caseDetail}>

        <div className={styles.caseMain}>
          <h1 className={styles.title}>{caseData.title}</h1>

          <p className={styles.description}>
            {caseData.description}
          </p>

          <div className={styles.statusBox}>
            <div className={styles.statusRow}>
              <h3>Status</h3>

              <span className={`${styles.badge} ${styles[caseData.status.toLowerCase()]}`}>
                {caseData.status}
              </span>
            </div>

                      {role === "USER" &&
            caseData.status === "REJECTED" &&
            !caseData.appealed && (
              <button
                className={styles.appeal}
                onClick={() => setShowAppealModal(true)}
              >
                Överklaga
              </button>
          )}


            {caseData.rejectionReason && (
              <div className={styles.rejectionBox}>
                <h4>Avslagsmotivering</h4>
                <p>{caseData.rejectionReason}</p>
              </div>
            )}

            {caseData.appealed && (
              <div className={styles.rejectionBox}>
                <h4>Överklagan</h4>
                <p>{caseData.appealReason}</p>
              </div>
            )}
          </div>

          <div className={styles.assignedBox}>
            <h3>Handläggare</h3>
            <p>{caseData.assignedToName || "Ej tilldelad"}</p>
          </div>

          {/* ANTECKNINGAR */}
<div className={styles.notesSection}>
  <h3 className={styles.sectionTitle}>Anteckningar</h3>

  {notes.length === 0 ? (
    <p className={styles.empty}>Inga anteckningar ännu</p>
  ) : (
    notes.map((note) => (
      <div key={note.id} className={styles.noteItem}>
        <p className={styles.noteText}>{note.text}</p>
        <small className={styles.noteMeta}>
          {note.user?.name} –{" "}
          {new Date(note.createdAt).toLocaleString()}
        </small>
      </div>
    ))
  )}

  <div className={styles.noteInputBox}>
    <textarea
      className={styles.textarea}
      placeholder="Skriv anteckning..."
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
    />

    <button
      className={styles.saveNote}
      onClick={handleAddNote}
      disabled={!newNote.trim()}
    >
      Spara anteckning
    </button>
  </div>
</div>
</div>

        <div className={styles.caseSidebar}>

{role === "ADMIN" && caseData.status === "SUBMITTED" && (
  <>
    {!caseData.assignedToName ? (
      <button
        className={styles.assign}
        onClick={handleAssign}
      >
        Ta ärende
      </button>
    ) : (
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
  </>
)}
          <h3>Historik</h3>

          {logs.length === 0 ? (
            <p className={styles.empty}>Ingen historik</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <p>{translateLog(log.action, log.user?.username)}</p>
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

      {showRejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Avslå ärende</h3>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowRejectModal(false)}>Avbryt</button>
              <button onClick={submitReject} disabled={!rejectReason.trim()}>
                Skicka
              </button>
            </div>
          </div>
        </div>
      )}

      {showAppealModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Överklaga ärende</h3>

            <textarea
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowAppealModal(false)}>Avbryt</button>
              <button onClick={submitAppeal} disabled={!appealReason.trim()}>
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