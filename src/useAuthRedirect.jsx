import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (token && role) {
      console.log(
        "✅ Token and role found, redirecting to:",
        role === "ADMIN" ? "/admin/products" : "/products"
      );
      navigate(role === "ADMIN" ? "/admin/products" : "/products");
    } else {
      console.log("🚨 No token or role, redirecting to /auth");
      navigate("/auth");
    }
  }, [token, role, navigate]);

  return null;
};

export default AuthRedirect;
