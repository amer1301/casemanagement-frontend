import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [cases, setCases] = useState<any[]>([]);

  const user = {
    name: localStorage.getItem("username") || "Admin",
    email: localStorage.getItem("email") || "admin@mail.com",
    role: localStorage.getItem("role"),
  };

  useEffect(() => {
    getCases().then(res => setCases(res.data));
  }, []);

  // statistik från dina riktiga data
  const total = cases.length;
  const approved = cases.filter(c => c.status === "APPROVED").length;
  const rejected = cases.filter(c => c.status === "REJECTED").length;
  const submitted = cases.filter(c => c.status === "SUBMITTED").length;

  return (
    <Layout>
      <div className={styles.dashboard}>

        {/* TOP */}
        <h2>Welcome back, {user.name}</h2>

        {/* GRID */}
        <div className={styles.grid}>

          {/* LEFT */}
          <div className={styles.main}>

            <div className={styles.cards}>
              <div className={styles.card}>
                <p>Total</p>
                <h3>{total}</h3>
              </div>

              <div className={styles.card}>
                <p>Submitted</p>
                <h3>{submitted}</h3>
              </div>

              <div className={styles.card}>
                <p>Approved</p>
                <h3>{approved}</h3>
              </div>

              <div className={styles.card}>
                <p>Rejected</p>
                <h3>{rejected}</h3>
              </div>
            </div>

          </div>

          {/* RIGHT (PROFIL) */}
          <div className={styles.sidebar}>
            <h3>Profil</h3>

            <div className={styles.profileCard}>
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;