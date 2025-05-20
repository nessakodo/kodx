import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MOCK_DASHBOARD_DATA } from "@/lib/mockData";

// Enhanced auth hook for development with persistent auth state
export function useAuth() {
  const queryClient = useQueryClient();
  
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
  
  // Use localStorage to track authentication state
  const [authState, setAuthState] = useState(() => {
    const savedState = localStorage.getItem("kodex_auth_state");
    return savedState ? JSON.parse(savedState) : { isAuthenticated: true, isAdmin: false };
  });
  
  // Set up mock data for dashboard endpoint
  useEffect(() => {
    if (authState.isAuthenticated) {
      queryClient.setQueryData(["/api/dashboard"], MOCK_DASHBOARD_DATA);
    }
  }, [authState.isAuthenticated, queryClient]);
  
  // Get the current user based on auth state
  const user = authState.isAdmin ? adminUser : testUser;
  
  // Login functions
  const loginAsUser = () => {
    const newState = { isAuthenticated: true, isAdmin: false };
    localStorage.setItem("kodex_auth_state", JSON.stringify(newState));
    setAuthState(newState);
    window.location.href = "/dashboard";
  };
  
  const loginAsAdmin = () => {
    const newState = { isAuthenticated: true, isAdmin: true };
    localStorage.setItem("kodex_auth_state", JSON.stringify(newState));
    setAuthState(newState);
    window.location.href = "/admin";
  };
  
  // Logout function
  const logout = () => {
    const newState = { isAuthenticated: false, isAdmin: false };
    localStorage.setItem("kodex_auth_state", JSON.stringify(newState));
    setAuthState(newState);
    // Clear any user-specific query cache
    queryClient.clear();
    window.location.href = "/";
  };
  
  return {
    user,
    isLoading: false,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    loginAsUser,
    loginAsAdmin,
    logout,
  };
}
