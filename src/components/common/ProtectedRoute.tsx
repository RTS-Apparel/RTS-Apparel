import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
  requiredRole?: "customer" | "agent" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0D0D0D",
          color: "#fff",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #333",
            borderTop: "3px solid #E63946",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#666", fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/login"} state={{ from: location }} replace />;
  }

  if (requiredRole === "admin" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "agent") {
    if (role !== "agent" && role !== "admin") {
      return <Navigate to="/" replace />;
    }
    if (role === "agent" && !user.is_approved) {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
