import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; // Импортируем Link из react-router-dom
import { useNavigate } from "react-router-dom";
import { logout } from "./authSlice";
import { useDispatch } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth", { replace: true });
  };

  return (
    <AppBar position="sticky" sx={{ width: "100%" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: 0, // Убираем отступы у Toolbar
          marginLeft: "-16px",
        }}
      >
        {/* Центральная часть - Ссылки */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexGrow: 1, // Центральные ссылки могут расширяться
            justifyContent: "center", // Центрируем ссылки по горизонтали
          }}
        >
          <RouterLink
            to="/admin/products"
            style={{ color: "white", textDecoration: "none" }}
          >
            ВСЕ ТОВАРЫ
          </RouterLink>
          <RouterLink
            to="/products"
            style={{ color: "white", textDecoration: "none" }}
          >
            СПИСОК ТОВАРОВ
          </RouterLink>
          <RouterLink
            to="/addProduct"
            style={{ color: "white", textDecoration: "none" }}
          >
            Добавление Товара
          </RouterLink>
          <RouterLink
            to="/categories"
            style={{ color: "white", textDecoration: "none" }}
          >
            Список категорий
          </RouterLink>
        </Box>

        {/* Правая часть - Кнопка выхода */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              minWidth: "auto", // Убираем минимальную ширину
              padding: "6px 16px", // Устанавливаем корректные отступы
              whiteSpace: "nowrap", // Запрещаем перенос текста на несколько строк
            }}
          >
            LOG OUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
