import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "./productsSlice";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
} from "@mui/material";

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
                  image={product.image || "https://via.placeholder.com/150"} // Подставьте изображение товара
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
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{ marginTop: 1 }}
                      onClick={() => handleDelete(product.id)}
                    >
                      Удалить
                    </Button>
                  )}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ProductsPage;
