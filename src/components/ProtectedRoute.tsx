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

    return <Navigate to="/login" replace />;
}

    // Tillåten
    return <>{children}</>;
}

export default ProtectedRoute;