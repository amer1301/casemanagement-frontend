import { createContext, useState, useContext } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children}: any) {
    const [token, setToken] = useState<String | null>(null);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);