import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем данные из localStorage только один раз при монтировании компонента
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Если токен и роль существуют, обновляем состояние и выполняем редирект
    if (token && role) {
      setIsAuthenticated(true);
      if (role === "USER") {
        navigate("/products"); // Страница списка товаров для USER
      } else if (role === "ADMIN") {
        navigate("/admin/products"); // Админская страница всех товаров
      }
    } else {
      navigate("/auth"); // Перенаправляем на страницу входа/регистрации
    }
  }, [navigate]); // Срабатывает при монтировании компонента

  return null; // Не нужно рендерить что-то в компоненте
};

export default AuthRedirect;
