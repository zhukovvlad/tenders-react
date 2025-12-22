import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null; // можно спиннер
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
