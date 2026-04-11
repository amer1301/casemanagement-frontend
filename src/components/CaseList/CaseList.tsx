import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";
import "./CaseList.css";

function CaseList() {
  const [cases, setCases] = useState<any[]>([]);

useEffect(() => {
  getCases()
    .then((res) => {
      console.log(res.data);
      setCases(res.data);
    })
    .catch((err) => console.error(err));
}, []);


  return (
    <div>
      <h2>Alla ärenden</h2>

      {cases.length === 0 ? (
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