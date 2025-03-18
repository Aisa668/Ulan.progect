import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "./ProductForm";
import {
  fetchProductById,
  fetchCategories,
  updateProduct,
} from "./productsSlice";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Состояние из Redux
  const { selectedProduct, categories, loading, error, success } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id)); // Получаем данные товара
      dispatch(fetchCategories()); // Получаем список категорий
    }
  }, [id, dispatch]);

  const handleSubmit = (updatedProduct) => {
    // Отправляем обновленные данные товара
    dispatch(updateProduct({ id, updatedData: updatedProduct }));
    navigate("/products"); // После редактирования перенаправляем на список товаров
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Редактировать продукт</h1>
      {success && <div style={{ color: "green" }}>{success}</div>}
      <ProductForm
        productData={selectedProduct} // Передаем данные товара
        categories={categories} // Передаем список категорий
        onSubmit={handleSubmit} // Функция для отправки данных
      />
    </div>
  );
};

export default EditProduct;
