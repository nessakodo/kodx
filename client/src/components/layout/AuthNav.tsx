import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

import { LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";

export function AuthNav() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Navigate to the logout endpoint
      window.location.href = "/api/logout";
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-24 rounded bg-gray-700/30 animate-pulse"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1.5">
            <Avatar className="h-8 w-8 border border-blue-500/30 bg-blue-950/20">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span className="font-semibold">{user.username}</span>
              <span className="text-xs text-gray-400">
                {user.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-lg border-gray-800">
          <div className="flex items-center justify-start p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.username}</p>
              <p className="w-[200px] truncate text-sm text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setLocation("/dashboard")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setLocation("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => setLocation("/admin")}
            >
              <svg 
                className="mr-2 h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10v2H7z" />
                <path d="M7 11h10v2H7z" />
                <path d="M7 15h4v2H7z" />
              </svg>
              <span>Admin Panel</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 focus:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        className="text-gray-300 hover:text-white"
        onClick={() => setLocation("/login")}
      >
        Sign In
      </Button>
      <Button 
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
        onClick={() => setLocation("/register")}
      >
        Sign Up
      </Button>
    </div>
  );
}