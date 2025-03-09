import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { addProduct } from "./productsSlice"; // Импортируем action

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products); // Подписываемся на Redux
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: 0,
    price: 0,
    image: "",
    quantity: 0,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/auth");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: ["categoryId", "price", "quantity"].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    // Отправляем данные через Redux
    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        setSuccess("Товар успешно добавлен!");
        setFormData({
          title: "",
          description: "",
          categoryId: 0,
          price: 0,
          image: "",
          quantity: 0,
        });
      })
      .catch((errorMessage) => {
        console.error("Ошибка при добавлении:", errorMessage);
      });
  };

  return (
    <div>
      <h1>Добавить товар</h1>

      <ProductForm
        productData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {loading && <p>Добавление...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AddProduct;
