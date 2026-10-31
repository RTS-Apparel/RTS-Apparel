import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { ChatWidget } from "./components/ai/ChatWidget";
import { ToastContainer } from "./components/common/Toast";
import { ScrollProgressBar } from "./components/common/ScrollProgressBar";
import { CustomCursor } from "./components/common/CustomCursor";
import { PageLoader } from "./components/common/PageLoader";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { pageVariants } from "./lib/animations";
import { useAuthStore } from "./store/authStore";

import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AgentApply from "./pages/AgentApply";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PendingApproval from "./pages/auth/PendingApproval";

import AccountDashboard from "./pages/account/Dashboard";
import AccountOrders from "./pages/account/Orders";
import AccountOrderDetail from "./pages/account/OrderDetail";
import AccountProfile from "./pages/account/Profile";
import AccountAddresses from "./pages/account/Addresses";
import AccountWishlist from "./pages/account/Wishlist";

import TeamDashboard from "./pages/team/TeamDashboard";
import MyReferrals from "./pages/team/MyReferrals";
import Commission from "./pages/team/Commission";
import Withdrawal from "./pages/team/Withdrawal";
import TeamProfile from "./pages/team/TeamProfile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminCustomers from "./pages/admin/Customers";
import AdminDiscounts from "./pages/admin/Discounts";
import AdminTeamMembers from "./pages/admin/TeamMembers";
import AdminCommissions from "./pages/admin/Commissions";
import AdminWithdrawals from "./pages/admin/Withdrawals";
import AdminDeliveryRates from "./pages/admin/DeliveryRates";
import AdminBanners from "./pages/admin/Banners";
import AdminReports from "./pages/admin/Reports";
import AdminSiteSettings from "./pages/admin/SiteSettings";
import SetupGuide from "./pages/admin/SetupGuide";

const PageMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1A1A1A] relative">
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <ToastContainer />
    </div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer Storefront Routes */}
        <Route
          path="/"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Home />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Category />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <StorefrontLayout>
              <PageMotion>
                <ProductDetail />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Cart />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Checkout />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <StorefrontLayout>
              <PageMotion>
                <OrderConfirmation />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/track"
          element={
            <StorefrontLayout>
              <PageMotion>
                <TrackOrder />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/search"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Search />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/about"
          element={
            <StorefrontLayout>
              <PageMotion>
                <About />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Contact />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Secret Agent Application Page (no public links) */}
        <Route
          path="/join-arts-team"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AgentApply />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Login />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Signup />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/pending-approval"
          element={
            <StorefrontLayout>
              <PageMotion>
                <PendingApproval />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Customer Account Hub (Protected) */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountDashboard />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountOrders />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountOrderDetail />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountProfile />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountAddresses />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/wishlist"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <PageMotion>
                  <AccountWishlist />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />

        {/* Partner Agent Referral Hub (Protected — Approved Agents Only) */}
        <Route
          path="/team"
          element={
            <ProtectedRoute requiredRole="agent">
              <StorefrontLayout>
                <PageMotion>
                  <TeamDashboard />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/referrals"
          element={
            <ProtectedRoute requiredRole="agent">
              <StorefrontLayout>
                <PageMotion>
                  <MyReferrals />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/commission"
          element={
            <ProtectedRoute requiredRole="agent">
              <StorefrontLayout>
                <PageMotion>
                  <Commission />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/withdrawal"
          element={
            <ProtectedRoute requiredRole="agent">
              <StorefrontLayout>
                <PageMotion>
                  <Withdrawal />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/profile"
          element={
            <ProtectedRoute requiredRole="agent">
              <StorefrontLayout>
                <PageMotion>
                  <TeamProfile />
                </PageMotion>
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Panel (Separate Layout — Protected by requiredRole="admin") */}
        <Route
          path="/admin/login"
          element={
            <>
              <PageMotion>
                <AdminLogin />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminDashboard />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminDashboard />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminProducts />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminProductForm />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminProductForm />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminCategories />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminOrders />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminOrderDetail />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminCustomers />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/discounts"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminDiscounts />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminTeamMembers />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/commissions"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminCommissions />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/withdrawals"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminWithdrawals />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delivery"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminDeliveryRates />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminBanners />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminReports />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <AdminSiteSettings />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/setup-guide"
          element={
            <ProtectedRoute requiredRole="admin">
              <PageMotion>
                <SetupGuide />
              </PageMotion>
              <ToastContainer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <PageLoader />
      <ScrollProgressBar />
      <CustomCursor />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
