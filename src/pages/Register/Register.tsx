import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./Register.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError("Registrering misslyckades");
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Registrera</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Registrera</button>

        {error && <p>{error}</p>}
      </div>
    </Layout>
  );
}

export default Register;