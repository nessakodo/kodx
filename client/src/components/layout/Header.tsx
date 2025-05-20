import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Award, 
  FileText, 
  Home, 
  BookOpen, 
  Code,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Navigation links structure
  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { href: '/labs', label: 'Labs', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { href: '/projects', label: 'Projects', icon: <Code className="h-4 w-4 mr-2" /> },
    { href: '/forum', label: 'Forum', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: '/resources', label: 'Resources', icon: <FileText className="h-4 w-4 mr-2" /> },
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0c1527]/90 backdrop-blur-sm border-b border-[#1e293b]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] w-8 h-8 rounded-lg flex items-center justify-center text-black font-orbitron font-bold">
                ΞX
              </div>
              <span className="font-orbitron text-lg text-white tracking-wider hidden sm:inline-block">
                KOD•X <span className="opacity-80">WORLD</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.label}>
                <span
                  className={`text-sm ${
                    location === link.href
                      ? 'text-[#9ecfff] font-medium'
                      : 'text-gray-300 hover:text-white'
                  } cursor-pointer transition-colors duration-200 flex items-center`}
                >
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* User Menu or Sign In */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Avatar className="h-8 w-8 border border-[#1e293b]">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                      <AvatarFallback className="bg-[#1e293b] text-[#9ecfff]">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex items-center text-sm text-white font-medium">
                      {user?.username}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0c1527] border-[#1e293b] text-white w-56">
                  <div className="px-3 py-2 text-sm font-semibold text-[#9ecfff]">
                    @{user?.username}
                  </div>
                  <DropdownMenuSeparator className="bg-[#1e293b]" />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/badges">
                    <DropdownMenuItem className="cursor-pointer">
                      <Award className="mr-2 h-4 w-4" />
                      Badges
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator className="bg-[#1e293b]" />
                  <Link href="/api/logout">
                    <DropdownMenuItem className="cursor-pointer text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/api/login">
                <Button 
                  size="sm" 
                  className="bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 text-[#9ecfff] border border-[#9ecfff]/30"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="ml-4 md:hidden text-gray-300 hover:text-white"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1527] border-t border-[#1e293b]">
          <div className="px-4 pt-2 pb-4">
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  <a
                    className={`${
                      location === link.href
                        ? 'bg-[#1e293b] text-[#9ecfff]'
                        : 'text-gray-300 hover:bg-[#1e293b]/50 hover:text-white'
                    } px-3 py-2 rounded-md text-base font-medium flex items-center`}
                    onClick={closeMobileMenu}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-[#1e293b] my-2"></div>
                  <Link href="/dashboard">
                    <a
                      className="text-gray-300 hover:bg-[#1e293b]/50 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={closeMobileMenu}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/profile">
                    <a
                      className="text-gray-300 hover:bg-[#1e293b]/50 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </a>
                  </Link>
                  <Link href="/api/logout">
                    <a
                      className="text-red-400 hover:bg-[#1e293b]/50 hover:text-red-300 px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={closeMobileMenu}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </a>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}