import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material"; // Импортируем компоненты из Material-UI
import AuthRedirect from "./useAuthRedirect";
import Header from "./Header"; // Подключаем Header
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="container">
      <Header />
      <AuthRedirect />

      <Box sx={{ maxWidth: "lg", margin: "0 auto", padding: 2 }}>
        <Outlet />
      </Box>

      {/* Можно добавить футер с ссылками */}
      <footer>
        <Link
          to="/terms"
          sx={{
            marginRight: 2,
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          Условия использования
        </Link>
        <Link
          to="/privacy"
          sx={{
            marginRight: 2,
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          Политика конфиденциальности
        </Link>
      </footer>
    </div>
  );
};

export default Layout;
