import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthSession } from "./useAuthSession";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuthSession();

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
