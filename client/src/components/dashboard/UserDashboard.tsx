import { useQuery } from "@tanstack/react-query";
import { XpRingProgress } from "@/components/dashboard/XpRingProgress";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_DASHBOARD_DATA } from "@/lib/mockData";
import { useEffect } from "react";

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });
  
  // Use mock data when no real data is available
  const display = dashboardData || MOCK_DASHBOARD_DATA;
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-orbitron mb-6">Sign in to view your dashboard</h2>
        <Button
          className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <GlassmorphicCard className="p-8 flex flex-col items-center h-full">
            <XpRingProgress
              xp={user.totalXp}
              username={user.username}
              profileImageUrl={user.profileImageUrl}
            />
            
            <div className="mt-6 w-full">
              <h3 className="font-orbitron text-lg text-center mb-4">Achievement Badges</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-16 rounded-full" />
                  ))
                ) : display.badges && display.badges.length > 0 ? (
                  display.badges.map((badge: any) => (
                    <div 
                      key={badge.id}
                      className="flex flex-col items-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 flex items-center justify-center">
                        {badge.iconUrl ? (
                          <img src={badge.iconUrl} alt={badge.name} className="h-10 w-10" />
                        ) : (
                          <span className="text-2xl">🏆</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-sm">Complete labs and projects to earn badges!</p>
                )}
              </div>
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
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9ecfff]/20 data-[state=active]:to-[#88c9b7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
                >
                  Labs
                </TabsTrigger>
                <TabsTrigger 
                  value="projects"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9ecfff]/20 data-[state=active]:to-[#88c9b7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
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
                    <Button 
                      variant="outline"
                      className="bg-gradient-to-r from-[#9ecfff]/10 to-[#88c9b7]/10 hover:from-[#9ecfff]/20 hover:to-[#88c9b7]/20"
                    >
                      Browse Labs
                    </Button>
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
                    <Button 
                      variant="outline"
                      className="bg-gradient-to-r from-[#9ecfff]/10 to-[#88c9b7]/10 hover:from-[#9ecfff]/20 hover:to-[#88c9b7]/20"
                    >
                      Browse Projects
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <section className="mb-8">
        <h2 className="font-orbitron text-2xl mb-6">Recent Activity</h2>
        <GlassmorphicCard className="p-6">
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
                  🏆
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">You earned the <span className="text-[#9ecfff]">Beginner's Mind</span> badge for completing your first lab.</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2 border-b border-gray-800">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">You completed <span className="text-green-500">2/5</span> tasks in <span className="text-[#9ecfff]">Quantum Computing Basics</span>.</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#88c9b7]/20 text-[#88c9b7]">
                  🚀
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">You started the <span className="text-[#88c9b7]">Mindful Meditation App</span> project.</p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
            </div>
          )}
        </GlassmorphicCard>
      </section>
      
      <section>
        <h2 className="font-orbitron text-2xl mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Lab</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">Intermediate</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Neural Network Foundations</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Build a simple neural network from scratch and understand the math behind it.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">750 XP</span>
              <Button variant="outline" className="h-8 px-3 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30">
                Start Lab
              </Button>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Project</Badge>
              <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Advanced</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Decentralized AI Marketplace</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Build a platform for trading AI models on a decentralized network.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">1500 XP</span>
              <Button variant="outline" className="h-8 px-3 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                Start Project
              </Button>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">Community</Badge>
              <Badge className="bg-[#88c9b7]/20 text-[#88c9b7] hover:bg-[#88c9b7]/30">Discussion</Badge>
            </div>
            <h3 className="font-orbitron text-lg mb-2">Balancing Tech & Mindfulness</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Join the discussion on techniques for maintaining mindfulness while coding.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">24 Comments</span>
              <Button variant="outline" className="h-8 px-3 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/30">
                Join Discussion
              </Button>
            </div>
          </GlassmorphicCard>
        </div>
      </section>
    </div>
  );
}