import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./cartSlice";
import { fetchProductById } from "./productsSlice";
import { fetchCategories } from "./categoriesSlice";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из Redux
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProductById(id)); // Загружаем товар
    dispatch(fetchCategories()); // Загружаем категории (если их еще нет)
  }, [dispatch, id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Товар не найден</Typography>;

  // Проверяем, что categories - это массив, прежде чем вызывать find()
  const currentCategory = Array.isArray(categories)
    ? categories.find((el) => el.id === product?.categoryId)
    : null;

  // Функция добавления товара в корзину
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: "20px",
        }}
      >
        <CardMedia
          component="img"
          image={product.image || "https://via.placeholder.com/300"}
          alt={product.title}
          sx={{
            maxWidth: { xs: "100%", md: "300px" },
            margin: "auto",
            objectFit: "contain",
          }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            <strong>Описание:</strong> {product.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Цена:</strong> {product.price} ₽
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Количество:</strong> {product.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Категория:</strong>{" "}
            {currentCategory ? currentCategory.title : "Неизвестно"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            sx={{ marginTop: "20px" }}
          >
            Добавить в корзину
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetail;
