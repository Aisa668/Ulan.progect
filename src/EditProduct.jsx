import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Импорт useParams
import ProductForm from "./ProductForm"; // Импортируем компонент ProductForm

const EditProduct = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: 0,
    price: 0,
    image: "",
    quantity: 0,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем данные товара и список категорий
  useEffect(() => {
    if (!id) return; // Если ID нет, не делаем запрос

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:7000/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          setError("Не удалось загрузить продукт.");
        }
      } catch (err) {
        setError("Ошибка при загрузке продукта.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:7000/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setError("Не удалось загрузить категории.");
        }
      } catch (err) {
        setError("Ошибка при загрузке категорий.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]); // Зависимость - id

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["categoryId", "price", "quantity"].includes(name)
        ? Number(value) || 0
        : value,
    });
  };

  const handleSubmit = async (updatedProduct) => {
    setSuccess("");
    setError("");

    const yourToken = localStorage.getItem("token");
    if (!yourToken) {
      setError("Токен не найден. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourToken}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setSuccess("Продукт успешно обновлен!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Не удалось обновить продукт.");
      }
    } catch (err) {
      setError("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Редактировать продукт</h1>

      {success && <div style={{ color: "green" }}>{success}</div>}

      <ProductForm
        productData={formData} // Передаем данные товара в форму
        categories={categories} // Передаем список категорий
        onInputChange={handleInputChange} // Обработчик изменения данных формы
        onSubmit={handleSubmit} // Обработчик отправки формы
      />
    </div>
  );
};

export default EditProduct;
