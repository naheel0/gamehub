import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("gameHubUser"));

  console.log("🔐 ProtectedAdminRoute - User:", user);
  console.log("🔐 ProtectedAdminRoute - User role:", user?.role);

  if (!user) {
    console.log("❌ No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.log("❌ User is not admin, redirecting to home");
    console.log("❌ User role is:", user.role);
    return <Navigate to="/" replace />;
  }

  console.log("✅ Admin access granted");
  return children;
};

export default ProtectedAdminRoute;