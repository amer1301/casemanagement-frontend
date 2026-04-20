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
  addNote,
  approveRole,
  rejectRole,
  updatePriority
} from "../../api/caseApi";

import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";
import Layout from "../../components/layout/Layout";
import styles from "./CaseDetail.module.css";
import type { Note } from "../../types/Note";
import { translateLog } from "../../utils/logTranslations";
import { useNavigate } from "react-router-dom";
import { translateCategory } from "../../utils/categoryTranslations";

function CaseDetail() {
  const { id } = useParams();
  const { role } = useAuth();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();
  const [priority, setPriority] = useState<number | null>(null);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [notFound, setNotFound] = useState(false);

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    setLoading(true);
    setNotFound(false);

    try {
      const caseRes = await getCaseById(id);
      const caseData = caseRes.data;

      setCaseData(caseData);

      setPriority(caseData.priority ?? 3);

      const [logsRes, notesRes] = await Promise.all([
        getCaseLogs(id),
        getNotes(id),
      ]);

      setLogs(logsRes.data);
      setNotes(notesRes.data);

    } catch (err: any) {
      if (err.response?.status === 404) {
        setCaseData(null);
        setNotFound(true);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

useEffect(() => {
  const handleClickOutside = () => {
    setPriorityOpen(false);
  };

  window.addEventListener("click", handleClickOutside);

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, []);

const handleStatus = async (status: string) => {
  if (!id) return;

  try {
    if (caseData?.type === "ROLE_REQUEST") {
      if (status === "APPROVED") {
        await approveRole(id);
      } else if (status === "REJECTED") {
        await rejectRole(id);
      }
    } else {
      // gamla vanliga
      await updateCaseStatus(id, status);
    }

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

  if (loading) {
  return (
    <Layout>
      <p>Laddar...</p>
    </Layout>
  );
}

if (notFound) {
  return (
    <Layout>
      <div className={styles.emptyState}>
        <h2>Ärendet finns inte längre</h2>
        <p>
          Det här ärendet kan ha tagits bort eller så har du inte längre
          behörighet att se det.
        </p>

        <button
          className={styles.backButton}
          onClick={() => navigate("/notifications")}
        >
          ← Tillbaka till notifikationer
        </button>
      </div>
    </Layout>
  );
}

if (!caseData) {
  return (
    <Layout>
      <p>Kunde inte hämta ärendet</p>
    </Layout>
  );
}

return (
  <Layout>
    <div className={styles.caseDetail}>
      <div className={styles.caseMain}>
        <h1 className={styles.title}>
  {caseData.type === "ROLE_REQUEST"
    ? "Admin-begäran"
    : caseData.title}
</h1>

        <p className={styles.description}>
          {caseData.description}
        </p>

        <div className={styles.metaBox}>
<div className={styles.infoBox}>
  <h3>Information</h3>

  <p><strong>Namn:</strong> {caseData.applicantName}</p>
  <p><strong>Personnummer:</strong> {caseData.personalNumber}</p>
<p><strong>Ärendetyp:</strong> {translateCategory(caseData.category)}</p>
</div>
</div>

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
        {(role === "ADMIN" || role === "MANAGER") && (
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
      )}
</div>

      <div className={styles.caseSidebar}>
        {caseData.status === "SUBMITTED" && (
  <>
    {/* ROLE REQUEST → endast MANAGER */}
    {caseData.type === "ROLE_REQUEST" && role === "MANAGER" && (
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

    {/* ANDRA ÄRENDEN → ADMIN */}
    {caseData.type !== "ROLE_REQUEST" && role === "ADMIN" && (
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
  </>
)}
{role === "ADMIN" && caseData.type !== "ROLE_REQUEST" && (
  <div className={styles.priorityBox}>
  <h3>Prioritet</h3>

<div className={styles.dropdown}
  onClick={(e) => e.stopPropagation()}
  >
  <div
    className={styles.dropdownSelected}
    onClick={() => setPriorityOpen(!priorityOpen)}
  >
    {priority}
  </div>

  {priorityOpen && (
    <div className={styles.dropdownMenu}>
      {[1,2,3,4,5].map((p) => (
        <div
          key={p}
          className={styles.dropdownItem}
          onClick={async () => {
            setPriority(p);
            setPriorityOpen(false);

            await updatePriority(caseData.id, p);
          }}
        >
          {p} {p === 1 ? "- Låg" : p === 3 ? "- Normal" : p === 5 ? "- Hög" : ""}
        </div>
      ))}
    </div>
  )}
</div>
</div>
)}
        <h3>Historik</h3>

        {logs.length === 0 ? (
          <p className={styles.empty}>Ingen historik</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={styles.logItem}>
              <p>{translateLog(log.action)}</p>
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