import React from "react";
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
import { FloatingParticles, pageVariants } from "./lib/animations";

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

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

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

        {/* Customer Account Hub */}
        <Route
          path="/account"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountDashboard />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/account/orders"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountOrders />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountOrderDetail />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/account/profile"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountProfile />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountAddresses />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/account/wishlist"
          element={
            <StorefrontLayout>
              <PageMotion>
                <AccountWishlist />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Partner Agent Referral Hub */}
        <Route
          path="/team"
          element={
            <StorefrontLayout>
              <PageMotion>
                <TeamDashboard />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/team/referrals"
          element={
            <StorefrontLayout>
              <PageMotion>
                <MyReferrals />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/team/commission"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Commission />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/team/withdrawal"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Withdrawal />
              </PageMotion>
            </StorefrontLayout>
          }
        />
        <Route
          path="/team/profile"
          element={
            <StorefrontLayout>
              <PageMotion>
                <TeamProfile />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Admin Panel (Separate Layout — No Storefront Navbar/Footer) */}
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
            <>
              <PageMotion>
                <AdminDashboard />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <>
              <PageMotion>
                <AdminDashboard />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/products"
          element={
            <>
              <PageMotion>
                <AdminProducts />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <>
              <PageMotion>
                <AdminProductForm />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <>
              <PageMotion>
                <AdminProductForm />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <>
              <PageMotion>
                <AdminCategories />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <>
              <PageMotion>
                <AdminOrders />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <>
              <PageMotion>
                <AdminOrderDetail />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <>
              <PageMotion>
                <AdminCustomers />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/discounts"
          element={
            <>
              <PageMotion>
                <AdminDiscounts />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/team"
          element={
            <>
              <PageMotion>
                <AdminTeamMembers />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/commissions"
          element={
            <>
              <PageMotion>
                <AdminCommissions />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/withdrawals"
          element={
            <>
              <PageMotion>
                <AdminWithdrawals />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/delivery"
          element={
            <>
              <PageMotion>
                <AdminDeliveryRates />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <>
              <PageMotion>
                <AdminBanners />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <>
              <PageMotion>
                <AdminReports />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <>
              <PageMotion>
                <AdminSiteSettings />
              </PageMotion>
              <ToastContainer />
            </>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
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
