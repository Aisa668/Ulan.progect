import React, { useState } from "react";

const Registration = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Заполните все поля!");
      return;
    }

    onSubmit(formData); // Отправляем данные в Redux
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Введите email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль"
        required
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Registration;
