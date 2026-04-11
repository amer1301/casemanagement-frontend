import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Alla ärenden</h2>
      <button onClick={handleLogout}>Logga ut</button>
      {!cases || cases.length === 0 ? (
  <p>Inga ärenden</p>
) : (
        <ul>
          {cases.map((c) => (
            <li key={c.id}>
              {c.title} - {c.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CaseList;