import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CreateCase.module.css";

function CreateCasePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await createCase({ title, description });
      navigate("/my-cases");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

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

    setErrors(newErrors);
    return valid;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Skapa ärende</h2>

        <div className={styles.form}>
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
                setErrors((prev) => ({ ...prev, title: "" }));
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
              !description.trim()
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