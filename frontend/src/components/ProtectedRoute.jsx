import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center font-mono text-cyan neon-text animate-pulse">
        AUTHENTICATING…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
