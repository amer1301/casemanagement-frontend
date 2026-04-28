import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

type Role = "USER" | "ADMIN" | "MANAGER";

type Props = {
    children: React.ReactNode;
    allowedRoles?: Role[];
};

/**
 * ProtectedRoute skyddar routes baserat på autentisering och roll.
 *
 * Funktionalitet:
 * - Om användaren inte är inloggad → redirect till login
 * - Om roll inte är tillåten → redirect till relevant startsida
 * - Om allt är OK → rendera children
 */
function ProtectedRoute({ children, allowedRoles }: Props) {
    const { token, role } = useAuth();

    /**
     * Om användaren inte är autentiserad,
     * redirecta till login-sidan.
     */
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    /**
     * Om route kräver specifika roller och användaren saknar dessa:
     * - redirect baserat på roll (fallback navigation)
     */
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        if (role === "USER") {
            return <Navigate to="/user/my-cases" replace />;
        }
        if (role === "ADMIN") {
            return <Navigate to="/my-cases" replace />;
        }
        if (role === "MANAGER") {
            return <Navigate to="/dashboard" replace />;
        }

        // fallback om roll saknas eller är okänd
        return <Navigate to="/login" replace />;
    }

    /**
     * Om användaren är behörig renderas innehållet.
     */
    return <>{children}</>;
}

export default ProtectedRoute;