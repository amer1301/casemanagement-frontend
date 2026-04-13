import { useEffect, useState } from "react";
import { getCases, getMyCases } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import CaseCard from "../../components/CaseCard/CaseCard";
import Layout from "../../components/layout/Layout";
import styles from "./CaseList.module.css";

function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();
  const [myOnly, setMyOnly] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = myOnly
          ? await getMyCases()
          : await getCases();

        setCases(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCases();
  }, [myOnly]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles["case-header"]}>
          <h2>Alla ärenden</h2>

          <div className={styles.actions}>
            <button onClick={() => setMyOnly(!myOnly)}>
              {myOnly ? "Visa alla" : "Mina ärenden"}
            </button>

            <button onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        </div>

        {/* LISTA */}
        {!cases || cases.length === 0 ? (
          <p>Inga ärenden</p>
        ) : (
          <div className={styles["case-grid"]}>
            {cases.map((c) => (
              <CaseCard key={c.id} caseItem={c} />
            ))}
          </div>
        )}
        
      </div>
    </Layout>
  );
}

export default CaseList;