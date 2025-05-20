import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Components
import { XPRing } from "@/components/dashboard/XPRing";
import { BadgeSection } from "@/components/dashboard/BadgeSection";
import { ForumActivitySection } from "@/components/dashboard/ForumActivitySection";
import { NotificationsSection } from "@/components/dashboard/NotificationsSection";
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
  EmptyNotesState
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
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  
  // Fetch dashboard data with user progress
  const { data: dashboardData = {}, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!isAuthenticated,
  });
  
  // Fetch latest badges
  const { data: userBadges = [], isLoading: isBadgesLoading } = useQuery({
    queryKey: ['/api/user-badges'],
    enabled: !!isAuthenticated,
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
  
  // Show sign in prompt if not authenticated
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
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 p-6 rounded-lg bg-gradient-to-r from-[#0c1527]/80 to-[#1e293b]/60 border border-[#1e293b]">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-3xl font-orbitron text-white mb-3">
            Welcome back, <span className="text-blue-400">{user?.username || 'Explorer'}</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Continue your journey of digital enlightenment. Explore labs, complete projects, 
            and connect with the community to advance your skills.
          </p>
        </div>
        
        <div className="flex items-center space-x-8">
          {/* XP Ring Component */}
          <XPRing
            level={currentLevel}
            progress={progress}
            onClick={() => setLevelUpModalOpen(true)}
          />
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Labs & Projects */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Labs & Projects Tabs */}
          <Card className="border border-[#1e293b] bg-[#0c1527]/50">
            <Tabs defaultValue="labs" className="p-6">
              <TabsList className="mb-6 bg-[#1e293b]/50">
                <TabsTrigger 
                  value="labs"
                  className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
                >
                  <BookOpenCheck className="h-4 w-4 mr-2" />
                  Labs
                </TabsTrigger>
                <TabsTrigger 
                  value="projects"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="labs" className="space-y-6">
                {dashboard.labProgress && dashboard.labProgress.length > 0 ? (
                  dashboard.labProgress.slice(0, 3).map((lab: any) => (
                    <div key={lab.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-md bg-indigo-900/10 border border-indigo-500/30">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="font-medium text-white flex items-center">
                          <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                          {lab.title || 'Lab in progress'}
                        </h3>
                        <div className="flex items-center mt-2">
                          <div className="h-2 flex-1 bg-[#1e293b] rounded-full mr-3">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${lab.completedPercent || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-indigo-300 min-w-[40px]">
                            {lab.completedPercent || 0}%
                          </span>
                        </div>
                      </div>
                      <Link href={`/labs/${lab.id}`}>
                        <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-indigo-200">
                          Continue
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <EmptyLabsState />
                )}
                
                <div className="flex justify-center">
                  <Link href="/labs">
                    <Button variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20">
                      View All Labs
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-6">
                {dashboard.projectProgress && dashboard.projectProgress.length > 0 ? (
                  dashboard.projectProgress.slice(0, 3).map((project: any) => (
                    <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-md bg-cyan-900/10 border border-cyan-500/30">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="font-medium text-white flex items-center">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
                          {project.title || 'Project in progress'}
                        </h3>
                        <div className="flex items-center mt-2">
                          <div className="h-2 flex-1 bg-[#1e293b] rounded-full mr-3">
                            <div 
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ width: `${project.completedPercent || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyan-300 min-w-[40px]">
                            {project.completedPercent || 0}%
                          </span>
                        </div>
                      </div>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm" variant="ghost" className="text-cyan-300 hover:text-cyan-200">
                          Continue
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <EmptyProjectsState />
                )}
                
                <div className="flex justify-center">
                  <Link href="/projects">
                    <Button variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Badges Section */}
          <BadgeSection 
            badges={dashboard.badges || []} 
            onBadgeClick={(badge) => {
              setSelectedBadge(badge);
              setBadgeModalOpen(true);
            }}
          />
          
          {/* Notes Section */}
          <NotesSection limit={3} />
        </div>
        
        {/* Right Column - Notifications & Forum */}
        <div className="space-y-8">
          {/* Notifications Section */}
          <NotificationsSection limit={4} />
          
          {/* Forum Activity */}
          <ForumActivitySection />
        </div>
      </div>
      
      {/* Modals */}
      <LevelUpModal 
        level={currentLevel} 
        isOpen={levelUpModalOpen} 
        onClose={() => setLevelUpModalOpen(false)} 
      />
      
      <BadgeModal 
        badge={selectedBadge}
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
      />
    </div>
  );
}