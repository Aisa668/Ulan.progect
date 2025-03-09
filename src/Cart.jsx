import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "./cartSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart); // Получаем корзину из Redux
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Корзина</h1>
      {cart.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul>
            {cart.items.map((product) => (
              <li key={product.id} style={{ marginBottom: "20px" }}>
                <h3>{product.title}</h3>
                <p>Цена: {product.price} ₽</p>
                <p>Количество: {product.quantity}</p>
                <button onClick={() => dispatch(removeFromCart(product.id))}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => dispatch(clearCart())}
            style={{ marginTop: "20px" }}
          >
            Очистить корзину
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
