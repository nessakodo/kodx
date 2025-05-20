import { useState, useEffect } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { GlassmorphicButton } from "@/components/ui/glassmorphic-button";
import { Badge } from "@/components/ui/badge";
import { QuizSection } from "@/components/labs/QuizSection";
import { LabProgress } from "@/components/labs/LabProgress";
import { 
  ArrowLeft, 
  BookOpen, 
  Server, 
  ShieldCheck, 
  Sparkles,
  ClipboardCheck,
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { XPRing } from "@/components/ui/xp-ring";

interface LabDetailProps {
  id: string | number;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  quizPassed: boolean;
  quiz: Quiz[];
}

interface LabData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  sections: Section[];
  prerequisites?: string[];
}

export function LabDetail({ id }: LabDetailProps) {
  const { isAuthenticated, user } = useAuth();
  const [labData, setLabData] = useState<LabData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [isLabCompleted, setIsLabCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  
  // Fetch lab data
  useEffect(() => {
    // This would be an API call in a real app
    // For now, we'll use mock data
    const mockLab: LabData = {
      id: typeof id === "string" ? parseInt(id) : id,
      title: "Quantum Computing Basics",
      description: "Learn the fundamentals of quantum computing and create your first quantum circuit.",
      difficulty: "beginner",
      xpReward: 500,
      prerequisites: ["Linear Algebra basics", "Basic programming knowledge"],
      sections: [
        {
          id: "section-1",
          title: "Introduction to Quantum Bits",
          content: `
# Introduction to Quantum Bits (Qubits)

Unlike classical bits, which can be either 0 or 1, quantum bits or qubits can exist in a superposition of both states simultaneously.

## Key Concepts:
- **Superposition**: A qubit can exist in multiple states at once
- **Measurement**: When measured, a qubit collapses to either 0 or 1
- **Quantum Gates**: Operations that manipulate qubits

## Mathematical Representation
A qubit is represented as a linear combination:
|ψ⟩ = α|0⟩ + β|1⟩

Where α and β are complex numbers, and |α|² + |β|² = 1
          `,
          completed: false,
          quizPassed: false,
          quiz: [
            {
              id: "q1-1",
              question: "What is a key difference between classical bits and qubits?",
              options: [
                "Qubits can only be measured once",
                "Qubits can exist in a superposition of states",
                "Qubits are only theoretical and cannot be physically created",
                "Qubits operate at room temperature"
              ],
              answer: "Qubits can exist in a superposition of states"
            },
            {
              id: "q1-2",
              question: "What happens when a qubit in superposition is measured?",
              options: [
                "It remains in superposition",
                "It splits into multiple qubits",
                "It collapses to either 0 or 1",
                "It ceases to exist"
              ],
              answer: "It collapses to either 0 or 1"
            }
          ]
        },
        {
          id: "section-2",
          title: "Quantum Gates and Circuits",
          content: `
# Quantum Gates and Circuits

Quantum gates are the building blocks of quantum circuits, much like logical gates in classical computing.

## Common Quantum Gates:
- **Hadamard (H) Gate**: Creates superposition from |0⟩ or |1⟩
- **Pauli-X Gate**: Quantum equivalent of the classical NOT gate
- **CNOT Gate**: Two-qubit gate that performs controlled-NOT operation

## Building a Circuit
1. Initialize qubits (typically to |0⟩)
2. Apply quantum gates to manipulate the qubits
3. Measure the qubits to get a classical output

## Quantum Circuit Notation
Quantum circuits are read from left to right, with each line representing a qubit and boxes representing gates.
          `,
          completed: false,
          quizPassed: false,
          quiz: [
            {
              id: "q2-1",
              question: "What does the Hadamard (H) gate do to a qubit in state |0⟩?",
              options: [
                "Leaves it unchanged",
                "Flips it to |1⟩",
                "Creates an equal superposition of |0⟩ and |1⟩",
                "Entangles it with another qubit"
              ],
              answer: "Creates an equal superposition of |0⟩ and |1⟩"
            },
            {
              id: "q2-2",
              question: "Which quantum gate is equivalent to the classical NOT gate?",
              options: [
                "Hadamard Gate",
                "Pauli-X Gate",
                "CNOT Gate",
                "Phase Gate"
              ],
              answer: "Pauli-X Gate"
            },
            {
              id: "q2-3",
              question: "How many qubits does a CNOT gate operate on?",
              options: [
                "One",
                "Two",
                "Three",
                "Four"
              ],
              answer: "Two"
            }
          ]
        },
        {
          id: "section-3",
          title: "Quantum Algorithms",
          content: `
# Introduction to Quantum Algorithms

Quantum algorithms leverage quantum phenomena to solve certain problems more efficiently than classical algorithms.

## Famous Quantum Algorithms:
- **Shor's Algorithm**: Efficiently factors large numbers
- **Grover's Algorithm**: Provides quadratic speedup for searching an unsorted database
- **Quantum Fourier Transform**: Transforms between time and frequency domains

## Quantum Advantage
Not all problems benefit from quantum computing. Quantum advantage occurs for specific problems where:
- Multiple possibilities need to be evaluated simultaneously
- The problem can be structured to use interference effects
- The answer can be extracted efficiently after quantum processing
          `,
          completed: false,
          quizPassed: false,
          quiz: [
            {
              id: "q3-1",
              question: "Which quantum algorithm is used to factor large numbers efficiently?",
              options: [
                "Grover's Algorithm",
                "Shor's Algorithm",
                "Quantum Fourier Transform",
                "Deutsch-Jozsa Algorithm"
              ],
              answer: "Shor's Algorithm"
            },
            {
              id: "q3-2",
              question: "What speedup does Grover's algorithm provide for searching an unsorted database?",
              options: [
                "Linear speedup",
                "Quadratic speedup",
                "Exponential speedup",
                "Logarithmic speedup"
              ],
              answer: "Quadratic speedup"
            }
          ]
        }
      ]
    };
    
    setLabData(mockLab);
    setSections(mockLab.sections);
  }, [id]);
  
  // Handle section completion when quiz is passed
  const handleQuizPassed = (sectionId: string) => {
    // Update passed quizzes list
    setPassedQuizzes(prev => [...prev, sectionId]);
    
    // Mark both the quiz as passed and section as completed
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, completed: true, quizPassed: true } 
          : section
      )
    );
    
    // Add to completed sections
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
    
    // Calculate earned XP (partial XP for each section/quiz completed)
    if (labData) {
      const sectionXP = Math.floor(labData.xpReward / labData.sections.length);
      setEarnedXP(prev => prev + sectionXP);
    }
  };
  
  // Check if all sections are completed and quizzes passed
  useEffect(() => {
    if (sections.length > 0) {
      const allCompleted = sections.every(section => section.completed && section.quizPassed);
      setIsLabCompleted(allCompleted);
    }
  }, [sections]);
  
  // Handle completing the entire lab
  const handleLabComplete = () => {
    if (isLabCompleted && labData) {
      setShowCompletionModal(true);
      // This would update the user's progress in a real app
    }
  };
  
  // Define difficulty styling
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
  
  if (!labData) {
    return (
      <div className="py-12 flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-orbitron text-white mb-4">Loading Lab...</h2>
        <div className="animate-pulse w-8 h-8 rounded-full bg-[#9ecfff]/20"></div>
      </div>
    );
  }
  
  const difficultyStyle = difficultyColors[labData.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;
  const currentSectionData = sections[currentSection];
  
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Lab Header */}
      <div className="mb-6 flex items-center gap-2">
        <a href="/labs" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </a>
        <h1 className="font-orbitron text-3xl text-white">{labData.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Section Content */}
          <GlassmorphicCard className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-orbitron text-xl text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#9ecfff]" /> {currentSectionData.title}
              </h2>
              
              <div className="text-sm text-gray-400">
                Section {currentSection + 1} of {sections.length}
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              {currentSectionData.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentSectionData.content.replace(/\n/g, '<br />') }} />
              ) : (
                <p>No content available</p>
              )}
            </div>
          </GlassmorphicCard>
          
          {/* Section Navigation */}
          <div className="flex justify-between items-center">
            <GlassmorphicButton
              variant="default"
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              className={cn(
                currentSection === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              Previous Section
            </GlassmorphicButton>
            
            <GlassmorphicButton
              variant="default"
              onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
              disabled={currentSection === sections.length - 1}
              className={cn(
                currentSection === sections.length - 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              Next Section
            </GlassmorphicButton>
          </div>
          
          {/* Quiz Section */}
          <QuizSection 
            quiz={currentSectionData.quiz}
            sectionTitle={currentSectionData.title}
            onQuizPassed={() => handleQuizPassed(currentSectionData.id)}
            minPassPercentage={80}
          />
        </div>
        
        <div className="space-y-6">
          {/* Lab Info */}
          <GlassmorphicCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge 
                className={`text-xs uppercase tracking-wider bg-transparent px-2 py-1 rounded border ${difficultyStyle.border} ${difficultyStyle.text} font-orbitron letter-spacing-wide`}
              >
                {difficultyStyle.label}
              </Badge>
              
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#9ecfff]" />
                <span className="text-white">{labData.xpReward} XP</span>
              </div>
            </div>
            
            <p className="text-gray-400">{labData.description}</p>
            
            {labData.prerequisites && labData.prerequisites.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-medium">Prerequisites</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  {labData.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#9ecfff] mt-0.5" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </GlassmorphicCard>
          
          {/* Lab Progress */}
          <LabProgress 
            sections={sections}
            totalXP={labData.xpReward}
            currentXP={earnedXP}
            onComplete={handleLabComplete}
            isCompleted={isLabCompleted}
          />
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
              <h2 className="font-orbitron text-2xl text-white">Lab Completed!</h2>
              <p className="text-gray-400 mt-2">
                Congratulations! You've completed {labData.title} and earned {labData.xpReward} XP.
              </p>
              
              <div className="my-6">
                <XPRing 
                  percentage={100}
                  size="lg"
                  showValue={true}
                  currentValue={labData.xpReward}
                  totalValue={labData.xpReward}
                  pulseEffect={true}
                />
              </div>
              
              <div className="space-y-3 w-full pt-2">
                <GlassmorphicButton
                  variant="success"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => setShowCompletionModal(false)}
                >
                  <ClipboardCheck className="h-4 w-4" /> Claim XP Reward
                </GlassmorphicButton>
                
                <GlassmorphicButton
                  variant="default"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  <Server className="h-4 w-4" /> Back to Dashboard
                </GlassmorphicButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      )}
    </div>
  );
}