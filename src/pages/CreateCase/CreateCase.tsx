import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CreateCase.module.css";
import { caseCategoryLabels } from "../../types/CaseCategory";
import type { CaseCategory } from "../../types/CaseCategory";

/**
 * CreateCasePage låter användaren skapa ett nytt ärende.
 *
 * Funktionalitet:
 * - Formulär med validering
 * - Input-sanitization (t.ex. siffror/bokstäver)
 * - Skickar data till backend
 */
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

  /**
   * Hanterar submit av formuläret.
   *
   * - Validerar input
   * - Skickar data till backend
   * - Navigerar efter lyckad skapning
   */
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

  /**
   * Validerar formulärdata.
   *
   * - Kontrollerar tomma fält
   * - Längdkrav
   * - Format (regex)
   * - Sätter felmeddelanden i state
   */
  const validate = () => {
    let valid = true;

    const newErrors = {
      title: "",
      description: "",
      personalNumber: "",
      applicantName: ""
    };

    if (!title.trim()) {
      newErrors.title = "Titel krävs";
      valid = false;
    } else if (title.length < 3) {
      newErrors.title = "Minst 3 tecken";
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Beskrivning krävs";
      valid = false;
    } else if (description.length < 10) {
      newErrors.description = "Minst 10 tecken";
      valid = false;
    }

    if (!applicantName.trim()) {
      newErrors.applicantName = "Namn krävs";
      valid = false;
    } else if (!/^[\p{L}\s-]+$/u.test(applicantName)) {
      newErrors.applicantName = "Endast bokstäver tillåtna";
      valid = false;
    }

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
        <main className={styles.main}>
          <h1 className={styles.title}>Skapa ärende</h1>

          <div className={styles.form}>

            <div className={styles.field}>
              <input
                className={`${styles.input} ${errors.applicantName ? styles.errorInput : ""}`}
                placeholder="Namn"
                value={applicantName}
                onChange={(e) => {
                  // Tar bort siffror (input-sanitization)
                  const value = e.target.value.replace(/[0-9]/g, "");
                  setApplicantName(value);
                  setErrors((prev) => ({ ...prev, applicantName: "" }));
                }}
              />
              {errors.applicantName && (
                <span className={styles.errorText}>{errors.applicantName}</span>
              )}
            </div>

            <div className={styles.field}>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                className={`${styles.input} ${errors.personalNumber ? styles.errorInput : ""}`}
                placeholder="Personnummer (YYYYMMDDXXXX)"
                value={personalNumber}
                onChange={(e) => {
                  // Tillåter endast siffror
                  const value = e.target.value.replace(/\D/g, "");
                  setPersonalNumber(value);
                  setErrors((prev) => ({ ...prev, personalNumber: "" }));
                }}
              />
              {errors.personalNumber && (
                <span className={styles.errorText}>{errors.personalNumber}</span>
              )}
            </div>

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
        </main>
      </div>
    </Layout>
  );
}

export default CreateCasePage;