import { useQuery } from "@tanstack/react-query";
import { XpRingProgress } from "@/components/dashboard/XpRingProgress";
import { BadgeSection } from "@/components/dashboard/BadgeSection";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_DASHBOARD_DATA } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { TrophyIcon, CheckCircleIcon, RocketIcon, ArrowRightCircleIcon, BookOpenIcon, ChevronDownIcon, MessageSquareIcon, MessageCircleIcon } from "lucide-react";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";
import { Link } from "wouter";

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });
  
  // Use mock data when no real data is available
  const display = dashboardData || MOCK_DASHBOARD_DATA;
  
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
            <XpRingProgress
              xp={user.totalXp}
              username={user.username}
              profileImageUrl={user.profileImageUrl}
            />
            
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Level {level}</span>
                <span className="text-gray-400">Level {nextLevel}</span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-[#1e293b] border border-[#1e293b]" />
              <div className="text-center text-xs text-gray-500">
                {xpNeeded - ((user?.totalXp || 0) - currentLevelXp)} XP until next level
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
                  <div className="flex flex-col items-center py-12 px-4 bg-[#1e2535]/40 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-6 text-center">You haven't started any labs yet. Explore our labs to begin your journey!</p>
                    <Link href="/labs">
                      <Button 
                        variant="outline"
                        className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
                      >
                        Browse Labs
                      </Button>
                    </Link>
                  </div>
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
                  <div className="flex flex-col items-center py-12 px-4 bg-[#1e2535]/40 rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-6 text-center">You haven't started any projects yet. Take on a project challenge!</p>
                    <Link href="/projects">
                      <Button 
                        variant="outline"
                        className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
                      >
                        Browse Projects
                      </Button>
                    </Link>
                  </div>
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
          Your Notes
        </h2>
        <div className="glassmorphic card-kodex divide-y divide-[#1e293b]/70">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
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
                  Show More Notes <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="font-orbitron text-2xl mb-6 flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5 text-[#9ecfff]" />
          Your Forum Posts
        </h2>
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
                <Button variant="outline" className="btn-kodex">
                  View All Posts <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
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