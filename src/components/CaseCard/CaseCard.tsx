import { useNavigate } from "react-router-dom";
import "./CaseCard.css";

type Case = {
  id: number;
  title: string;
  description: string;
  status: string;
};

type Props = {
  caseItem: Case;
};

function CaseCard({ caseItem }: Props) {
  const navigate = useNavigate();

  return (
    <div className="case-card">
      <h3>{caseItem.title}</h3>

      <p className="description">
        {caseItem.description}
      </p>

      <div className="case-footer">
        <span className={`badge ${caseItem.status.toLowerCase()}`}>
          {caseItem.status}
        </span>

        <button onClick={() => navigate(`/cases/${caseItem.id}`)}>
          Öppna
        </button>
      </div>
    </div>
  );
}

export default CaseCard;