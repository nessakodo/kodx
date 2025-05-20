import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
        <Header />
        <main className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-pulse h-12 w-12 mx-auto rounded-full bg-[#9ecfff]/20 mb-4" />
            <h2 className="text-xl font-orbitron mb-2">Loading...</h2>
            <p className="text-gray-500">Retrieving your dashboard information</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
        <Header />
        <main className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto text-[#ff5c5c] mb-4" />
            <h2 className="text-2xl font-orbitron mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-8">
              You must be signed in to access your dashboard. Please sign in to track your progress, 
              view your badges, and manage your notes.
            </p>
            <Button asChild size="lg">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <UserDashboard />
      <Footer />
    </div>
  );
}
