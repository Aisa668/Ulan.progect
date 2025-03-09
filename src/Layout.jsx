import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AuthRedirect from "./useAuthRedirect";
import "./Layout.css"; // Импортируем стили

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Удаляю токен...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Редирект на страницу входа после выхода
    navigate("/auth");
  };

  return (
    <div className="container">
      <AuthRedirect />
      <header>
        <Link to="admin/products">ВСЕ ТОВАРЫ</Link>
        <Link to="products">СПИСОК ТОВАРОВ</Link>
        <Link to="addProduct">Добавления Товара</Link>
        <Link to="categories">Список категорий</Link>

        {/* Кнопка для выхода */}
        <button onClick={handleLogout}>LOG OUT</button>
      </header>

      {/* Здесь будут отображаться компоненты для каждого маршрута */}
      <div className="main-content">
        <Outlet />
      </div>

      {/* Можно добавить футер с ссылками */}
      <footer>
        <Link to="/terms">Условия использования</Link>
        <Link to="/privacy">Политика конфиденциальности</Link>
      </footer>
    </div>
  );
};

export default Layout;
