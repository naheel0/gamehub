import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  // Change from 'loggedInUser' to 'gameHubUser'
  const user = JSON.parse(localStorage.getItem("gameHubUser"));

  console.log("🔐 ProtectedAdminRoute - User:", user);
  console.log("🔐 ProtectedAdminRoute - User role:", user?.role);

  // ✅ User not logged in → go to login page
  if (!user) {
    console.log("❌ No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // ✅ User logged in but NOT admin → go to home
  if (user.role !== "admin") {
    console.log("❌ User is not admin, redirecting to home");
    console.log("❌ User role is:", user.role);
    return <Navigate to="/" replace />;
  }

  // ✅ Admin user → allow access
  console.log("✅ Admin access granted");
  return children;
};

export default ProtectedAdminRoute;