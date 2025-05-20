import { useQuery } from "@tanstack/react-query";

// Simpler useAuth implementation to avoid hook order issues
export function useAuth() {
  // For development, we'll always fetch from the user endpoint 
  // and it will always return a user
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    staleTime: 30000, // Refresh every 30 seconds
  });
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    // Simple role toggle - reloads the page to switch endpoints
    toggleRole: () => {
      window.location.href = user?.role === "admin" 
        ? "/api/auth/user" 
        : "/api/auth/admin";
    }
  };
}
