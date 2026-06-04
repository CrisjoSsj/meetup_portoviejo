import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/auth";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
