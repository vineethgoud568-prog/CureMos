import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: "doctor-a" | "doctor-b";
}

export const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  // TODO: Implement actual authentication check with Supabase
  const isAuthenticated = false; // Placeholder
  const userType = null; // Placeholder

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
