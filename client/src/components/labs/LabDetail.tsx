import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlayCircleIcon, 
  CheckCircleIcon, 
  CodeIcon,
  BookIcon,
  StarIcon,
  BookmarkIcon,
  ClockIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon
} from "lucide-react";
import { QuizSection } from "./QuizSection";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Section {
  id: string;
  title: string;
  timestamp: string;
  quiz: {
    questions: Question[];
    pass_threshold: number;
    xp_reward: number;
  };
  tasks: string[];
}

interface Lab {
  id: string;
  title: string;
  level: string;
  xp_reward: number;
  description: string;
  video_url: string;
  sections: Section[];
  completion_requirements: {
    all_quizzes_passed: boolean;
  };
  completion_logic: {
    type: string;
    title: string;
    message: string;
    show_level_up_if_unlocked: boolean;
    aggregate_notes: boolean;
    forum_prompt: {
      title: string;
      tags: string[];
      body_from_notes: boolean;
      cta: string;
    };
  };
  note_settings: {
    per_section_notes: boolean;
    global_lab_notes_aggregation: boolean;
    pagination_enabled: boolean;
  };
}

export function LabDetail() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState("");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Mock lab data - would come from API in real implementation
  const { data: lab, isLoading, error } = useQuery({
    queryKey: ["/api/labs/1"],
    // This would be replaced with real API data
    initialData: {
      id: "lab-quantum-computing-basics",
      title: "Quantum Computing Basics",
      level: "Beginner",
      xp_reward: 500,
      description: "Learn the fundamentals of quantum computing and create your first quantum circuit.",
      video_url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      sections: [
        {
          id: "sec-intro",
          title: "Introduction",
          timestamp: "0:00",
          quiz: {
            questions: [
              {
                question: "What is a qubit?",
                options: [
                  "A classical bit",
                  "A unit of classical data",
                  "A quantum bit",
                  "A byte"
                ],
                answer: "A quantum bit"
              },
              {
                question: "Which principle allows a qubit to be in multiple states at once?",
                options: [
                  "Superposition",
                  "Entanglement",
                  "Uncertainty",
                  "Relativity"
                ],
                answer: "Superposition"
              }
            ],
            pass_threshold: 80,
            xp_reward: 50
          },
          tasks: [
            "Watch introduction video",
            "Complete the intro quiz"
          ]
        },
        {
          id: "sec-core",
          title: "Core Concepts",
          timestamp: "3:42",
          quiz: {
            questions: [
              {
                question: "What is entanglement in quantum computing?",
                options: [
                  "Two qubits behaving independently",
                  "Qubits sharing the same memory",
                  "A quantum connection where the state of one qubit affects another",
                  "A form of encryption"
                ],
                answer: "A quantum connection where the state of one qubit affects another"
              }
            ],
            pass_threshold: 80,
            xp_reward: 100
          },
          tasks: [
            "Study core theory",
            "Pass section quiz"
          ]
        },
        {
          id: "sec-practice",
          title: "Practice",
          timestamp: "12:30",
          quiz: {
            questions: [
              {
                question: "Which gate puts a qubit into superposition?",
                options: [
                  "X",
                  "Z",
                  "H (Hadamard)",
                  "CNOT"
                ],
                answer: "H (Hadamard)"
              }
            ],
            pass_threshold: 80,
            xp_reward: 150
          },
          tasks: [
            "Implement the circuit",
            "Verify results",
            "Pass practice quiz"
          ]
        },
        {
          id: "sec-summary",
          title: "Final Review",
          timestamp: "18:45",
          quiz: {
            questions: [
              {
                question: "What is the main advantage of quantum over classical computing?",
                options: [
                  "Higher power consumption",
                  "Faster arithmetic operations",
                  "Parallelism through superposition and entanglement",
                  "Better graphics processing"
                ],
                answer: "Parallelism through superposition and entanglement"
              }
            ],
            pass_threshold: 80,
            xp_reward: 200
          },
          tasks: [
            "Submit final review",
            "Pass final quiz"
          ]
        }
      ],
      completion_requirements: {
        all_quizzes_passed: true
      },
      completion_logic: {
        type: "modal",
        title: "🎉 Lab Complete!",
        message: "You've completed all sections of this lab.",
        show_level_up_if_unlocked: true,
        aggregate_notes: true,
        forum_prompt: {
          title: "Devlog – Reflections on Quantum Computing Basics",
          tags: [
            "devlog",
            "quantum",
            "beginner"
          ],
          body_from_notes: true,
          cta: "Would you like to post your notes to the forum?"
        }
      },
      note_settings: {
        per_section_notes: true,
        global_lab_notes_aggregation: true,
        pagination_enabled: true
      }
    }
  });
  
  useEffect(() => {
    if (lab) {
      // Initialize notes for each section
      const notesObj: Record<string, string> = {};
      lab.sections.forEach(section => {
        notesObj[section.id] = "";
      });
      setNotes(notesObj);
      
      // Set the first section as active by default
      if (lab.sections.length > 0 && !activeSection) {
        setActiveSection(lab.sections[0].id);
      }
    }
  }, [lab, activeSection]);
  
  // Handle quiz completion for a section
  const handleQuizPassed = (sectionId: string) => {
    if (!passedQuizzes.includes(sectionId)) {
      setPassedQuizzes([...passedQuizzes, sectionId]);
    }
    
    // Auto-complete section when quiz is passed
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
    
    // Check if all quizzes are passed to mark the lab as completed
    if (lab && passedQuizzes.length + 1 === lab.sections.length) {
      setIsCompleted(true);
    }
  };
  
  const handleSectionCompletion = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };
  
  const handleNotesChange = (sectionId: string, value: string) => {
    setNotes({
      ...notes,
      [sectionId]: value
    });
  };
  
  const saveNotes = (sectionId: string) => {
    // In a real app, this would save to the API/backend
    // For now, we'll just show a success message
    alert(`Notes saved for section "${lab?.sections.find(s => s.id === sectionId)?.title}"`);
  };
  
  // Calculate XP earned so far
  const calculateEarnedXP = () => {
    if (!lab) return 0;
    
    return lab.sections
      .filter(section => passedQuizzes.includes(section.id))
      .reduce((total, section) => total + section.quiz.xp_reward, 0);
  };
  
  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!lab) return 0;
    
    const totalSections = lab.sections.length;
    const completedCount = passedQuizzes.length;
    
    return Math.round((completedCount / totalSections) * 100);
  };
  
  const currentSection = lab?.sections.find(s => s.id === activeSection);
  const progress = calculateProgress();
  const earnedXP = calculateEarnedXP();
  
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
  
  if (error || !lab) {
    return (
      <div className="text-center py-16">
        <div className="h-16 w-16 mx-auto text-[#ff5c5c] mb-6">
          <AlertCircleIcon className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-orbitron mb-4">Lab Not Found</h2>
        <p className="text-gray-500 mb-8">We couldn't find the lab you're looking for.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Lab header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-orbitron text-white mb-2">{lab.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="bg-transparent text-[#56ccf2] border border-[#56ccf2]/30">
              {lab.level}
            </Badge>
            <div className="flex items-center gap-1 text-[#9ecfff]">
              <StarIcon className="h-4 w-4" />
              <span>{lab.xp_reward} XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
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
                {completedSections.length > 0 ? "Continue Lab" : "Start Lab"}
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
                Video Tutorial
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <GlassmorphicCard className="p-6">
                <h2 className="text-xl font-orbitron mb-4">Lab Description</h2>
                <p className="text-gray-400 mb-6">{lab.description}</p>
                
                <h3 className="text-lg font-medium mb-3">Sections</h3>
                <div className="space-y-4 mb-6">
                  {lab.sections.map((section, index) => (
                    <div 
                      key={section.id}
                      className={`p-4 rounded-md border transition-colors ${
                        passedQuizzes.includes(section.id)
                          ? "bg-[#6fcf97]/5 border-[#6fcf97]/20"
                          : completedSections.includes(section.id)
                            ? "bg-[#9ecfff]/5 border-[#9ecfff]/20"
                            : "bg-[#1e293b]/50 border-[#1e293b]/80"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            passedQuizzes.includes(section.id)
                              ? "bg-[#6fcf97]/20 text-[#6fcf97]"
                              : completedSections.includes(section.id)
                                ? "bg-[#9ecfff]/20 text-[#9ecfff]"
                                : "bg-[#1e293b] text-gray-400 border border-gray-700"
                          }`}>
                            {passedQuizzes.includes(section.id) ? (
                              <CheckIcon className="h-3 w-3" />
                            ) : completedSections.includes(section.id) ? (
                              <AlertCircleIcon className="h-3 w-3" />
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <h4 className="font-medium">{section.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{section.quiz.xp_reward} XP</span>
                          <Button 
                            size="sm"
                            variant="outline"
                            className={`h-8 text-xs ${
                              passedQuizzes.includes(section.id)
                                ? "bg-[#6fcf97]/10 text-[#6fcf97] border-[#6fcf97]/30"
                                : "bg-[#1e2535]/70 border-[#9ecfff]/20 text-[#9ecfff]"
                            }`}
                            onClick={() => setActiveSection(section.id)}
                          >
                            {passedQuizzes.includes(section.id) ? (
                              "Review Section"
                            ) : completedSections.includes(section.id) ? (
                              "Complete Quiz"
                            ) : (
                              "Start Section"
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {completedSections.includes(section.id) && !passedQuizzes.includes(section.id) && (
                        <div className="mt-2 text-sm text-[#9ecfff]">
                          <AlertCircleIcon className="inline-block h-3 w-3 mr-1" />
                          Section in progress. Complete the quiz to earn XP.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="text-lg font-medium mb-3">Completion Requirements</h3>
                  <ul className="list-disc pl-5 text-gray-400">
                    <li>All section quizzes must be passed to complete this lab</li>
                    <li>Each quiz requires a minimum score of 80% to pass</li>
                    <li>You'll earn XP for each quiz you pass</li>
                  </ul>
                </div>
              </GlassmorphicCard>
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <GlassmorphicCard className="p-6">
                <div className="aspect-video bg-black mb-6 flex items-center justify-center">
                  <iframe 
                    src={lab.video_url.replace('watch?v=', 'embed/')}
                    title={`${lab.title} Tutorial Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Video Timestamps</h3>
                <div className="space-y-2">
                  {lab.sections.map((section, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-[#1e293b]/50 cursor-pointer transition-colors"
                    >
                      <ClockIcon className="h-4 w-4 text-[#9ecfff]" />
                      <span className="text-[#9ecfff] font-mono">{section.timestamp}</span>
                      <span className="text-gray-400">{section.title}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
          
          {/* Active section content */}
          {activeSection && currentSection && (
            <div className="space-y-6">
              <GlassmorphicCard className="p-6">
                <h2 className="text-xl font-orbitron mb-4">{currentSection.title}</h2>
                
                <h3 className="text-lg font-medium mb-3">Tasks</h3>
                <div className="space-y-3 mb-6">
                  {currentSection.tasks.map((task, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center ${
                        completedSections.includes(currentSection.id)
                          ? "bg-[#6fcf97]/10 border-[#6fcf97]/30 text-[#6fcf97]"
                          : "border-gray-700"
                      }`}>
                        {completedSections.includes(currentSection.id) && (
                          <CheckIcon className="h-3 w-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        completedSections.includes(currentSection.id)
                          ? "text-gray-400"
                          : "text-gray-300"
                      }`}>{task}</span>
                    </div>
                  ))}
                </div>
                
                {!completedSections.includes(currentSection.id) && (
                  <Button 
                    onClick={() => handleSectionCompletion(currentSection.id)}
                    className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
                  >
                    Mark as Completed
                  </Button>
                )}
              </GlassmorphicCard>
              
              {/* Quiz section */}
              {currentSection && (
                <QuizSection 
                  quiz={currentSection.quiz.questions}
                  sectionTitle={currentSection.title}
                  onQuizPassed={() => handleQuizPassed(currentSection.id)}
                  minPassPercentage={currentSection.quiz.pass_threshold}
                />
              )}
              
              {/* Notes section */}
              <GlassmorphicCard className="p-6">
                <h2 className="text-xl font-orbitron mb-4">Section Notes</h2>
                <p className="text-gray-400 mb-4">
                  Capture your insights, questions, and key learnings from this section.
                </p>
                <Textarea 
                  value={notes[currentSection.id] || ""}
                  onChange={(e) => handleNotesChange(currentSection.id, e.target.value)}
                  placeholder={`Write your notes for "${currentSection.title}" here...`}
                  className="bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50 min-h-[150px] mb-4"
                />
                <Button 
                  onClick={() => saveNotes(currentSection.id)}
                  className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
                >
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </GlassmorphicCard>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <GlassmorphicCard className="p-6 sticky top-24">
            <h2 className="text-xl font-orbitron mb-4">Lab Progress</h2>
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">{passedQuizzes.length} of {lab.sections.length} sections</span>
                  <span className="text-[#9ecfff]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#9ecfff] to-[#6fcf97] rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-b border-gray-800 py-3">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-[#9ecfff]" />
                  <span className="text-gray-300">XP Earned</span>
                </div>
                <div className="text-[#9ecfff] font-medium">
                  {earnedXP} / {lab.xp_reward}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-md font-medium">Section Status</h3>
                {lab.sections.map(section => (
                  <div 
                    key={section.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${
                        passedQuizzes.includes(section.id)
                          ? "bg-[#6fcf97]"
                          : completedSections.includes(section.id)
                            ? "bg-[#9ecfff]"
                            : "bg-gray-700"
                      }`}></div>
                      <span className={`truncate max-w-[160px] ${
                        passedQuizzes.includes(section.id)
                          ? "text-[#6fcf97]"
                          : completedSections.includes(section.id)
                            ? "text-[#9ecfff]"
                            : "text-gray-400"
                      }`}>{section.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{section.quiz.xp_reward} XP</span>
                  </div>
                ))}
              </div>
              
              {isCompleted && (
                <div className="text-center p-4 bg-[#6fcf97]/10 border border-[#6fcf97]/30 rounded-lg">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6fcf97]/20 mb-2">
                    <CheckCircleIcon className="h-6 w-6 text-[#6fcf97]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#6fcf97] mb-1">Lab Completed!</h3>
                  <p className="text-sm text-gray-400">
                    You've earned {lab.xp_reward} XP. Would you like to publish your notes to the forum?
                  </p>
                  <Button className="mt-3 bg-[#6fcf97]/20 text-[#6fcf97] border border-[#6fcf97]/40 hover:bg-[#6fcf97]/30">
                    Publish Notes
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