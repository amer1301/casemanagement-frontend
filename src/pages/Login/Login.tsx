import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../../context/authContext";
import { loginUser } from "../../api/caseApi";

/**
 * Login-komponent för autentisering av användare.
 *
 * Funktionalitet:
 * - Skickar login-request till backend
 * - Sparar token i AuthContext
 * - Navigerar användare baserat på roll
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  /**
   * Hanterar inloggning.
   *
   * - Skickar credentials till backend
   * - Sparar token + user info i context
   * - Redirectar beroende på roll
   */
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser({
      email,
      password,
    });

    if (!res) {
      throw new Error("No response from server");
    }

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

  } catch (err: any) {
    console.error("Login failed:", err);

    if (err?.response) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Fel email eller lösenord";

      setError(message);

    } else if (err?.request) {
      setError("Kan inte nå servern. Kontrollera backend URL.");

    } else {
      setError(err.message || "Ett oväntat fel uppstod");
    }
  }
};

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <img src="/heroStartsida.png" alt="Illustration av ärendehantering" />
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