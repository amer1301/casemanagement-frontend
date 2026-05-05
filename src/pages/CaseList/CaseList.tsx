import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CaseList.module.css";
import { useAuth } from "../../context/authContext";
import { getCases, deleteCase } from "../../api/caseApi";
import { translateStatus } from "../../utils/statusTranslations";
import { ArrowUp, ArrowDown } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);

      try {
        let res;

        if (role === "MANAGER") {
          res = await getCases({
            page,
            size: 10,
            status: statusFilter || undefined,
            q: search || undefined,
            sortBy,
            direction,
            assignedTo:
              assignedFilter === ""
                ? undefined
                : assignedFilter === "unassigned"
                ? -1
                : Number(assignedFilter),
          });
        } else if (role === "ADMIN") {
          res = await getCases({
            page,
            size: 10,
            q: search || undefined,
            sortBy,
            direction,
          });
        }

        setCases(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    if (role) fetchCases();
  }, [page, search, statusFilter, assignedFilter, sortBy, direction, role]);

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

  const uniqueAdmins = Array.from(
    new Map(
      cases
        .filter((c) => c.assignedTo && c.assignedToName)
        .map((c) => [c.assignedTo, c.assignedToName])
    ).entries()
  );

  /**
   * Skeleton rows
   */
  const CaseListSkeleton = () => {
    return (
      <>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.row}>
            <div className={styles.field}>
              <Skeleton width="80%" />
            </div>

            <div className={styles.field}>
              <Skeleton width={100} />
            </div>

            <div className={styles.field}>
              <Skeleton width={120} />
            </div>

            <div className={styles.field}>
              <Skeleton width={80} />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>

          <div className={styles.header}>
            <h1 className={styles.h1}>Ärenden</h1>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Sök ärende..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />

            {role === "MANAGER" && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">Alla statusar</option>
                  <option value="APPROVED">Godkänd</option>
                  <option value="REJECTED">Avslagen</option>
                  <option value="SUBMITTED">Inskickad</option>
                </select>

                <select
                  value={assignedFilter}
                  onChange={(e) => {
                    setAssignedFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">Alla handläggare</option>
                  <option value="unassigned">Ej tilldelad</option>
                  {uniqueAdmins.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Titel</span>
              <span
                onClick={() => {
                  setSortBy("createdAt");
                  setDirection((prev) =>
                    prev === "asc" ? "desc" : "asc"
                  );
                }}
                className={styles.sortHeader}
              >
                Skapad
                {direction === "asc" ? (
                  <ArrowUp size={22} className={styles.sortIcon} />
                ) : (
                  <ArrowDown size={22} className={styles.sortIcon} />
                )}
              </span>
              <span>Handläggare</span>
              <span>Status</span>
            </div>

            {loading ? (
              <CaseListSkeleton />
            ) : cases.length === 0 ? (
              <p className={styles.empty}>Inga ärenden hittades</p>
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

                  <div className={styles.field}>
                    <span className={styles.label}>Handläggare</span>
                    <span>{c.assignedToName || "Ej hanterad"}</span>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Status</span>
                    <span
                      className={`${styles.badge} ${
                        styles[c.status.toLowerCase()]
                      }`}
                    >
                      {translateStatus(c.status)}
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

          <div className={styles.pagination}>
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Föregående
            </button>

            <span>
              Sida {page + 1} av {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Nästa
            </button>
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
        </main>
      </div>
    </Layout>
  );
}

export default CaseList;