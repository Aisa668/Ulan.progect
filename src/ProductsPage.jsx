import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "./productsSlice";
import { Link } from "react-router-dom";
import "./ProductsPage.css";

const ProductsPage = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Фильтрация товаров по поиску
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="container">
      <h1>{isAdmin ? "Все товары" : "Список товаров"}</h1>

      <input
        type="text"
        placeholder="Поиск по названию товара"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <h2>{product.title}</h2>
              <p>{product.body}</p>
              <Link to={`/products/${product.id}`}>
                {isAdmin ? "Просмотр" : "Подробнее"}
              </Link>
              {isAdmin && (
                <button onClick={() => handleDelete(product.id)}>
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
