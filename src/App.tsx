import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import StorefrontSidebar from "./components/layout/StorefrontSidebar";
import Footer from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { ToastContainer } from "./components/common/Toast";
import { CustomCursor } from "./components/common/CustomCursor";
import { PageLoader } from "./components/common/PageLoader";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { pageVariants } from "./lib/animations";
import { useAuthStore } from "./store/authStore";
import { useDataStore } from "./store/dataStore";
import { useProducts } from "./hooks/useProducts";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { Order, OrderItem } from "./types";

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
import ChatPage from "./pages/ChatPage";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PendingApproval from "./pages/auth/PendingApproval";

import AccountDashboard from "./pages/account/Dashboard";
import AccountOrders from "./pages/account/Orders";
import AccountOrderDetail from "./pages/account/OrderDetail";
import AccountProfile from "./pages/account/Profile";
import AccountAddresses from "./pages/account/Addresses";
import AccountWishlist from "./pages/account/Wishlist";

import TeamLogin from "./pages/team/TeamLogin";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="storefront-shell min-h-screen flex flex-col bg-[#FFFFFF] text-[#1A1A1A] relative">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex min-w-0 flex-1">
        <StorefrontSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </div>
      </div>
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Floating customer assistant over the storefront */}
        <Route
          path="/assistant"
          element={
            <StorefrontLayout>
              <PageMotion>
                <Home />
              </PageMotion>
              <ChatPage />
            </StorefrontLayout>
          }
        />

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
            <StorefrontLayout>
              <PageMotion>
                <AccountWishlist />
              </PageMotion>
            </StorefrontLayout>
          }
        />

        {/* Private team login: deliberately not linked from public navigation */}
        <Route path="/team/login" element={<PageMotion><TeamLogin /></PageMotion>} />

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
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const userId = useAuthStore((s) => s.user?.id || null);

  // Load the live Supabase catalog for storefront and admin routes alike.
  useProducts();

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  useEffect(() => {
    let cancelled = false;

    const loadAccountData = async () => {
      if (!isSupabaseConfigured || !userId) {
        useDataStore.setState({ orders: [], orderItems: [] });
        return;
      }

      const [ordersResult, ratesResult] = await Promise.all([
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false }),
        supabase
          .from("city_delivery_rates")
          .select("*")
          .eq("is_active", true)
          .order("city_name"),
      ]);

      if (cancelled) return;

      if (ordersResult.error) {
        console.error("Unable to load Supabase orders:", ordersResult.error.message);
      } else {
        const allItems: OrderItem[] = [];
        const orders: Order[] = (ordersResult.data || []).map((row: any) => {
          const items: OrderItem[] = (row.order_items || []).map((item: any) => ({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id || "",
            product_name_en: item.product_name_en,
            name_en: item.product_name_en,
            product_image: item.product_image || "",
            image: item.product_image || "",
            quantity: Number(item.quantity),
            size: item.size || "",
            color: item.color || "",
            unit_price: Number(item.unit_price),
            final_unit_price: Number(item.unit_price),
            original_price: Number(item.original_price),
            discount_percent: Number(item.original_price) > 0
              ? Math.round((1 - Number(item.unit_price) / Number(item.original_price)) * 100)
              : 0,
          }));
          allItems.push(...items);

          return {
            id: row.id,
            order_number: row.order_number,
            customer_id: row.customer_id,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            agent_id: row.agent_id,
            referral_code: row.referral_code,
            status: row.status,
            payment_method: row.payment_method,
            payment_status: row.payment_status,
            transaction_id: row.transaction_id,
            subtotal: Number(row.subtotal),
            delivery_charge: Number(row.delivery_charge),
            discount_amount: Number(row.discount_amount),
            total_amount: Number(row.total_amount),
            delivery_city: row.delivery_city,
            delivery_address: row.delivery_address,
            admin_note: row.admin_note,
            notes: row.customer_note || null,
            created_at: row.created_at,
            updated_at: row.updated_at,
            items,
          };
        });

        useDataStore.setState({ orders, orderItems: allItems });
      }

      if (ratesResult.error) {
        console.error("Unable to load delivery rates:", ratesResult.error.message);
      } else {
        useDataStore.setState({
          deliveryRates: (ratesResult.data || []).map((rate: any) => ({
            ...rate,
            charge: Number(rate.charge),
          })),
        });
      }
    };

    void loadAccountData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <BrowserRouter>
      <PageLoader />
      <CustomCursor />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
