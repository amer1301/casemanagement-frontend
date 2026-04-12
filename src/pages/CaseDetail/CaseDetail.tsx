import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/caseApi";

function CaseDetail() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        API.get(`/cases/${id}`).then(res => setData(res.data));
    }, [id]);

    if (!data) return <p>Laddar...</p>;

    return (
    <div className="detail">
      <div className="left">
        <h2>{data.title}</h2>
        <p>{data.description}</p>
      </div>

      <div className="right">
        <h3>Status</h3>
        <p>{data.status}</p>

        <button>Godkänn</button>
        <button>Avslå</button>
      </div>
    </div>
  );
}

export default CaseDetail;