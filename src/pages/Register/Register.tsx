import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import heroImg from "../../assets/Hero Startsida.png";
import { registerUser } from "../../api/caseApi";

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

      setSuccess("Registrering lyckades!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 409) {
        setError("E-postadressen används redan");
      } else {
        setError("Registrering misslyckades");
      }
    }
  };

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

        <div className={styles.hero}>
          <img src={heroImg} alt="hero" />
        </div>

        <div className={styles.card}>
          <h2>Registrera</h2>

          <div className={styles.field}>
            <input
              placeholder="Namn"
              value={name}
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
            <input
              placeholder="Email"
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
            <input
              type="password"
              placeholder="Lösenord"
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
      </div>
  );
}

export default Register;