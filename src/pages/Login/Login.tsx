import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./Login.module.css";
import heroImg from "../../assets/Hero Startsida.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const role = res.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate("/");

    } catch (err: any) {
      console.error("Login failed", err);
      setError("Fel email eller lösenord");
    }
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        
        <div className={styles.hero}>
          <img src={heroImg} alt="hero" />
        </div>

        <form className={styles.card} onSubmit={handleLogin}>
          <h2>Logga in</h2>

          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.buttonGroup}>
  <button onClick={handleLogin}>Logga in</button>

  <button onClick={() => navigate("/register")}>
    Registrera
  </button>
</div>

          {error && <p className={styles.error}>{error}</p>}
        </form>

      </div>
    </Layout>
  );
}

export default Login;