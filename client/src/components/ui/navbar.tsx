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
  Code
} from "lucide-react";
import { KodexModal } from "./kodex-modal";

export function Navbar() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifications = 2; // This would be fetched from API

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
    },
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

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e293b] bg-[#0a0d14]/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <KodexLogo size="sm" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
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

            <div className="flex items-center space-x-1">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-[#1e293b]/50 text-gray-400 hover:text-gray-200"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#9ecfff]"></span>
                )}
              </Button>

              {/* User Menu (Desktop) */}
              {isAuthenticated ? (
                <div className="relative hidden md:block">
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
                    showCloseButton={false}
                    position="right"
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-[#1e293b]">
                        <p className="text-sm font-medium text-gray-200">
                          {user?.firstName || "User"}
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
                              className="w-full justify-start text-gray-400 hover:text-gray-200 hover:bg-[#1e293b]/50"
                            >
                              {link.icon}
                              <span className="ml-2">{link.name}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                      <div className="py-1 border-t border-[#1e293b]">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-[#1e293b]/50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="ml-2">Log out</span>
                        </Button>
                      </div>
                    </div>
                  </KodexModal>
                </div>
              ) : (
                <Link href="/api/login">
                  <Button className="btn-kodex hover-glow">Sign In</Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-[#1e293b]/50 text-gray-400 hover:text-gray-200"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden kodex-modal">
            <nav className="py-4 px-2 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive(link.path)
                        ? "text-gray-100 bg-[#1e293b]/50"
                        : "text-gray-400"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Button>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="pt-4 border-t border-[#1e293b]">
                    <div className="flex items-center px-4 py-2">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1e293b] bg-[#1e293b]/50">
                          <img
                            src={user?.profileImageUrl || "https://replit.com/public/images/mark.png"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {user?.firstName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {userNavLinks.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon}
                        <span className="ml-2">{link.name}</span>
                      </Button>
                    </Link>
                  ))}

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2">Log out</span>
                  </Button>
                </>
              )}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-[#1e293b]">
                  <Link href="/api/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-kodex hover-glow">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Notifications Modal */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}