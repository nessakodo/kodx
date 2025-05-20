import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookIcon, GitForkIcon, ArrowRightIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { XPRing } from "@/components/ui/xp-ring";

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
  
  // Only mark as completed if all tasks are done or it's explicitly marked as completed
  const showAsCompleted = isCompleted || (progress >= total && total > 0);

  return (
    <div className={cn(
      "bg-[#1e2535]/50 rounded-lg p-4 border border-[#9ecfff]/10 hover:border-[#9ecfff]/30 transition-all",
      showAsCompleted 
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
          <div className="flex items-center">
            <span className="font-medium text-white hover:text-[#9ecfff] transition-colors">
              {title}
            </span>
            <span onClick={(e) => e.stopPropagation()} className="ml-1">
              <Link href={`/${type}s/${id}`}>
                <div className="inline-flex items-center text-xs text-[#9ecfff]/70 hover:text-[#9ecfff]">
                  <ArrowRightIcon className="h-3 w-3" />
                </div>
              </Link>
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            className={`text-xs uppercase tracking-wider bg-gradient-to-r ${difficultyStyle.gradientClasses} px-2 py-1 rounded border ${difficultyStyle.borderClasses}`}
          >
            {difficultyStyle.label}
          </Badge>
          
          {showAsCompleted && (
            <Badge className="bg-[#5cdc96]/20 text-[#5cdc96] border-[#5cdc96]/30 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-full">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                showAsCompleted 
                  ? "bg-gradient-to-r from-[#5cdc96]/80 to-[#5cdc96]"
                  : "bg-gradient-to-r from-[#9ecfff] to-[#88c9b7]"
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              {progress} of {total} tasks
            </div>
            
            <div className="hidden sm:block">
              <span className={showAsCompleted ? "text-[#5cdc96]" : "text-[#9ecfff]"}>
                {xpEarned}
              </span>
              <span className="text-gray-500">
                /{xpTotal} XP
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <XPRing 
            percentage={(xpEarned / xpTotal) * 100}
            size="sm"
            pulseEffect={xpEarned > 0}
            showValue={false}
            animationSpeed="slow"
          />
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="block sm:hidden">
          <XPRing 
            percentage={(xpEarned / xpTotal) * 100}
            size="sm"
            showValue={true}
            currentValue={xpEarned}
            totalValue={xpTotal}
            animationSpeed="slow"
          />
        </div>
        
        <div className="ml-auto">
          <Link href={`/${type}s/${id}`}>
            <div className="inline-flex items-center px-3 py-1 rounded bg-[#9ecfff]/10 border border-[#9ecfff]/20 
              text-[#9ecfff] text-sm hover:bg-[#9ecfff]/20 transition-all">
              {showAsCompleted ? "Review" : "Continue"} <ArrowRightIcon className="ml-1 h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
