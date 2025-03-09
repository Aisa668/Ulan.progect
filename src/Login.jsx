import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Для редиректа
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Хук для редиректа

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:7000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка авторизации");
      }

      const data = await response.json();
      console.log("Ответ от сервера:", data);

      // Сохраняем токен
      localStorage.setItem("token", data.token);

      // Если роль есть в ответе сервера, сохраняем ее
      if (data.role) {
        localStorage.setItem("role", data.role);
        console.log("Сохраненная роль из ответа сервера:", data.role);
      } else {
        // Если роль отсутствует в ответе, пробуем достать из декодированного токена
        const decodedToken = jwtDecode(data.token);
        if (decodedToken.role) {
          localStorage.setItem("role", decodedToken.role);
          console.log("Сохраненная роль из токена:", decodedToken.role);
        } else {
          console.log("Роль не найдена в токене");
        }
      }

      // Редиректим пользователя в зависимости от роли
      const role = data.role || jwtDecode(data.token).role;
      if (role === "ADMIN") {
        navigate("/admin/products"); // Админская страница
      } else {
        navigate("/products"); // Страница товаров для обычного пользователя
      }

      console.log("Успешная авторизация:", data);
    } catch (error) {
      setError(error.message);
    }
  };

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
        <button type="submit">Войти</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
