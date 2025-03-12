import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "./cartSlice";
import { Button, Typography, Box, Grid } from "@mui/material";

const Cart = () => {
  const cart = useSelector((state) => state.cart); // Получаем корзину из Redux
  const dispatch = useDispatch();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>
      {cart.items.length === 0 ? (
        <Typography variant="body1">Корзина пуста</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cart.items.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <img
                    src={product.image} // Добавляем изображение товара
                    alt={product.title}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body2">
                    Цена: {product.price} ₽
                  </Typography>
                  <Typography variant="body2">
                    Количество: {product.quantity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Категория: {product.categoryId}{" "}
                    {/* Отображаем ID категории */}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Описание: {product.description} {/* Отображаем описание */}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => dispatch(removeFromCart(product.id))}
                    sx={{ marginTop: 1 }}
                  >
                    Удалить
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="error"
            onClick={() => dispatch(clearCart())}
            sx={{ marginTop: 3 }}
          >
            Очистить корзину
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;
