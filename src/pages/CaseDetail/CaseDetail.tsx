import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  getCaseById,
  getCaseLogs,
  updateCaseStatus,
  assignCase,
  appealCase,
  getNotes,
  addNote,
  updatePriority,
  deleteNote
} from "../../api/caseApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";
import Layout from "../../components/layout/Layout";
import styles from "./CaseDetail.module.css";
import type { Note } from "../../types/Note";
import { translateLog } from "../../utils/logTranslations";
import { translateCategory } from "../../utils/categoryTranslations";
import { translateStatus } from "../../utils/statusTranslations";

/**
 * CaseDetail visar detaljer för ett specifikt ärende.
 *
 * Funktionalitet:
 * - Hämtar ärendedata, loggar och anteckningar
 * - Tillåter admin att hantera ärenden (approve/reject/assign)
 * - Tillåter användare att överklaga
 * - Hanterar anteckningar och prioritet
 */
function CaseDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Hämtar ärendedata, loggar och anteckningar.
   * Körs när id ändras.
   *
   * - Parallella requests (Promise.all) för bättre prestanda
   * - Hanterar 404 separat (visar "not found" state)
   */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const caseRes = await getCaseById(id);
        setCaseData(caseRes);
        setPriority(caseRes.priority ?? 3);

        const [logsRes, notesRes] = await Promise.all([
          getCaseLogs(id),
          getNotes(id),
        ]);

        setLogs(logsRes);
        setNotes(notesRes);
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

  /**
   * Stänger priority dropdown när användaren klickar utanför.
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setPriorityOpen(false);
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /**
   * Rensar felmeddelande automatiskt efter några sekunder.
   */
  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  /**
   * Uppdaterar ärendets status (approve/reject).
   *
   * - Uppdaterar backend
   * - Hämtar om data och loggar efter ändring
   * - Visar specifika felmeddelanden beroende på statuskod
   */
  const handleStatus = async (status: string) => {
    if (!id) return;

    try {
      setErrorMessage("");

      await updateCaseStatus(id, status);

      const updated = await getCaseById(id);
      setCaseData(updated);

      const updatedLogs = await getCaseLogs(id);
      setLogs(updatedLogs);

    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 403) {
        setErrorMessage("Du kan inte handlägga ett ärende du själv skapat");
      } else if (err.response?.status === 404) {
        setErrorMessage("Ärendet finns inte längre");
      } else {
        setErrorMessage("Något gick fel, försök igen");
      }
    }
  };

  /**
 * Tar bort en anteckning och uppdaterar listan.
 *
 * Flöde:
 * - Skickar delete-request till backend
 * - Hämtar uppdaterade anteckningar
 * - Uppdaterar state så UI reflekterar ändringen
 */
  const handleDeleteNote = async (noteId: number) => {
  if (!id) return;

  try {
    await deleteNote(noteId);

    const updatedNotes = await getNotes(id);
    setNotes(updatedNotes);
  } catch (err) {
    console.error(err);
  }
};

  /**
   * Skickar avslagsbeslut med motivering.
   */
  const submitReject = async () => {
    if (!id || !rejectReason.trim()) return;

    try {
      await updateCaseStatus(id, "REJECTED", rejectReason);

      setShowRejectModal(false);
      setRejectReason("");

      const updated = await getCaseById(id);
      setCaseData(updated);

      const updatedLogs = await getCaseLogs(id);
      setLogs(updatedLogs);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Tilldelar ärendet till aktuell admin.
   */
  const handleAssign = async () => {
    if (!id) return;

    try {
      setErrorMessage("");

      await assignCase(id);

      const updated = await getCaseById(id);
      setCaseData(updated);

    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 403) {
        setErrorMessage("Du kan inte ta ett ärende du själv skapat");
      } else if (err.response?.status === 404) {
        setErrorMessage("Ärendet finns inte längre");
      } else {
        setErrorMessage("Något gick fel");
      }
    }
  };

  /**
   * Skickar överklagan från användare.
   */
  const submitAppeal = async () => {
    if (!id || !appealReason.trim()) return;

    try {
      await appealCase(id, appealReason);

      const updated = await getCaseById(id);
      setCaseData(updated);

      setShowAppealModal(false);
      setAppealReason("");
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Lägger till en anteckning och uppdaterar listan.
   */
  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;

    try {
      await addNote(id, newNote);

      const updatedNotes = await getNotes(id);
      setNotes(updatedNotes);

      setNewNote("");
    } catch (err) {
      console.error(err);
    }
  };

const CaseDetailSkeleton = () => {
  return (
    <div className={`${styles.caseDetail} ${styles.skeleton}`}>
      <div className={styles.caseMain}>
        <Skeleton height={40} width="60%" />

        <Skeleton count={3} />

        <div className={styles.metaBox}>
          <div className={styles.infoBox}>
            <Skeleton height={15} width="80%" />
            <Skeleton height={15} width="70%" />
            <Skeleton height={15} width="60%" />
          </div>
        </div>

        <div className={styles.statusBox}>
          <Skeleton height={20} width={120} />
          <Skeleton height={25} width={80} />
        </div>

        <div className={styles.assignedBox}>
          <Skeleton height={20} width={150} />
        </div>
      </div>

      <div className={styles.caseSidebar}>
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={200} />
      </div>
    </div>
  );
};

if (loading) {
  return (
    <Layout>
      <CaseDetailSkeleton />
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
    <main className={styles.main}>
      <div className={styles.caseDetail}>

        {/* ===== LEFT SIDE ===== */}
        <div className={styles.caseMain}>
          <h1 className={styles.title}>{caseData.title}</h1>

          <p className={styles.description}>
            {caseData.description}
          </p>

          <div className={styles.metaBox}>
            <div className={styles.infoBox}>
              <h2>Information</h2>
              <p><strong>Namn:</strong> {caseData.applicantName}</p>
              <p><strong>Personnummer:</strong> {caseData.personalNumber}</p>
              <p><strong>Ärendetyp:</strong> {translateCategory(caseData.category)}</p>
            </div>
          </div>

          <div className={styles.statusBox}>
            <div className={styles.statusRow}>
              <h2>Status</h2>
              <span className={`${styles.badge} ${styles[caseData.status.toLowerCase()]}`}>
                {translateStatus(caseData.status)}
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
                <h3>Avslagsmotivering</h3>
                <p>{caseData.rejectionReason}</p>
              </div>
            )}

            {caseData.appealed && (
              <div className={styles.rejectionBox}>
                <h3>Överklagan</h3>
                <p>{caseData.appealReason}</p>
              </div>
            )}
          </div>

          <div className={styles.assignedBox}>
            <h2>Handläggare</h2>
            <p>{caseData.assignedToName || "Ej tilldelad"}</p>
          </div>

          {/* ===== NOTES ===== */}
          {(role === "ADMIN" || role === "MANAGER") && (
            <div className={styles.notesSection}>
              <h3 className={styles.sectionTitle}>Anteckningar</h3>

              {notes.length === 0 ? (
                <p className={styles.empty}>Inga anteckningar ännu</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className={styles.noteItem}>

                    <div className={styles.noteContent}>
                      <p className={styles.noteText}>{note.text}</p>

                      <small className={styles.noteMeta}>
                        {note.user?.name} –{" "}
                        {new Date(note.createdAt).toLocaleString()}
                      </small>
                    </div>

                    <button
                      className={styles.deleteNote}
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      ×
                    </button>

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

        {/* ===== RIGHT SIDE (SIDEBAR) ===== */}
        <div className={styles.caseSidebar}>

          {errorMessage && (
            <div className={styles.errorBox}>
              {errorMessage}
            </div>
          )}

          {caseData.status === "SUBMITTED" && role === "ADMIN" && (
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
                    onClick={() => setShowRejectModal(true)}
                  >
                    Avslå
                  </button>
                </>
              )}
            </>
          )}

          {role === "ADMIN" && (
            <div className={styles.priorityBox}>
              <h2>Prioritet</h2>

              <div
                className={styles.dropdown}
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
                    {[1, 2, 3, 4, 5].map((p) => (
                      <div
                        key={p}
                        className={styles.dropdownItem}
                        onClick={async () => {
                          setPriority(p);
                          setPriorityOpen(false);
                          await updatePriority(caseData.id, p);
                        }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <h2>Historik</h2>

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

      {/* ===== MODALS ===== */}
      {showRejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Avslå ärende</h2>

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
            <h2>Överklaga ärende</h2>

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

    </main>
  </Layout>
);
}

export default CaseDetail;