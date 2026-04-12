import { useEffect, useState } from "react";
import { getCases, getMyCases } from "../../api/caseApi";
import "./CaseList.css";
import { useNavigate } from "react-router-dom";

function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  getCases()
    .then((res) => {
      console.log("API RESPONSE:", res.data);
      setCases(res.data);
    })
    .catch((err) => console.error(err));
}, []);

useEffect(() => {
  getMyCases().then(res => setCases(res.data));
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Alla ärenden</h2>

      <button onClick={handleLogout}>Logga ut</button>

      {!cases || cases.length === 0 ? (
        <p>Inga ärenden</p>
      ) : (
        <div className="case-grid">
          {cases.map((c) => (
            <div key={c.id} className="case-card">
              <h3>{c.title}</h3>

              <span className={`badge ${c.status.toLowerCase()}`}>
                {c.status}
              </span>

              <button
                className="open-btn"
                onClick={() => navigate(`/cases/${c.id}`)}
              >
                Öppna
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CaseList;