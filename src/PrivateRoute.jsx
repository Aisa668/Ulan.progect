import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const userRole = (localStorage.getItem("role") || "").toUpperCase();

  console.log(
    "🔹 Роль из localStorage (приведена к верхнему регистру):",
    userRole
  );
  console.log("✅ Допустимые роли:", allowedRoles);
  console.log("✅ Проверка includes:", allowedRoles.includes(userRole));

  if (!allowedRoles.includes(userRole)) {
    console.log("❌ Редирект на /auth");
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
