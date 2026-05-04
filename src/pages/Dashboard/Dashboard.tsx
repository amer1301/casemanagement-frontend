import { useEffect, useState } from "react";
import { getDashboardStats, getAdminStats, downloadMonthlyReport } from "../../api/statsApi";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";
import { useAuth } from "../../context/authContext";
import type { AdminStat } from "../../types/AdminStat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<AdminStat[]>([]);

  const { role } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res || {});

        if (role === "MANAGER") {
          const adminRes = await getAdminStats();
          setAdminStats(Array.isArray(adminRes) ? adminRes : []);
        }
      } catch (err) {
        console.error(err);
        setAdminStats([]);
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
                  <h3>{stats.total ?? 0}</h3>
                  <p>Totala ärenden</p>
                </div>

                <div className={styles.card}>
                  <h3>{stats.unassigned ?? 0}</h3>
                  <p>Ej hanterade</p>
                </div>

                <div className={styles.card}>
                  <h3>{stats.assigned ?? 0}</h3>
                  <p>Hanterade</p>
                </div>

                <div className={styles.card}>
                  <h3>
                    {stats.total > 0
                      ? Math.round((stats.assigned / stats.total) * 100)
                      : 0}%
                  </h3>
                  <p>Slutförda</p>
                </div>
              </div>

              {role === "MANAGER" && (adminStats?.length ?? 0) > 0 && (
                <div className={styles.chartContainer}>
                  <h3>Ärenden per admin</h3>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={adminStats}>
                      <CartesianGrid stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid rgba(169,169,244,0.3)",
                          borderRadius: "10px",
                          color: "#e2e8f0"
                        }}
                      />
                      <Bar dataKey="handled" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {role === "MANAGER" && (
                <div className={styles.adminList}>
                  <h3>Admins</h3>

                  {adminStats?.map((admin, index) => (
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
                <p>Totala ärenden: {stats.total ?? 0}</p>
                <p>Ej hanterade: {stats.unassigned ?? 0}</p>
                <p>Hanterade: {stats.assigned ?? 0}</p>
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
        </main>
      </div>
    </Layout>
  );
}

export default Dashboard;