import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import heroImg from "../../assets/Hero Startsida.png";
import { registerUser } from "../../api/caseApi";

/**
 * Register-komponent för att skapa nya användare.
 *
 * Funktionalitet:
 * - Formulär med validering
 * - Skickar data till backend
 * - Hanterar fel och success feedback
 */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  /**
   * Hanterar registrering.
   *
   * - Validerar input
   * - Skickar request till backend
   * - Visar success eller felmeddelande
   */
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    try {
      await registerUser({
        name,
        email,
        password,
      });

      // Visar feedback till användaren
      setSuccess("Registrering lyckades!");

      // Redirect efter kort delay (bättre UX)
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      console.error(err);

      // Specifik hantering av duplicate email
      if (err.response?.status === 409) {
        setError("E-postadressen används redan");
      } else {
        setError("Registrering misslyckades");
      }
    }
  };

  /**
   * Validerar formulärdata.
   *
   * - Kontrollerar tomma fält
   * - Enkla formatkrav
   * - Sätter felmeddelanden i state
   */
  const validate = () => {
    let valid = true;

    const newErrors = {
      name: "",
      email: "",
      password: ""
    };

    if (!name.trim()) {
      newErrors.name = "Namn krävs";
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = "Minst 2 tecken";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "E-post krävs";
      valid = false;
    } else if (!email.includes("@")) {
      newErrors.email = "Ogiltig e-postadress";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Lösenord krävs";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Minst 6 tecken";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <img
            src={heroImg}
            alt="Illustration av ärendehantering"
          />
        </div>

        <div className={styles.card}>
          <h1>Registrera</h1>

          <div className={styles.field}>
            <label htmlFor="name">Namn</label>
            <input
              id="name"
              value={name}
              autoComplete="name"
              className={errors.name ? styles.errorInput : ""}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />

            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              className={errors.email ? styles.errorInput : ""}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />

            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              className={errors.password ? styles.errorInput : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />

            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={
              !name.trim() ||
              !email.trim() ||
              !password.trim() ||
              password.length < 6
            }
          >
            Registrera
          </button>

          {success && <div className={styles.toast}>{success}</div>}

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </main>
    </div>
  );
}

export default Register;