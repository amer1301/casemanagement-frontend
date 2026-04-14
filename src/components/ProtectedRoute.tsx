import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

type Role = "USER" | "ADMIN" | "MANAGER";

type Props = {
    children: React.ReactNode;
    allowedRoles?: Role[];
};

function ProtectedRoute({ children, allowedRoles }: Props) {
    const { token, role } = useAuth();

    // Ej inloggad
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Roll saknas eller ej tillåten
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        return <Navigate to="/" replace />;
    }

    // Tillåten
    return <>{children}</>;
}

export default ProtectedRoute;