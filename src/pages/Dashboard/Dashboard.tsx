import { useEffect, useState } from "react";
import { getCases } from "../../api/caseApi";

function Dashboard() {
    const [cases, setCases] = useState<any[]>([]);

    useEffect(() => {
        getCases().then(res => setCases(res.data));
    }, []);

    const total = cases.length;
    const submitted = cases.filter(c => c.status === "SUBMITTED").length;
    const approved = cases.filter(c => c.status === "APPROVED").length;
    const rejected = cases.filter(c => c.status === "REJECTED").length;

     return (
    <div className="dashboard">
      <h1>Översikt</h1>

      <div className="stats">
        <div className="card">Totalt: {total}</div>
        <div className="card blue">Inkomna: {submitted}</div>
        <div className="card green">Godkända: {approved}</div>
        <div className="card red">Avslagna: {rejected}</div>
      </div>
    </div>
  );
}

export default Dashboard;
