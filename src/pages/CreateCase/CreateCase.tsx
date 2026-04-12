import { useState } from "react";
import { createCase } from "../../api/caseApi";
import { useNavigate } from "react-router-dom";

function CreateCasePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await createCase({ title, description });
    navigate("/");
  };

  return (
    <div>
      <h2>Skapa ärende</h2>

      <input
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Beskrivning"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>Skicka</button>
    </div>
  );
}

export default CreateCasePage;