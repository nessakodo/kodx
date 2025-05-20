import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { KodexLogo } from "@/components/ui/kodex-logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellIcon, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Labs", href: "/labs" },
    { name: "Projects", href: "/projects" },
    { name: "Forum", href: "/forum" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#9ecfff]/10 backdrop-blur-md bg-[#0e1525]/75">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
                <KodexLogo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    location === item.href
                      ? "text-[#9ecfff]"
                      : "text-gray-300 hover:text-[#9ecfff]"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon size={24} />
          </button>

          {/* Auth/Profile Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-[#9ecfff]"
                    >
                      <BellIcon size={20} />
                      {/* Notification dot */}
                      <span className="absolute -top-1 -right-1 bg-[#b166ff] w-2 h-2 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-10 w-10 rounded-full p-0 border-2 border-[#9ecfff]/20 overflow-hidden"
                      variant="ghost"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user?.profileImageUrl || ""}
                          alt={user?.username || ""}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {user?.totalXp && (
                        <div className="absolute -bottom-1 -right-1 bg-[#5cdc96] text-xs px-1 rounded text-black font-semibold">
                          {user.totalXp}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <a href="/api/logout">Sign Out</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="border border-[#9ecfff]/30 hover:bg-[#9ecfff]/10"
                  asChild
                >
                  <a href="/api/login">Sign In</a>
                </Button>

                <Button
                  className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30 transition-all"
                  asChild
                >
                  <a href="/api/login">Create Account</a>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-3 border-t border-[#9ecfff]/10 pt-3">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "transition-colors py-2",
                    location === item.href
                      ? "text-[#9ecfff]"
                      : "text-gray-300 hover:text-[#9ecfff]"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <>
                  <a
                    href="/api/login"
                    className="text-gray-300 hover:text-[#9ecfff] py-2"
                  >
                    Sign In
                  </a>
                  <a
                    href="/api/login"
                    className="text-[#9ecfff] hover:text-[#9ecfff] py-2"
                  >
                    Create Account
                  </a>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-gray-300 hover:text-[#9ecfff] py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === "admin" && (
                    <Link 
                      href="/admin"
                      className="text-gray-300 hover:text-[#9ecfff] py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <a
                    href="/api/logout"
                    className="text-gray-300 hover:text-[#9ecfff] py-2"
                  >
                    Sign Out
                  </a>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
