import "./App.css";
import { store } from "./store";
import { Provider } from "react-redux"; // Импортируем Provider
import { RouterProvider } from "react-router-dom";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import ErrorPage from "./ErrorPage";
import Layout from "./Layout";
// добавление комментария для коммита

// добавление коммита в новую ветку
import ProductDetail from "./ProductDetail";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import Categories from "./Categories";
import Auth from "./Auth";
import ProductsPage from "./ProductsPage";
import PrivateRoute from "./PrivateRoute"; // Импортируем PrivateRoute
import Cart from "./Cart";
import "@fontsource/roboto";
import { Navigate } from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/auth" replace />} />
        <Route path="auth" element={<Auth />} />

        <Route path="cart" element={<Cart />} />

        {/* Приватные маршруты для USER и ADMIN */}
        <Route element={<PrivateRoute allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="products" element={<ProductsPage isAdmin={false} />} />

          <Route path="products/:id" element={<ProductDetail />} />
          <Route element={<PrivateRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route
              path="categories"
              element={
                <Categories
                  isAdmin={localStorage.getItem("role") === "ADMIN"}
                />
              }
            />
          </Route>
        </Route>

        {/* Приватные маршруты только для ADMIN */}
        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="admin/products"
            element={<ProductsPage isAdmin={true} />}
          />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="addProduct" element={<AddProduct />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );

  return (
    <Provider store={store}>
      {" "}
      {/* Оборачиваем в Redux Provider */}
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
