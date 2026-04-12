import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getCaseById,
    getCaseLogs,
    updateCaseStatus,
} from "../../api/caseApi";

import type { Case } from "../../types/Case";
import type { Log } from "../../types/Log";

function CaseDetail() {
    const { id } = useParams();

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    // ====================
    // HÄMTA DATA
    // ====================
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

    // ====================
    // UPPDATERA STATUS
    // ====================
    const handleStatus = async (status: string) => {
        try {
            await updateCaseStatus(id!, status);

            // 🔥 HÄMTA OM DATA (viktigt!)
            const updated = await getCaseById(id!);
            setCaseData(updated.data);

            const updatedLogs = await getCaseLogs(id!);
            setLogs(updatedLogs.data);
        } catch (err) {
            console.error("ERROR:", err);
        }
    };

    // ====================
    // LOADING / ERROR
    // ====================
    if (loading) return <p>Laddar...</p>;
    if (!caseData) return <p>Kunde inte hämta ärendet</p>;

    const role = localStorage.getItem("role");

    // ====================
    // UI
    // ====================
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
                            <p>{log.message}</p>
                            <small>
                                {log.user?.username}{" "}
                                {log.createdAt
                                    ? new Date(log.createdAt).toLocaleString()
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