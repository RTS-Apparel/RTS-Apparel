import { useAuthStore } from "../store/authStore";
import { useDataStore } from "../store/dataStore";

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
  const users = useDataStore((s) => s.users);
  const user =
    storeUser ||
    (currentUserId ? users.find((u) => u.id === currentUserId) || null : null);
  const resolvedRole = role || user?.role || null;

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
