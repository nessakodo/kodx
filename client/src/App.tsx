import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import React, { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/index";
import LabsPage from "@/pages/labs/index";
import LabPage from "@/pages/labs/[id]";
import ProjectsPage from "@/pages/projects/index";
import ProjectPage from "@/pages/projects/[id]";
import ForumPage from "@/pages/forum/index";
import CreatePostPage from "@/pages/forum/create";
import PostDetailPage from "@/pages/forum/post/[id]";
import DashboardPage from "@/pages/dashboard";
import SettingsPage from "@/pages/settings";
import AdminPage from "@/pages/admin";
import ResourcesPage from "@/pages/resources";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path="/" component={Home} />
      <Route path="/resources" component={ResourcesPage} />
      
      {/* Authentication routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Lab routes */}
      <Route path="/labs" component={LabsPage} />
      <Route path="/labs/:id" component={LabPage} />
      
      {/* Project routes */}
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:id" component={ProjectPage} />
      
      {/* Forum routes */}
      <Route path="/forum" component={ForumPage} />
      <Route path="/forum/create" component={CreatePostPage} />
      <Route path="/forum/post/:id" component={PostDetailPage} />
      <Route path="/forum/categories/:category" component={ForumPage} />
      <Route path="/forum/tags/:tag" component={ForumPage} />
      
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
          <div className="bg-gradient-to-b from-[#0c1527] to-[#101929] min-h-screen">
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
