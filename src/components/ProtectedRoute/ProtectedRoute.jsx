import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show a loading spinner or placeholder while waiting for user data
  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or skeleton if needed
  }

  // Redirect if user is not an ADMIN
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
