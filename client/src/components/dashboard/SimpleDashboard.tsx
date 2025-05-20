import { useQuery } from "@tanstack/react-query";
import { XPRing } from "@/components/dashboard/XPRing";
import { BadgeSection } from "@/components/dashboard/BadgeSection";
import { ForumActivitySection } from "@/components/dashboard/ForumActivitySection";
import { NotificationsSection } from "@/components/dashboard/NotificationsSection";
import { NotesSection } from "@/components/notes/NotesSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "wouter";
import { 
  EmptyLabsState, 
  EmptyProjectsState, 
  EmptyBadgesState, 
  EmptyNotesState,
  EmptyActivityState
} from "@/components/dashboard/EmptyStates";
import { BookOpen, Code, MessageSquare, FileText } from "lucide-react";

export function SimpleDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  // Default empty data structure
  const emptyData = {
    labProgress: [],
    projectProgress: [],
    badges: [],
    notes: [],
    totalXp: 0,
    forumActivity: [],
    username: user?.username || 'User'
  };
  
  // Fetch user data
  const { data: userData = emptyData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
  });
  
  // Display welcome message for new users
  const isNewUser = userData.labProgress?.length === 0 && 
                   userData.projectProgress?.length === 0 && 
                   userData.badges?.length === 0;
  
  // Handle XP ring click to show level-up modal
  const handleXPRingClick = () => {
    setShowLevelModal(true);
  };
  
  // Handle badge click to show badge modal
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/3 pr-0 lg:pr-4 mb-6">
            <Card className="p-6 border border-[#1e293b] bg-[#0c1527]/50 h-full">
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          </div>
          
          <div className="w-full lg:w-2/3 mb-6">
            <Card className="p-6 border border-[#1e293b] bg-[#0c1527]/50 h-full">
              <div className="space-y-4">
                <Skeleton className="h-6 w-[180px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Welcome message */}
      <Card className="mb-8 border border-[#1e293b] bg-[#0c1527]/80 bg-gradient-to-br from-[#0f1729]/90 to-[#131f38]/70 overflow-hidden">
        <div className="relative p-6 md:p-8">
          {/* Background effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/40 to-violet-600/30"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-orbitron text-3xl text-white mb-2">
                Welcome back, <span className="text-blue-400">{userData.username}</span>
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Continue your journey of digital enlightenment. Explore labs, complete projects, and connect with the community to advance your skills.
              </p>
            </div>
            
            <div className="flex-shrink-0" onClick={handleXPRingClick}>
              <XPRing 
                totalXp={userData.totalXp || 0} 
                size="lg" 
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Main content grid */}
      <div className="flex flex-wrap">
        {/* Left sidebar - profile & quick actions */}
        <div className="w-full lg:w-1/3 pr-0 lg:pr-4 mb-6">
          <Card className="p-6 border border-[#1e293b] bg-[#0c1527]/50">
            {/* Stats section */}
            <div className="text-center mb-8">
              <h3 className="font-orbitron text-xl text-white mb-6">
                Your Progress
              </h3>
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#121a2a] rounded-lg p-4 text-center border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                  <div className="text-2xl font-orbitron text-indigo-400 mb-1">
                    {userData.labProgress?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Labs Completed</div>
                </div>
                <div className="bg-[#121a2a] rounded-lg p-4 text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <div className="text-2xl font-orbitron text-cyan-400 mb-1">
                    {userData.projectProgress?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Projects Started</div>
                </div>
                <div className="bg-[#121a2a] rounded-lg p-4 text-center border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                  <div className="text-2xl font-orbitron text-violet-400 mb-1">
                    {userData.badges?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Badges Earned</div>
                </div>
                <div className="bg-[#121a2a] rounded-lg p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <div className="text-2xl font-orbitron text-emerald-400 mb-1">
                    {userData.notes?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Notes Created</div>
                </div>
              </div>
            </div>
            
            {/* Quick action buttons */}
            <div className="space-y-3">
              <Link href="/labs">
                <Button variant="outline" className="w-full justify-start border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20">
                  <BookOpen className="mr-2 h-4 w-4" /> Explore Labs
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="w-full justify-start border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20">
                  <Code className="mr-2 h-4 w-4" /> Browse Projects
                </Button>
              </Link>
              <Link href="/forum">
                <Button variant="outline" className="w-full justify-start border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20">
                  <MessageSquare className="mr-2 h-4 w-4" /> Join the Forum
                </Button>
              </Link>
              <Link href="/notes/new">
                <Button variant="outline" className="w-full justify-start border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20">
                  <FileText className="mr-2 h-4 w-4" /> Create a Note
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        
        {/* Main content - learning progress & activity */}
        <div className="w-full lg:w-2/3">
          {/* Welcome message for new users */}
          {isNewUser && (
            <Card className="mb-6 p-6 border border-[#1e293b] bg-gradient-to-br from-[#0c1527]/70 to-[#1e293b]/30">
              <h2 className="font-orbitron text-2xl text-blue-300 mb-2">
                Welcome to KOD-X WORLD
              </h2>
              <p className="text-gray-300 mb-4">
                Begin your journey into digital literacy and cyber-zen. Explore labs, build projects, 
                and connect with a community of learners focused on mindful technology mastery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/labs">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Start with a Lab
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    Build a Project
                  </Button>
                </Link>
              </div>
            </Card>
          )}
          
          {/* Notifications section */}
          <NotificationsSection />
          
          {/* Learning progress section */}
          <div className="mb-8">
            <Tabs defaultValue="labs" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-orbitron text-2xl text-white">
                  Your Progress
                </h2>
                <TabsList className="bg-[#1e293b]">
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
                <Card className="border border-[#1e293b] bg-[#0c1527]/50 divide-y divide-[#1e293b]">
                  {userData.labProgress && userData.labProgress.length > 0 ? (
                    userData.labProgress.slice(0, 3).map((lab) => (
                      <Link key={lab.id} href={`/labs/${lab.labId}`}>
                        <div className="p-4 hover:bg-[#1e293b]/20 transition-colors cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-white mb-1">{lab.title}</h3>
                              <div className="flex items-center text-xs text-gray-400">
                                <span className="mr-2">Progress: {lab.progress || 0}%</span>
                                {lab.completed && (
                                  <span className="text-green-400">✓ Completed</span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-indigo-400">
                              Continue
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6">
                      <EmptyLabsState />
                    </div>
                  )}
                  
                  {userData.labProgress && userData.labProgress.length > 0 && (
                    <div className="p-4 text-center">
                      <Link href="/labs">
                        <Button 
                          variant="outline"
                          className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                        >
                          View All Labs
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="projects">
                <Card className="border border-[#1e293b] bg-[#0c1527]/50 divide-y divide-[#1e293b]">
                  {userData.projectProgress && userData.projectProgress.length > 0 ? (
                    userData.projectProgress.slice(0, 3).map((project) => (
                      <Link key={project.id} href={`/projects/${project.projectId}`}>
                        <div className="p-4 hover:bg-[#1e293b]/20 transition-colors cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-white mb-1">{project.title}</h3>
                              <div className="flex items-center text-xs text-gray-400">
                                <span className="mr-2">Progress: {project.progress || 0}%</span>
                                {project.completed && (
                                  <span className="text-green-400">✓ Completed</span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-cyan-400">
                              Continue
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6">
                      <EmptyProjectsState />
                    </div>
                  )}
                  
                  {userData.projectProgress && userData.projectProgress.length > 0 && (
                    <div className="p-4 text-center">
                      <Link href="/projects">
                        <Button
                          variant="outline"
                          className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                        >
                          View All Projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Badge showcase section */}
          <BadgeSection badges={userData.badges || []} isLoading={false} />
          
          {/* Notes section with search */}
          <NotesSection limit={3} />
          
          {/* Forum activity section */}
          <ForumActivitySection />
        </div>
      </div>
      
      {/* Level Up Modal */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-blue-500/30 bg-[#0c1527]/95">
            <div className="p-6">
              <h2 className="font-orbitron text-2xl text-center text-blue-300 mb-6">Level Progress</h2>
              
              <div className="flex justify-center mb-6">
                <XPRing totalXp={userData.totalXp || 0} size="lg" />
              </div>
              
              <div className="space-y-4">
                <p className="text-center text-gray-300">
                  You have accumulated <span className="font-bold text-blue-400">{userData.totalXp || 0} XP</span> on your journey.
                </p>
                <p className="text-center text-gray-300">
                  Continue completing labs, projects, and engaging with the community to earn more XP and advance to the next level.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setShowLevelModal(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue Journey
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Badge Modal */}
      {showBadgeModal && selectedBadge && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-violet-500/30 bg-[#0c1527]/95">
            <div className="p-6">
              <h2 className="font-orbitron text-2xl text-center text-violet-300 mb-6">{selectedBadge.name}</h2>
              
              <div className="flex justify-center mb-6">
                {/* Badge image would go here */}
                <div className="w-32 h-32 rounded-full bg-violet-500/20 border-2 border-violet-500/30 flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-center text-gray-300">
                  {selectedBadge.description}
                </p>
                {selectedBadge.timesEarned && (
                  <p className="text-center text-gray-400 text-sm">
                    Earned on {new Date(selectedBadge.timesEarned).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setShowBadgeModal(false)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}