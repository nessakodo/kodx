import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { isAuthenticated, loginAsUser } = useAuth();
  const [, navigate] = useLocation();
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-[#1e2535]/70 backdrop-blur-md rounded-xl border border-[#9ecfff]/10 p-8 text-center">
            <h1 className="font-orbitron text-2xl mb-6">Sign In Required</h1>
            <p className="text-gray-400 mb-8">
              Please sign in to access your personalized dashboard.
            </p>
            <Button 
              onClick={loginAsUser} 
              className="w-full py-6 h-auto bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
            >
              Sign In
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