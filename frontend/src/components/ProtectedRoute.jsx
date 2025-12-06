import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />; // not logged in (generic)
  if (requireRole && user.role !== requireRole) return <Navigate to="/" replace />; // wrong role
  return <Outlet />;
}
