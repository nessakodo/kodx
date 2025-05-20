import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { StarIcon, GitForkIcon, PlayIcon, BookOpenIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { XPRing } from "@/components/ui/xp-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ReactMarkdown from 'react-markdown';

interface Task {
  id: string;
  description: string;
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");

  // Fetch project details
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  // Fetch user's progress for this project
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: [`/api/dashboard`],
    enabled: !!isAuthenticated && !!id,
  });

  // Fetch markdown content
  useEffect(() => {
    if (project && project.content) {
      // In a real implementation, we would fetch the markdown file
      // For now, we'll use a placeholder
      setMarkdownContent(`
# ${project.title}

${project.description}

## Getting Started

1. Fork the repository to your own GitHub account
2. Clone the repository to your local machine
3. Install the dependencies
4. Start working on the project tasks

## Project Tasks

${getTasksFromProject(project).map(task => `- ${task.description}`).join('\n')}

## Resources

- [GitHub Repository](${project.repoUrl})
- [Documentation](#)
      `);
    }
  }, [project]);

  // Mock function to extract tasks from project data
  const getTasksFromProject = (project: any) => {
    // In a real implementation, tasks would come from the API
    return [
      { id: "task1", description: "Fork the repository" },
      { id: "task2", description: "Clone the project locally" },
      { id: "task3", description: "Complete the core functionality" },
      { id: "task4", description: "Add tests for your implementation" },
      { id: "task5", description: "Submit a pull request" }
    ];
  };

  // Initialize project progress
  useEffect(() => {
    if (progress && progress.projectProgress) {
      const projectProgress = progress.projectProgress.find(
        (p: any) => p.project.id === parseInt(id as string)
      );
      
      if (projectProgress) {
        setNotes(projectProgress.progress.notes || "");
        setCompletedTasks(projectProgress.progress.completedTasks || []);
      }
    }
  }, [progress, id]);

  // Complete project mutation
  const completeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/projects/${id}/complete`, {}),
    onSuccess: () => {
      toast({
        title: "Project completed!",
        description: `You've earned ${project?.xpReward} XP!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: { notes?: string; completedTasks?: string[] }) => 
      apiRequest("POST", `/api/projects/${id}/progress`, data),
    onSuccess: () => {
      toast({
        title: "Progress updated",
        description: "Your progress has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate progress percentage
  const calculateProgress = () => {
    const tasks = getTasksFromProject(project);
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  };

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(updatedTasks);
    updateProgressMutation.mutate({ completedTasks: updatedTasks });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    updateProgressMutation.mutate({ notes });
  };

  const handleCompleteProject = () => {
    completeMutation.mutate();
  };

  // Get user progress for this project
  const userProjectProgress = progress?.projectProgress?.find(
    (p: any) => p.project.id === parseInt(id as string)
  );

  const isCompleted = userProjectProgress?.progress.isCompleted;

  if (isProjectLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="md:w-1/3">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-orbitron mb-4">Project Not Found</h2>
        <p className="text-gray-500 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/projects">Back to Projects</a>
        </Button>
      </div>
    );
  }

  const tasks = getTasksFromProject(project);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <GlassmorphicCard className="mb-8 overflow-hidden">
            {/* Project header */}
            <div className="relative h-56 bg-[#1e2535]">
              {project.videoUrl ? (
                <iframe 
                  className="w-full h-full"
                  src={project.videoUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1629654297299-c8506221ca97" 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                    >
                      <PlayIcon className="h-8 w-8 text-white" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Project info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-orbitron mb-2">{project.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#1e2535]/80 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <StarIcon className="h-3 w-3 text-[#9ecfff]" /> {project.xpReward} XP
                    </Badge>
                    <Badge 
                      className={`text-xs uppercase tracking-wider bg-gradient-to-r from-[#b166ff]/10 to-[#9ecfff]/10 px-2 py-1 rounded border border-[#b166ff]/20`}
                    >
                      {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <a 
                  href={project.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#1e2535]/80 border border-[#88c9b7]/30 rounded-lg hover:bg-[#1e2535] transition-colors"
                >
                  <GitForkIcon className="h-4 w-4 text-[#88c9b7]" />
                  <span className="text-[#88c9b7]">Fork Repository</span>
                </a>
              </div>

              <p className="text-gray-400 mb-6">{project.description}</p>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content" className="font-orbitron">Project Content</TabsTrigger>
                  <TabsTrigger value="notes" className="font-orbitron">Your Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-pre:bg-[#1e2535] prose-pre:border prose-pre:border-[#9ecfff]/20 prose-code:text-[#9ecfff] prose-headings:font-orbitron">
                    <ReactMarkdown>
                      {markdownContent}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  {isAuthenticated ? (
                    <>
                      <Textarea 
                        placeholder="Write your notes here..."
                        className="min-h-[200px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                        value={notes}
                        onChange={handleNotesChange}
                      />
                      <Button 
                        className="mt-4 bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        onClick={handleSaveNotes}
                        disabled={updateProgressMutation.isPending}
                      >
                        {updateProgressMutation.isPending ? "Saving..." : "Save Notes"}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpenIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                      <h3 className="text-xl font-orbitron mb-2">Sign In to Take Notes</h3>
                      <p className="text-gray-500 mb-4">Track your progress and take notes as you work through this project.</p>
                      <Button asChild>
                        <a href="/api/login">Sign In</a>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <GlassmorphicCard className="sticky top-24 overflow-hidden">
            <div className="p-6 border-b border-[#9ecfff]/10">
              <h3 className="font-orbitron text-white text-lg mb-4 uppercase">Project Tasks</h3>
              
              {isAuthenticated ? (
                <>
                  <div className="space-y-4 mb-6">
                    {tasks.map((task) => (
                      <div className="flex items-center" key={task.id}>
                        <Checkbox 
                          id={task.id} 
                          className="border-[#9ecfff]/50 text-[#9ecfff] data-[state=checked]:bg-[#9ecfff]" 
                          checked={completedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          disabled={isCompleted || !isAuthenticated}
                        />
                        <label 
                          htmlFor={task.id} 
                          className={`ml-2 text-sm ${completedTasks.includes(task.id) ? 'text-gray-500 line-through' : 'text-gray-300'}`}
                        >
                          {task.description}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <XPRing percentage={calculateProgress()} size="md" className="mr-4" />
                    
                    <div>
                      <div className="text-sm text-gray-500">Completion</div>
                      {isCompleted ? (
                        <div>
                          <span className="text-[#5cdc96] font-semibold">{project.xpReward} XP</span>
                          <span className="text-gray-500 text-sm"> earned</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[#9ecfff] font-semibold">0 XP</span>
                          <span className="text-gray-500 text-sm"> / {project.xpReward} XP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Sign in to track your progress and earn XP.</p>
                  <Button asChild>
                    <a href="/api/login">Sign In</a>
                  </Button>
                </div>
              )}
            </div>
            
            {isAuthenticated && (
              <div className="p-6">
                <Button 
                  className="w-full py-3 h-auto bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30 font-medium"
                  onClick={handleCompleteProject}
                  disabled={completeMutation.isPending || isCompleted || completedTasks.length < tasks.length}
                >
                  {isCompleted 
                    ? "Project Completed ✓" 
                    : completeMutation.isPending 
                      ? "Completing..." 
                      : completedTasks.length < tasks.length 
                        ? "Complete All Tasks First" 
                        : "Complete Project"}
                </Button>
                
                {isCompleted && (
                  <div className="mt-4 p-3 bg-[#5cdc96]/10 border border-[#5cdc96]/30 rounded-lg text-center">
                    <p className="text-[#5cdc96] text-sm">
                      Congratulations! You've completed this project and earned {project.xpReward} XP.
                    </p>
                  </div>
                )}
              </div>
            )}
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}
