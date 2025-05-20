import { useState, useRef, useEffect } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { GlassmorphicButton } from "@/components/ui/glassmorphic-button";
import { Badge } from "@/components/ui/badge";
import { 
  GithubIcon, 
  PlayCircleIcon, 
  ClockIcon, 
  StarIcon, 
  CheckIcon, 
  PencilIcon,
  MessageSquarePlusIcon,
  ArrowLeft,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { XPRing } from "@/components/ui/xp-ring";

interface ProjectDetailProps {
  id: string | number;
}

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface Timestamp {
  time: string;
  title: string;
}

interface ProjectData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  repoUrl: string;
  videoUrl?: string;
  timestamps?: Timestamp[];
  tasks: Task[];
  content?: string;
}

export function ProjectDetail({ id }: ProjectDetailProps) {
  const { isAuthenticated, user } = useAuth();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Fetch project data
  useEffect(() => {
    // This would be an API call in a real app
    // For now, we'll use mock data
    const mockProject: ProjectData = {
      id: typeof id === "string" ? parseInt(id) : id,
      title: "Build Your Own Password Manager",
      description: "Create a local password manager app using JavaScript, secure storage patterns, and a minimal UI with encryption best practices.",
      difficulty: "beginner",
      xpReward: 40,
      repoUrl: "https://github.com/nessakodo/password-manager-starter",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      timestamps: [
        { time: "00:00", title: "Project Intro" },
        { time: "01:25", title: "Setting up HTML/CSS" },
        { time: "05:40", title: "JavaScript encryption logic" },
        { time: "12:10", title: "UI hooks and button interactions" },
        { time: "18:45", title: "Finishing touches" }
      ],
      tasks: [
        { id: "task-1", description: "Set up base HTML and CSS structure", completed: false },
        { id: "task-2", description: "Add form inputs for site/account and password fields", completed: false },
        { id: "task-3", description: "Use Web Crypto API or a JS library to encrypt password data", completed: false },
        { id: "task-4", description: "Store and retrieve encrypted data using localStorage or IndexedDB", completed: false },
        { id: "task-5", description: "Implement copy-to-clipboard and password visibility toggle", completed: false },
        { id: "task-6", description: "Style the interface with dark theme and finalize layout", completed: false },
        { id: "task-7", description: "Deploy the finished version to GitHub Pages", completed: false }
      ],
      content: `
# Build Your Own Password Manager

Create a local password manager app using JavaScript, secure storage patterns, and a minimal UI with encryption best practices.

## Project Overview

This project will guide you through building a password manager application that runs locally in your browser. You'll learn about:

- Secure credential storage using the Web Crypto API
- LocalStorage or IndexedDB for persistent data
- UI/UX considerations for security applications
- Basic encryption principles

## Getting Started

1. Fork the starter repo using the GitHub button above
2. Clone it to your local machine
3. Follow the video tutorial for step-by-step guidance
      `
    };
    
    setProjectData(mockProject);
    setTasks(mockProject.tasks);
  }, [id]);
  
  // Calculate completed tasks
  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    setCompletedTasks(completed);
    setIsCompleted(completed === tasks.length && tasks.length > 0);
  }, [tasks]);
  
  // Handle task toggling
  const handleTaskToggle = (taskId: string) => {
    if (!isAuthenticated) return;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  // Handle project completion
  const handleProjectComplete = () => {
    if (!isAuthenticated || !isCompleted) return;
    setShowCompletionModal(true);
  };
  
  // Jump to timestamp in video
  const jumpToTimestamp = (timestamp: string) => {
    if (!videoRef.current) return;
    
    const [minutes, seconds] = timestamp.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    // Set the current time of the iframe
    // This assumes the iframe API supports this method
    if (videoRef.current.contentWindow) {
      videoRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [totalSeconds, true]
        }),
        '*'
      );
    }
  };
  
  // Define difficulty badge styling
  const difficultyColors = {
    beginner: {
      border: "border-[#6fcf97]/30",
      text: "text-[#6fcf97]",
      label: "Beginner"
    },
    intermediate: {
      border: "border-[#56ccf2]/30",
      text: "text-[#56ccf2]",
      label: "Intermediate"
    },
    advanced: {
      border: "border-[#bb86fc]/30",
      text: "text-[#bb86fc]",
      label: "Advanced"
    }
  };
  
  if (!projectData) {
    return (
      <div className="py-12 flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-orbitron text-white mb-4">Loading Project...</h2>
        <div className="animate-pulse w-8 h-8 rounded-full bg-[#9ecfff]/20"></div>
      </div>
    );
  }
  
  const difficultyStyle = difficultyColors[projectData.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;
  
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="mb-6 flex items-center gap-2">
        <a href="/projects" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </a>
        <h1 className="font-orbitron text-3xl text-white">{projectData.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Section */}
          <GlassmorphicCard className="p-6 space-y-4">
            <h2 className="font-orbitron text-xl text-white flex items-center gap-2">
              <PlayCircleIcon className="h-5 w-5 text-[#9ecfff]" /> Video Walkthrough
            </h2>
            
            <div className="aspect-video bg-black/50 rounded-lg overflow-hidden">
              {projectData.videoUrl ? (
                <iframe 
                  ref={videoRef}
                  src={`${projectData.videoUrl}?enablejsapi=1`} 
                  title={`${projectData.title} video walkthrough`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">No video available</p>
                </div>
              )}
            </div>
            
            {projectData.timestamps && projectData.timestamps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {projectData.timestamps.map((timestamp, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToTimestamp(timestamp.time)}
                    className="flex items-center justify-between p-2 bg-[#1e2535]/50 rounded border border-[#1e2535] hover:border-[#9ecfff]/30 transition-all"
                  >
                    <span className="text-gray-300">{timestamp.title}</span>
                    <span className="text-[#9ecfff] text-sm font-mono">{timestamp.time}</span>
                  </button>
                ))}
              </div>
            )}
          </GlassmorphicCard>
          
          {/* Project Content */}
          <GlassmorphicCard className="p-6">
            <div className="prose prose-invert max-w-none">
              {projectData.content ? (
                <div dangerouslySetInnerHTML={{ __html: projectData.content.replace(/\n/g, '<br />') }} />
              ) : (
                <p>No content available</p>
              )}
            </div>
          </GlassmorphicCard>
        </div>
        
        <div className="space-y-6">
          {/* Project Info Card */}
          <GlassmorphicCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge 
                className={`text-xs uppercase tracking-wider bg-transparent px-2 py-1 rounded border ${difficultyStyle.border} ${difficultyStyle.text} font-orbitron letter-spacing-wide`}
              >
                {difficultyStyle.label}
              </Badge>
              
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-[#9ecfff]" />
                <span className="text-white">{projectData.xpReward} XP</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" /> Est. Time
                </span>
                <span className="text-white">2-3 hours</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1">
                  <CheckIcon className="h-4 w-4" /> Tasks
                </span>
                <span className="text-white">{completedTasks}/{tasks.length} completed</span>
              </div>
            </div>
            
            <div className="pt-2">
              <a 
                href={projectData.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full"
              >
                <GlassmorphicButton 
                  variant="default" 
                  className="w-full justify-center flex items-center gap-2"
                >
                  <GithubIcon className="h-4 w-4" /> Fork Project on GitHub
                </GlassmorphicButton>
              </a>
            </div>
          </GlassmorphicCard>
          
          {/* Tasks Section */}
          <GlassmorphicCard className="p-6 space-y-4">
            <h2 className="font-orbitron text-xl text-white">Project Tasks</h2>
            
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-3">Sign in to track your progress</p>
                <a href="/api/login">
                  <GlassmorphicButton variant="primary">Sign In</GlassmorphicButton>
                </a>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-md transition-all",
                        task.completed 
                          ? "border border-[#1e2535] opacity-70" 
                          : "border border-[#1e2535] hover:border-[#9ecfff]/20 bg-[#0f172a]/30"
                      )}
                    >
                      <div 
                        onClick={() => handleTaskToggle(task.id)}
                        className={cn(
                          "flex-shrink-0 w-5 h-5 rounded-sm border flex items-center justify-center cursor-pointer transition-all mt-0.5",
                          task.completed 
                            ? "border-[#4a5568]/50" 
                            : "border-[#4a5568]/50 hover:border-[#9ecfff]/50"
                        )}
                      >
                        {task.completed && (
                          <CheckIcon className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className={cn(
                        "text-sm",
                        task.completed ? "text-gray-500 line-through" : "text-gray-300"
                      )}>
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <GlassmorphicButton
                    variant={isCompleted ? "success" : "default"}
                    disabled={!isCompleted}
                    className="w-full justify-center"
                    onClick={handleProjectComplete}
                  >
                    {isCompleted ? "Complete Project" : `Complete All Tasks (${completedTasks}/${tasks.length})`}
                  </GlassmorphicButton>
                </div>
              </>
            )}
          </GlassmorphicCard>
          
          {/* Notes Section */}
          {isAuthenticated && (
            <GlassmorphicCard className="p-6 space-y-4">
              <h2 className="font-orbitron text-xl text-white flex items-center gap-2">
                <PencilIcon className="h-5 w-5 text-[#9ecfff]" /> Project Notes
              </h2>
              
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Take notes as you work on the project. These notes can be published as a devlog when you complete the project."
                className="w-full min-h-[200px] bg-[#0f172a]/50 text-white border border-[#1e2535] rounded-md p-3 focus:border-[#9ecfff]/30 focus:outline-none resize-y"
              />
              
              <div className="text-sm text-gray-400">
                Notes are saved automatically and can be used to create a devlog.
              </div>
            </GlassmorphicCard>
          )}
        </div>
      </div>
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <GlassmorphicCard className="w-full max-w-md p-8 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-[#6fcf97]/10 border border-[#6fcf97]/30 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-[#6fcf97]" />
              </div>
              <h2 className="font-orbitron text-2xl text-white">Project Completed!</h2>
              <p className="text-gray-400 mt-2">
                Congratulations! You've completed the {projectData.title} project and earned {projectData.xpReward} XP.
              </p>
              
              <div className="my-6">
                <XPRing 
                  percentage={100}
                  size="lg"
                  showValue={true}
                  currentValue={projectData.xpReward}
                  totalValue={projectData.xpReward}
                  pulseEffect={true}
                />
              </div>
              
              <div className="space-y-3 w-full pt-2">
                <GlassmorphicButton
                  variant="success"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => setShowCompletionModal(false)}
                >
                  <CheckIcon className="h-4 w-4" /> Claim XP Reward
                </GlassmorphicButton>
                
                <GlassmorphicButton
                  variant="default"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => {
                    // This would navigate to forum post creation in a real app
                    alert("This would navigate to forum post creation with your notes pre-filled");
                    setShowCompletionModal(false);
                  }}
                >
                  <MessageSquarePlusIcon className="h-4 w-4" /> Publish Devlog
                </GlassmorphicButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      )}
    </div>
  );
}