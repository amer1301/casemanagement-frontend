import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CreateCase.module.css";
import { caseCategoryLabels } from "../../types/CaseCategory";
import type { CaseCategory } from "../../types/CaseCategory";

function CreateCasePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

const [category, setCategory] = useState<CaseCategory>("STUDY");
  const [personalNumber, setPersonalNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    personalNumber: "",
    applicantName: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createCase({
        title,
        description,
        category,
        personalNumber,
        applicantName
      });

      navigate("/my-cases");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const validate = () => {
  let valid = true;

  const newErrors = {
    title: "",
    description: "",
    personalNumber: "",
    applicantName: ""
  };

  // TITLE
  if (!title.trim()) {
    newErrors.title = "Titel krävs";
    valid = false;
  } else if (title.length < 3) {
    newErrors.title = "Minst 3 tecken";
    valid = false;
  }

  // DESCRIPTION
  if (!description.trim()) {
    newErrors.description = "Beskrivning krävs";
    valid = false;
  } else if (description.length < 10) {
    newErrors.description = "Minst 10 tecken";
    valid = false;
  }

  // NAMN
  if (!applicantName.trim()) {
    newErrors.applicantName = "Namn krävs";
    valid = false;
  } else if (!/^[\p{L}\s-]+$/u.test(applicantName)) {
    newErrors.applicantName = "Endast bokstäver tillåtna";
    valid = false;
  }

  // PERSONNUMMER
  if (!personalNumber.trim()) {
    newErrors.personalNumber = "Personnummer krävs";
    valid = false;
  } else if (!/^\d{10,12}$/.test(personalNumber)) {
    newErrors.personalNumber = "Ange 10–12 siffror";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Skapa ärende</h2>

        <div className={styles.form}>

          {/* NAMN */}
          <div className={styles.field}>
            <input
              className={`${styles.input} ${errors.applicantName ? styles.errorInput : ""}`}
              placeholder="Namn"
              value={applicantName}
              onChange={(e) => {
  const value = e.target.value.replace(/[0-9]/g, "");
  setApplicantName(value);
  setErrors((prev) => ({ ...prev, applicantName: "" }));
}}
            />
            {errors.applicantName && (
              <span className={styles.errorText}>{errors.applicantName}</span>
            )}
          </div>

          {/* PERSONNUMMER */}
          <div className={styles.field}>
            <input
  inputMode="numeric"
  pattern="[0-9]*"
              className={`${styles.input} ${errors.personalNumber ? styles.errorInput : ""}`}
              placeholder="Personnummer (YYYYMMDDXXXX)"
              value={personalNumber}
              onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");
  setPersonalNumber(value);
  setErrors((prev) => ({ ...prev, personalNumber: "" }));
}}
            />
            {errors.personalNumber && (
              <span className={styles.errorText}>{errors.personalNumber}</span>
            )}
          </div>

          {/* KATEGORI */}
          <div className={styles.field}>
<select
  className={styles.select}
  value={category}
  onChange={(e) => setCategory(e.target.value as CaseCategory)}
>
  {Object.entries(caseCategoryLabels).map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ))}
</select>
          </div>

          {/* TITEL */}
          <div className={styles.field}>
            <input
              className={`${styles.input} ${errors.title ? styles.errorInput : ""}`}
              placeholder="Titel"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          {/* BESKRIVNING */}
          <div className={styles.field}>
            <textarea
              className={`${styles.textarea} ${errors.description ? styles.errorInput : ""}`}
              placeholder="Beskrivning"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <button
            className={styles.buttonSend}
            onClick={handleSubmit}
            disabled={
              loading ||
              !title.trim() ||
              !description.trim() ||
              !personalNumber.trim() ||
              !applicantName.trim()
            }
          >
            {loading ? "Skickar..." : "Skicka"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCasePage;