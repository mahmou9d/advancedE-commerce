import React from "react";
import { useAppSelector } from "@store/hooks";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If not logged in, redirect to login page and remember where they wanted to go
  if (!user && !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin rights and user is not an admin, redirect to home
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
