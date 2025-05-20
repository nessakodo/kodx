import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { XPRing } from '@/components/dashboard/XPRing';
import { BadgeDisplay } from '@/components/dashboard/BadgeDisplay';
import OnboardingTutorial from '@/components/onboarding/OnboardingTutorial';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Code, 
  Award, 
  Activity, 
  Settings, 
  MessageSquare,
  Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Check if user is a new user (needs onboarding)
  useEffect(() => {
    if (user && !isLoading) {
      // If this is a new user, show onboarding tutorial
      if (user.isNewUser) {
        setShowOnboarding(true);
      }
    }
  }, [user, isLoading]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/');
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto p-4 pt-8">
      {/* Show onboarding tutorial for new users */}
      {showOnboarding && <OnboardingTutorial />}
      
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Welcome to KODΞX
        </h1>
        <p className="text-gray-400 mt-2">
          Your journey into mindful technology continues...
        </p>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Learning</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code size={16} />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center gap-2 forum-link">
              <MessageSquare size={16} />
              <span>Community</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Activity size={16} />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="learning" className="labs-section">
            <Card>
              <CardHeader>
                <CardTitle>My Learning Path</CardTitle>
                <CardDescription>
                  Continue your journey through interactive labs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Button 
                    className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90"
                    onClick={() => setLocation('/labs')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Labs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="projects-section">
            <Card>
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                  Build real-world applications and practice your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Button 
                    className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90"
                    onClick={() => setLocation('/projects')}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Explore Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forum">
            <Card>
              <CardHeader>
                <CardTitle>Community Discussions</CardTitle>
                <CardDescription>
                  Connect with peers and share insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Button 
                    className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90"
                    onClick={() => setLocation('/forum')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Go to Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>My Activity</CardTitle>
                <CardDescription>
                  Track your progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Start exploring labs and projects to see your activity here!
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={() => setLocation('/labs')}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Labs
                      </Button>
                      <Button variant="outline" onClick={() => setLocation('/projects')}>
                        <Code className="mr-2 h-4 w-4" />
                        Projects
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;