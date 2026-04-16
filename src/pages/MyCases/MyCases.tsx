import { useEffect, useState } from "react";
import { getAssignedCases } from "../../api/caseApi";
import Layout from "../../components/layout/Layout";
import styles from "./MyCases.module.css";
import { useNavigate } from "react-router-dom";

function MyCases() {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getAssignedCases();
        setCases(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCases();
  }, []);

return (
  <Layout>
    <div className={styles.container}>

      <div className={styles.header}>
        <h2>Mina ärenden</h2>
      </div>

      <div className={styles.table}>

        <div className={styles.tableHeader}>
          <span>Titel</span>
          <span>Skapad</span>
          <span>Handläggare</span>
          <span>Status</span>
        </div>

        {cases.length === 0 ? (
          <p className={styles.empty}>Inga tilldelade ärenden</p>
        ) : (
          cases.map((c) => (
            <div
              key={c.id}
              className={styles.row}
              onClick={() => navigate(`/cases/${c.id}`)}
            >
              <span>{c.title}</span>

              <span>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString()
                  : "—"}
              </span>

              {/* ALLTID tilldelad → ingen fallback */}
              <span>{c.assignedToName}</span>

              <span
                className={`${styles.badge} ${
                  styles[c.status.toLowerCase()]
                }`}
              >
                {c.status}
              </span>
            </div>
          ))
        )}

      </div>

    </div>
  </Layout>
);
}
export default MyCases;