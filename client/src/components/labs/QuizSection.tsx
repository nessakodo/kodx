import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  RotateCcw,
  PartyPopper 
} from "lucide-react";

interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface QuizSectionProps {
  quiz: QuizItem[];
  sectionTitle: string;
  onQuizPassed: () => void;
  minPassPercentage?: number;
}

export function QuizSection({
  quiz,
  sectionTitle,
  onQuizPassed,
  minPassPercentage = 80
}: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(quiz.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  
  const currentQuestion = quiz[currentQuestionIndex];
  
  // Calculate results when submitted
  useEffect(() => {
    if (isSubmitted) {
      let correctCount = 0;
      
      quiz.forEach((question, index) => {
        if (selectedAnswers[index] === question.answer) {
          correctCount++;
        }
      });
      
      const percentage = Math.round((correctCount / quiz.length) * 100);
      setScore(percentage);
      setIsPassed(percentage >= minPassPercentage);
      
      // If passed, trigger the callback
      if (percentage >= minPassPercentage) {
        onQuizPassed();
      }
    }
  }, [isSubmitted, quiz, selectedAnswers, minPassPercentage, onQuizPassed]);
  
  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.length).fill(""));
    setIsSubmitted(false);
    setScore(0);
    setIsPassed(false);
  };
  
  // If already submitted and quiz is passed, show completion state
  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-[#1e293b] bg-[#0f172a]/50 backdrop-blur-sm p-6 space-y-6">
        <div className="text-center space-y-4">
          {isPassed ? (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6fcf97]/10 border border-[#6fcf97]/30">
                <PartyPopper className="h-6 w-6 text-[#6fcf97]" />
              </div>
              <h3 className="text-xl font-orbitron text-white">Quiz Passed!</h3>
              <p className="text-gray-400">
                You scored {score}% on the {sectionTitle} quiz.
              </p>
              <Button
                onClick={handleReset}
                className="mt-4 border border-[#9ecfff]/20 bg-[#1e293b]/50 text-[#9ecfff] hover:bg-[#1e293b] transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f44336]/10 border border-[#f44336]/30">
                <XCircle className="h-6 w-6 text-[#f44336]" />
              </div>
              <h3 className="text-xl font-orbitron text-white">Quiz Failed</h3>
              <p className="text-gray-400">
                You scored {score}%. You need at least {minPassPercentage}% to pass.
              </p>
              <Button
                onClick={handleReset}
                className="mt-4 border border-[#9ecfff]/20 bg-[#1e293b]/50 text-[#9ecfff] hover:bg-[#1e293b] transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border border-[#1e293b] bg-[#0f172a]/50 backdrop-blur-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-white text-lg">{sectionTitle} Quiz</h3>
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} of {quiz.length}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-white font-medium">{currentQuestion.question}</p>
          
          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-all",
                  selectedAnswers[currentQuestionIndex] === option
                    ? "border-[#9ecfff]/50 bg-[#9ecfff]/5"
                    : "border-[#1e293b] bg-[#0f172a]/30 hover:border-[#9ecfff]/30"
                )}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    selectedAnswers[currentQuestionIndex] === option
                      ? "border-[#9ecfff]"
                      : "border-gray-600"
                  )}>
                    {selectedAnswers[currentQuestionIndex] === option && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#9ecfff]" />
                    )}
                  </div>
                  <span className={cn(
                    selectedAnswers[currentQuestionIndex] === option
                      ? "text-white"
                      : "text-gray-400"
                  )}>
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "border px-4 py-2",
              currentQuestionIndex === 0
                ? "border-[#1e293b] bg-transparent text-gray-500 cursor-not-allowed"
                : "border-[#9ecfff]/20 bg-transparent text-[#9ecfff] hover:bg-[#1e293b]"
            )}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className={cn(
              "border px-4 py-2 flex items-center",
              !selectedAnswers[currentQuestionIndex]
                ? "border-[#1e293b] bg-transparent text-gray-500 cursor-not-allowed"
                : "border-[#9ecfff]/20 bg-transparent text-[#9ecfff] hover:bg-[#1e293b]"
            )}
          >
            {currentQuestionIndex === quiz.length - 1 ? "Submit" : "Next"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}