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
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: () => apiRequest('/api/dashboard'),
    enabled: isAuthenticated,
  });
  
  // Check if user is a new user (needs onboarding)
  useEffect(() => {
    if (user && !isLoading) {
      // Show onboarding for new users or when no labs are completed
      const isNewUser = user.createdAt && (
        new Date().getTime() - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000
      );
      
      if (isNewUser && user.completedOnboarding !== true) {
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
          Welcome, {user?.username || 'Explorer'}
        </h1>
        <p className="text-gray-400 mt-2">
          Your journey into mindful technology continues...
        </p>
      </div>
      
      {/* User Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* XP Ring */}
        <div className="flex flex-col items-center p-6 bg-gray-900/40 rounded-xl border border-gray-800 shadow-lg">
          <div className="xp-ring mb-4">
            <XPRing 
              user={{
                username: user?.username,
                profileImageUrl: user?.profileImageUrl,
                totalXp: user?.totalXp || 0
              }} 
              size="lg"
              showLevelUp={true}
            />
          </div>
          <div className="mt-2 text-center">
            <h2 className="text-lg font-semibold text-gray-200">@{user?.username}</h2>
            <p className="text-sm text-gray-400">{dashboardData?.level?.title || 'Digital Initiate'}</p>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="col-span-2 p-6 bg-gray-900/40 rounded-xl border border-gray-800 shadow-lg">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] bg-clip-text text-transparent">
            Your Achievements
          </h2>
          
          {isDashboardLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              <div className="badges-showcase grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {dashboardData?.badges?.map((badge: any) => (
                  <BadgeDisplay 
                    key={badge.id} 
                    badge={badge} 
                    size="md" 
                  />
                ))}
                {(!dashboardData?.badges || dashboardData.badges.length === 0) && (
                  <div className="col-span-full text-center py-4 text-gray-400">
                    <p>No badges earned yet. Complete labs and projects to earn your first badge!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
                {isDashboardLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData?.labs?.map((lab: any) => (
                      <Card key={lab.id} className="overflow-hidden border border-gray-800 bg-gray-900/60">
                        <div className={`h-2 ${
                          lab.progress?.isCompleted 
                            ? 'bg-green-500' 
                            : lab.progress?.currentStep 
                              ? 'bg-blue-500' 
                              : 'bg-gray-700'
                        }`}></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{lab.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {lab.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="text-xs bg-gray-800 px-2 py-1 rounded">
                            {lab.difficulty}
                          </div>
                          <Button 
                            size="sm" 
                            variant={lab.progress?.isCompleted ? "outline" : "default"}
                            onClick={() => setLocation(`/labs/${lab.id}`)}
                          >
                            {lab.progress?.isCompleted 
                              ? 'Review' 
                              : lab.progress?.currentStep 
                                ? 'Continue' 
                                : 'Start'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
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
                {isDashboardLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dashboardData?.projects?.map((project: any) => (
                      <Card key={project.id} className="overflow-hidden border border-gray-800 bg-gray-900/60">
                        <div className={`h-2 ${
                          project.progress?.isCompleted 
                            ? 'bg-green-500' 
                            : project.progress 
                              ? 'bg-blue-500' 
                              : 'bg-gray-700'
                        }`}></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="text-xs bg-gray-800 px-2 py-1 rounded">
                            {project.difficulty}
                          </div>
                          <Button 
                            size="sm" 
                            variant={project.progress?.isCompleted ? "outline" : "default"}
                            onClick={() => setLocation(`/projects/${project.id}`)}
                          >
                            {project.progress?.isCompleted 
                              ? 'Review' 
                              : project.progress 
                                ? 'Continue' 
                                : 'Start'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
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
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">XP Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-xs text-gray-400">Total XP</p>
                        <p className="text-2xl font-bold">{user?.totalXp || 0}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-xs text-gray-400">Labs Completed</p>
                        <p className="text-2xl font-bold">{dashboardData?.completedLabs || 0}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-xs text-gray-400">Projects Completed</p>
                        <p className="text-2xl font-bold">{dashboardData?.completedProjects || 0}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-xs text-gray-400">Badges Earned</p>
                        <p className="text-2xl font-bold">{dashboardData?.badges?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    {isDashboardLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dashboardData?.recentActivity?.length > 0 ? (
                          dashboardData.recentActivity.map((activity: any, index: number) => (
                            <div key={index} className="flex items-center bg-gray-800/60 p-3 rounded-lg">
                              <div className="mr-3">
                                {activity.type === 'lab' && <BookOpen className="h-5 w-5 text-blue-400" />}
                                {activity.type === 'project' && <Code className="h-5 w-5 text-green-400" />}
                                {activity.type === 'badge' && <Award className="h-5 w-5 text-purple-400" />}
                              </div>
                              <div>
                                <p className="text-sm">{activity.message}</p>
                                <p className="text-xs text-gray-400">{activity.date}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            <p>No recent activity to display.</p>
                            <p className="text-sm mt-2">Complete labs and projects to see your activity here!</p>
                          </div>
                        )}
                      </div>
                    )}
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