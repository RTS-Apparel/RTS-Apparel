import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "../types";
import { useDataStore } from "./dataStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  session: any | null;
  currentUserId: string | null;
  isLoading: boolean;
  setAuth: (payload: {
    user: User | null;
    role: UserRole | null;
    session?: any | null;
    isLoading?: boolean;
  }) => void;
  initAuth: () => Promise<void>;
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
    city?: string;
    whatsapp?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => void;
  switchDemoRole: (role: UserRole | "guest") => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      session: null,
      currentUserId: null,
      isLoading: true,

      setAuth: ({ user, role, session = null, isLoading = false }) => {
        set({
          user,
          role,
          session,
          currentUserId: user?.id || null,
          isLoading,
        });
      },

      initAuth: async () => {
        if (!isSupabaseConfigured) {
          set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            const { data } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (data) {
              const mappedUser: User = {
                id: data.id,
                email: data.email || session.user.email || "",
                full_name: data.full_name || "User",
                phone: data.phone || "",
                role: (data.role as UserRole) || "customer",
                referral_code: data.referral_code || null,
                is_approved: Boolean(data.is_approved),
                is_blocked: Boolean(data.is_blocked),
                created_at: data.created_at || new Date().toISOString(),
              };
              set({
                user: mappedUser,
                role: mappedUser.role,
                session,
                currentUserId: mappedUser.id,
                isLoading: false,
              });
            } else {
              set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
            }
          } else {
            set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
          }

          supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (newSession?.user) {
              const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", newSession.user.id)
                .single();

              if (data) {
                const mappedUser: User = {
                  id: data.id,
                  email: data.email || newSession.user.email || "",
                  full_name: data.full_name || "User",
                  phone: data.phone || "",
                  role: (data.role as UserRole) || "customer",
                  referral_code: data.referral_code || null,
                  is_approved: Boolean(data.is_approved),
                  is_blocked: Boolean(data.is_blocked),
                  created_at: data.created_at || new Date().toISOString(),
                };
                set({
                  user: mappedUser,
                  role: mappedUser.role,
                  session: newSession,
                  currentUserId: mappedUser.id,
                  isLoading: false,
                });
              } else {
                set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
              }
            } else if (_event === "SIGNED_OUT") {
              set({
                user: null,
                role: null,
                session: null,
                currentUserId: null,
                isLoading: false,
              });
            }
          });
        } catch {
          set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const cleanEmail = email.trim().toLowerCase();

          // 1. Try Supabase Auth if configured
          if (isSupabaseConfigured && password) {
            const { data: authData, error: authErr } =
              await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
              });

            if (!authErr && authData?.user) {
              const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", authData.user.id)
                .single();

              if (!userData) {
                const newEntry = {
                  id: authData.user.id,
                  full_name: authData.user.email?.split("@")[0] || "User",
                  role: "customer" as UserRole,
                  is_approved: false,
                  is_blocked: false,
                };
                await supabase.from("users").insert(newEntry);
                const createdUser: User = {
                  ...newEntry,
                  email: authData.user.email || cleanEmail,
                  phone: "",
                  referral_code: null,
                  created_at: new Date().toISOString(),
                };
                set({
                  user: createdUser,
                  role: createdUser.role,
                  session: authData.session,
                  currentUserId: createdUser.id,
                  isLoading: false,
                });
                return { success: true, user: createdUser };
              }

              if (userData.is_blocked) {
                await supabase.auth.signOut();
                set({ isLoading: false });
                return {
                  success: false,
                  error: "Aapka account block kar diya gaya hai.",
                };
              }

              const mappedUser: User = {
                id: userData.id,
                email: userData.email || authData.user.email || cleanEmail,
                full_name: userData.full_name || "User",
                phone: userData.phone || "",
                role: (userData.role as UserRole) || "customer",
                referral_code: userData.referral_code || null,
                is_approved: Boolean(userData.is_approved),
                is_blocked: Boolean(userData.is_blocked),
                created_at: userData.created_at || new Date().toISOString(),
              };

              set({
                user: mappedUser,
                role: mappedUser.role,
                session: authData.session,
                currentUserId: mappedUser.id,
                isLoading: false,
              });
              return { success: true, user: mappedUser };
            }
          }

          set({ user: null, role: null, session: null, currentUserId: null, isLoading: false });
          return { success: false, error: "Invalid email or password. Supabase authentication is required." };
        } catch (err) {
          set({ isLoading: false });
          return {
            success: false,
            error: "Email ya password galat hai. Dobara try karo.",
          };
        }
      },

      signup: async (payload) => {
        set({ isLoading: true });
        try {
          if (!isSupabaseConfigured) {
            set({ isLoading: false });
            return {
              success: false,
              error: "Account registration is temporarily unavailable. Please try again later.",
            };
          }

          const cleanEmail = payload.email.trim().toLowerCase();
          const cleanName = payload.full_name.trim();
          const cleanPhone = payload.phone.trim();

          if (!cleanEmail || !cleanName || !cleanPhone || !payload.password) {
            set({ isLoading: false });
            return {
              success: false,
              error: "Please complete your name, email, phone number, and password.",
            };
          }

          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password: payload.password,
            options: {
              data: {
                full_name: cleanName,
                phone: cleanPhone,
                requested_role: payload.role,
                join_reason: payload.join_reason || null,
              },
            },
          });

          if (signUpError) {
            set({ isLoading: false });
            return { success: false, error: signUpError.message };
          }

          if (!signUpData.user) {
            set({ isLoading: false });
            return {
              success: false,
              error: "Account could not be created. Please try again.",
            };
          }

          // When email confirmation is enabled, Supabase creates the profile
          // through the auth.users trigger but does not issue a session yet.
          if (!signUpData.session) {
            set({
              user: null,
              role: null,
              session: null,
              currentUserId: null,
              isLoading: false,
            });
            return { success: true, requiresEmailConfirmation: true };
          }

          const { data: userData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", signUpData.user.id)
            .single();

          if (profileError || !userData) {
            await supabase.auth.signOut();
            set({
              user: null,
              role: null,
              session: null,
              currentUserId: null,
              isLoading: false,
            });
            return {
              success: false,
              error: "Your account was created, but its profile could not be loaded. Please contact support.",
            };
          }

          const mappedUser: User = {
            id: userData.id,
            email: userData.email || signUpData.user.email || cleanEmail,
            full_name: userData.full_name || cleanName,
            phone: userData.phone || cleanPhone,
            role: (userData.role as UserRole) || "customer",
            referral_code: userData.referral_code || null,
            is_approved: Boolean(userData.is_approved),
            is_blocked: Boolean(userData.is_blocked),
            created_at: userData.created_at || new Date().toISOString(),
          };

          set({
            user: mappedUser,
            role: mappedUser.role,
            session: signUpData.session,
            currentUserId: mappedUser.id,
            isLoading: false,
          });
          return { success: true, user: mappedUser };
        } catch (err) {
          set({ isLoading: false });
          return {
            success: false,
            error: err instanceof Error ? err.message : "Account could not be created. Please try again.",
          };
        }
      },

      logout: () => {
        if (isSupabaseConfigured) {
          supabase.auth.signOut().catch(() => {});
        }
        set({
          user: null,
          role: null,
          session: null,
          currentUserId: null,
          isLoading: false,
        });
        useDataStore.getState().addToast("Signed out of ARTS APPAREL", "info");
      },

      switchDemoRole: (_role) => {
        // Demo role switching is disabled in production.
        return null;
      },
    }),
    {
      name: "arts-apparel-auth-v3",
      partialize: (state) => ({ currentUserId: state.currentUserId }),
    }
  )
);
