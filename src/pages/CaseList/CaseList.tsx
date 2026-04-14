import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CaseList.module.css";

type Props = {
  isMyCases?: boolean;
};

function CaseList({ isMyCases }: Props) {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchCases = async () => {
    try {
      if (isMyCases) {
        const res = await fetch("http://localhost:8080/cases/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setCases(data);
      } else {
        const res = await getCases();
        setCases(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchCases();
}, [isMyCases]);

  return (
    <Layout>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <h2>{isMyCases ? "Mina ärenden" : "Ärenden"}</h2>
        </div>

        <div className={styles.table}>

          <div className={styles.tableHeader}>
            <span>Titel</span>
            <span>Skapad</span>
            <span>Handläggare</span>
            <span>Status</span>
          </div>

          {!cases || cases.length === 0 ? (
            <p className={styles.empty}>Inga ärenden</p>
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

                <span>
                  {c.assignedTo?.username || "Ej tilldelad"}
                </span>

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

export default CaseList;