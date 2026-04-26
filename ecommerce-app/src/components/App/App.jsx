import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
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
const AdminLayout = lazy(() => import("../../pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../../pages/admin/AdminProducts"));
const Register = lazy(() => import("../../pages/Register"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Suspense
              fallback={
                <div className="h-screen flex items-center justify-center">
                  <Loading>Cargando...</Loading>
                </div>
              }
            >
              <Routes>

                {/* PUBLIC */}
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/search" element={<SearchResults />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />

                {/* USER */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "customer", "cliente"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route path="/order-confirmation" element={<OrderConfirmation />} />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ ADMIN LIMPIO */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<div>Ruta no encontrada</div>} />

              </Routes>
            </Suspense>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;