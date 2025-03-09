import React, { useState } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Здесь вы можете добавить логику для отправки данных на сервер
      const response = await fetch("http://localhost:7000/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка регистрации");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      console.log("Ответ сервера:", data);
      localStorage.setItem("role", data.role);
      console.log("Сохраненная роль:", localStorage.getItem("role"));

      // Обработка успешного ответа, например, сохранение токена
      console.log("Успешная регистрация:", data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
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

export default Registration;
