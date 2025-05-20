import { useState } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckIcon, XIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizSectionProps {
  quiz: Question[];
  sectionTitle: string;
  onQuizPassed: () => void;
  minPassPercentage: number;
}

export function QuizSection({ quiz, sectionTitle, onQuizPassed, minPassPercentage }: QuizSectionProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(quiz.length).fill(""));
  const [showResults, setShowResults] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  
  const submitQuiz = () => {
    // Calculate correct answers
    const correctAnswersCount = userAnswers.reduce((count, answer, index) => {
      return count + (answer === quiz[index].answer ? 1 : 0);
    }, 0);
    
    // Calculate score percentage
    const scorePercentage = Math.round((correctAnswersCount / quiz.length) * 100);
    
    // Check if passed based on threshold
    const isPassed = scorePercentage >= minPassPercentage;
    
    setQuizPassed(isPassed);
    setShowResults(true);
    
    if (isPassed) {
      onQuizPassed();
    }
  };
  
  const resetQuiz = () => {
    setUserAnswers(Array(quiz.length).fill(""));
    setShowResults(false);
  };
  
  // Calculate score when showing results
  const correctAnswersCount = userAnswers.reduce((count, answer, index) => {
    return count + (answer === quiz[index].answer ? 1 : 0);
  }, 0);
  
  const scorePercentage = Math.round((correctAnswersCount / quiz.length) * 100);
  
  return (
    <GlassmorphicCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-orbitron">Quiz: {sectionTitle}</h2>
        {showResults && (
          <Badge className={`${
            quizPassed 
              ? "bg-[#6fcf97]/10 text-[#6fcf97] border border-[#6fcf97]/40" 
              : "bg-[#ff5c5c]/10 text-[#ff5c5c] border border-[#ff5c5c]/40"
          }`}>
            {quizPassed ? "Passed" : "Failed"} ({scorePercentage}%)
          </Badge>
        )}
      </div>
      
      <p className="text-gray-400 mb-6">
        Answer all questions correctly to earn XP and complete this section. 
        You need at least {minPassPercentage}% to pass.
      </p>
      
      <div className="space-y-8 mb-6">
        {quiz.map((question, questionIndex) => (
          <div 
            key={questionIndex}
            className={`p-4 rounded-md transition-all ${
              showResults
                ? userAnswers[questionIndex] === question.answer
                  ? "bg-[#6fcf97]/5 border border-[#6fcf97]/20"
                  : "bg-[#ff5c5c]/5 border border-[#ff5c5c]/20"
                : "bg-[#1e293b]/50 border border-[#1e293b]/80"
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                showResults
                  ? userAnswers[questionIndex] === question.answer
                    ? "bg-[#6fcf97]/20 text-[#6fcf97]"
                    : "bg-[#ff5c5c]/20 text-[#ff5c5c]"
                  : "bg-[#1e293b] text-gray-400 border border-gray-700"
              }`}>
                {showResults ? (
                  userAnswers[questionIndex] === question.answer ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    <XIcon className="h-3 w-3" />
                  )
                ) : (
                  <span className="text-xs">{questionIndex + 1}</span>
                )}
              </div>
              <h4 className="font-medium text-white">{question.question}</h4>
            </div>
            
            <RadioGroup
              value={userAnswers[questionIndex]}
              onValueChange={(value) => handleAnswerChange(questionIndex, value)}
              className="ml-9 space-y-2"
              disabled={showResults}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`q${questionIndex}-o${optionIndex}`}
                    className={showResults && option === question.answer ? "text-[#6fcf97] border-[#6fcf97]" : ""}
                  />
                  <Label 
                    htmlFor={`q${questionIndex}-o${optionIndex}`}
                    className={`cursor-pointer ${
                      showResults && option === question.answer 
                        ? "text-[#6fcf97]" 
                        : showResults && userAnswers[questionIndex] === option 
                          ? "text-[#ff5c5c]" 
                          : "text-gray-400"
                    }`}
                  >
                    {option}
                  </Label>
                  
                  {showResults && option === question.answer && (
                    <span className="ml-2 text-[#6fcf97]">
                      <CheckIcon className="h-4 w-4 inline" />
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
            
            {showResults && userAnswers[questionIndex] !== question.answer && (
              <div className="ml-9 mt-3 text-sm text-[#ff5c5c]">
                <XIcon className="h-3 w-3 inline mr-1" />
                Correct answer: {question.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showResults ? (
        <div className="flex flex-col space-y-4">
          {quizPassed ? (
            <div className="p-4 bg-[#6fcf97]/10 border border-[#6fcf97]/30 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6fcf97]/20 mb-2">
                <CheckCircleIcon className="h-6 w-6 text-[#6fcf97]" />
              </div>
              <h3 className="text-lg font-medium text-[#6fcf97] mb-1">Quiz Passed!</h3>
              <p className="text-sm text-gray-400">
                You scored {scorePercentage}% and earned XP for this section.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-[#ff5c5c]/10 border border-[#ff5c5c]/30 rounded-lg text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5c5c]/20 mb-2">
                <AlertCircleIcon className="h-6 w-6 text-[#ff5c5c]" />
              </div>
              <h3 className="text-lg font-medium text-[#ff5c5c] mb-1">Quiz Failed</h3>
              <p className="text-sm text-gray-400">
                You scored {scorePercentage}% and need {minPassPercentage}% to pass. Try again?
              </p>
            </div>
          )}
          
          {!quizPassed && (
            <Button 
              onClick={resetQuiz}
              className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
            >
              Try Again
            </Button>
          )}
        </div>
      ) : (
        <Button 
          onClick={submitQuiz}
          disabled={userAnswers.some(answer => answer === "")}
          className={`${
            userAnswers.some(answer => answer === "")
              ? "bg-[#1e2535]/50 text-gray-500 border-gray-700"
              : "bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white"
          }`}
        >
          Submit Answers
        </Button>
      )}
    </GlassmorphicCard>
  );
}