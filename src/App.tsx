import { useEffect, useState } from "react";
import { getCases } from "./api/caseApi";

function App() {
  const [cases, setCases] = useState([]);

useEffect(() => {
  getCases()
    .then((res) => {
      console.log(res.data);
      setCases(res.data.content); // 👈 FIX
    })
    .catch((err) => console.error(err));
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ärenden</h1>

      {cases.length === 0 ? (
        <p>Inga ärenden ännu...</p>
      ) : (
        <ul>
          {cases.map((c: any) => (
            <li key={c.id}>
              {c.title} - {c.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;