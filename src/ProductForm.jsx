import React, { useState, useEffect } from "react";

const ProductForm = ({ productId }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState(""); // Описание товара
  const [productImage, setProductImage] = useState(""); // Изображение товара
  const [productQuantity, setProductQuantity] = useState(""); // Количество товара
  const [selectedCategory, setSelectedCategory] = useState(""); // Категория товара
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole && userRole.toUpperCase() === "ADMIN";

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:7000/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Error loading categories: " + err.message);
      }
    };
    fetchCategories();
  }, []);

  // Загрузка данных товара, если редактирование
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(
            `http://localhost:7000/products/${productId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }
          const data = await response.json();
          setProductName(data.name);
          setProductPrice(data.price);
          setProductDescription(data.description || ""); // Добавляем описание
          setProductImage(data.image || ""); // Добавляем изображение
          setProductQuantity(data.quantity || ""); // Добавляем количество
          setSelectedCategory(data.categoryId); // предполагаем, что categoryId — это id категории
        } catch (err) {
          setError("Error loading product: " + err.message);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    if (!token) {
      setError("Ошибка: пользователь не авторизован.");
      return;
    }

    try {
      const method = productId ? "PUT" : "POST";
      const url = productId
        ? `http://localhost:7000/products/${productId}`
        : "http://localhost:7000/products";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: productName,
          description: productDescription,
          image: productImage,
          categoryId: Number(selectedCategory), // Преобразуем в число
          price: Number(productPrice), // Преобразуем в число
          quantity: Number(productQuantity), // Преобразуем в число
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении/редактировании товара");
      }

      const product = await response.json();
      setError(""); // Очищаем ошибки
      console.log("Товар успешно добавлен/отредактирован", product);
    } catch (err) {
      setError("Ошибка: " + err.message);
    }
  };

  return (
    <div>
      <h1>{productId ? "Редактировать товар" : "Добавить товар"}</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Название товара</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <label htmlFor="productPrice">Цена товара</label>
        <input
          type="number"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(Number(e.target.value))} // Преобразуем в число сразу
          required
        />

        <label htmlFor="productDescription">Описание товара</label>
        <textarea
          id="productDescription"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />

        <label htmlFor="productImage">Изображение товара</label>
        <input
          type="text"
          id="productImage"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
        />

        <label htmlFor="productQuantity">Количество товара</label>
        <input
          type="number"
          id="productQuantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))} // Преобразуем в число сразу
          required
        />

        <label htmlFor="productCategory">Категория товара</label>

        <select
          id="productCategory"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))} // Преобразуем в число сразу
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">{productId ? "Сохранить" : "Добавить"}</button>
      </form>
    </div>
  );
};

export default ProductForm;
