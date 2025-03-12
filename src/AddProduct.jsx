import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "./productsSlice"; // Импортируем action
import { Container, Grid, TextField, Button, Typography } from "@mui/material";

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
    <Container maxWidth="sm">
      <div>
        <Typography variant="h4" gutterBottom>
          Добавить товар
        </Typography>

        {/* Форма для добавления товара */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Название товара"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Описание товара"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Категория"
                name="categoryId"
                fullWidth
                type="number"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Цена"
                name="price"
                fullWidth
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Ссылка на изображение"
                name="image"
                fullWidth
                value={formData.image}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Количество"
                name="quantity"
                fullWidth
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Добавление..." : "Добавить товар"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Статусы */}
        {error && (
          <Typography color="error" variant="body2" mt={2}>
            Ошибка: {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" variant="body2" mt={2}>
            {success}
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default AddProduct;
