import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StorefrontLayout from './components/layouts/StorefrontLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import HomePage from './pages/storefront/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductListPage from './pages/storefront/ProductListPage';
import ProductDetailsPage from './pages/storefront/ProductDetailsPage';
import CartPage from './pages/storefront/CartPage';
import LoginPage from './pages/storefront/LoginPage';
import RegisterPage from './pages/storefront/RegisterPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import OrderDetailsPage from './pages/storefront/OrderDetailsPage';
import OrdersPage from './pages/storefront/OrdersPage';
import CategoryExperiencePage from './pages/storefront/CategoryExperiencePage';
import PrimePage from './pages/storefront/PrimePage';
import CustomerServicePage from './pages/storefront/CustomerServicePage';
import GiftCardPage from './pages/storefront/GiftCardPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Admin Pages
import AdminProductList from './pages/admin/AdminProductList';
import AdminOrderList from './pages/admin/AdminOrderList';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailsPage />} />
              <Route path="experience" element={<CategoryExperiencePage />} />
              <Route path="prime" element={<PrimePage />} />
              <Route path="gift-cards" element={<GiftCardPage />} />
              <Route path="customer-service" element={<CustomerServicePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/new" element={<AddProductPage />} />
              <Route path="products/edit/:id" element={<EditProductPage />} />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
