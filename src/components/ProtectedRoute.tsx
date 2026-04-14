import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("USER" | "ADMIN" | "MANAGER")[];
};

function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;