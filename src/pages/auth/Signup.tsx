import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

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
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="rounded-xl bg-[#FAFAFA] border border-[#C9A84C] p-8 text-center space-y-4 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-[#C9A84C] mx-auto" />
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Your Agent Account is Under Review
          </h1>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            Thank you, <strong className="text-[#1A1A1A]">{fullName}</strong>. Your application has been registered with status <code className="text-[#C9A84C] font-semibold">pending_approval</code>. Once the Admin approves your profile in the Admin Panel, your unique referral code will be generated.
          </p>
          <div className="pt-3 flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm"
            >
              Return to Store
            </Link>
            <Link
              to="/admin/team"
              className="px-5 py-2.5 rounded-lg border border-[#E8E0D0] text-xs text-[#4A4A4A] hover:text-[#1A1A1A] flex items-center"
            >
              Approve in Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <p className="text-xs text-[#C9A84C] font-semibold tracking-widest uppercase">
            RTS Apparel Membership
          </p>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Create Your Account
          </h1>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F5F4F0] border border-[#E8E0D0]">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`py-2 rounded-md text-xs font-semibold transition-colors ${
              role === "customer"
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "text-[#4A4A4A] hover:text-[#1A1A1A]"
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`py-2 rounded-md text-xs font-semibold transition-colors ${
              role === "agent"
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "text-[#4A4A4A] hover:text-[#1A1A1A]"
            }`}
          >
            Join as Agent
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="signup-name" className="text-xs font-medium text-[#4A4A4A]">
              Full Name *
            </label>
            <input
              id="signup-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Bilal Hassan"
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="text-xs font-medium text-[#4A4A4A]">
              Email Address *
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-phone" className="text-xs font-medium text-[#4A4A4A]">
              Pakistan Phone Number *
            </label>
            <input
              id="signup-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0300-1234567"
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm font-mono text-[#1A1A1A]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="text-xs font-medium text-[#4A4A4A]">
              Password *
            </label>
            <input
              id="signup-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>

          {role === "agent" && (
            <div className="space-y-1">
              <label htmlFor="signup-reason" className="text-xs font-medium text-[#4A4A4A]">
                City & Referral Channel (Instagram / WhatsApp / Boutique)
              </label>
              <textarea
                id="signup-reason"
                rows={2}
                value={joinReason}
                onChange={(e) => setJoinReason(e.target.value)}
                placeholder="Tell us how you plan to refer RTS Apparel clients..."
                className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm hover:bg-[#E2C07A]"
          >
            {role === "agent"
              ? "Submit Partner Agent Application"
              : "Create Customer Account"}
          </button>
        </form>

        <p className="text-xs text-[#4A4A4A] text-center">
          Already registered?{" "}
          <Link to="/login" className="text-[#C9A84C] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
