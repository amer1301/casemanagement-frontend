import { useEffect, useState } from "react";
import { getDashboard, getAdminStats } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";
import { useAuth } from "../../context/authContext";
import type { AdminStat } from "../../types/AdminStat";
import { downloadMonthlyReport } from "../../api/caseApi";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<AdminStat[]>([]);

  const { role } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboard();
        setStats(res.data);

        // Bara manager hämtar admin-data
        if (role === "MANAGER") {
          const adminRes = await getAdminStats();
          setAdminStats(adminRes.data);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [role]);

  if (!stats) return <p>Laddar...</p>;

  return (
    <Layout>
      <div className={styles.dashboard}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Dashboard</h2>
          <p>
            {role === "MANAGER"
              ? "Översikt (alla admins)"
              : "Min statistik"}
          </p>
        </div>

        <div className={styles.grid}>
          
          {/* LEFT */}
          <div>

            {/* CARDS */}
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3>{stats.total}</h3>
                <p>Totala ärenden</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.pending}</h3>
                <p>Ej hanterade</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.handled}</h3>
                <p>Hanterade</p>
              </div>

              <div className={styles.card}>
                <h3>
                  {stats.total > 0
                    ? Math.round((stats.handled / stats.total) * 100)
                    : 0}%
                </h3>
                <p>Slutförda</p>
              </div>
            </div>

            {/* ADMIN LISTA (bara för manager) */}
            {role === "MANAGER" && (
              <div className={styles.adminList}>
                <h3>Admins</h3>

                {adminStats.map((admin, index) => (
                  <div key={index} className={styles.adminRow}>
                    <span>{admin.name}</span>
                    <span>{admin.total} ärenden</span>
                    <span>{admin.handled} hanterade</span>
                    <span>{admin.pending} pending</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className={styles.sidebar}>
            <h3>Översikt</h3>

            <div className={styles.profileCard}>
              <p>Totala ärenden: {stats.total}</p>
              <p>Ej hanterade: {stats.pending}</p>
              <p>Hanterade: {stats.handled}</p>
            </div>

            {role === "MANAGER" && (
    <button
      className={styles.downloadBtn}
      onClick={downloadMonthlyReport}
    >
      Ladda ner månadens statistik
    </button>
  )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;