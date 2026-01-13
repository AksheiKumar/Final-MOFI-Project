import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

   if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-white">MO</span>
            <span className="text-amber-600">FI</span>
          </h1>
        </div>
        
        {/* Spinner */}
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-amber-600 rounded-full absolute top-0 left-0 border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
  if (!accessToken) return <Navigate to="/login" replace />;

  return children;
}
