import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash2, Edit, Star, User, BookOpen, Award, MessageSquare } from 'lucide-react';

// Admin Panel Component
const AdminPanel: React.FC = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  
  // Redirect if not admin
  if (!authLoading && !isAuthenticated) {
    window.location.href = '/login?redirect=/admin';
    return null;
  }
  
  if (!authLoading && isAuthenticated && user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl mb-8">You don't have permission to access the admin panel.</p>
        <Button onClick={() => window.location.href = '/'}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent mb-2">KODΞX Admin Panel</h1>
        <p className="text-gray-400">Manage content, users, and platform settings</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Labs</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Star size={16} />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award size={16} />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Forum</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="labs">
          <LabManagement />
        </TabsContent>
        
        <TabsContent value="projects">
          <ProjectManagement />
        </TabsContent>
        
        <TabsContent value="badges">
          <BadgeManagement />
        </TabsContent>
        
        <TabsContent value="forum">
          <ForumManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// USER MANAGEMENT COMPONENT
const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('/api/admin/users')
  });
  
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => 
      apiRequest('/api/admin/users/update-role', {
        method: 'POST',
        body: JSON.stringify({ userId, role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User role updated',
        description: 'User role has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => 
      apiRequest('/api/admin/users/delete', {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User deleted',
        description: 'User has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Search users by username or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-2">Username</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">XP</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {user.profileImageUrl && (
                            <img 
                              src={user.profileImageUrl} 
                              alt={user.username} 
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          {user.username}
                        </div>
                      </td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => 
                            updateUserRoleMutation.mutate({ 
                              userId: user.id, 
                              role: value 
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">{user.totalXp}</td>
                      <td className="p-2 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the user and all associated data.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUserMutation.mutate(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// LAB MANAGEMENT COMPONENT
const LabManagement: React.FC = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLab, setEditingLab] = useState<any>(null);
  
  const { data: labs, isLoading } = useQuery({
    queryKey: ['/api/admin/labs'],
    queryFn: () => apiRequest('/api/admin/labs')
  });
  
  const createLabMutation = useMutation({
    mutationFn: (labData: any) => 
      apiRequest('/api/admin/labs/create', {
        method: 'POST',
        body: JSON.stringify(labData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labs'] });
      setIsCreating(false);
      toast({
        title: 'Lab created',
        description: 'New lab has been successfully created',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const updateLabMutation = useMutation({
    mutationFn: (labData: any) => 
      apiRequest(`/api/admin/labs/${labData.id}/update`, {
        method: 'PUT',
        body: JSON.stringify(labData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labs'] });
      setEditingLab(null);
      toast({
        title: 'Lab updated',
        description: 'Lab has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const deleteLabMutation = useMutation({
    mutationFn: (labId: number) => 
      apiRequest(`/api/admin/labs/${labId}/delete`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labs'] });
      toast({
        title: 'Lab deleted',
        description: 'Lab has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const labData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      difficulty: formData.get('difficulty') as string,
      xpReward: parseInt(formData.get('xpReward') as string),
      videoUrl: formData.get('videoUrl') as string || undefined,
    };
    
    createLabMutation.mutate(labData);
  };
  
  const handleUpdateLab = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const labData = {
      id: editingLab.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      difficulty: formData.get('difficulty') as string,
      xpReward: parseInt(formData.get('xpReward') as string),
      videoUrl: formData.get('videoUrl') as string || undefined,
    };
    
    updateLabMutation.mutate(labData);
  };
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lab Management</CardTitle>
            <CardDescription>Create and manage learning labs</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Lab
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labs?.map((lab: any) => (
                <Card key={lab.id} className="bg-gray-900 border border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lab.title}</CardTitle>
                      <Badge className="ml-2">
                        {lab.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400">XP Reward: {lab.xpReward}</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setEditingLab(lab)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the lab. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteLabMutation.mutate(lab.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create Lab Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Lab</CardTitle>
              <CardDescription>Add a new learning lab to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="create-lab-form" onSubmit={handleCreateLab}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea id="content" name="content" rows={8} required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue="beginner">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="xpReward">XP Reward</Label>
                    <Input id="xpReward" name="xpReward" type="number" min="1" defaultValue="100" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                    <Input id="videoUrl" name="videoUrl" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" form="create-lab-form">
                Create Lab
                {createLabMutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Edit Lab Modal */}
      {editingLab && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Lab</CardTitle>
              <CardDescription>Update lab details</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="edit-lab-form" onSubmit={handleUpdateLab}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input 
                      id="edit-title" 
                      name="title" 
                      defaultValue={editingLab.title} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      name="description" 
                      defaultValue={editingLab.description} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-content">Content (Markdown)</Label>
                    <Textarea 
                      id="edit-content" 
                      name="content" 
                      rows={8} 
                      defaultValue={editingLab.content} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue={editingLab.difficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-xpReward">XP Reward</Label>
                    <Input 
                      id="edit-xpReward" 
                      name="xpReward" 
                      type="number" 
                      min="1" 
                      defaultValue={editingLab.xpReward} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-videoUrl">Video URL (Optional)</Label>
                    <Input 
                      id="edit-videoUrl" 
                      name="videoUrl" 
                      defaultValue={editingLab.videoUrl || ""} 
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingLab(null)}>
                Cancel
              </Button>
              <Button type="submit" form="edit-lab-form">
                Save Changes
                {updateLabMutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

// PROJECT MANAGEMENT COMPONENT
const ProjectManagement: React.FC = () => {
  // Similar to LabManagement but for projects
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Create and manage projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">Project management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

// BADGE MANAGEMENT COMPONENT
const BadgeManagement: React.FC = () => {
  // Similar to LabManagement but for badges
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Badge Management</CardTitle>
          <CardDescription>Create and manage achievement badges</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">Badge management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

// FORUM MANAGEMENT COMPONENT
const ForumManagement: React.FC = () => {
  // Similar to other management components but for forum content
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Forum Management</CardTitle>
          <CardDescription>Moderate and manage forum posts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">Forum management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;