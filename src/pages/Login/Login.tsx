import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import heroImg from "../../assets/Hero Startsida.png";
import { useAuth } from "../../context/authContext";
import { loginUser } from "../../api/caseApi";

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
      const res = await loginUser({
        email,
        password,
      });

      const { token, role, email: userEmail, name } = res;

      if (!token) {
        throw new Error("No token received");
      }

      setAuth({
        token,
        email: userEmail,
        name,
      });

      if (role === "USER") {
        navigate("/my-cases");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login failed", err);
      setError("Fel email eller lösenord");
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
      <div className={styles.hero}>
        <img src={heroImg} alt="Illustration av ärendehantering" />
      </div>

      <form className={styles.card} onSubmit={handleLogin}>
        <h1>Logga in</h1>

        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
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
      </main>
    </div>
  );
}

export default Login;