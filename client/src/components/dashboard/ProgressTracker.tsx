import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookIcon, GitForkIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  type: "lab" | "project";
  title: string;
  id: number;
  progress: number;
  total: number;
  xpEarned: number;
  xpTotal: number;
  difficulty: string;
  isCompleted?: boolean;
}

export function ProgressTracker({
  type,
  title,
  id,
  progress,
  total,
  xpEarned,
  xpTotal,
  difficulty,
  isCompleted = false
}: ProgressTrackerProps) {
  // Calculate progress percentage
  const progressPercentage = Math.round((progress / total) * 100);
  
  // Define difficulty badge styling
  const difficultyStyles = {
    beginner: {
      gradientClasses: "from-[#9ecfff]/10 to-[#88c9b7]/10",
      borderClasses: "border-[#9ecfff]/20",
      label: "Beginner"
    },
    intermediate: {
      gradientClasses: "from-[#b166ff]/10 to-[#9ecfff]/10",
      borderClasses: "border-[#b166ff]/20",
      label: "Intermediate"
    },
    advanced: {
      gradientClasses: "from-[#ff5c5c]/10 to-[#b166ff]/10",
      borderClasses: "border-[#ff5c5c]/20",
      label: "Advanced"
    }
  };

  const difficultyStyle = difficultyStyles[difficulty as keyof typeof difficultyStyles] || difficultyStyles.beginner;

  return (
    <div className={cn(
      "bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10 hover:border-[#9ecfff]/30 transition-all",
      isCompleted 
        ? "" 
        : "hover:shadow-[0_0_15px_rgba(158,207,255,0.2)] hover:bg-[#1e2535]/70"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center">
          {type === "lab" ? (
            <BookIcon className="h-4 w-4 mr-2 text-[#9ecfff]" />
          ) : (
            <GitForkIcon className="h-4 w-4 mr-2 text-[#88c9b7]" />
          )}
          <Link href={`/${type}s/${id}`}>
            <a className="font-medium hover:text-[#9ecfff] transition-colors">
              {title}
            </a>
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            className={`text-xs uppercase tracking-wider bg-gradient-to-r ${difficultyStyle.gradientClasses} px-2 py-1 rounded border ${difficultyStyle.borderClasses}`}
          >
            {difficultyStyle.label}
          </Badge>
          
          {isCompleted && (
            <Badge className="bg-[#5cdc96]/20 text-[#5cdc96] border-[#5cdc96]/30">
              Completed
            </Badge>
          )}
        </div>
      </div>
      
      <Progress
        value={progressPercentage}
        className="h-2 mb-2"
        indicatorClassName={isCompleted ? "bg-[#5cdc96]" : "bg-[#9ecfff]"}
      />
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {progress} of {total} tasks
        </div>
        
        <div>
          <span className={isCompleted ? "text-[#5cdc96]" : "text-[#9ecfff]"}>
            {xpEarned}
          </span>
          <span className="text-gray-500">
            /{xpTotal} XP
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-right">
        <Link href={`/${type}s/${id}`}>
          <a className="inline-flex items-center text-[#9ecfff] text-sm hover:underline">
            {isCompleted ? "Review" : "Continue"} <ArrowRightIcon className="ml-1 h-3 w-3" />
          </a>
        </Link>
      </div>
    </div>
  );
}
