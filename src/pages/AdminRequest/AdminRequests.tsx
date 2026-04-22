import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./AdminRequests.module.css";
import {
  getAllRoleRequests,
  approveRole,
  rejectRole,
  deleteRoleRequest
} from "../../api/caseApi";

function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAllRoleRequests();
        setRequests(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);


  const handleApprove = async (id: number) => {
    try {
      await approveRole(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "APPROVED" } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectRole(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "REJECTED" } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoleRequest(id);

      setRequests((prev) =>
        prev.filter((r) => r.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.h1}>Administrativ begäran</h1>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Användare</span>
              <span>Skapad</span>
              <span>Status</span>
              <span>Åtgärder</span>
            </div>

            {!requests || requests.length === 0 ? (
              <p className={styles.empty}>Inga admin-begäran</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} className={styles.row}>

                  <div className={styles.field}>
                    <span className={styles.label}>Användare</span>
                    <span>{r.user?.name}</span>
                    <span className={styles.subText}>{r.user?.email}</span>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Skapad</span>
                    <span>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Status</span>
                    <span className={`${styles.badge} ${styles[r.status.toLowerCase()]}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className={styles.actions}>

                    {r.status === "PENDING" && (
                      <>
                        <button onClick={() => handleApprove(r.id)}>
                          Godkänn
                        </button>
                        <button onClick={() => handleReject(r.id)}>
                          Neka
                        </button>
                      </>
                    )}

                    {(r.status === "APPROVED" || r.status === "REJECTED") && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(r.id)}
                      >
                        ×
                      </button>
                    )}

                  </div>

                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default AdminRequests;