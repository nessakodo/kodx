import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Admin dashboard tabs
type AdminTab = 'users' | 'labs' | 'projects' | 'badges' | 'forum';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Redirect non-admin users to dashboard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access this page.",
        variant: "destructive",
      });
      setLocation('/login');
      return;
    }
    
    // Check if user has admin role
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      setLocation('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, setLocation, toast]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-blue-400">Loading admin dashboard...</div>
      </div>
    );
  }
  
  // If not authenticated or not admin, don't render the dashboard
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all aspects of KOD-X WORLD</p>
        </div>
        
        <Button
          onClick={() => setLocation('/dashboard')}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Return to Dashboard
        </Button>
      </div>
      
      <Tabs 
        defaultValue="users" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AdminTab)}
        className="w-full"
      >
        <div className="border-b border-gray-800 mb-6">
          <TabsList className="bg-transparent w-full justify-start gap-4">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-blue-400 hover:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="labs"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-blue-400 hover:text-white"
            >
              Labs
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-blue-400 hover:text-white"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="badges"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-blue-400 hover:text-white"
            >
              Badges
            </TabsTrigger>
            <TabsTrigger 
              value="forum"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-gray-400 data-[state=active]:text-blue-400 hover:text-white"
            >
              Forum
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="users" className="bg-black/20 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
          <p className="text-gray-400 mb-6">View, edit, and manage user accounts.</p>
          
          <div className="space-y-6">
            {/* User management functionality would go here */}
            <div className="flex justify-end">
              <Button className="bg-[#9ecfff] hover:bg-[#8ab9e9] text-black">
                Add New User
              </Button>
            </div>
            
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">Username</th>
                    <th className="px-4 py-3 text-left text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-gray-300">XP</th>
                    <th className="px-4 py-3 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-black/30">
                    <td className="px-4 py-3 text-white">admin</td>
                    <td className="px-4 py-3 text-gray-400">admin@example.com</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded-full text-xs">
                        Admin
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">1500</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 text-blue-400 hover:text-blue-300">Edit</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-400 hover:text-red-300">Delete</Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-black/20">
                    <td className="px-4 py-3 text-white">testuser</td>
                    <td className="px-4 py-3 text-gray-400">test@example.com</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                        User
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">350</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 text-blue-400 hover:text-blue-300">Edit</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-400 hover:text-red-300">Delete</Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="labs" className="bg-black/20 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Lab Management</h2>
          <p className="text-gray-400 mb-6">Create, edit, and organize educational labs.</p>
          
          <div className="flex justify-end mb-6">
            <Button className="bg-[#9ecfff] hover:bg-[#8ab9e9] text-black">
              Create New Lab
            </Button>
          </div>
          
          {/* Lab list with edit/delete functionality would go here */}
          <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-lg bg-black/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">Quantum Computing Basics</h3>
                  <p className="text-gray-400 text-sm">Beginner-friendly introduction to quantum principles.</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 border-blue-800 text-blue-400 hover:bg-blue-900/20">Edit</Button>
                  <Button size="sm" variant="outline" className="h-8 border-red-800 text-red-400 hover:bg-red-900/20">Delete</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-800 rounded-lg bg-black/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">Digital Privacy Fundamentals</h3>
                  <p className="text-gray-400 text-sm">Essential knowledge for maintaining digital sovereignty.</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 border-blue-800 text-blue-400 hover:bg-blue-900/20">Edit</Button>
                  <Button size="sm" variant="outline" className="h-8 border-red-800 text-red-400 hover:bg-red-900/20">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="bg-black/20 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Project Management</h2>
          <p className="text-gray-400 mb-6">Create and manage projects for users to work on.</p>
          
          <div className="flex justify-end mb-6">
            <Button className="bg-[#9ecfff] hover:bg-[#8ab9e9] text-black">
              Create New Project
            </Button>
          </div>
          
          {/* Project management functionality would go here */}
        </TabsContent>
        
        <TabsContent value="badges" className="bg-black/20 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Badge Management</h2>
          <p className="text-gray-400 mb-6">Create, edit and assign achievement badges.</p>
          
          <div className="flex justify-end mb-6">
            <Button className="bg-[#9ecfff] hover:bg-[#8ab9e9] text-black">
              Create New Badge
            </Button>
          </div>
          
          {/* Badge management functionality would go here */}
        </TabsContent>
        
        <TabsContent value="forum" className="bg-black/20 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Forum Management</h2>
          <p className="text-gray-400 mb-6">Moderate forum posts and comments.</p>
          
          <div className="flex justify-end mb-6">
            <Button className="bg-[#9ecfff] hover:bg-[#8ab9e9] text-black">
              Create Announcement
            </Button>
          </div>
          
          {/* Forum management functionality would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}