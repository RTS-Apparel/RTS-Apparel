import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface GoogleAuthButtonProps {
  onError: (message: string) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    onError("");
    if (!isSupabaseConfigured) {
      onError("Google sign-in is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login?google=1`,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        onError(error.message || "Google sign-in could not be started. Please try again.");
        setLoading(false);
      }
    } catch {
      onError("Google sign-in could not be started. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[6px] border border-[#DADCE0] bg-white px-4 py-3 text-sm font-semibold text-[#3C4043] shadow-sm transition hover:border-[#B8C0CC] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-70"
      aria-label="Continue with Google"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
        <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
        <path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7v-5.3H5.8a20 20 0 0 0 0 17.6l6.8-5.3Z" />
        <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15.2l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
      </svg>
      <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
    </button>
  );
};

export default GoogleAuthButton;
