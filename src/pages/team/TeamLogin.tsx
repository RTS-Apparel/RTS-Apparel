import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { useDataStore } from "../../store/dataStore";
import { pageVariants } from "../../lib/animations";
import { User, UserRole } from "../../types";

export default function TeamLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const currentUser = useAuthStore((s) => s.user);
  const currentRole = useAuthStore((s) => s.role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (currentUser && currentRole === "agent" && currentUser.is_approved) {
    return <Navigate to="/team" replace />;
  }
  if (currentUser && currentRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!isSupabaseConfigured) {
      setError("Team login abhi available nahi. Please administrator se rabta karein.");
      setLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !data.user || !data.session) {
      setError("Email ya password ghalat hai. Dobara koshish karein.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role, is_approved, is_blocked, full_name, phone, referral_code")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setError("Team profile nahi mila. Administrator se rabta karein.");
      setLoading(false);
      return;
    }

    if (profile.is_blocked) {
      await supabase.auth.signOut();
      setError("Aapka account block hai. Administrator se rabta karein.");
      setLoading(false);
      return;
    }

    if (profile.role !== "agent") {
      await supabase.auth.signOut();
      setError("Yeh portal sirf registered team agents ke liye hai.");
      setLoading(false);
      return;
    }

    const mappedUser: User = {
      id: data.user.id,
      email: data.user.email || normalizedEmail,
      full_name: profile.full_name || data.user.email?.split("@")[0] || "Team Agent",
      phone: profile.phone || "",
      role: profile.role as UserRole,
      referral_code: profile.referral_code || null,
      is_approved: Boolean(profile.is_approved),
      is_blocked: Boolean(profile.is_blocked),
      created_at: new Date().toISOString(),
    };

    setAuth({
      user: mappedUser,
      role: mappedUser.role,
      session: data.session,
      isLoading: false,
    });

    setLoading(false);
    navigate(mappedUser.is_approved ? "/team" : "/pending-approval", { replace: true });
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center bg-[#0B0B0C] px-4 py-12 text-white"
    >
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E63946]/40 bg-[#E63946]/10 text-[#E63946]">
            <ShieldCheck size={28} />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#E63946]">ARTS APPAREL • PRIVATE PORTAL</p>
          <h1 className="font-serif-display text-3xl font-bold">Team Member Login</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Sirf approved ARTS APPAREL team agents ke liye.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="team-email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/75">Team Email</label>
              <input id="team-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Apni registered email" className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#E63946]" />
            </div>
            <div>
              <label htmlFor="team-password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/75">Password</label>
              <div className="relative">
                <input id="team-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Apna password" className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-[#E63946]" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Password chhupayein" : "Password dikhayein"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E63946] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:bg-[#C1121F] disabled:cursor-not-allowed disabled:opacity-60">
              <LogIn size={16} /> {loading ? "Verifying..." : "Secure Team Login"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-white/45">Access role aur approval status se verify hota hai. Naye agents ko admin approval darkar hai.</p>
        </div>
      </div>
    </motion.main>
  );
}
