import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import Layout from "../../layout/Layout";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import ProtectedRoute from "../../pages/ProtectedRoute";
import Loading from "../common/Loading/Loading";

const Cart = lazy(() => import("../../pages/Cart"));
const CategoryPage = lazy(() => import("../../pages/CategoryPage"));
const Checkout = lazy(() => import("../../pages/Checkout"));
const OrderConfirmation = lazy(() => import("../../pages/OrderConfirmation"));
const Orders = lazy(() => import("../../pages/Orders"));
const Product = lazy(() => import("../../pages/Product"));
const Profile = lazy(() => import("../../pages/Profile"));
const SearchResults = lazy(() => import("../../pages/SearchResults"));
const Settings = lazy(() => import("../../pages/Settings"));
const WishList = lazy(() => import("../../pages/WishList"));

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loading>Cargando vista...</Loading></div>}>
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />

              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    redirectTo="/login"
                    allowedRoles={["admin", "customer", "cliente"]}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Checkout */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* Wishlist */}
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <WishList />
                  </ProtectedRoute>
                }
              />

              {/* Orders */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route path="/order-confirmation" element={<OrderConfirmation />} />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<div>Ruta no encontrada</div>} />

            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
