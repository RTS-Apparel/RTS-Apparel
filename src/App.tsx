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
import { Order, OrderItem, User, Commission, WithdrawalRequest } from "./types";

const Home = React.lazy(() => import("./pages/Home"));
const Category = React.lazy(() => import("./pages/Category"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderConfirmation = React.lazy(() => import("./pages/OrderConfirmation"));
const TrackOrder = React.lazy(() => import("./pages/TrackOrder"));
const Search = React.lazy(() => import("./pages/Search"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const AgentApply = React.lazy(() => import("./pages/AgentApply"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Signup = React.lazy(() => import("./pages/auth/Signup"));
const PendingApproval = React.lazy(() => import("./pages/auth/PendingApproval"));

const AccountDashboard = React.lazy(() => import("./pages/account/Dashboard"));
const AccountOrders = React.lazy(() => import("./pages/account/Orders"));
const AccountOrderDetail = React.lazy(() => import("./pages/account/OrderDetail"));
const AccountProfile = React.lazy(() => import("./pages/account/Profile"));
const AccountAddresses = React.lazy(() => import("./pages/account/Addresses"));
const AccountWishlist = React.lazy(() => import("./pages/account/Wishlist"));

const TeamLogin = React.lazy(() => import("./pages/team/TeamLogin"));
const TeamDashboard = React.lazy(() => import("./pages/team/TeamDashboard"));
const MyReferrals = React.lazy(() => import("./pages/team/MyReferrals"));
const Commission = React.lazy(() => import("./pages/team/Commission"));
const Withdrawal = React.lazy(() => import("./pages/team/Withdrawal"));
const TeamProfile = React.lazy(() => import("./pages/team/TeamProfile"));

const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/Products"));
const AdminProductForm = React.lazy(() => import("./pages/admin/ProductForm"));
const AdminCategories = React.lazy(() => import("./pages/admin/Categories"));
const AdminOrders = React.lazy(() => import("./pages/admin/Orders"));
const AdminOrderDetail = React.lazy(() => import("./pages/admin/OrderDetail"));
const AdminCustomers = React.lazy(() => import("./pages/admin/Customers"));
const AdminDiscounts = React.lazy(() => import("./pages/admin/Discounts"));
const AdminTeamMembers = React.lazy(() => import("./pages/admin/TeamMembers"));
const AdminCommissions = React.lazy(() => import("./pages/admin/Commissions"));
const AdminWithdrawals = React.lazy(() => import("./pages/admin/Withdrawals"));
const AdminDeliveryRates = React.lazy(() => import("./pages/admin/DeliveryRates"));
const AdminBanners = React.lazy(() => import("./pages/admin/Banners"));
const AdminReports = React.lazy(() => import("./pages/admin/Reports"));
const AdminSiteSettings = React.lazy(() => import("./pages/admin/SiteSettings"));

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
      <React.Suspense
        fallback={
          <div className="min-h-[45vh] grid place-items-center text-xs font-semibold tracking-widest text-[#666666]">
            LOADING ARTS APPAREL...
          </div>
        }
      >
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
        <Route
          path="*"
          element={
            <StorefrontLayout>
              <PageMotion>
                <NotFound />
              </PageMotion>
            </StorefrontLayout>
          }
        />
      </Routes>
      </React.Suspense>
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

      const [ordersResult, usersResult, commissionsResult, withdrawalsResult] = await Promise.all([
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false }),
        supabase.from("users").select("*").order("created_at", { ascending: false }),
        supabase.from("commissions").select("*").order("created_at", { ascending: false }),
        supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false }),
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

      if (usersResult.error) {
        console.error("Unable to load Supabase users:", usersResult.error.message);
      } else {
        const users: User[] = (usersResult.data || []).map((row: any) => ({
          ...row,
          full_name: row.full_name || "",
          phone: row.phone || "",
          referral_code: row.referral_code || null,
          is_approved: Boolean(row.is_approved),
          is_blocked: Boolean(row.is_blocked),
        }));
        useDataStore.setState({ users });
      }

      if (commissionsResult.error) {
        console.error("Unable to load Supabase commissions:", commissionsResult.error.message);
      } else {
        const commissions: Commission[] = (commissionsResult.data || []).map((row: any) => ({
          ...row,
          amount: row.amount == null ? null : Number(row.amount),
        }));
        useDataStore.setState({ commissions });
      }

      if (withdrawalsResult.error) {
        console.error("Unable to load Supabase withdrawals:", withdrawalsResult.error.message);
      } else {
        const withdrawals: WithdrawalRequest[] = (withdrawalsResult.data || []).map((row: any) => ({
          ...row,
          amount: Number(row.amount),
        }));
        useDataStore.setState({ withdrawalRequests: withdrawals });
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
