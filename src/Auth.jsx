import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "./authSlice"; // Импортируем экшены
import Login from "./Login";
import Registration from "./Registration";
import { jwtDecode } from "jwt-decode"; // Импортируем jwtDecode

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между формами
  };

  const handleLogin = async (credentials) => {
    try {
      const resultAction = await dispatch(loginUser(credentials)); // Отправляем данные
      const { token } = resultAction.payload || {}; // Извлекаем токен

      if (token) {
        const decodedToken = jwtDecode(token); // Декодируем токен
        localStorage.setItem("token", token); // Сохраняем токен
        localStorage.setItem("role", decodedToken.role); // Сохраняем роль
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
        localStorage.setItem("token", token); // Сохраняем токен
        localStorage.setItem("role", decodedToken.role); // Сохраняем роль
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
            <button onClick={toggleForm}>Зарегистрироваться</button>
          </p>
        ) : (
          <p>
            Уже есть учетная запись? <button onClick={toggleForm}>Войти</button>
          </p>
        )}
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;
