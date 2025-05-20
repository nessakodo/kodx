import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { StarIcon, PlayIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { XPRing } from "@/components/ui/xp-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { QuizQuestion } from "@/components/labs/QuizQuestion";
import ReactMarkdown from 'react-markdown';

interface Task {
  id: string;
  description: string;
}

interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [selectedTimestamp, setSelectedTimestamp] = useState("intro");

  // Fetch lab details
  const { data: lab, isLoading: isLabLoading } = useQuery({
    queryKey: [`/api/labs/${id}`],
    enabled: !!id,
  });

  // Fetch user's progress for this lab
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: [`/api/dashboard`],
    enabled: !!isAuthenticated && !!id,
  });

  // Fetch markdown content
  useEffect(() => {
    if (lab && lab.content) {
      // In a real implementation, we would fetch the markdown file
      // For now, we'll use a placeholder
      setMarkdownContent(`
# ${lab.title}

${lab.description}

## Introduction

This lab will guide you through the core concepts and provide hands-on exercises to reinforce your learning.

## Learning Objectives

1. Understand key security principles
2. Identify common vulnerabilities
3. Implement secure coding practices
4. Test and validate your implementations

## Resources

- [Documentation](#)
- [Supplementary materials](#)
      `);
    }
  }, [lab]);

  // Mock function to get timestamps from lab data
  const getTimestamps = (lab: any) => {
    // In a real implementation, timestamps would come from the API
    return [
      { id: "intro", label: "Introduction", time: "0:00" },
      { id: "concept", label: "Core Concepts", time: "3:42" },
      { id: "demo", label: "Demonstration", time: "7:15" },
      { id: "practice", label: "Practice", time: "12:30" },
      { id: "summary", label: "Summary", time: "18:45" }
    ];
  };

  // Mock function to extract tasks from lab data
  const getTasksFromLab = (lab: any) => {
    // In a real implementation, tasks would come from the API
    return [
      { id: "task1", description: "Watch introduction video" },
      { id: "task2", description: "Complete the exercises" },
      { id: "task3", description: "Pass the quiz (min 80%)" },
      { id: "task4", description: "Implement the practice example" },
      { id: "task5", description: "Submit final review" }
    ];
  };

  // Mock function to get quiz questions from lab data
  const getQuizQuestions = (lab: any): QuizItem[] => {
    // In a real implementation, quiz questions would come from the API
    return [
      {
        id: "q1",
        question: "Which of the following is NOT a secure way to store user passwords?",
        options: [
          "Salted bcrypt hashing",
          "Argon2id with proper parameters",
          "PBKDF2 with high iteration count",
          "Base64 encoding with a static salt"
        ],
        correctAnswer: "Base64 encoding with a static salt"
      },
      {
        id: "q2",
        question: "What is the primary purpose of HTTPS?",
        options: [
          "To increase website loading speed",
          "To secure data transmission between client and server",
          "To authenticate website visitors",
          "To compress website data"
        ],
        correctAnswer: "To secure data transmission between client and server"
      },
      {
        id: "q3",
        question: "Which of these is a defense against Cross-Site Scripting (XSS)?",
        options: [
          "Using prepared statements for database queries",
          "Content Security Policy",
          "Rate limiting API requests",
          "IP address filtering"
        ],
        correctAnswer: "Content Security Policy"
      }
    ];
  };

  // Initialize lab progress
  useEffect(() => {
    if (progress && progress.labProgress) {
      const labProgress = progress.labProgress.find(
        (p: any) => p.lab.id === parseInt(id as string)
      );
      
      if (labProgress) {
        setNotes(labProgress.progress.notes || "");
        setCompletedTasks(labProgress.progress.completedTasks || []);
        setQuizAnswers(labProgress.progress.quizResults?.answers || {});
      }
    }
  }, [progress, id]);

  // Complete lab mutation
  const completeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/labs/${id}/complete`, {}),
    onSuccess: () => {
      toast({
        title: "Lab completed!",
        description: `You've earned ${lab?.xpReward} XP!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete lab. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: { notes?: string; completedTasks?: string[]; quizResults?: any }) => 
      apiRequest("POST", `/api/labs/${id}/progress`, data),
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

  // Calculate quiz score
  const calculateQuizScore = () => {
    const questions = getQuizQuestions(lab);
    if (Object.keys(quizAnswers).length === 0) return 0;
    
    let correctCount = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / questions.length) * 100);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const tasks = getTasksFromLab(lab);
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

  const handleQuizAnswer = (questionId: string, answer: string) => {
    const updatedAnswers = { ...quizAnswers, [questionId]: answer };
    setQuizAnswers(updatedAnswers);
    
    // Calculate score after update
    const score = calculateQuizScore();
    
    // Update progress with quiz results
    updateProgressMutation.mutate({ 
      quizResults: { 
        answers: updatedAnswers,
        score 
      } 
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    updateProgressMutation.mutate({ notes });
  };

  const handleCompletelab = () => {
    completeMutation.mutate();
  };

  // Get user progress for this lab
  const userLabProgress = progress?.labProgress?.find(
    (p: any) => p.lab.id === parseInt(id as string)
  );

  const isCompleted = userLabProgress?.progress.isCompleted;

  if (isLabLoading) {
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

  if (!lab) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-orbitron mb-4">Lab Not Found</h2>
        <p className="text-gray-500 mb-8">The lab you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/labs">Back to Labs</a>
        </Button>
      </div>
    );
  }

  const timestamps = getTimestamps(lab);
  const tasks = getTasksFromLab(lab);
  const quizQuestions = getQuizQuestions(lab);
  const quizScore = calculateQuizScore();
  const passingScore = 80; // 80% to pass

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <GlassmorphicCard className="mb-8 overflow-hidden">
            {/* Video section */}
            <div className="relative h-56 md:h-96 bg-[#1e2535]">
              {lab.videoUrl ? (
                <iframe 
                  className="w-full h-full"
                  src={lab.videoUrl}
                  title={lab.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1629654297299-c8506221ca97" 
                    alt={lab.title}
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

            {/* Timestamps navigation */}
            <div className="p-4 border-b border-[#9ecfff]/10 overflow-x-auto">
              <div className="flex gap-3 py-2">
                {timestamps.map((timestamp) => (
                  <Badge 
                    key={timestamp.id}
                    variant={selectedTimestamp === timestamp.id ? "default" : "outline"}
                    className={`whitespace-nowrap px-3 py-1 cursor-pointer
                      ${selectedTimestamp === timestamp.id 
                        ? "bg-[#9ecfff]/10 text-[#9ecfff] hover:bg-[#9ecfff]/20" 
                        : "bg-transparent text-gray-300 hover:bg-white/5"}`
                    }
                    onClick={() => setSelectedTimestamp(timestamp.id)}
                  >
                    {timestamp.label} <span className="text-xs ml-1">{timestamp.time}</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lab content */}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#1e2535]/80 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <StarIcon className="h-3 w-3 text-[#9ecfff]" /> {lab.xpReward} XP
                </Badge>
                <Badge 
                  className={`text-xs uppercase tracking-wider bg-gradient-to-r from-[#9ecfff]/10 to-[#88c9b7]/10 px-2 py-1 rounded border border-[#9ecfff]/20`}
                >
                  {lab.difficulty.charAt(0).toUpperCase() + lab.difficulty.slice(1)}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-orbitron mb-4">{lab.title}</h1>
              <p className="text-gray-400 mb-6">{lab.description}</p>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content" className="font-orbitron">Lab Content</TabsTrigger>
                  <TabsTrigger value="quiz" className="font-orbitron">Quiz</TabsTrigger>
                  <TabsTrigger value="notes" className="font-orbitron">Your Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-pre:bg-[#1e2535] prose-pre:border prose-pre:border-[#9ecfff]/20 prose-code:text-[#9ecfff] prose-headings:font-orbitron">
                    <ReactMarkdown>
                      {markdownContent}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
                <TabsContent value="quiz" className="mt-4">
                  {isAuthenticated ? (
                    <>
                      {quizQuestions.map((question, index) => (
                        <QuizQuestion
                          key={question.id}
                          question={question.question}
                          options={question.options}
                          selectedAnswer={quizAnswers[question.id] || ""}
                          onSelect={(answer) => handleQuizAnswer(question.id, answer)}
                          number={index + 1}
                          disabled={isCompleted}
                        />
                      ))}
                      <div className="mt-6 p-4 rounded-lg bg-[#1e2535]/50 border border-[#9ecfff]/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-400">Your Score</p>
                            <p className="text-lg font-medium">
                              {Object.keys(quizAnswers).length > 0 
                                ? <span className={quizScore >= passingScore ? "text-[#5cdc96]" : "text-[#ff5c5c]"}>
                                    {quizScore}%
                                  </span>
                                : <span className="text-gray-500">Not attempted</span>
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Passing Score</p>
                            <p className="text-lg font-medium text-[#9ecfff]">{passingScore}%</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-orbitron mb-2">Sign In to Take the Quiz</h3>
                      <p className="text-gray-500 mb-4">Complete the quiz to test your knowledge and earn XP.</p>
                      <Button asChild>
                        <a href="/api/login">Sign In</a>
                      </Button>
                    </div>
                  )}
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
                      <h3 className="text-xl font-orbitron mb-2">Sign In to Take Notes</h3>
                      <p className="text-gray-500 mb-4">Track your progress and take notes as you work through this lab.</p>
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
              <h3 className="font-orbitron text-white text-lg mb-4 uppercase">Lab Progress</h3>
              
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
                          disabled={isCompleted}
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
                          <span className="text-[#5cdc96] font-semibold">{lab.xpReward} XP</span>
                          <span className="text-gray-500 text-sm"> earned</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[#9ecfff] font-semibold">0 XP</span>
                          <span className="text-gray-500 text-sm"> / {lab.xpReward} XP</span>
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
                  onClick={handleCompletelab}
                  disabled={completeMutation.isPending || isCompleted || quizScore < passingScore}
                >
                  {isCompleted 
                    ? "Lab Completed ✓" 
                    : completeMutation.isPending 
                      ? "Completing..." 
                      : quizScore < passingScore 
                        ? "Pass Quiz to Complete" 
                        : "Complete Lab"}
                </Button>
                
                {isCompleted && (
                  <div className="mt-4 p-3 bg-[#5cdc96]/10 border border-[#5cdc96]/30 rounded-lg text-center">
                    <p className="text-[#5cdc96] text-sm">
                      Congratulations! You've completed this lab and earned {lab.xpReward} XP.
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
