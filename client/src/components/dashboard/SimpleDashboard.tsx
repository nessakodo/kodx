import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  EmptyLabsState,
  EmptyProjectsState,
  EmptyBadgesState,
  EmptyNotesState
} from '@/components/dashboard/EmptyStates';
import { BadgeModal } from '../modals/BadgeModal';
import { LevelUpModal } from '../modals/LevelUpModal';
import {
  BookOpenCheck,
  Code,
  FileText,
  Bell,
  Eye,
  Award,
  MessageSquare,
  Heart,
  CheckCircle
} from 'lucide-react';

// Sample badge for demonstration
const SAMPLE_BADGE = {
  id: 1,
  name: "Digital Starter",
  description: "Embarked on your journey toward digital enlightenment",
  category: "achievement" as const,
  rarity: "common" as const,
  createdAt: new Date().toISOString()
};

export function SimpleDashboard() {
  // Modal states
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-posts');
  
  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Welcome Banner */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-orbitron text-white mb-2">
              Welcome back, <span className="text-blue-400">Explorer</span>
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
            {/* XP Ring would go here, showing a placeholder button instead */}
            <Button
              className="h-32 w-32 rounded-full bg-blue-600/20 border-4 border-blue-500/30 relative"
              onClick={() => setLevelUpModalOpen(true)}
            >
              <div className="text-center">
                <div className="text-3xl font-orbitron text-blue-400">1</div>
                <div className="text-xs text-blue-300">LEVEL</div>
              </div>
            </Button>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-400">
                100 XP Total
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Labs & Projects Progress */}
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
              <EmptyLabsState />
            </TabsContent>
            
            <TabsContent value="projects">
              <EmptyProjectsState />
            </TabsContent>
          </Tabs>
          
          {/* Badges Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl text-purple-300">
                Your Badges
              </h2>
              
              <Button 
                variant="outline" 
                className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              >
                View All Badges
              </Button>
            </div>
            
            <Card className="border border-[#1e293b] bg-[#0c1527]/50">
              <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                  <Button
                    onClick={() => setBadgeModalOpen(true)}
                    className="mb-4 w-20 h-20 rounded-full border-2 border-purple-500/30 bg-[#0c1527]/80 hover:bg-purple-500/10 flex items-center justify-center"
                  >
                    <span className="text-2xl font-orbitron text-purple-400">D</span>
                  </Button>
                  <h3 className="text-sm font-medium text-white mb-1">Digital Starter</h3>
                  <Badge className="bg-purple-500/10 text-purple-300">
                    achievement
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 border-t border-[#1e293b] text-center">
                <Button 
                  variant="link" 
                  className="text-purple-300 hover:text-purple-200"
                >
                  Unlock More Badges
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Notes Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl text-emerald-300">
                Your Notes
              </h2>
              
              <div className="flex items-center gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  New Note
                </Button>
              </div>
            </div>
            
            <EmptyNotesState />
          </div>
        </div>
        
        {/* Right Column - Activity & Forum */}
        <div className="space-y-8">
          {/* Notifications Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl text-blue-300">
                Notifications
              </h2>
            </div>
            
            <Card className="border border-[#1e293b] bg-[#0c1527]/50">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-orbitron text-blue-300">Recent Notifications</h3>
                  <Button 
                    variant="ghost" 
                    className="text-blue-300 hover:text-blue-200 text-sm"
                    onClick={() => {}}
                  >
                    Mark all as read
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* No notifications state */}
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-500/10 border border-blue-500/30">
                      <Bell className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-orbitron text-blue-300 mb-3">No Recent Activity</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Your timeline is a blank canvas. Once you begin your first Lab, Project, 
                      or Forum thread, your journey will unfold here.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/labs">
                        <Button 
                          variant="outline" 
                          className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                        >
                          Explore Labs
                        </Button>
                      </Link>
                      
                      <Link href="/forum">
                        <Button 
                          variant="outline" 
                          className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                        >
                          Join Community Forum
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Sample notifications that would be shown once user engages */}
                  {/* 
                  <div className="p-4 flex items-start space-x-4 bg-blue-900/10 rounded-md">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/30">
                      <Eye className="h-5 w-5 text-green-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">
                          Welcome to KOD•X
                          <Badge className="ml-2 bg-blue-500 text-white">
                            New
                          </Badge>
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-300 mt-1">
                        Begin your journey into mindful technology and cyber-zen practices.
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          Just now
                        </span>
                      </div>
                    </div>
                  </div>
                  */}
                </div>
              </div>
              
              <div className="p-4 border-t border-[#1e293b] text-center">
                <Button
                  variant="ghost"
                  className="text-blue-300 hover:text-blue-200"
                >
                  View All Notifications
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Forum Activity */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl text-blue-300">
                Your Forum Activity
              </h2>
              
              <div className="flex bg-[#0f172a] border border-[#1e293b] rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('my-posts')}
                  className={`rounded-none border-0 px-6 ${
                    activeTab === 'my-posts' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-transparent text-gray-300 hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  My Posts
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('saved-posts')}
                  className={`rounded-none border-0 px-6 ${
                    activeTab === 'saved-posts' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-transparent text-gray-300 hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  Saved Posts
                </Button>
              </div>
            </div>
            
            <Card className="border border-[#1e293b] bg-[#0c1527]/50">
              <div className="p-8 text-center">
                <p className="text-gray-400 mb-6">
                  {activeTab === 'my-posts' 
                    ? "You haven't created any forum posts yet. Start a discussion to engage with the community."
                    : "You haven't saved any forum posts yet. Save interesting posts to read later."}
                </p>
                <Link href="/forum">
                  <Button 
                    variant="outline" 
                    className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                  >
                    Explore Forum
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <BadgeModal 
        badge={SAMPLE_BADGE} 
        open={badgeModalOpen} 
        onOpenChange={setBadgeModalOpen} 
      />
      
      <LevelUpModal 
        level={1} 
        open={levelUpModalOpen} 
        onOpenChange={setLevelUpModalOpen} 
      />
    </div>
  );
}