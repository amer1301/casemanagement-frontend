import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import styles from "./Login.module.css";
import heroImg from "../../assets/Hero Startsida.png";
import { useAuth } from "../../context/authContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post<{
        token: string;
        role: string;
        email: string;
        name: string;
      }>("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { token, email: userEmail, name } = res.data;

      if (!token) {
        throw new Error("No token received");
      }

      setAuth({
        token,
        email: userEmail,
        name,
      });

      navigate("/");

    } catch (err) {
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
            required
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.buttonGroup}>
            <button type="submit">Logga in</button>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
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