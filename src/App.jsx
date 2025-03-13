import "./App.css";
import { store } from "./store";
import { Provider, useSelector } from "react-redux";
import { RouterProvider, Navigate } from "react-router-dom";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import ErrorPage from "./ErrorPage";
import Layout from "./Layout";
import ProductDetail from "./ProductDetail";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import Categories from "./Categories";
import Auth from "./Auth";
import ProductsPage from "./ProductsPage";
import PrivateRoute from "./PrivateRoute";
import Cart from "./Cart";
import "@fontsource/roboto";

function AppContent() {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            token ? (
              <Navigate
                to={role === "ADMIN" ? "/admin/products" : "/products"}
                replace
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="auth" element={<Auth />} />
        <Route path="cart" element={<Cart />} />

        {/* Приватные маршруты для USER и ADMIN */}
        <Route element={<PrivateRoute allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="products" element={<ProductsPage isAdmin={false} />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route
            path="categories"
            element={<Categories isAdmin={role === "ADMIN"} />}
          />
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

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
