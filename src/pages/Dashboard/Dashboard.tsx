import { useEffect, useState } from "react";
import { getDashboard } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";
import { useAuth } from "../../context/authContext";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
const { role } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Laddar...</p>;

  return (
    <Layout>
      <div className={styles.dashboard}>
        
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
          </div>

          {/* RIGHT SIDEBAR */}
          <div className={styles.sidebar}>
            <h3>Översikt</h3>

            <div className={styles.profileCard}>
              <p>Totala ärenden: {stats.total}</p>
              <p>Ej hanterade: {stats.pending}</p>
              <p>Hanterade: {stats.handled}</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;