import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "./productsSlice";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputAdornment,
} from "@mui/material";

const ProductsPage = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false); // Открытие модального окна для редактирования
  const [selectedProduct, setSelectedProduct] = useState(null); // Выбранный продукт для редактирования

  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
    categoryId: "",
    image: "",
    price: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({
    description: "",
    categoryId: "",
    image: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Открытие модального окна редактирования
  const handleEditOpen = (product) => {
    setSelectedProduct(product);
    setUpdatedData({
      title: product.title,
      description: product.description,
      categoryId: product.categoryId || "",
      image: product.image || "",
      price: product.price || "",
      quantity: product.quantity || "",
    });
    setOpenEditDialog(true);
  };

  // Закрытие модального окна
  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  // Валидация данных формы
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Валидация описания
    if (!updatedData.description.trim()) {
      newErrors.description = "Должно быть строкой и не может быть пустым";
      isValid = false;
    }

    // Валидация categoryId (целое положительное число)
    const categoryId = parseInt(updatedData.categoryId, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      newErrors.categoryId = "Поле должно быть целым положительным числом";
      isValid = false;
    }

    // Валидация изображения (строка и не пустое)
    if (!updatedData.image.trim()) {
      newErrors.image = "Должно быть строкой и не может быть пустым";
      isValid = false;
    }

    // Валидация цены (целое положительное число)
    const price = parseInt(updatedData.price, 10);
    if (isNaN(price) || price <= 0) {
      newErrors.price = "Поле должно быть целым положительным числом";
      isValid = false;
    }

    // Валидация количества (целое положительное число)
    const quantity = parseInt(updatedData.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Поле должно быть целым положительным числом";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработка отправки формы редактирования
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedDataToSubmit = {
        ...updatedData,
        categoryId: parseInt(updatedData.categoryId, 10),
        price: parseInt(updatedData.price, 10),
        quantity: parseInt(updatedData.quantity, 10),
      };

      try {
        // Обновляем товар через dispatch
        if (selectedProduct) {
          await dispatch(
            updateProduct({
              id: selectedProduct.id,
              updatedData: updatedDataToSubmit,
            })
          );
        }
        setOpenEditDialog(false);
      } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        alert(
          "Произошла ошибка при обновлении товара. Пожалуйста, попробуйте снова."
        );
      }
    }
  };

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>{isAdmin ? "Все товары" : "Список товаров"}</h1>

      <TextField
        label="Поиск по названию товара"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  alt={product.title}
                  height="140"
                  image={product.image || "https://via.placeholder.com/150"}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ height: "80px", overflow: "hidden" }}
                  >
                    {product.body}
                  </Typography>
                </CardContent>

                <div style={{ margin: "auto", padding: "10px" }}>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="contained" color="primary" fullWidth>
                      {isAdmin ? "Просмотр" : "Подробнее"}
                    </Button>
                  </Link>

                  {isAdmin && (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 1 }}
                        onClick={() => handleEditOpen(product)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        sx={{ marginTop: 1 }}
                        onClick={() => handleDelete(product.id)}
                      >
                        Удалить
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Модальное окно редактирования товара */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Редактировать товар</DialogTitle>
        <DialogContent>
          <TextField
            label="Название"
            variant="outlined"
            fullWidth
            name="title"
            value={updatedData.title}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Описание"
            variant="outlined"
            fullWidth
            name="description"
            value={updatedData.description}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Категория ID"
            variant="outlined"
            fullWidth
            name="categoryId"
            value={updatedData.categoryId}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
            error={!!errors.categoryId}
            helperText={errors.categoryId}
          />
          <TextField
            label="Изображение (URL)"
            variant="outlined"
            fullWidth
            name="image"
            value={updatedData.image}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
            error={!!errors.image}
            helperText={errors.image}
          />
          <TextField
            label="Цена"
            variant="outlined"
            fullWidth
            name="price"
            value={updatedData.price}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₽</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Количество"
            variant="outlined"
            fullWidth
            name="quantity"
            value={updatedData.quantity}
            onChange={handleInputChange}
            style={{ marginBottom: "20px" }}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
