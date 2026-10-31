import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { CUSTOMER_TRANSLATIONS } from "../../lib/i18n";
import { pageVariants } from "../../lib/animations";

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const [email, setEmail] = useState("customer@rts.pk");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/account";

  const handleQuickRoleLogin = (role: "customer" | "agent") => {
    switchDemoRole(role);
    if (role === "agent") navigate("/team");
    else navigate(from);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success && res.user) {
      if (res.user.role === "agent") navigate("/team");
      else navigate(from);
      return;
    }
    if (email.toLowerCase().includes("agent")) {
      handleQuickRoleLogin("agent");
    } else {
      handleQuickRoleLogin("customer");
    }
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-md mx-auto px-4 py-16"
    >
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-8 space-y-6 shadow-sm">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E63946] block mb-1 font-semibold">
            ARTS APPAREL Pakistan
          </span>
          <h1 className="font-serif-display text-3xl text-[#1A1A1A] font-bold">
            {t.signIn}
          </h1>
        </div>

        {error && (
          <div className="p-3 rounded-[6px] bg-[#F8D7DA] border border-[#E63946] text-xs text-[#E63946] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs uppercase tracking-wider text-[#1A1A1A] mb-1.5 font-medium"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs uppercase tracking-wider text-[#1A1A1A] mb-1.5 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] px-3.5 py-2.5 pr-10 text-sm text-[#1A1A1A] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#E63946]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#C1121F] transition-colors btn-primary-futuristic"
          >
            {t.signIn}
          </button>
        </form>

        <div className="pt-5 border-t border-[#E0E0E0] space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-[#666666] text-center font-medium">
            Instant Demo Account Access
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("customer")}
              className="py-2.5 px-4 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] text-xs text-[#1A1A1A] font-medium flex items-center justify-between transition-colors"
            >
              <span>Customer Account (Hamza Raza)</span>
              <UserCheck className="w-4 h-4 text-[#E63946]" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("agent")}
              className="py-2.5 px-4 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] text-xs text-[#1A1A1A] font-medium flex items-center justify-between transition-colors"
            >
              <span>Partner Agent Hub (Ali Raza — RTS-ALI123)</span>
              <UserCheck className="w-4 h-4 text-[#E63946]" />
            </button>
          </div>
        </div>

        <p className="text-xs text-[#666666] text-center">
          New to ARTS APPAREL?{" "}
          <Link
            to="/signup"
            className="text-[#E63946] font-semibold hover:underline"
          >
            {t.signUp}
          </Link>
        </p>
      </div>
    </motion.main>
  );
};

export default LoginPage;
