import React, { useState } from "react";
import Login from "./Login"; // Импорт компонента для логина
import Registration from "./Registration"; // Импорт компонента для регистрации

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения форм

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между формами
  };

  return (
    <div>
      <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2>

      {isLogin ? <Login /> : <Registration />}

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
    </div>
  );
};

export default Auth;
