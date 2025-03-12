import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Для редиректа
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice"; // Импортируем асинхронный экшен
import { jwtDecode } from "jwt-decode"; // Для декодирования JWT токена

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для редиректа

  // Получаем данные из Redux
  const {
    loading,
    error: reduxError,
    token,
    role,
  } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Отправляем данные в Redux для логина
      const actionResult = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(actionResult)) {
        console.log("Action Result:", actionResult.payload);

        // Декодируем токен, чтобы получить роль
        const decodedToken = jwtDecode(actionResult.payload.token);
        const role = decodedToken.role; // Извлекаем роль из токена

        // Сохраняем токен и роль в localStorage
        localStorage.setItem("token", actionResult.payload.token);
        localStorage.setItem("role", role); // Сохраняем роль

        // Редиректим пользователя в зависимости от роли
        if (role === "ADMIN") {
          navigate("/admin/products"); // Админская страница
        } else {
          navigate("/products"); // Страница товаров для обычного пользователя
        }
      } else {
        setError(actionResult.payload || "Ошибка авторизации");
      }
    } catch (error) {
      setError("Ошибка при авторизации");
    }
  };

  if (loading) {
    return <div>Загрузка...</div>; // Индикатор загрузки
  }

  return (
    <div>
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Войти
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {reduxError && <p style={{ color: "red" }}>{reduxError}</p>}
      </form>
    </div>
  );
};

export default Login;
