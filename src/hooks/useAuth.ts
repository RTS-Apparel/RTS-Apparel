import { useAuthStore } from "../store/authStore";
import { useDataStore } from "../store/dataStore";

export function useAuth() {
  const { currentUserId, isLoading, login, signup, logout, switchDemoRole } =
    useAuthStore();
  const users = useDataStore((s) => s.users);
  const user = users.find((u) => u.id === currentUserId) || null;

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isAgent: user?.role === "agent",
    isApprovedAgent:
      user?.role === "agent" && user.is_approved && !user.is_blocked,
    isLoading,
    login,
    signup,
    logout,
    switchDemoRole,
  };
}
