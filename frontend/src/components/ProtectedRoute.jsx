import { Navigate } from "react-router-dom";
import { authStore } from "../auth";

export default function ProtectedRoute({ children, roles }) {
  const u = authStore.user;
  if (!u) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(u.role)) return <Navigate to="/" replace />;
  return children;
}
