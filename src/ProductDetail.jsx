import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch(); // Подключаем Redux dispatch
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:7000/products/${id}`);
        if (!response.ok) throw new Error("Ошибка загрузки товара");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Ошибка загрузки товара: " + err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:7000/category");
        if (!response.ok) throw new Error("Ошибка загрузки категорий");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Ошибка загрузки категорий: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Товар не найден</p>;

  // Поиск категории по ID товара
  const currentCategory = categories.find((el) => el.id === product.categoryId);

  // Функция для добавления товара в корзину
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <p>
        <strong>Описание:</strong> {product.description}
      </p>
      <p>
        <strong>Цена:</strong> {product.price} ₽
      </p>
      <p>
        <strong>Количество:</strong> {product.quantity}
      </p>
      <p>
        <strong>Категория:</strong>{" "}
        {currentCategory ? currentCategory.title : "Неизвестно"}
      </p>
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          style={{ maxWidth: "300px" }}
        />
      )}

      {/* Кнопка "Добавить в корзину" */}
      <button
        onClick={handleAddToCart}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductDetail;
