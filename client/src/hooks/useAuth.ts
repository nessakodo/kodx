import { useQuery } from "@tanstack/react-query";

// Very simple auth hook for development
export function useAuth() {
  // Fixed data for our test user accounts
  const testUser = {
    id: "test-user-123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    profileImageUrl: "https://ui-avatars.com/api/?name=Test+User",
    role: "user",
    totalXp: 1250,
  };
  
  const adminUser = {
    id: "admin-user-456",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    username: "adminuser",
    profileImageUrl: "https://ui-avatars.com/api/?name=Admin+User&background=5cdc96&color=fff",
    role: "admin",
    totalXp: 5000,
  };
  
  // Use the standard endpoint just to check if it's available
  const { data, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: false, // Don't actually run the query
  });
  
  // For development, we'll use our predefined user data
  const isAdmin = window.location.pathname === "/admin";
  const user = isAdmin ? adminUser : testUser;
  
  return {
    user,
    isLoading: false,
    isAuthenticated: true, // Always authenticated for development
    isAdmin,
    loginAsUser: () => window.location.href = "/",
    loginAsAdmin: () => window.location.href = "/admin",
    logout: () => console.log("Logged out (simulated)"),
  };
}
