import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, isLoggedIn } = useAuth();

  if (loading) return null; // prevents flicker
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}
