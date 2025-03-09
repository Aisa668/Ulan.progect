import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:7000/products");
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Ошибка загрузки товаров: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:7000/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Все товары (Админ)</h1>
      <Link to="/addProduct">Добавить товар</Link>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.body}</p>
            <Link to={`/edit-product/${product.id}`}>Редактировать</Link>
            <button onClick={() => handleDelete(product.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
