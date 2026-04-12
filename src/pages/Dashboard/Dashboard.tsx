import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import type { Case } from "../../types/Case";

function Dashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getCases();
        setCases(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <p>Laddar...</p>;

  // Statistik
  const total = cases.length;
  const submitted = cases.filter(c => c.status === "SUBMITTED").length;
  const approved = cases.filter(c => c.status === "APPROVED").length;
  const rejected = cases.filter(c => c.status === "REJECTED").length;

  return (
    <div className="container">
      <h2>Dashboard</h2>
        <button onClick={() => navigate("/")}>
  Till ärenden
</button>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Totala ärenden</h3>
          <p>{total}</p>
        </div>

        <div className="card">
          <h3>Inskickade</h3>
          <p>{submitted}</p>
        </div>

        <div className="card">
          <h3>Godkända</h3>
          <p>{approved}</p>
        </div>

        <div className="card">
          <h3>Avslagna</h3>
          <p>{rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;