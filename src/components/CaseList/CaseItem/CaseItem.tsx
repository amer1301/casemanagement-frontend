import {updateStatus } from "../../../api/caseApi";
import "./CaseItem.css";

type Case = {
    id: number;
    title: string,
    description: string,
    status: string;
};

type Props = {
    caseItem: Case;
};

function CaseItem({ caseItem }: Props) {
    const handleUpdate = async (status: string) => {
        try {
            await updateStatus(caseItem.id, status);
            console.log("Status uppdaterad");
        } catch (err) {
            console.error(err);
        }
    };

return (
  <li className="case-item">
    <div className="case-title">
      {caseItem.title}
    </div>

    <div className="case-status">
      Status: {caseItem.status}
    </div>

    <div className="case-actions">
      <button onClick={() => handleUpdate("APPROVED")}>
        Godkänn
      </button>

      <button onClick={() => handleUpdate("REJECTED")}>
        Avslå
      </button>
    </div>
  </li>
);
}

export default CaseItem;
