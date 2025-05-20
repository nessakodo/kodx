import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/ui/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/index";
import LabsPage from "@/pages/labs/index";
import LabPage from "@/pages/labs/[id]";
import ProjectsPage from "@/pages/projects/index";
import ProjectPage from "@/pages/projects/[id]";
import ForumPage from "@/pages/forum/index";
import ForumPostPage from "@/pages/forum/[id]";
import DashboardPage from "@/pages/dashboard";
import SettingsPage from "@/pages/settings";
import AdminPage from "@/pages/admin";

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path="/" component={Home} />
      
      {/* Lab routes */}
      <Route path="/labs" component={LabsPage} />
      <Route path="/labs/:id" component={LabPage} />
      
      {/* Project routes */}
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:id" component={ProjectPage} />
      
      {/* Forum routes */}
      <Route path="/forum" component={ForumPage} />
      <Route path="/forum/:id" component={ForumPostPage} />
      
      {/* Dashboard, Settings and Admin */}
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/admin" component={AdminPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
            <Navbar />
            <main className="pt-20 pb-16">
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
