import { useState } from "react";
import API from "../api/caseApi";

function CreateCase() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const create = async () => {
        await API.post("/cases", { title, description });
    };

    return (
        <div>
            <h2>Skapa ärende</h2>
            <input onChange={(e) => setTitle(e.target.value)} />
            <textarea onChange={(e) => setDescription(e.target.value)} />
                <button onClick={create}>Skapa</button>
        </div>
    );
}

export default CreateCase;