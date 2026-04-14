import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CreateCase.module.css";

function CreateCasePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
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

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Skapa ärende</h2>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className={styles.textarea}
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className={styles.buttonSend}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Skickar..." : "Skicka"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCasePage;