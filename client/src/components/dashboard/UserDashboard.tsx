import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Components
import { XPRing } from "@/components/dashboard/XPRing";
import { BadgeSection } from "@/components/dashboard/BadgeSection";
import { ForumActivitySection } from "@/components/dashboard/ForumActivitySection";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { NotesSection } from "@/components/notes/NotesSection";
import { LevelUpModal } from "@/components/modals/LevelUpModal";
import { BadgeModal } from "@/components/modals/BadgeModal";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Utils and Constants
import { calculateLevel, calculateLevelProgress, getXpForNextLevel } from "@shared/constants/levels";
import { Badge as BadgeType } from "@shared/constants/badges";

// Empty States
import { 
  EmptyLabsState, 
  EmptyProjectsState, 
  EmptyBadgesState, 
  EmptyNotesState,
  EmptyActivityState
} from "@/components/dashboard/EmptyStates";

// Icons
import { 
  Search,
  BookOpen,
  ChevronRight,
  BookOpenCheck,
  Code,
  Award,
  FileText,
  Activity
} from "lucide-react";

// Define interfaces for component props and dashboard data
interface DashboardData {
  totalXp: number;
  labProgress: any[];
  projectProgress: any[];
  badges: BadgeType[];
  notes: any[];
}

// Simple progress interface
interface Progress {
  id: number;
  completedPercent: number;
  updatedAt?: string;
  [key: string]: any;
}

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  
  // Fetch dashboard data with user progress
  const { data: dashboardData = {}, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
  });
  
  // Fetch latest badges
  const { data: userBadges = [], isLoading: isBadgesLoading } = useQuery({
    queryKey: ['/api/user-badges'],
    enabled: isAuthenticated,
  });
  
  // Default data if not yet available
  const defaultData = {
    totalXp: 0,
    labProgress: [],
    projectProgress: [],
    badges: [],
    notes: []
  };
  
  // Merge dashboard data with defaults
  const dashboard = {
    ...defaultData,
    ...(dashboardData || {})
  };
  
  // Calculate level and progress
  const currentXp = dashboard.totalXp || 0;
  const currentLevel = calculateLevel(currentXp);
  const progress = calculateLevelProgress(currentXp);
  
  // Handle unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-orbitron text-white mb-6">Sign in to view your dashboard</h2>
          <p className="text-gray-300 mb-8 max-w-md">Access your personalized learning experience, track progress, and unlock achievements</p>
          <Link href="/api/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Welcome Section with XP Ring */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-orbitron text-white mb-2">
              Welcome back, <span className="text-blue-400">{user?.username || 'Explorer'}</span>
            </h1>
            <p className="text-gray-300 mb-4">
              Continue your journey toward digital enlightenment
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
              >
                <BookOpenCheck className="h-4 w-4 mr-2" />
                Resume Learning
              </Button>
              
              <Button 
                variant="outline"
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              >
                <Code className="h-4 w-4 mr-2" />
                My Projects
              </Button>
              
              <Button 
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                My Notes
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <XPRing 
              totalXp={currentXp}
              size="lg"
              showTooltip={true}
            />
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-400">
                {currentXp} XP Total
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Labs & Projects Progress Tabs */}
          <Tabs defaultValue="labs" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-orbitron text-2xl text-indigo-300">
                Your Progress
              </h2>
              <TabsList className="bg-[#0f172a] border border-[#1e293b]">
                <TabsTrigger 
                  value="labs"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Labs
                </TabsTrigger>
                <TabsTrigger 
                  value="projects"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="labs">
              {isDashboardLoading ? (
                <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex">
                        <div className="w-full">
                          <div className="h-6 bg-[#1e293b]/50 rounded mb-2 w-3/4 animate-pulse" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse w-2/3" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-3 w-1/2 animate-pulse" />
                          <div className="h-2 bg-[#1e293b]/50 rounded w-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : dashboard.labProgress && dashboard.labProgress.length > 0 ? (
                <Card className="border border-[#1e293b] bg-[#0c1527]/50">
                  <div className="divide-y divide-[#1e293b]">
                    {dashboard.labProgress.map((progress: any) => (
                      <div key={progress.id} className="p-6">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white">{progress.lab?.title || 'Unknown Lab'}</h3>
                            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                              {progress.completedPercent}% Complete
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{progress.lab?.description || 'No description available'}</p>
                        </div>
                        
                        <div className="w-full bg-[#1e293b] rounded-full h-2 mb-3">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${progress.completedPercent}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Last activity: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleDateString() : 'Never'}
                          </span>
                          <Link href={`/labs/${progress.labId}`}>
                            <Button 
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-[#1e293b] text-center">
                    <Link href="/labs">
                      <Button variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20">
                        Explore More Labs
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <EmptyLabsState />
              )}
            </TabsContent>
            
            <TabsContent value="projects">
              {isDashboardLoading ? (
                <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex">
                        <div className="w-full">
                          <div className="h-6 bg-[#1e293b]/50 rounded mb-2 w-3/4 animate-pulse" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse w-2/3" />
                          <div className="h-4 bg-[#1e293b]/50 rounded mb-3 w-1/2 animate-pulse" />
                          <div className="h-2 bg-[#1e293b]/50 rounded w-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : dashboard.projectProgress && dashboard.projectProgress.length > 0 ? (
                <Card className="border border-[#1e293b] bg-[#0c1527]/50">
                  <div className="divide-y divide-[#1e293b]">
                    {dashboard.projectProgress.map((progress: any) => (
                      <div key={progress.id} className="p-6">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white">{progress.project?.title || 'Unknown Project'}</h3>
                            <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                              {progress.completedPercent}% Complete
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{progress.project?.description || 'No description available'}</p>
                        </div>
                        
                        <div className="w-full bg-[#1e293b] rounded-full h-2 mb-3">
                          <div 
                            className="bg-cyan-600 h-2 rounded-full" 
                            style={{ width: `${progress.completedPercent}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Last activity: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleDateString() : 'Never'}
                          </span>
                          <Link href={`/projects/${progress.projectId}`}>
                            <Button 
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-[#1e293b] text-center">
                    <Link href="/projects">
                      <Button variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20">
                        Explore More Projects
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <EmptyProjectsState />
              )}
            </TabsContent>
          </Tabs>
          
          {/* Badges Section */}
          <BadgeSection badges={userBadges} isLoading={isBadgesLoading} />
          
          {/* Notes Section */}
          <NotesSection limit={3} />
        </div>
        
        {/* Right Column - Activity & Forum */}
        <div className="space-y-8">
          {/* Activity Section */}
          <ActivitySection limit={4} />
          
          {/* Forum Activity */}
          <ForumActivitySection />
        </div>
      </div>
      
      {/* Modals */}
      <LevelUpModal 
        level={currentLevel} 
        open={levelUpModalOpen} 
        onOpenChange={setLevelUpModalOpen} 
      />
      
      <BadgeModal 
        badge={selectedBadge} 
        open={badgeModalOpen} 
        onOpenChange={setBadgeModalOpen} 
      />
    </div>
  );
}
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });
  
  // Fetch saved posts
  const { data: savedPosts, isLoading: isSavedPostsLoading } = useQuery({
    queryKey: ["/api/saved-posts"],
    enabled: isAuthenticated,
  });
  
  // Check if user is new (no progress data yet)
  const isNewUser = !dashboardData || (
    (!dashboardData.labProgress || dashboardData.labProgress.length === 0) &&
    (!dashboardData.projectProgress || dashboardData.projectProgress.length === 0) &&
    (!dashboardData.badges || dashboardData.badges.length === 0)
  );
  
  // Use appropriate data based on user status
  const display = dashboardData || (isNewUser ? EMPTY_DASHBOARD_DATA : MOCK_DASHBOARD_DATA);
  
  // Calculate level and progress
  const level = calculateLevel(user?.totalXp || 0);
  const nextLevel = level + 1;
  const progressToNextLevel = calculateLevelProgress(user?.totalXp || 0);
  const xpToNextLevel = Math.pow(nextLevel, 2) * 500;
  const currentLevelXp = Math.pow(level, 2) * 500;
  const xpNeeded = xpToNextLevel - currentLevelXp;
  const xpProgress = Math.round(((user?.totalXp || 0) - currentLevelXp) / xpNeeded * 100);
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-orbitron mb-6">Sign in to view your dashboard</h2>
        <Button
          className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-8">
          {/* User Profile and XP */}
          <GlassmorphicCard className="p-8 flex flex-col items-center">
            <DashboardXPRing
              userXP={user.totalXp}
              userLevel={level}
              nextLevelXP={xpToNextLevel}
              showExtraInfo={true}
            />
            
            <div className="text-center mt-2 mb-2">
              <div className="text-lg font-medium text-white">{user.username}</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#56ccf2]"></span>
                <span className="text-sm text-gray-400">Online</span>
              </div>
              <div className="text-xs text-gray-500">
                Member since May 2025
              </div>
            </div>
          </GlassmorphicCard>
          
          {/* Recent Activity Section */}
          <GlassmorphicCard className="p-6">
            <h3 className="font-orbitron text-xl text-white mb-4 flex items-center gap-2">
              <ArrowRightCircleIcon className="h-5 w-5 text-[#9ecfff]" />
              Recent Activity
            </h3>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isNewUser ? (
              <EmptyActivityState />
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3 py-2 border-b border-gray-800">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#9ecfff]/20 text-[#9ecfff]">
                    <TrophyIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300">You earned the <span className="text-[#9ecfff]">Beginner's Mind</span> badge for completing your first lab.</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2 border-b border-gray-800">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#6fcf97]/20 text-[#6fcf97]">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300">You completed <span className="text-[#6fcf97]">2/5</span> tasks in <span className="text-[#9ecfff]">Quantum Computing Basics</span>.</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#56ccf2]/20 text-[#56ccf2]">
                    <RocketIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300">You started the <span className="text-[#56ccf2]">Mindful Meditation App</span> project.</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" className="text-[#9ecfff]">
                View All Activity
              </Button>
            </div>
          </GlassmorphicCard>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="labs" className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl">Your Progress</h2>
              <TabsList className="grid grid-cols-2 bg-[#1e293b]/30">
                <TabsTrigger 
                  value="labs"
                  className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
                >
                  Labs
                </TabsTrigger>
                <TabsTrigger 
                  value="projects"
                  className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
                >
                  Projects
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="labs" className="h-full">
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                  ))
                ) : display.labProgress && display.labProgress.length > 0 ? (
                  display.labProgress.map((item: any) => (
                    <ProgressTracker
                      key={item.lab.id}
                      type="lab"
                      title={item.lab.title}
                      id={item.lab.id}
                      progress={item.progress.completedTasks.length}
                      total={5} // Assuming 5 tasks per lab
                      xpEarned={item.progress.xpEarned}
                      xpTotal={item.lab.xpReward}
                      difficulty={item.lab.difficulty}
                      isCompleted={item.progress.isCompleted}
                    />
                  ))
                ) : (
                  <EmptyLabsState />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="h-full">
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                  ))
                ) : display.projectProgress && display.projectProgress.length > 0 ? (
                  display.projectProgress.map((item: any) => (
                    <ProgressTracker
                      key={item.project.id}
                      type="project"
                      title={item.project.title}
                      id={item.project.id}
                      progress={item.progress.completedTasks.length}
                      total={4} // Assuming 4 tasks per project
                      xpEarned={item.progress.xpEarned}
                      xpTotal={item.project.xpReward}
                      difficulty={item.project.difficulty}
                      isCompleted={item.progress.isCompleted}
                    />
                  ))
                ) : (
                  <EmptyProjectsState />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Badges Section */}
      <section className="mb-8">
        <h2 className="font-orbitron text-2xl mb-6 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-[#9ecfff]" />
          Achievement Badges
        </h2>
        <BadgeSection 
          badges={display.badges || []}
          isLoading={isLoading}
        />
      </section>

      <section className="mb-8">
        <h2 className="font-orbitron text-2xl mb-6 flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-[#9ecfff]" />
          Your Reflections
        </h2>
        <div className="glassmorphic card-kodex divide-y divide-[#1e293b]/70">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : display.reflections && display.reflections.length > 0 ? (
            <>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg text-gray-200">Quantum Computing Basics</h3>
                  <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">Lab</Badge>
                </div>
                <p className="text-gray-400 mb-2">Section: Introduction</p>
                <div className="bg-[#1e293b]/50 rounded p-3 border border-[#1e293b]/90 text-gray-300">
                  Qubit superposition and entanglement enable quantum parallelism. Need to review H-gate operations and Bell states further.
                </div>
                <div className="flex justify-end mt-3">
                  <div className="text-xs text-gray-500">Last updated: 19 May 2025</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg text-gray-200">Mindful Meditation App</h3>
                  <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">Project</Badge>
                </div>
                <p className="text-gray-400 mb-2">Section: Security Implementation</p>
                <div className="bg-[#1e293b]/50 rounded p-3 border border-[#1e293b]/90 text-gray-300">
                  Implemented encryption for user meditation history. Need to add validation and sanitization for meditation entry descriptions.
                </div>
                <div className="flex justify-end mt-3">
                  <div className="text-xs text-gray-500">Last updated: 17 May 2025</div>
                </div>
              </div>
              
              <div className="p-4 flex justify-center">
                <Button variant="outline" className="btn-kodex">
                  Show More Reflections <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <EmptyReflectionsState />
          )}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="font-orbitron text-2xl mb-6 flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5 text-[#9ecfff]" />
          Your Forum Activity
        </h2>
        {isNewUser ? (
          <EmptyForumActivityState />
        ) : (
          <Tabs defaultValue="posts" className="h-full">
            <TabsList className="grid grid-cols-2 bg-[#1e293b]/30 mb-4 w-[240px]">
              <TabsTrigger 
                value="posts"
                className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
              >
                Your Posts
              </TabsTrigger>
              <TabsTrigger 
                value="saved"
                className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
              >
                Saved Posts
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="posts" className="h-full">
            <div className="glassmorphic card-kodex divide-y divide-[#1e293b]/70">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                      <h3 className="font-medium text-lg text-gray-200">Devlog – Reflections on Quantum Computing Basics</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">devlog</Badge>
                        <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">quantum</Badge>
                        <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">beginner</Badge>
                      </div>
                    </div>
                    <div className="text-gray-400 mb-3 line-clamp-3">
                      I've completed the Quantum Computing Basics lab and wanted to share some thoughts. The concept of superposition was particularly interesting as it...
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageCircleIcon className="h-4 w-4" />
                        <span>3 comments</span>
                      </div>
                      <div className="text-xs text-gray-500">Posted: 19 May 2025</div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex justify-center">
                    <Link href="/forum">
                      <Button variant="outline" className="btn-kodex">
                        View All Posts <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="h-full">
            <div className="glassmorphic card-kodex divide-y divide-[#1e293b]/70">
              {isLoading || isSavedPostsLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : savedPosts && savedPosts.length > 0 ? (
                <>
                  {savedPosts.map((post: any) => (
                    <div className="p-6" key={post.id}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                        <h3 className="font-medium text-lg text-gray-200">{post.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {/* Dynamically generate color by category */}
                          <Badge className={`bg-[#1e293b]/60 border-[#9ecfff]/20 ${
                            post.category === 'RESOURCES' ? 'text-[#10b981]' : 
                            post.category === 'DISCUSSION' ? 'text-[#8b5cf6]' : 
                            post.category === 'SHOWCASE' ? 'text-[#facc15]' : 
                            post.category === 'QUESTIONS' ? 'text-[#3b82f6]' : 
                            post.category === 'FEEDBACK' ? 'text-[#f87171]' : 
                            post.category === 'ANNOUNCEMENTS' ? 'text-[#e879f9]' : 
                            'text-gray-300'
                          }`}>{post.category.charAt(0) + post.category.slice(1).toLowerCase()}</Badge>
                          {/* Add a tag based on the post content */}
                          <Badge className="bg-[#1e293b]/60 border-[#9ecfff]/20 text-gray-300">
                            {post.content.split(' ').length > 5 ? post.content.split(' ')[2].toLowerCase() : 'coding'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span>Posted by </span>
                        <span className="font-medium ml-1 text-[#9ecfff]">@{post.user.username}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      
                      <div className="text-gray-400 mb-3 line-clamp-3">
                        {post.content}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Link href={`/forum/post/${post.id}`}>
                          <Button variant="link" className="text-[#9ecfff] p-0 h-auto">
                            Read Post
                          </Button>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-gray-500">
                            <MessageCircleIcon className="h-4 w-4" />
                            <span>{post.commentsCount || 0} comments</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-xs text-gray-400"
                            onClick={() => {
                              apiRequest("POST", `/api/forum-posts/${post.id}/save`, {})
                                .then(() => {
                                  queryClient.invalidateQueries({ queryKey: ["/api/saved-posts"] });
                                })
                                .catch((err: Error) => console.error("Error unsaving post:", err));
                            }}
                          >
                            <span className="sr-only">Unsave</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#9ecfff]">
                              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93zM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 013.75 21z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 flex justify-center">
                    <Link href="/forum">
                      <Button variant="outline" className="btn-kodex">
                        View All Posts <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <BookmarkIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-orbitron mb-2">No Saved Posts</h3>
                  <p className="text-gray-500 mb-4">You haven't saved any posts yet. Browse the forum and bookmark posts that interest you.</p>
                  <Link href="/forum">
                    <Button variant="outline" className="btn-kodex">
                      Browse Forum
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        )}
      </section>
      
      <section>
        <h2 className="font-orbitron text-2xl mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-transparent text-[#56ccf2] border border-[#56ccf2]/30">Lab</Badge>
              <Badge className="bg-transparent text-[#bb86fc] border border-[#bb86fc]/30">Intermediate</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Neural Network Foundations</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Build a simple neural network from scratch and understand the math behind it.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">750 XP</span>
              <Link href="/labs/2">
                <Button 
                  className="h-8 px-3 text-xs bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#56ccf2]/20 hover:border-[#56ccf2]/40 text-white"
                >
                  Start Lab
                </Button>
              </Link>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-transparent text-[#6fcf97] border border-[#6fcf97]/30">Project</Badge>
              <Badge className="bg-transparent text-[#bb86fc] border border-[#bb86fc]/30">Advanced</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Decentralized AI Marketplace</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Build a platform for trading AI models on a decentralized network.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">1500 XP</span>
              <Link href="/projects/2">
                <Button 
                  className="h-8 px-3 text-xs bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#6fcf97]/20 hover:border-[#6fcf97]/40 text-white"
                >
                  Start Project
                </Button>
              </Link>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-transparent text-[#9ecfff] border border-[#9ecfff]/30">Community</Badge>
              <Badge className="bg-transparent text-[#6fcf97] border border-[#6fcf97]/30">Discussion</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Balancing Tech & Mindfulness</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Join the discussion on techniques for maintaining mindfulness while coding.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">24 Comments</span>
              <Link href="/forum/1">
                <Button 
                  className="h-8 px-3 text-xs bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
                >
                  Join Discussion
                </Button>
              </Link>
            </div>
          </GlassmorphicCard>
        </div>
      </section>
    </div>
  );
}