import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { XPRing } from "@/components/ui/xp-ring";
import { Badge } from "@/components/ui/badge";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BookIcon, 
  GitForkIcon, 
  AwardIcon, 
  NotebookPenIcon,
  BellIcon, 
  AlertCircleIcon
} from "lucide-react";

export function UserDashboard() {
  const { user, isLoading: isUserLoading } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
  });
  
  const isLoading = isUserLoading || isDashboardLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="h-[300px] w-full rounded-xl mb-6" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="md:w-2/3">
            <Skeleton className="h-12 w-full rounded-lg mb-6" />
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <AlertCircleIcon className="h-16 w-16 mx-auto text-[#ff5c5c] mb-6" />
        <h2 className="text-2xl font-orbitron mb-4">Authentication Required</h2>
        <p className="text-gray-500 mb-8">Please sign in to access your dashboard.</p>
        <Button asChild>
          <a href="/api/login">Sign In</a>
        </Button>
      </div>
    );
  }

  // Extract data
  const { 
    labProgress = [], 
    projectProgress = [], 
    badges = [] 
  } = dashboardData || {};

  // Calculate total XP and levels
  const totalXp = user.totalXp || 0;
  const level = Math.floor(totalXp / 1000) + 1; // Simple level calculation
  
  // Calculate progress to next level
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const levelProgress = Math.round(((totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100);
  
  // Sort completed and in-progress items
  const completedLabs = labProgress.filter((item: any) => item.progress.isCompleted);
  const inProgressLabs = labProgress.filter((item: any) => !item.progress.isCompleted);
  
  const completedProjects = projectProgress.filter((item: any) => item.progress.isCompleted);
  const inProgressProjects = projectProgress.filter((item: any) => !item.progress.isCompleted);
  
  const completedCount = completedLabs.length + completedProjects.length;
  const inProgressCount = inProgressLabs.length + inProgressProjects.length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar */}
        <div className="xl:w-1/3 space-y-8">
          {/* User Profile Card */}
          <GlassmorphicCard className="overflow-hidden">
            <div className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-[#9ecfff]/20">
                <AvatarImage 
                  src={user.profileImageUrl} 
                  alt={user.username || "User"} 
                />
                <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30 text-xl">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-orbitron mb-1">{user.username || "User"}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <XPRing percentage={levelProgress} size="lg" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs text-gray-400">LEVEL</span>
                    <span className="text-2xl font-bold text-white">{level}</span>
                  </div>
                </div>
                
                <div className="ml-6 text-left">
                  <h3 className="text-lg font-orbitron text-[#9ecfff]">{totalXp} XP</h3>
                  <p className="text-xs text-gray-500">
                    {xpForNextLevel - totalXp} XP to level {level + 1}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-[#1e2535]/80 text-gray-300">
                      {completedCount} Completed
                    </Badge>
                    <Badge variant="outline" className="bg-[#1e2535]/80 text-gray-300">
                      {inProgressCount} In Progress
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center border-t border-[#9ecfff]/10 pt-4">
                <div>
                  <div className="text-2xl font-orbitron text-[#9ecfff]">
                    {completedLabs.length}
                  </div>
                  <div className="text-xs text-gray-500">Labs</div>
                </div>
                <div>
                  <div className="text-2xl font-orbitron text-[#9ecfff]">
                    {completedProjects.length}
                  </div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-orbitron text-[#9ecfff]">
                    {badges.length}
                  </div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
          
          {/* Badges Card */}
          <GlassmorphicCard className="overflow-hidden">
            <div className="p-6">
              <h3 className="font-orbitron text-lg mb-4 flex items-center">
                <AwardIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                Your Badges
              </h3>
              
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-4">
                  {badges.map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-[#1e2535]/80 rounded-lg">
                      <div className="w-16 h-16 mb-2 bg-gradient-to-br from-[#9ecfff]/10 to-[#88c9b7]/10 border border-[#9ecfff]/20 rounded-full flex items-center justify-center">
                        <img
                          src={badge.iconUrl || `https://api.dicebear.com/6.x/shapes/svg?seed=${badge.name}`}
                          alt={badge.name}
                          className="w-10 h-10"
                        />
                      </div>
                      <h4 className="text-sm font-medium">{badge.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AwardIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Complete labs and projects to earn badges!</p>
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>
        
        {/* Main Content */}
        <div className="xl:w-2/3">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress" className="font-orbitron">Progress</TabsTrigger>
              <TabsTrigger value="notes" className="font-orbitron">Notes</TabsTrigger>
              <TabsTrigger value="badges" className="font-orbitron">Badges</TabsTrigger>
              <TabsTrigger value="notifications" className="font-orbitron">Notifications</TabsTrigger>
            </TabsList>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="mt-6">
              <GlassmorphicCard>
                <div className="p-6">
                  <h3 className="font-orbitron text-xl mb-6 flex items-center">
                    <BookIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                    Labs Progress
                  </h3>
                  
                  {labProgress.length > 0 ? (
                    <div className="space-y-6">
                      <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">In Progress</h4>
                      {inProgressLabs.length > 0 ? (
                        <div className="space-y-4">
                          {inProgressLabs.map((item: any) => (
                            <ProgressTracker
                              key={item.lab.id}
                              type="lab"
                              title={item.lab.title}
                              id={item.lab.id}
                              progress={item.progress.completedTasks?.length || 0}
                              total={5} // Placeholder, ideally from the API
                              xpEarned={item.progress.xpEarned || 0}
                              xpTotal={item.lab.xpReward}
                              difficulty={item.lab.difficulty}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 py-2">No labs in progress. Start a new lab!</p>
                      )}
                      
                      <div className="border-t border-[#9ecfff]/10 pt-6 mt-6">
                        <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Completed</h4>
                        {completedLabs.length > 0 ? (
                          <div className="space-y-4">
                            {completedLabs.map((item: any) => (
                              <ProgressTracker
                                key={item.lab.id}
                                type="lab"
                                title={item.lab.title}
                                id={item.lab.id}
                                progress={5} // Completed, so max value
                                total={5}
                                xpEarned={item.lab.xpReward}
                                xpTotal={item.lab.xpReward}
                                difficulty={item.lab.difficulty}
                                isCompleted
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 py-2">You haven't completed any labs yet.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                      <p className="text-gray-500 mb-4">You haven't started any labs yet.</p>
                      <Button asChild>
                        <Link href="/labs">Browse Labs</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="mt-6">
                <div className="p-6">
                  <h3 className="font-orbitron text-xl mb-6 flex items-center">
                    <GitForkIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                    Projects Progress
                  </h3>
                  
                  {projectProgress.length > 0 ? (
                    <div className="space-y-6">
                      <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">In Progress</h4>
                      {inProgressProjects.length > 0 ? (
                        <div className="space-y-4">
                          {inProgressProjects.map((item: any) => (
                            <ProgressTracker
                              key={item.project.id}
                              type="project"
                              title={item.project.title}
                              id={item.project.id}
                              progress={item.progress.completedTasks?.length || 0}
                              total={5} // Placeholder, ideally from the API
                              xpEarned={item.progress.xpEarned || 0}
                              xpTotal={item.project.xpReward}
                              difficulty={item.project.difficulty}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 py-2">No projects in progress. Start a new project!</p>
                      )}
                      
                      <div className="border-t border-[#9ecfff]/10 pt-6 mt-6">
                        <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Completed</h4>
                        {completedProjects.length > 0 ? (
                          <div className="space-y-4">
                            {completedProjects.map((item: any) => (
                              <ProgressTracker
                                key={item.project.id}
                                type="project"
                                title={item.project.title}
                                id={item.project.id}
                                progress={5} // Completed, so max value
                                total={5}
                                xpEarned={item.project.xpReward}
                                xpTotal={item.project.xpReward}
                                difficulty={item.project.difficulty}
                                isCompleted
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 py-2">You haven't completed any projects yet.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <GitForkIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                      <p className="text-gray-500 mb-4">You haven't started any projects yet.</p>
                      <Button asChild>
                        <Link href="/projects">Browse Projects</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-6">
              <GlassmorphicCard>
                <div className="p-6">
                  <h3 className="font-orbitron text-xl mb-6 flex items-center">
                    <NotebookPenIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                    Your Notes
                  </h3>
                  
                  <div className="space-y-6">
                    {labProgress.filter((item: any) => item.progress.notes).length > 0 || 
                     projectProgress.filter((item: any) => item.progress.notes).length > 0 ? (
                      <>
                        {/* Lab Notes */}
                        {labProgress.filter((item: any) => item.progress.notes).map((item: any) => (
                          <div key={`lab-${item.lab.id}`} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10">
                            <h4 className="font-medium mb-2 flex items-center">
                              <BookIcon className="h-4 w-4 mr-2" />
                              <Link href={`/labs/${item.lab.id}`}>
                                <a className="hover:text-[#9ecfff] transition-colors">
                                  {item.lab.title}
                                </a>
                              </Link>
                            </h4>
                            <Textarea 
                              className="min-h-[100px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                              value={item.progress.notes}
                              readOnly
                            />
                            <div className="mt-2 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="text-xs"
                              >
                                <Link href={`/labs/${item.lab.id}`}>
                                  <a>Edit in Lab</a>
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Project Notes */}
                        {projectProgress.filter((item: any) => item.progress.notes).map((item: any) => (
                          <div key={`project-${item.project.id}`} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10">
                            <h4 className="font-medium mb-2 flex items-center">
                              <GitForkIcon className="h-4 w-4 mr-2" />
                              <Link href={`/projects/${item.project.id}`}>
                                <a className="hover:text-[#9ecfff] transition-colors">
                                  {item.project.title}
                                </a>
                              </Link>
                            </h4>
                            <Textarea 
                              className="min-h-[100px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                              value={item.progress.notes}
                              readOnly
                            />
                            <div className="mt-2 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="text-xs"
                              >
                                <Link href={`/projects/${item.project.id}`}>
                                  <a>Edit in Project</a>
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <NotebookPenIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                        <p className="text-gray-500">
                          You haven't taken any notes yet. Notes you take in labs and projects will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassmorphicCard>
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges" className="mt-6">
              <GlassmorphicCard>
                <div className="p-6">
                  <h3 className="font-orbitron text-xl mb-6 flex items-center">
                    <AwardIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                    Your Badges
                  </h3>
                  
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {badges.map((badge: any) => (
                        <div key={badge.id} className="bg-[#1e2535]/50 rounded-lg p-6 border border-[#9ecfff]/10 flex flex-col items-center text-center">
                          <div className="w-24 h-24 mb-4 bg-gradient-to-br from-[#9ecfff]/10 to-[#88c9b7]/10 border border-[#9ecfff]/20 rounded-full flex items-center justify-center">
                            <img
                              src={badge.iconUrl || `https://api.dicebear.com/6.x/shapes/svg?seed=${badge.name}`}
                              alt={badge.name}
                              className="w-16 h-16"
                            />
                          </div>
                          <h4 className="font-medium mb-2">{badge.name}</h4>
                          <p className="text-sm text-gray-400 mb-3">{badge.description}</p>
                          <Badge variant="outline" className="bg-[#1e2535]/80 text-gray-300 text-xs">
                            Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AwardIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                      <p className="text-gray-500 mb-4">
                        You haven't earned any badges yet. Complete labs and projects to earn badges!
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button asChild variant="outline">
                          <Link href="/labs">Browse Labs</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/projects">Browse Projects</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <GlassmorphicCard>
                <div className="p-6">
                  <h3 className="font-orbitron text-xl mb-6 flex items-center">
                    <BellIcon className="mr-2 h-5 w-5 text-[#9ecfff]" />
                    Notifications
                  </h3>
                  
                  <div className="text-center py-6">
                    <BellIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                    <p className="text-gray-500">
                      You have no notifications yet. Interactions with your content will appear here.
                    </p>
                  </div>
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
