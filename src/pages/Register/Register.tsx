import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./Register.module.css";
import heroImg from "../../assets/Hero Startsida.png";
import { registerUser } from "../../api/caseApi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

const handleRegister = async () => {
  try {
    await registerUser({
      name,
      email,
      password,
    });

    setSuccess("Registrering lyckades!");

    setTimeout(() => {
      navigate("/login");
    }, 2000);

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
        {success && <div className={styles.toast}>{success}</div>}

        {error && <p className={styles.error}>{error}</p>}
      </div>
      </div>
    </Layout>
  );
}

export default Register;