import { useEffect, useState } from "react";
import { getCases, getMyCases } from "../../api/caseApi";
import "./CaseList.css";
import { useNavigate } from "react-router-dom";
import CaseCard from "../../components/CaseCard/CaseCard";

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

useEffect(() => {
  getMyCases().then(res => setCases(res.data));
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

return (
  <div className="container">
    
    {/* HEADER */}
    <div className="case-header">
      <h2>Alla ärenden</h2>

      <div className="actions">
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
      <div className="case-grid">
        {cases.map((c) => (
          <CaseCard key={c.id} caseItem={c} />
        ))}
      </div>
    )}
    
  </div>
);
}

export default CaseList;