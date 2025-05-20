import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { KodexLogo } from "@/components/ui/kodex-logo";
import { NotificationsPanel } from "@/components/ui/notifications-panel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  MessageSquare, 
  BookOpen, 
  Code,
  Shield
} from "lucide-react";
import { KodexModal } from "./kodex-modal";

export function Navbar() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // For testing purposes - enable users to sign in without authentication
  const [testUserMode, setTestUserMode] = useState(false);
  const unreadNotifications = isAuthenticated ? 2 : 0; // Only show notifications for authenticated users

  const navLinks = [
    {
      name: "Labs",
      path: "/labs",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "Forum",
      path: "/forum",
      icon: <MessageSquare className="w-5 h-5" />,
    }
  ];
  
  const userNavLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <User className="w-4 h-4" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // In a real implementation, this would call API to logout
    window.location.href = "/api/logout";
  };
  
  // Helper function to enable test/admin user mode
  const enableTestUserMode = () => {
    setTestUserMode(true);
    // Close any open menus
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e293b] bg-[#0a0d14]/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo and main navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <KodexLogo size="sm" />
              </Link>
              
              {/* Desktop Navigation - Main links */}
              <nav className="hidden md:flex items-center ml-6 space-x-1">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <Button
                      variant="ghost"
                      className={`px-4 hover:bg-[#1e293b]/50 ${
                        isActive(link.path)
                          ? "text-gray-100 bg-[#1e293b]/50 border-b-2 border-[#9ecfff]/50 rounded-none"
                          : "text-gray-400"
                      }`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right aligned items */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Show these controls only for authenticated users */}
              {(isAuthenticated || testUserMode) && (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-[#1e293b]/50 text-gray-400"
                    onClick={() => setNotificationsOpen(true)}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9ecfff] text-[10px] font-medium text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                  
                  {/* Admin Access Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-[#1e293b]/50 text-gray-400"
                    onClick={() => window.location.href = "/admin"}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin
                  </Button>
                </>
              )}

              {/* User Menu (Desktop) */}
              {(isAuthenticated || testUserMode) ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-[#1e293b]/50 text-gray-400 hover:text-gray-200"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#1e293b] bg-[#1e293b]/50">
                      <img
                        src={user?.profileImageUrl || "https://replit.com/public/images/mark.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* User Menu Dropdown */}
                  <KodexModal
                    isOpen={userMenuOpen}
                    onClose={() => setUserMenuOpen(false)}
                    title=""
                    showCloseButton={true}
                    position="right"
                    size="sm"
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-[#1e293b]">
                        <p className="text-sm font-medium text-gray-200">
                          {user?.firstName || "Test User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <div className="py-1">
                        {userNavLinks.map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200"
                            >
                              {link.icon}
                              <span className="ml-2">{link.name}</span>
                            </Button>
                          </Link>
                        ))}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:bg-[#1e293b]/50 hover:text-gray-200"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="ml-2">Sign Out</span>
                        </Button>
                      </div>
                    </div>
                  </KodexModal>
                </div>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Button 
                    className="bg-gradient-to-r from-[#9ecfff]/30 to-[#88c9b7]/30 border border-[#9ecfff]/30 hover:from-[#9ecfff]/40 hover:to-[#88c9b7]/40"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Sign In
                  </Button>
                  
                  {/* Test User Toggle (temporary for development) */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-gray-500 border-[#1e293b] hover:bg-[#1e293b]/30"
                    onClick={enableTestUserMode}
                  >
                    Test Mode
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-[#1e293b]/50 text-gray-400"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <KodexModal
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu"
        position="right"
        size="md"
      >
        <div className="py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive(link.path)
                    ? "text-gray-100 bg-[#1e293b]/50"
                    : "text-gray-400"
                }`}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Button>
            </Link>
          ))}
          
          {/* Show user-related items if authenticated */}
          {(isAuthenticated || testUserMode) && (
            <>
              <div className="border-t border-[#1e293b] my-2 pt-2">
                <p className="px-4 text-xs text-gray-500 uppercase mb-2">User</p>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-400"
                    >
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </Button>
                  </Link>
                ))}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/admin";
                  }}
                >
                  <Shield className="h-4 w-4" />
                  <span className="ml-2">Admin Access</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </div>
            </>
          )}
          
          {/* Sign In Button for non-authenticated users */}
          {!isAuthenticated && !testUserMode && (
            <div className="border-t border-[#1e293b] my-2 pt-2">
              <Button
                className="w-full bg-gradient-to-r from-[#9ecfff]/30 to-[#88c9b7]/30 border border-[#9ecfff]/30 hover:from-[#9ecfff]/40 hover:to-[#88c9b7]/40"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/api/login";
                }}
              >
                Sign In
              </Button>
              
              {/* Test User Toggle (temporary for development) */}
              <Button
                variant="outline"
                className="w-full mt-2 text-sm text-gray-500 border-[#1e293b] hover:bg-[#1e293b]/30"
                onClick={() => {
                  enableTestUserMode();
                  setMobileMenuOpen(false);
                }}
              >
                Enable Test User Mode
              </Button>
            </div>
          )}
        </div>
      </KodexModal>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Top spacing to account for fixed header */}
      <div className="pt-16" />
    </>
  );
}