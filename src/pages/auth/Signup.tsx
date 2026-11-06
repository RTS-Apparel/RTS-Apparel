import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { pageVariants } from "../../lib/animations";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signup({
      full_name: fullName,
      email,
      phone,
      password,
      role: "customer",
    });

    if (!res.success) {
      setError(res.error || "Could not create account.");
      return;
    }

    navigate("/account");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-md mx-auto px-4 py-12"
    >
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-1">
          <p className="text-xs text-[#E63946] font-semibold tracking-widest uppercase">
            ARTS APPAREL Membership
          </p>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Create Your Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="signup-name" className="text-xs font-medium text-[#1A1A1A]">
              Full Name *
            </label>
            <input
              id="signup-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Bilal Hassan"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="text-xs font-medium text-[#1A1A1A]">
              Email Address *
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-phone" className="text-xs font-medium text-[#1A1A1A]">
              Pakistan Phone Number *
            </label>
            <input
              id="signup-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0305-8165623"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="text-xs font-medium text-[#1A1A1A]">
              Password *
            </label>
            <input
              id="signup-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-[#E63946] bg-[#F8D7DA] border border-[#E63946] rounded-[6px] p-3 font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors btn-primary-futuristic flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </form>

        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999999]">
          <span className="h-px flex-1 bg-[#E8E8E8]" />
          <span>Or sign up with</span>
          <span className="h-px flex-1 bg-[#E8E8E8]" />
        </div>
        <GoogleAuthButton onError={setError} />

        <p className="text-xs text-[#666666] text-center">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-[#E63946] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <LogIn size={14} />
            <span>Login</span>
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
