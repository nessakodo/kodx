import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BellIcon, LogOutIcon, MenuIcon, SettingsIcon, XIcon } from "lucide-react";
import { NotificationsPanel } from "./NotificationsPanel";
import { calculateLevel } from "@/lib/utils";
import { KodexModal } from "@/components/ui/kodex-modal";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [currentLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mocked unread notifications count - would come from the API in a real app
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  // Ref for notification bell button to position the dropdown
  const notificationBellRef = useRef<HTMLButtonElement>(null);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close menus when clicking outside their containers
      if (mobileMenuOpen || userMenuOpen) {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
      
      // Don't close notifications panel here - it's handled by the KodexModal component
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, userMenuOpen]);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentLocation]);
  
  // Get user level - would come from the API in a real app
  const userLevel = user ? calculateLevel(user.totalXp || 0) : 0;
  
  const navLinks = [
    { text: "Home", href: "/" },
    { text: "Labs", href: "/labs" },
    { text: "Projects", href: "/projects" },
    { text: "Forum", href: "/forum" },
    { text: "Resources", href: "/resources" },
  ];
  
  const isActive = (href: string) => {
    if (href === "/") {
      return currentLocation === href;
    }
    return currentLocation.startsWith(href);
  };
  
  return (
    <header className="relative bg-[#0f172a]/70 backdrop-blur-sm border-b border-[#9ecfff]/10 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="font-orbitron text-xl tracking-wider bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent hover-glow kodex-logo">
                KOD<span className="text-[#9ecfff]">•</span>X
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm ${
                  isActive(link.href)
                    ? "text-white bg-[#1e2535]/70 border-b-2 border-[#9ecfff]/50"
                    : "text-gray-300 hover:text-white hover:bg-[#1e2535]/50"
                } transition-colors duration-200`}
              >
                {link.text}
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {/* Notifications Button */}
                <Button
                  ref={notificationBellRef}
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                  }}
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#9ecfff] text-[0.6rem]">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                
                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 ml-2"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                      <AvatarFallback className="bg-[#1e2535]">
                        {user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium truncate max-w-[100px]">
                        {user?.username || "User"}
                      </div>
                      <div className="text-xs text-gray-500">Level {userLevel}</div>
                    </div>
                  </Button>
                  
                  {/* User Menu Dropdown */}
                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 py-2 bg-[#1e2535] border border-[#9ecfff]/10 rounded-md shadow-xl z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link 
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#9ecfff]/10 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#9ecfff]/10 hover:text-white"
                      >
                        <span className="flex items-center">
                          <SettingsIcon className="h-4 w-4 mr-2" />
                          Settings
                        </span>
                      </Link>
                      <Link 
                        href="/api/logout"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#9ecfff]/10 hover:text-white border-t border-[#9ecfff]/10 mt-1 pt-1"
                      >
                        <span className="flex items-center">
                          <LogOutIcon className="h-4 w-4 mr-2" />
                          Sign Out
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Login Button for non-authenticated users
              <Button 
                variant="outline" 
                className="bg-transparent border-[#9ecfff]/30 hover:bg-[#1e2535] hover:border-[#9ecfff]/50"
                onClick={() => window.location.href = "/api/login"}
              >
                Sign In
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-sm border-b border-[#9ecfff]/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "text-white bg-[#1e2535]/70 border-l-2 border-[#9ecfff]/50"
                    : "text-gray-300 hover:text-white hover:bg-[#1e2535]/50"
                } transition-colors duration-200`}
              >
                {link.text}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link 
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1e2535]/50"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Notifications Modal */}
      <NotificationsPanel 
        isOpen={notificationsOpen}
        onClose={() => {
          setNotificationsOpen(false);
          // When closed, mark all as read
          setUnreadNotifications(0);
        }}
        positionElement={notificationBellRef.current as HTMLElement | undefined}
        onMarkAllAsRead={() => setUnreadNotifications(0)}
      />
    </header>
  );
}