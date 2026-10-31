import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "../types";
import { useDataStore } from "./dataStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthState {
  currentUserId: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (payload: {
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    role: "customer" | "agent";
    join_reason?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole | "guest") => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: "user-customer-1",
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const users = useDataStore.getState().users;
          const matched = users.find(
            (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
          );

          if (!matched && isSupabaseConfigured && supabase && password) {
            await supabase.auth.signInWithPassword({ email, password });
          }

          if (!matched) {
            set({ isLoading: false });
            return {
              success: false,
              error:
                "No account found with this email. Try demo accounts or Sign Up.",
            };
          }

          if (matched.is_blocked) {
            set({ isLoading: false });
            return {
              success: false,
              error:
                "Account suspended by administrator. Please contact ARTS APPAREL support.",
            };
          }

          set({ currentUserId: matched.id, isLoading: false });
          return { success: true, user: matched };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: String(err) };
        }
      },

      signup: async (payload) => {
        set({ isLoading: true });
        try {
          const dataStore = useDataStore.getState();
          const existing = dataStore.users.find(
            (u) => u.email?.toLowerCase() === payload.email.trim().toLowerCase()
          );
          if (existing) {
            set({ isLoading: false });
            return {
              success: false,
              error: "An account with this email already exists.",
            };
          }

          const newUser = dataStore.registerUser({
            email: payload.email.trim(),
            full_name: payload.full_name.trim(),
            phone: payload.phone.trim(),
            role: payload.role,
            referral_code: null,
            is_approved: payload.role === "customer",
            is_blocked: false,
            join_reason: payload.join_reason,
          });

          set({ currentUserId: newUser.id, isLoading: false });
          return { success: true, user: newUser };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: String(err) };
        }
      },

      logout: () => {
        if (isSupabaseConfigured && supabase) {
          supabase.auth.signOut().catch(() => {});
        }
        set({ currentUserId: null });
        useDataStore.getState().addToast("Signed out of ARTS APPAREL", "info");
      },

      switchDemoRole: (role) => {
        if (role === "guest") {
          set({ currentUserId: null });
          useDataStore.getState().addToast("Browsing as Guest", "info");
          return null;
        }
        const users = useDataStore.getState().users;
        const target = users.find(
          (u) => u.role === role && u.is_approved && !u.is_blocked
        );
        if (target) {
          set({ currentUserId: target.id });
          useDataStore
            .getState()
            .addToast(`Switched to ${target.full_name} (${role.toUpperCase()})`, "info");
          return target;
        }
        return null;
      },
    }),
    {
      name: "rts-apparel-auth-v1",
    }
  )
);
