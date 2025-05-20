import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RepoLinkEditor } from "@/components/projects/RepoLinkEditor";
import { 
  GithubIcon, 
  PlayCircleIcon, 
  CheckCircleIcon, 
  CodeIcon,
  ClipboardIcon,
  StarIcon,
  BookmarkIcon,
  ClockIcon
} from "lucide-react";

interface Task {
  id: string;
  description: string;
}

interface VideoTimestamp {
  time: string;
  title: string;
}

interface Repository {
  fork_url: string;
  cta: string;
}

export function ProjectDetail() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  // Mock project data - would come from API in real implementation
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["/api/projects/1"],
    // This would be replaced with real API data
    initialData: {
      id: "proj-password-manager",
      title: "Build Your Own Password Manager",
      level: "Beginner",
      xp_reward: 40,
      description: "Create a local password manager app using JavaScript, secure storage patterns, and a minimal UI with encryption best practices.",
      objectives: {
        overview: [
          "Build a user-friendly password entry interface",
          "Securely store and retrieve credentials using localStorage or IndexedDB",
          "Enable clipboard copy and password visibility toggle",
          "Implement save/load/delete logic with clean UI feedback"
        ]
      },
      video: {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamps: [
          { time: "00:00", title: "Project Intro" },
          { time: "01:25", title: "Setting up HTML/CSS" },
          { time: "05:40", title: "JavaScript encryption logic" },
          { time: "12:10", title: "UI hooks and button interactions" },
          { time: "18:45", title: "Finishing touches" }
        ]
      },
      tasks: [
        "Set up base HTML and CSS structure",
        "Add form inputs for site/account and password fields",
        "Use Web Crypto API or a JS library to encrypt password data",
        "Store and retrieve encrypted data using localStorage or IndexedDB",
        "Implement copy-to-clipboard and password visibility toggle",
        "Style the interface with dark theme and finalize layout",
        "Deploy the finished version to GitHub Pages"
      ],
      repository: {
        fork_url: "https://github.com/nessakodo/password-manager-starter",
        cta: "Fork this starter repo to begin your build."
      }
    }
  });
  
  const toggleTaskCompletion = (taskIndex: number) => {
    const taskId = `task-${taskIndex}`;
    
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const saveNotes = () => {
    // In a real app, this would save to the API/backend
    // For now, we'll just show a success message
    alert("Notes saved successfully!");
  };
  
  const progress = project ? Math.round((completedTasks.length / project.tasks.length) * 100) : 0;
  const isCompleted = project && completedTasks.length === project.tasks.length;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96 md:col-span-1" />
        </div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="text-center py-16">
        <div className="h-16 w-16 mx-auto text-[#ff5c5c] mb-6">
          <CodeIcon className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-orbitron mb-4">Project Not Found</h2>
        <p className="text-gray-500 mb-8">We couldn't find the project you're looking for.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-orbitron text-white mb-2">{project.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="bg-transparent text-[#6fcf97] border border-[#6fcf97]/30">
              {project.level}
            </Badge>
            <div className="flex items-center gap-1 text-[#9ecfff]">
              <StarIcon className="h-4 w-4" />
              <span>{project.xp_reward} XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <a 
            href={project.repository.fork_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#1e2535]/70 border border-[#9ecfff]/20 text-white hover:bg-[#1e2535] hover:border-[#9ecfff]/40 transition-all"
          >
            <GithubIcon className="h-4 w-4" />
            Fork Repository
          </a>
          
          <Button 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded ${
              isCompleted 
                ? "bg-[#6fcf97]/20 text-[#6fcf97] border border-[#6fcf97]/40" 
                : "bg-[#1e2535]/70 border border-[#9ecfff]/20 text-white hover:bg-[#1e2535] hover:border-[#9ecfff]/40"
            }`}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                <PlayCircleIcon className="h-4 w-4" />
                {completedTasks.length > 0 ? "Continue Project" : "Start Project"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full bg-[#1e293b]/30">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="video"
                className="data-[state=active]:bg-[#1e2535]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#9ecfff]"
              >
                Tutorial Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <GlassmorphicCard className="p-6">
                <h2 className="text-xl font-orbitron mb-4">Project Description</h2>
                <p className="text-gray-400 mb-6">{project.description}</p>
                
                <h3 className="text-lg font-medium mb-3">Objectives</h3>
                <ul className="list-disc pl-5 mb-6 space-y-2">
                  {project.objectives.overview.map((objective, index) => (
                    <li key={index} className="text-gray-400">{objective}</li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-medium mb-3">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#9ecfff]/20 flex items-center justify-center text-[#9ecfff]">
                      <ClipboardIcon className="h-3 w-3" />
                    </div>
                    <span className="text-gray-400">Secure data storage techniques</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#9ecfff]/20 flex items-center justify-center text-[#9ecfff]">
                      <ClipboardIcon className="h-3 w-3" />
                    </div>
                    <span className="text-gray-400">Browser encryption APIs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#9ecfff]/20 flex items-center justify-center text-[#9ecfff]">
                      <ClipboardIcon className="h-3 w-3" />
                    </div>
                    <span className="text-gray-400">Modern form handling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#9ecfff]/20 flex items-center justify-center text-[#9ecfff]">
                      <ClipboardIcon className="h-3 w-3" />
                    </div>
                    <span className="text-gray-400">Responsive UI design</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="text-lg font-medium mb-3">Repository Information</h3>
                  <p className="text-gray-400 mb-4">{project.repository.cta}</p>
                  <a 
                    href={project.repository.fork_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#1e2535]/70 border border-[#9ecfff]/20 text-white hover:bg-[#1e2535] hover:border-[#9ecfff]/40 transition-all text-sm"
                  >
                    <GithubIcon className="h-4 w-4" />
                    View Starter Repository
                  </a>
                </div>
              </GlassmorphicCard>
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <GlassmorphicCard className="p-6">
                <div className="aspect-video bg-black mb-6 flex items-center justify-center">
                  <iframe 
                    src={project.video.url.replace('watch?v=', 'embed/')}
                    title={`${project.title} Tutorial Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Video Timestamps</h3>
                <div className="space-y-2">
                  {project.video.timestamps.map((timestamp, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-[#1e293b]/50 cursor-pointer transition-colors"
                    >
                      <ClockIcon className="h-4 w-4 text-[#9ecfff]" />
                      <span className="text-[#9ecfff] font-mono">{timestamp.time}</span>
                      <span className="text-gray-400">{timestamp.title}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
          
          {/* Project notes section */}
          <GlassmorphicCard className="p-6">
            <h2 className="text-xl font-orbitron mb-4">Project Notes</h2>
            <p className="text-gray-400 mb-4">
              Capture your insights, issues, and reflections as you go. Your notes will be saved and suggested for your devlog on completion.
            </p>
            <Textarea 
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write your project notes here..."
              className="bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50 min-h-[150px] mb-4"
            />
            <Button 
              onClick={saveNotes}
              className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Save Notes
            </Button>
          </GlassmorphicCard>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <GlassmorphicCard className="p-6 sticky top-24">
            <h2 className="text-xl font-orbitron mb-4">Your Progress</h2>
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">{completedTasks.length} of {project.tasks.length} tasks</span>
                  <span className="text-[#9ecfff]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#9ecfff] to-[#6fcf97] rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {project.tasks.map((task, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      id={`task-${index}`}
                      checked={completedTasks.includes(`task-${index}`)}
                      onChange={() => toggleTaskCompletion(index)}
                      className="kodex-checkbox mt-1"
                    />
                    <label 
                      htmlFor={`task-${index}`}
                      className={`text-sm cursor-pointer ${
                        completedTasks.includes(`task-${index}`) 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-300'
                      }`}
                    >
                      {task}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Repository Link Section */}
              <div className="border-t border-[#1e293b] mt-6 pt-6">
                <RepoLinkEditor 
                  projectId={project.id} 
                  initialRepoUrl={project.repository?.fork_url} 
                />
              </div>
              
              {isCompleted && (
                <div className="text-center p-4 bg-[#6fcf97]/10 border border-[#6fcf97]/30 rounded-lg mt-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6fcf97]/20 mb-2">
                    <CheckCircleIcon className="h-6 w-6 text-[#6fcf97]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#6fcf97] mb-1">Project Completed!</h3>
                  <p className="text-sm text-gray-400">
                    You've earned {project.xp_reward} XP. Would you like to publish your devlog to the forum?
                  </p>
                  <Button className="mt-3 bg-[#6fcf97]/20 text-[#6fcf97] border border-[#6fcf97]/40 hover:bg-[#6fcf97]/30">
                    Publish Devlog
                  </Button>
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}