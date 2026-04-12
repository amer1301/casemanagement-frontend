import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById, getCaseLogs, updateCaseStatus } from "../../api/caseApi";
import "./CaseDetail.css";
import type { Log } from "../../types/Log";
import type { Case } from "../../types/Case";

function CaseDetail() {
    const { id } = useParams();

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    // Hämta case + logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const caseRes = await getCaseById(id!);
                const logsRes = await getCaseLogs(id!);

                setCaseData(caseRes.data);
                setLogs(logsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Uppdatera status (ADMIN)
    const handleStatus = async (status: string) => {
        try {
            console.log("CLICK STATUS:", status);
            console.log("ID:", id);

            const res = await updateCaseStatus(id!, status);

            console.log("RESPONSE:", res);

            setCaseData((prev) =>
                prev ? { ...prev, status } : prev
            );
        } catch (err) {
            console.error("ERROR:", err);
        }
    };

    if (loading) return <p>Laddar...</p>;
    if (!caseData) return <p>Kunde inte hämta ärendet</p>;

    const role = localStorage.getItem("role");
    console.log("ROLE:", role);

    return (
        <div className="case-detail">

            {/* VÄNSTER */}
            <div className="case-main">
                <h1>{caseData.title}</h1>
                <p className="description">{caseData.description}</p>

                <div className="status-box">
                    <h3>Status</h3>
                    <span className={`badge ${caseData.status.toLowerCase()}`}>
                        {caseData.status}
                    </span>
                </div>
            </div>

            {/* HÖGER */}
            <div className="case-sidebar">
                <h3>Åtgärder</h3>

                {role === "ADMIN" && (
                    <>
                        <button onClick={() => handleStatus("APPROVED")}>
                            Godkänn
                        </button>

                        <button onClick={() => handleStatus("REJECTED")}>
                            Avslå
                        </button>
                    </>
                )}

                <h3>Historik</h3>

                {logs.length === 0 ? (
                    <p>Ingen historik</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="log-item">
                            <p>{log.action}</p>
                            <small>
                                {log.userEmail}{" "}
                                {log.timestamp
                                    ? new Date(log.timestamp).toLocaleString()
                                    : "Okänt datum"}
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CaseDetail;