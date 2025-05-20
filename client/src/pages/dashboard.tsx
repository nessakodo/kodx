import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { awardFounderBadge } from "@/utils/badges";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Award founder badge to new users
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      // Check if user is new and award founder badge
      if (user.createdAt && 
          new Date(user.createdAt).getTime() > Date.now() - 10 * 60 * 1000) { // User created in the last 10 minutes
        awardFounderBadge(user.id);
      }
    }
  }, [isAuthenticated, user]);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);
  
  // If not authenticated, show loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-[#1e2535]/70 backdrop-blur-md rounded-xl border border-[#9ecfff]/10 p-8 text-center">
            <h1 className="font-orbitron text-2xl mb-6">Accessing Dashboard</h1>
            <p className="text-gray-400 mb-8">
              Please wait while we redirect you to the login page...
            </p>
            <Button 
              onClick={() => setLocation('/login')} 
              className="w-full py-6 h-auto bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
            >
              Sign In Now
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main>
        <UserDashboard />
      </main>
      <Footer />
    </div>
  );
}