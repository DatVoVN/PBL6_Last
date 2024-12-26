import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.jsx";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useContext(UserContext);

  // Redirect to login if not authenticated
  if (!user || !user.authToken) {
    return <Navigate to="/login" replace />;
  }

  // Additional admin check for admin routes
  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
