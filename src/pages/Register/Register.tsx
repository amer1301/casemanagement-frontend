import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./Register.module.css";
import heroImg from "../../assets/Hero Startsida.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        name,
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
        <div className={styles.wrapper}>
        <div className={styles.hero}>
          <img src={heroImg} alt="hero" />
        </div>
      <div className={styles.container}>
        <h2>Registrera</h2>

        <input
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        {error && <p className={styles.error}>{error}</p>}
      </div>
      </div>
    </Layout>
  );
}

export default Register;