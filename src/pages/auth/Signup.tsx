import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { pageVariants } from "../../lib/animations";

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [role, setRole] = useState<"customer" | "agent">(
    searchParams.get("tab") === "agent" ? "agent" : "customer"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [agentPendingSubmitted, setAgentPendingSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signup({
      full_name: fullName,
      email,
      phone,
      password,
      role,
      join_reason: role === "agent" ? joinReason : undefined,
    });

    if (!res.success) {
      setError(res.error || "Could not create account.");
      return;
    }

    if (role === "agent") {
      setAgentPendingSubmitted(true);
    } else {
      navigate("/account");
    }
  };

  if (agentPendingSubmitted) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-lg mx-auto px-4 py-16"
      >
        <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E63946] p-8 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto" />
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Your Agent Account is Under Review
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed">
            Thank you, <strong className="text-[#1A1A1A]">{fullName}</strong>. Your application has been registered with status <code className="text-[#E63946] font-semibold">pending_approval</code>. Once the Admin approves your profile in the Admin Panel, your unique referral code will be generated.
          </p>
          <div className="pt-3 flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

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

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0]">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`py-2 rounded-[6px] text-xs font-semibold transition-colors ${
              role === "customer"
                ? "bg-[#E63946] text-[#FFFFFF]"
                : "text-[#1A1A1A] hover:text-[#E63946]"
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`py-2 rounded-[6px] text-xs font-semibold transition-colors ${
              role === "agent"
                ? "bg-[#E63946] text-[#FFFFFF]"
                : "text-[#1A1A1A] hover:text-[#E63946]"
            }`}
          >
            Join as Agent
          </button>
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

          {role === "agent" && (
            <div className="space-y-1">
              <label htmlFor="signup-reason" className="text-xs font-medium text-[#1A1A1A]">
                City & Referral Channel (Instagram / WhatsApp / Boutique)
              </label>
              <textarea
                id="signup-reason"
                rows={2}
                value={joinReason}
                onChange={(e) => setJoinReason(e.target.value)}
                placeholder="Tell us how you plan to refer ARTS APPAREL clients..."
                className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-[#E63946] bg-[#F8D7DA] border border-[#E63946] rounded-[6px] p-3 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm hover:bg-[#C1121F] transition-colors btn-primary-futuristic"
          >
            {role === "agent"
              ? "Submit Partner Agent Application"
              : "Create Customer Account"}
          </button>
        </form>

        <p className="text-xs text-[#666666] text-center">
          Already registered?{" "}
          <Link to="/login" className="text-[#E63946] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
