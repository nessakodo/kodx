import { useState } from "react";
import { XPRing } from "@/components/ui/xp-ring";
import { Button } from "@/components/ui/button";
import { CheckIcon, CircleSlashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  completed: boolean;
  quizPassed?: boolean;
}

interface LabProgressProps {
  sections: Section[];
  totalXP: number;
  currentXP: number;
  onComplete: () => void;
  isCompleted?: boolean;
}

export function LabProgress({
  sections,
  totalXP,
  currentXP = 0,
  onComplete,
  isCompleted = false
}: LabProgressProps) {
  // Calculate overall progress percentage
  const completedSections = sections.filter(section => section.completed && section.quizPassed).length;
  const progressPercentage = Math.round((completedSections / sections.length) * 100);
  
  // All sections completed means quizzes should be passed too
  const allCompleted = sections.every(section => section.completed && section.quizPassed);
  
  return (
    <div className="space-y-6 p-6 rounded-lg border border-[#1e293b] bg-[#0f172a]/50 backdrop-blur-sm">
      <div className="space-y-2">
        <h3 className="font-orbitron text-xl text-white tracking-wide">LAB PROGRESS</h3>
        
        <div className="space-y-3 mt-4">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {section.completed ? (
                  section.quizPassed ? (
                    <div className="w-5 h-5 bg-transparent border border-[#6fcf97]/30 rounded-sm flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-[#6fcf97]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-transparent border border-[#9ecfff]/30 rounded-sm flex items-center justify-center">
                      <CircleSlashIcon className="h-3 w-3 text-[#9ecfff]" />
                    </div>
                  )
                ) : (
                  <div className="w-5 h-5 bg-transparent border border-[#4a5568]/30 rounded-sm"></div>
                )}
              </div>
              
              <div className={cn(
                "flex-1",
                section.completed && section.quizPassed && "line-through text-gray-500",
                section.completed && !section.quizPassed && "text-[#9ecfff]",
                !section.completed && "text-gray-400"
              )}>
                {section.title}
                {section.completed && !section.quizPassed && (
                  <span className="ml-2 text-xs text-[#9ecfff]">(Quiz required)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <XPRing 
            percentage={progressPercentage}
            size="md"
            animationSpeed="slow"
            showValue={true}
            currentValue={currentXP}
            totalValue={totalXP}
            pulseEffect={progressPercentage > 0}
          />
          <div className="text-sm text-gray-400">
            Completion
          </div>
        </div>
        
        <Button
          onClick={onComplete}
          disabled={!allCompleted || isCompleted}
          className={cn(
            "px-4 py-2 font-medium border rounded-md transition-all",
            allCompleted && !isCompleted 
              ? "border-[#6fcf97]/30 text-[#6fcf97] hover:bg-[#6fcf97]/10" 
              : "border-[#4a5568]/30 text-gray-500 cursor-not-allowed opacity-70"
          )}
        >
          {isCompleted ? "Lab Completed" : "Complete Lab"}
        </Button>
      </div>
      
      {!allCompleted && (
        <div className="text-sm text-gray-500 pt-2">
          All sections must be completed and quizzes passed to finish the lab.
        </div>
      )}
    </div>
  );
}