import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./CreateCase.module.css";

function CreateCasePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await createCase({ title, description });
      navigate("/");
    } catch (err) {
      console.error(err);
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

          <button className={styles.button} onClick={handleSubmit}>
            Skicka
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCasePage;