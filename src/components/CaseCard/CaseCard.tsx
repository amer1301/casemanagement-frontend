import { useNavigate } from "react-router-dom";
import styles from "./CaseCard.module.css";

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
    <div className={styles.caseCard}>
      <h3>{caseItem.title}</h3>

      <p className={styles.description}>
        {caseItem.description}
      </p>

      <div className={styles.caseFooter}>
        <span
          className={`${styles.badge} ${
            styles[caseItem.status.toLowerCase()]
          }`}
        >
          {caseItem.status}
        </span>

        <button
          className={styles.button}
          onClick={() => navigate(`/cases/${caseItem.id}`)}
        >
          Öppna
        </button>
      </div>
    </div>
  );
}

export default CaseCard;