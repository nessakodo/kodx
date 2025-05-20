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
  const { user, isAuthenticated, isAdmin, loginAsUser, loginAsAdmin, logout } = useAuth();
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
                      {/* Notification dot - only shown when there are unread notifications */}
                      <span className="absolute -top-1 -right-1 bg-[#b166ff] w-2 h-2 rounded-full animate-pulse"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <div className="px-2 py-2 border-b border-[#9ecfff]/10">
                      <div className="text-sm font-medium">Notifications</div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      <DropdownMenuItem className="cursor-pointer flex items-start py-3">
                        <div className="flex flex-col">
                          <div className="text-sm"><span className="font-semibold">Quantum Mechanics</span> lab is now available</div>
                          <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer flex items-start py-3">
                        <div className="flex flex-col">
                          <div className="text-sm"><span className="font-semibold">@codemaster</span> commented on your forum post</div>
                          <div className="text-xs text-gray-400 mt-1">Yesterday</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer flex items-start py-3">
                        <div className="flex flex-col">
                          <div className="text-sm">Your post received <span className="font-semibold">5 new likes</span></div>
                          <div className="text-xs text-gray-400 mt-1">3 days ago</div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <div className="px-2 py-2 border-t border-[#9ecfff]/10">
                      <Link href="/dashboard" className="text-sm text-[#9ecfff] hover:text-[#cae6ff] w-full text-center block">View all in Dashboard</Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-10 w-10 rounded-full p-0 border-2 border-[#9ecfff]/20 overflow-hidden"
                      variant="ghost"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={user.profileImageUrl}
                            alt={user.username}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-2 border-b border-[#9ecfff]/10">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs text-gray-400">Level {Math.floor(user.totalXp / 1000) + 1} • {user.totalXp} XP</div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <button
                  onClick={loginAsUser}
                  className="cta-button bg-transparent hover:bg-[rgba(158,207,255,0.1)]"
                >
                  Sign In
                </button>

                <button
                  onClick={loginAsAdmin}
                  className="cta-button"
                >
                  Admin Access
                </button>
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
                  <button
                    onClick={loginAsUser}
                    className="text-gray-300 hover:text-[#9ecfff] py-2 flex"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={loginAsAdmin}
                    className="text-[#9ecfff] hover:text-[#cae6ff] py-2 flex"
                  >
                    Admin Access
                  </button>
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
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="text-gray-300 hover:text-[#9ecfff] py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-[#9ecfff] py-2 flex"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
