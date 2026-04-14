import { createContext, useState, useContext, useEffect } from "react";

type Role = "USER" | "ADMIN" | "MANAGER";

type AuthContextType = {
    token: string | null;
    role: Role | null;
    setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): any {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: any) {
    const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        if (token) {
            const decoded = parseJwt(token);

            setRole(decoded?.role ?? null);
        } else {
            setRole(null);
        }
    }, [token]);

    const setToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        setTokenState(newToken);
    };

    return (
        <AuthContext.Provider value={{ token, role, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};