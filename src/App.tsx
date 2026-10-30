import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { ChatWidget } from "./components/ai/ChatWidget";
import { ToastContainer } from "./components/common/Toast";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { useDataStore } from "./store/dataStore";

import { HomePage } from "./pages/Home";
import { CategoryPage } from "./pages/Category";
import { ProductDetail } from "./pages/ProductDetail";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";
import { OrderConfirmationPage } from "./pages/OrderConfirmation";
import { TrackOrderPage } from "./pages/TrackOrder";
import { SearchPage } from "./pages/Search";
import { AboutPage } from "./pages/About";
import { ContactPage } from "./pages/Contact";

import { LoginPage } from "./pages/auth/Login";
import { SignupPage } from "./pages/auth/Signup";

import { AccountDashboard } from "./pages/account/Dashboard";
import { AccountOrders } from "./pages/account/Orders";
import { AccountOrderDetail } from "./pages/account/OrderDetail";
import { AccountProfile } from "./pages/account/Profile";
import { AccountAddresses } from "./pages/account/Addresses";
import { AccountWishlist } from "./pages/account/Wishlist";

import { TeamDashboard } from "./pages/team/TeamDashboard";
import { MyReferralsPage } from "./pages/team/MyReferrals";
import { TeamCommissionPage } from "./pages/team/Commission";
import { TeamWithdrawalPage } from "./pages/team/Withdrawal";
import { TeamProfilePage } from "./pages/team/TeamProfile";

import { AdminLoginPage } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/Products";
import { AdminProductForm } from "./pages/admin/ProductForm";
import { AdminCategories } from "./pages/admin/Categories";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminOrderDetail } from "./pages/admin/OrderDetail";
import { AdminCustomers } from "./pages/admin/Customers";
import { AdminDiscounts } from "./pages/admin/Discounts";
import { AdminTeamMembers } from "./pages/admin/TeamMembers";
import { AdminCommissions } from "./pages/admin/Commissions";
import { AdminWithdrawals } from "./pages/admin/Withdrawals";
import { AdminDeliveryRates } from "./pages/admin/DeliveryRates";
import { AdminBanners } from "./pages/admin/Banners";
import { AdminReports } from "./pages/admin/Reports";
import { AdminSiteSettings } from "./pages/admin/SiteSettings";

function AppShell() {
  const location = useLocation();
  const language = useDataStore((s) => s.language);
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const rtl = !isAdminRoute && language === "ur";

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#FFFFFF] text-[#1A1A1A] flex flex-col selection:bg-[#C9A84C] selection:text-[#1A1A1A]"
    >
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <div className="flex-1">
        <Routes>
          {/* Public Customer Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route
            path="/order-confirmation/:orderNumber"
            element={<OrderConfirmationPage />}
          />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Customer Account Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountOrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/addresses"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountAddresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/wishlist"
            element={
              <ProtectedRoute allowedRoles={["customer", "agent", "admin"]}>
                <AccountWishlist />
              </ProtectedRoute>
            }
          />

          {/* Partner Agent Hub Routes */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <TeamDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/referrals"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <MyReferralsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/commissions"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <TeamCommissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/withdrawals"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <TeamWithdrawalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/profile"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <TeamProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Separate Standalone Admin Panel Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/discounts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDiscounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminTeamMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/commissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCommissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminWithdrawals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delivery"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDeliveryRates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBanners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSiteSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
