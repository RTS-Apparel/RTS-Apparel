import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const {
    user: storeUser,
    role,
    session,
    currentUserId,
    isLoading,
    setAuth,
    initAuth,
    login,
    signup,
    logout,
    switchDemoRole,
  } = useAuthStore();
  const user = storeUser;
  const resolvedRole = user ? role : null;

  return {
    user,
    role: resolvedRole,
    session,
    isAuthenticated: Boolean(user),
    isAdmin: resolvedRole === "admin",
    isAgent: resolvedRole === "agent",
    isApprovedAgent:
      resolvedRole === "agent" && Boolean(user?.is_approved) && !user?.is_blocked,
    isLoading,
    setAuth,
    initAuth,
    login,
    signup,
    logout,
    switchDemoRole,
  };
}
