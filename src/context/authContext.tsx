import { createContext, useState, useContext, useEffect } from "react";

type Role = "USER" | "ADMIN" | "MANAGER";

type AuthContextType = {
  token: string | null;
  role: Role | null;
  email: string | null;
  name: string | null;
  setAuth: (data: {
    token: string | null;
    email: string | null;
    name: string | null;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Decode JWT
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );
  const [name, setName] = useState<string | null>(
    localStorage.getItem("name")
  );

  // Sync role och fallback email från token
  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);

      let rawRole = decoded?.role ?? null;

      if (rawRole && typeof rawRole === "string") {
        rawRole = rawRole.replace("ROLE_", "");
      }

      if (["USER", "ADMIN", "MANAGER"].includes(rawRole)) {
        setRole(rawRole as Role);
      } else {
        setRole(null);
      }

      // fallback email från JWT (sub)
      if (!email && decoded?.sub) {
        setEmail(decoded.sub);
      }

    } else {
      setRole(null);
      setEmail(null);
      setName(null);
    }
  }, [token, email]);

  const setAuth = ({
    token,
    email,
    name,
  }: {
    token: string | null;
    email: string | null;
    name: string | null;
  }) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (email) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }

    if (name) {
      localStorage.setItem("name", name);
    } else {
      localStorage.removeItem("name");
    }

    setToken(token);
    setEmail(email);
    setName(name);
  };

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");

  setToken(null);
  setRole(null);
  setEmail(null);
  setName(null);

  window.location.href = "/login";
};

  return (
    <AuthContext.Provider
      value={{ token, role, email, name, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// För axios interceptor
export const getToken = () => {
  return localStorage.getItem("token");
};