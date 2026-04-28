import { useEffect, useState } from "react";
import { getDashboard, getAdminStats } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";
import { useAuth } from "../../context/authContext";
import type { AdminStat } from "../../types/AdminStat";
import { downloadMonthlyReport } from "../../api/caseApi";

/**
 * Dashboard visar statistik över ärenden.
 *
 * Funktionalitet:
 * - Hämtar generell statistik (alla användare)
 * - Hämtar admin-specifik statistik (endast MANAGER)
 * - Visar olika vy beroende på roll
 */
function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<AdminStat[]>([]);

  const { role } = useAuth();

  /**
   * Hämtar statistik från backend.
   *
   * - Alla roller får grunddata
   * - MANAGER får även statistik per admin
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboard();
        setStats(res);

        if (role === "MANAGER") {
          const adminRes = await getAdminStats();
          setAdminStats(adminRes);
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
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>Dashboard</h1>
            <p>
              {role === "MANAGER"
                ? "Översikt (alla admins)"
                : "Min statistik"}
            </p>
          </div>

          <div className={styles.grid}>

            <div>

              <div className={styles.cards}>
                <div className={styles.card}>
                  <h3>{stats.total}</h3>
                  <p>Totala ärenden</p>
                </div>

                <div className={styles.card}>
                  <h3>{stats.unassigned}</h3>
                  <p>Ej hanterade</p>
                </div>

                <div className={styles.card}>
                  <h3>{stats.assigned}</h3>
                  <p>Hanterade</p>
                </div>

                <div className={styles.card}>
                  <h3>
                    {/* Beräknar andel hanterade ärenden i procent */}
                    {stats.total > 0
                      ? Math.round((stats.assigned / stats.total) * 100)
                      : 0}%
                  </h3>
                  <p>Slutförda</p>
                </div>
              </div>

              {/* Endast MANAGER ser statistik per admin */}
              {role === "MANAGER" && (
                <div className={styles.adminList}>
                  <h3>Admins</h3>

                  {adminStats.map((admin, index) => (
                    <div key={index} className={styles.adminRow}>
                      <span>{admin.name}</span>
                      <span>{admin.total} ärenden</span>
                      <span>{admin.handled} hanterade</span>
                      <span>{admin.pending} väntande</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className={styles.sidebar}>
              <h3>Översikt</h3>

              <div className={styles.profileCard}>
                <p>Totala ärenden: {stats.total}</p>
                <p>Ej hanterade: {stats.unassigned}</p>
                <p>Hanterade: {stats.assigned}</p>
              </div>

              {/* Endast MANAGER kan ladda ner rapport */}
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
        </main>
      </div>
    </Layout>
  );
}

export default Dashboard;