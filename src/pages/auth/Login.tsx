import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { useDataStore } from "../../store/dataStore";
import { CUSTOMER_TRANSLATIONS } from "../../lib/i18n";
import { pageVariants } from "../../lib/animations";
import { User, UserRole } from "../../types";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

export const LoginPage: React.FC = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const authUser = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const language = useDataStore((s) => s.language);
  const t = CUSTOMER_TRANSLATIONS[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [googleCallback, setGoogleCallback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") || params.get("error");
    if (oauthError) {
      setError(oauthError);
    } else if (params.get("google") === "1") {
      setGoogleCallback(true);
    }
    if (params.has("google") || params.has("error")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!googleCallback || authLoading) return;
    if (!authUser) {
      setError("Google sign-in could not be completed. Please try again.");
      setGoogleCallback(false);
      return;
    }
    if (authUser.is_blocked) {
      void supabase.auth.signOut();
      setError("Aapka account block kar diya gaya hai.");
      setGoogleCallback(false);
      return;
    }
    if (authUser.role === "admin") navigate("/admin", { replace: true });
    else if (authUser.role === "agent") navigate(authUser.is_approved ? "/team" : "/pending-approval", { replace: true });
    else navigate("/account", { replace: true });
  }, [googleCallback, authLoading, authUser, navigate]);

  async function handleLogin(loginEmail: string, loginPassword: string) {
    setLoading(true);
    setError("");

    const normalizedEmail = loginEmail.trim().toLowerCase();

    if (isSupabaseConfigured) {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: loginPassword,
        });

      if (!signInError && data?.user) {
        // Fetch user role from users table
        const { data: userData } = await supabase
          .from("users")
          .select("role, is_approved, is_blocked, full_name, phone, referral_code")
          .eq("id", data.user.id)
          .single();

        if (!userData) {
          // User exists in auth but not in users table — create entry
          const defaultName = data.user.email?.split("@")[0] || "User";
          await supabase.from("users").insert({
            id: data.user.id,
            full_name: defaultName,
            role: "customer",
            is_approved: false,
            is_blocked: false,
          });
          const createdUser: User = {
            id: data.user.id,
            email: data.user.email || normalizedEmail,
            full_name: defaultName,
            phone: "",
            role: "customer",
            referral_code: null,
            is_approved: false,
            is_blocked: false,
            created_at: new Date().toISOString(),
          };
          setAuth({
            user: createdUser,
            role: "customer",
            session: data.session,
            isLoading: false,
          });
          setLoading(false);
          navigate("/account");
          return;
        }

        if (userData.is_blocked) {
          await supabase.auth.signOut();
          setError("Aapka account block kar diya gaya hai.");
          setLoading(false);
          return;
        }

        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          full_name: userData.full_name || data.user.email?.split("@")[0] || "User",
          phone: userData.phone || "",
          role: (userData.role as UserRole) || "customer",
          referral_code: userData.referral_code || null,
          is_approved: Boolean(userData.is_approved),
          is_blocked: Boolean(userData.is_blocked),
          created_at: new Date().toISOString(),
        };

        setAuth({
          user: mappedUser,
          role: mappedUser.role,
          session: data.session,
          isLoading: false,
        });

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "agent" && userData.is_approved) {
          navigate("/team");
        } else if (userData.role === "agent" && !userData.is_approved) {
          navigate("/pending-approval");
        } else {
          navigate("/account");
        }
        setLoading(false);
        return;
      }

      // If Supabase returned an auth error and email doesn't match local fallback users, return error
      const localUsers = useDataStore.getState().users;
      const localMatch = localUsers.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );
      if (!localMatch) {
        setError("Email ya password galat hai. Dobara try karo.");
        setLoading(false);
        return;
      }
    }

    // Local / Demo user verification when Supabase is not configured or for seeded accounts
    const users = useDataStore.getState().users;
    const matched = users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (!matched || loginPassword.trim().length < 4) {
      setError("Email ya password galat hai. Dobara try karo.");
      setLoading(false);
      return;
    }

    if (matched.is_blocked) {
      setError("Aapka account block kar diya gaya hai.");
      setLoading(false);
      return;
    }

    setAuth({
      user: matched,
      role: matched.role,
      session: { user: { id: matched.id, email: matched.email } },
      isLoading: false,
    });

    if (matched.role === "admin") {
      navigate("/admin");
    } else if (matched.role === "agent" && matched.is_approved) {
      navigate("/team");
    } else if (matched.role === "agent" && !matched.is_approved) {
      navigate("/pending-approval");
    } else {
      navigate("/account");
    }
    setLoading(false);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
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
          <div className="p-3 rounded-[6px] bg-[#F8D7DA] border border-[#E63946] text-xs text-[#E63946] font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
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
              placeholder="name@example.com"
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
                placeholder="••••••••"
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
            disabled={loading}
            className="w-full py-3.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#C1121F] transition-colors btn-primary-futuristic flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            <span>{loading ? "Signing In..." : "Login"}</span>
          </button>
        </form>

        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999999]">
          <span className="h-px flex-1 bg-[#E8E8E8]" />
          <span>Or continue with</span>
          <span className="h-px flex-1 bg-[#E8E8E8]" />
        </div>
        <GoogleAuthButton onError={setError} />

        <p className="text-center text-xs text-[#666666]">
          New to ARTS APPAREL?{" "}
          <Link to="/signup" className="font-semibold text-[#E63946] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </motion.main>
  );
};

export default LoginPage;
