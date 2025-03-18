import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "./authSlice"; // Импортируем экшены
import Login from "./Login";
import Registration from "./Registration";
import { jwtDecode } from "jwt-decode"; // Импортируем jwtDecode
import { Button, CircularProgress } from "@mui/material"; // Импортируем компоненты MUI
import { useNavigate } from "react-router-dom";
import { setAuthData } from "./authSlice";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между формами
  };

  const handleLogin = async (credentials) => {
    try {
      const resultAction = await dispatch(loginUser(credentials)); // Отправляем данные
      const { token } = resultAction.payload || {}; // Извлекаем токен

      if (token) {
        const decodedToken = jwtDecode(token); // Декодируем токен
        const userRole = decodedToken.role;

        localStorage.setItem("token", token); // Сохраняем токен
        localStorage.setItem("role", decodedToken.role); // Сохраняем роль

        dispatch(setAuthData({ token, role: userRole })); // ✅ Используем setAuthData

        navigate(userRole === "ADMIN" ? "admin/products" : "/products");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
    }
  };

  const handleRegistration = async (credentials) => {
    try {
      console.log("Registration Credentials:", credentials);
      const resultAction = await dispatch(registerUser(credentials)); // Отправляем данные
      const { token } = resultAction.payload || {}; // Извлекаем токен

      if (token) {
        const decodedToken = jwtDecode(token); // Декодируем токен
        const userRole = decodedToken.role;

        localStorage.setItem("token", token); // Сохраняем токен
        localStorage.setItem("role", decodedToken.role); // Сохраняем роль

        dispatch(setAuthData({ token, role: userRole })); // ✅ Записываем в Redux

        navigate(userRole === "ADMIN" ? "/admin/products" : "/products"); // ✅ Редирект после регистрации
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2>
      {isLogin ? (
        <Login onSubmit={handleLogin} /> // Форма логина
      ) : (
        <Registration onSubmit={handleRegistration} /> // Форма регистрации
      )}
      <div>
        {isLogin ? (
          <p>
            Нет учетной записи?{" "}
            <Button variant="text" onClick={toggleForm}>
              Зарегистрироваться
            </Button>
          </p>
        ) : (
          <p>
            Уже есть учетная запись?{" "}
            <Button variant="text" onClick={toggleForm}>
              Войти
            </Button>
          </p>
        )}
      </div>
      {loading && <CircularProgress />} {/* Показать индикатор загрузки */}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;
