import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  GitFork, 
  Award, 
  MessageSquare,
  Users,
  Trash,
  Edit,
  Plus
} from "lucide-react";

export function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("labs");
  
  // Forms state
  const [newLab, setNewLab] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    difficulty: "beginner",
    xpReward: 250,
    timestamps: {}
  });
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    content: "",
    repoUrl: "",
    videoUrl: "",
    difficulty: "beginner",
    xpReward: 400,
    timestamps: {}
  });
  
  const [newBadge, setNewBadge] = useState({
    name: "",
    description: "",
    iconUrl: "",
    unlockCriteria: { type: "xp", value: 1000 }
  });

  // Query data
  const { data: labs, isLoading: isLabsLoading } = useQuery({
    queryKey: ["/api/labs"],
  });
  
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });
  
  const { data: badges, isLoading: isBadgesLoading } = useQuery({
    queryKey: ["/api/badges"],
  });
  
  const { data: forumPosts, isLoading: isForumLoading } = useQuery({
    queryKey: ["/api/forum-posts"],
  });

  // Mutations
  const createLabMutation = useMutation({
    mutationFn: (data: typeof newLab) => apiRequest("POST", "/api/admin/labs", data),
    onSuccess: () => {
      toast({
        title: "Lab created",
        description: "The lab has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/labs"] });
      setNewLab({
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        difficulty: "beginner",
        xpReward: 250,
        timestamps: {}
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lab. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const createProjectMutation = useMutation({
    mutationFn: (data: typeof newProject) => apiRequest("POST", "/api/admin/projects", data),
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "The project has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setNewProject({
        title: "",
        description: "",
        content: "",
        repoUrl: "",
        videoUrl: "",
        difficulty: "beginner",
        xpReward: 400,
        timestamps: {}
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const createBadgeMutation = useMutation({
    mutationFn: (data: typeof newBadge) => apiRequest("POST", "/api/admin/badges", data),
    onSuccess: () => {
      toast({
        title: "Badge created",
        description: "The badge has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      setNewBadge({
        name: "",
        description: "",
        iconUrl: "",
        unlockCriteria: { type: "xp", value: 1000 }
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create badge. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const deletePostMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/forum-posts/${id}`, {}),
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The forum post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forum-posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLabMutation.mutate(newLab);
  };
  
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(newProject);
  };
  
  const handleBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBadgeMutation.mutate(newBadge);
  };
  
  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="font-orbitron text-3xl md:text-4xl tracking-wider mb-6 text-center uppercase">
        <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent drop-shadow-glow">
          KODΞX
        </span> Admin Panel
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-5 max-w-4xl mx-auto">
          <TabsTrigger value="labs" className="font-orbitron flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Labs
          </TabsTrigger>
          <TabsTrigger value="projects" className="font-orbitron flex items-center gap-1">
            <GitFork className="h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="badges" className="font-orbitron flex items-center gap-1">
            <Award className="h-4 w-4" /> Badges
          </TabsTrigger>
          <TabsTrigger value="forum" className="font-orbitron flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> Forum
          </TabsTrigger>
          <TabsTrigger value="users" className="font-orbitron flex items-center gap-1">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          {/* Labs Tab */}
          <TabsContent value="labs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create New Lab Form */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-[#9ecfff]" /> Create New Lab
                  </h2>
                  
                  <form onSubmit={handleLabSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="lab-title" className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <Input
                          id="lab-title"
                          placeholder="Lab title"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newLab.title}
                          onChange={(e) => setNewLab({ ...newLab, title: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lab-description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea
                          id="lab-description"
                          placeholder="Lab description"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newLab.description}
                          onChange={(e) => setNewLab({ ...newLab, description: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lab-content" className="block text-sm font-medium mb-1">
                          Content Path (Markdown)
                        </label>
                        <Input
                          id="lab-content"
                          placeholder="Path to markdown file (e.g., labs/secure-coding.md)"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newLab.content}
                          onChange={(e) => setNewLab({ ...newLab, content: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lab-video" className="block text-sm font-medium mb-1">
                          Video URL
                        </label>
                        <Input
                          id="lab-video"
                          placeholder="YouTube video URL"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newLab.videoUrl}
                          onChange={(e) => setNewLab({ ...newLab, videoUrl: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lab-difficulty" className="block text-sm font-medium mb-1">
                            Difficulty
                          </label>
                          <Select
                            value={newLab.difficulty}
                            onValueChange={(value) => setNewLab({ ...newLab, difficulty: value })}
                          >
                            <SelectTrigger className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus:ring-[#9ecfff]/50">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label htmlFor="lab-xp" className="block text-sm font-medium mb-1">
                            XP Reward
                          </label>
                          <Input
                            id="lab-xp"
                            type="number"
                            className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                            value={newLab.xpReward}
                            onChange={(e) => setNewLab({ ...newLab, xpReward: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        disabled={createLabMutation.isPending}
                      >
                        {createLabMutation.isPending ? "Creating..." : "Create Lab"}
                      </Button>
                    </div>
                  </form>
                </div>
              </GlassmorphicCard>
              
              {/* Existing Labs List */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-[#9ecfff]" /> Existing Labs
                  </h2>
                  
                  {isLabsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse h-12 w-12 mx-auto rounded-full bg-[#9ecfff]/20 mb-4" />
                      <p className="text-gray-500">Loading labs...</p>
                    </div>
                  ) : labs && labs.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {labs.map((lab: any) => (
                        <div key={lab.id} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{lab.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{lab.description.substring(0, 60)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#ff5c5c]">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <div className="text-xs py-0.5 px-1.5 bg-[#9ecfff]/10 text-[#9ecfff] rounded">
                              {lab.difficulty}
                            </div>
                            <div className="text-xs py-0.5 px-1.5 bg-[#5cdc96]/10 text-[#5cdc96] rounded">
                              {lab.xpReward} XP
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-500">No labs created yet. Create your first lab.</p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </div>
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create New Project Form */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-[#9ecfff]" /> Create New Project
                  </h2>
                  
                  <form onSubmit={handleProjectSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="project-title" className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <Input
                          id="project-title"
                          placeholder="Project title"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="project-description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea
                          id="project-description"
                          placeholder="Project description"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="project-content" className="block text-sm font-medium mb-1">
                          Content Path (Markdown)
                        </label>
                        <Input
                          id="project-content"
                          placeholder="Path to markdown file (e.g., projects/crypto-tools.md)"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newProject.content}
                          onChange={(e) => setNewProject({ ...newProject, content: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="project-repo" className="block text-sm font-medium mb-1">
                          Repository URL
                        </label>
                        <Input
                          id="project-repo"
                          placeholder="GitHub repository URL"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newProject.repoUrl}
                          onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="project-video" className="block text-sm font-medium mb-1">
                          Video URL (Optional)
                        </label>
                        <Input
                          id="project-video"
                          placeholder="YouTube video URL"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newProject.videoUrl}
                          onChange={(e) => setNewProject({ ...newProject, videoUrl: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="project-difficulty" className="block text-sm font-medium mb-1">
                            Difficulty
                          </label>
                          <Select
                            value={newProject.difficulty}
                            onValueChange={(value) => setNewProject({ ...newProject, difficulty: value })}
                          >
                            <SelectTrigger className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus:ring-[#9ecfff]/50">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label htmlFor="project-xp" className="block text-sm font-medium mb-1">
                            XP Reward
                          </label>
                          <Input
                            id="project-xp"
                            type="number"
                            className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                            value={newProject.xpReward}
                            onChange={(e) => setNewProject({ ...newProject, xpReward: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        disabled={createProjectMutation.isPending}
                      >
                        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                      </Button>
                    </div>
                  </form>
                </div>
              </GlassmorphicCard>
              
              {/* Existing Projects List */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <GitFork className="mr-2 h-5 w-5 text-[#9ecfff]" /> Existing Projects
                  </h2>
                  
                  {isProjectsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse h-12 w-12 mx-auto rounded-full bg-[#9ecfff]/20 mb-4" />
                      <p className="text-gray-500">Loading projects...</p>
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {projects.map((project: any) => (
                        <div key={project.id} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{project.description.substring(0, 60)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#ff5c5c]">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <div className="text-xs py-0.5 px-1.5 bg-[#9ecfff]/10 text-[#9ecfff] rounded">
                              {project.difficulty}
                            </div>
                            <div className="text-xs py-0.5 px-1.5 bg-[#5cdc96]/10 text-[#5cdc96] rounded">
                              {project.xpReward} XP
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GitFork className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-500">No projects created yet. Create your first project.</p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </div>
          </TabsContent>
          
          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create New Badge Form */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <Plus className="mr-2 h-5 w-5 text-[#9ecfff]" /> Create New Badge
                  </h2>
                  
                  <form onSubmit={handleBadgeSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="badge-name" className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          id="badge-name"
                          placeholder="Badge name"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newBadge.name}
                          onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="badge-description" className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea
                          id="badge-description"
                          placeholder="Badge description"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newBadge.description}
                          onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="badge-icon" className="block text-sm font-medium mb-1">
                          Icon URL
                        </label>
                        <Input
                          id="badge-icon"
                          placeholder="Badge icon URL"
                          className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                          value={newBadge.iconUrl}
                          onChange={(e) => setNewBadge({ ...newBadge, iconUrl: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Unlock Criteria
                        </label>
                        <div className="flex gap-4 mb-2">
                          <Select
                            value={newBadge.unlockCriteria.type}
                            onValueChange={(value) => setNewBadge({
                              ...newBadge,
                              unlockCriteria: { ...newBadge.unlockCriteria, type: value }
                            })}
                          >
                            <SelectTrigger className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus:ring-[#9ecfff]/50">
                              <SelectValue placeholder="Select criteria type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="xp">Total XP</SelectItem>
                              <SelectItem value="labs">Labs Completed</SelectItem>
                              <SelectItem value="projects">Projects Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input
                            type="number"
                            className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                            value={newBadge.unlockCriteria.value}
                            onChange={(e) => setNewBadge({
                              ...newBadge,
                              unlockCriteria: {
                                ...newBadge.unlockCriteria,
                                value: parseInt(e.target.value) || 0
                              }
                            })}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {newBadge.unlockCriteria.type === "xp" 
                            ? `Unlocks when user earns ${newBadge.unlockCriteria.value} XP`
                            : newBadge.unlockCriteria.type === "labs"
                            ? `Unlocks when user completes ${newBadge.unlockCriteria.value} labs`
                            : `Unlocks when user completes ${newBadge.unlockCriteria.value} projects`}
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        disabled={createBadgeMutation.isPending}
                      >
                        {createBadgeMutation.isPending ? "Creating..." : "Create Badge"}
                      </Button>
                    </div>
                  </form>
                </div>
              </GlassmorphicCard>
              
              {/* Existing Badges List */}
              <GlassmorphicCard>
                <div className="p-6">
                  <h2 className="font-orbitron text-xl mb-6 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-[#9ecfff]" /> Existing Badges
                  </h2>
                  
                  {isBadgesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse h-12 w-12 mx-auto rounded-full bg-[#9ecfff]/20 mb-4" />
                      <p className="text-gray-500">Loading badges...</p>
                    </div>
                  ) : badges && badges.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                      {badges.map((badge: any) => (
                        <div key={badge.id} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10 flex flex-col items-center">
                          <div className="w-16 h-16 mb-2 bg-gradient-to-br from-[#9ecfff]/10 to-[#88c9b7]/10 border border-[#9ecfff]/20 rounded-full flex items-center justify-center">
                            <img
                              src={badge.iconUrl || `https://api.dicebear.com/6.x/shapes/svg?seed=${badge.name}`}
                              alt={badge.name}
                              className="w-10 h-10"
                            />
                          </div>
                          <h3 className="text-sm font-medium text-center">{badge.name}</h3>
                          <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
                          
                          <div className="flex gap-2 mt-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-[#ff5c5c]">
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-500">No badges created yet. Create your first badge.</p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </div>
          </TabsContent>
          
          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <GlassmorphicCard>
              <div className="p-6">
                <h2 className="font-orbitron text-xl mb-6 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-[#9ecfff]" /> Forum Management
                </h2>
                
                {isForumLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse h-12 w-12 mx-auto rounded-full bg-[#9ecfff]/20 mb-4" />
                    <p className="text-gray-500">Loading forum posts...</p>
                  </div>
                ) : forumPosts && forumPosts.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {forumPosts.map((post: any) => (
                      <div key={post.id} className="bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span>by {post.user.username}</span>
                              <span className="mx-2">•</span>
                              <div className={`text-xs px-2 py-0.5 rounded ${
                                post.category === "question" 
                                  ? "bg-[#9ecfff]/10 text-[#9ecfff]" 
                                  : post.category === "devlog"
                                  ? "bg-[#b166ff]/10 text-[#b166ff]"
                                  : "bg-[#88c9b7]/10 text-[#88c9b7]"
                              }`}>
                                {post.category}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                            >
                              {post.isPinned ? "Unpin" : "Pin"}
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-[#ff5c5c] hover:text-white hover:bg-[#ff5c5c]/80"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{post.content.substring(0, 100)}...</p>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{post.likes} likes</span>
                          <span className="mx-2">•</span>
                          <span>{post.commentsCount || 0} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-500">No forum posts yet.</p>
                  </div>
                )}
              </div>
            </GlassmorphicCard>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <GlassmorphicCard>
              <div className="p-6">
                <h2 className="font-orbitron text-xl mb-6 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-[#9ecfff]" /> User Management
                </h2>
                
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-500">User management is coming soon.</p>
                </div>
              </div>
            </GlassmorphicCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
