import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";

interface XpRingProgressProps {
  totalXp?: number;
  showLevel?: boolean;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function XpRingProgress({
  totalXp: propTotalXp,
  showLevel = true,
  size = "md",
  showTooltip = false,
  className = "",
}: XpRingProgressProps) {
  const { user } = useAuth();
  const totalXp = propTotalXp ?? user?.totalXp ?? 0;
  
  const userLevel = calculateLevel(totalXp);
  const progressPercentage = calculateLevelProgress(totalXp);
  
  // For animation
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  // Calculate XP needed for next level
  const xpNeededForCurrentLevel = userLevel * 1000;
  const xpNeededForNextLevel = (userLevel + 1) * 1000;
  const currentLevelXp = totalXp - xpNeededForCurrentLevel;
  const xpToNextLevel = xpNeededForNextLevel - totalXp;
  
  // Size adjustments
  const dimensions = {
    sm: { size: "w-20 h-20", fontSize: "text-xl", ringThickness: 4, innerSize: "w-16 h-16" },
    md: { size: "w-28 h-28", fontSize: "text-3xl", ringThickness: 6, innerSize: "w-24 h-24" },
    lg: { size: "w-36 h-36", fontSize: "text-4xl", ringThickness: 8, innerSize: "w-32 h-32" },
  };
  
  // Animate the progress on load and when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);
  
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Main XP Ring */}
      <div className={`relative ${dimensions[size].size}`}>
        {/* Gradient aura animation */}
        <div className="absolute inset-0 rounded-full opacity-20 animate-pulse bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] blur-md"></div>
        
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full bg-[#1e2535] border border-[#9ecfff]/20"></div>
        
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="50%" 
            cy="50%" 
            r={`calc(50% - ${dimensions[size].ringThickness}px)`}
            fill="none" 
            stroke="url(#xp-gradient)" 
            strokeWidth={dimensions[size].ringThickness}
            strokeDasharray={`calc(${animatedProgress} * 3.14159 * (100% - ${dimensions[size].ringThickness * 2}px) / 100) calc(3.14159 * (100% - ${dimensions[size].ringThickness * 2}px))`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Define gradient for stroke */}
          <defs>
            <linearGradient id="xp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="50%" stopColor="#bb86fc" />
              <stop offset="100%" stopColor="#9ecfff" />
              <animate attributeName="x1" from="0%" to="100%" dur="3s" repeatCount="indefinite" />
              <animate attributeName="x2" from="100%" to="0%" dur="3s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Inner content */}
        <div 
          className={`absolute inset-0 rounded-full bg-[#0f172a]/90 ${dimensions[size].innerSize} m-auto flex flex-col items-center justify-center`}
          onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
          onMouseLeave={() => showTooltip && setIsTooltipVisible(false)}
        >
          {showLevel && (
            <>
              <span className={`font-orbitron ${dimensions[size].fontSize} bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent`}>
                {userLevel}
              </span>
              <span className="text-xs text-gray-400 font-mono tracking-wide">LEVEL</span>
            </>
          )}
        </div>
        
        {/* XP Tooltip */}
        {showTooltip && isTooltipVisible && (
          <div className="absolute top-full mt-2 z-10 p-3 bg-[#1e2535]/95 backdrop-blur-sm border border-[#9ecfff]/20 rounded-lg shadow-lg text-center w-56">
            <div className="text-sm font-medium text-white mb-1">Level {userLevel} Progress</div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">{currentLevelXp}</span>
              <span className="text-gray-400">{xpNeededForNextLevel - xpNeededForCurrentLevel}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9ecfff] to-[#bb86fc]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-[#bb86fc]">
              {xpToNextLevel} XP to level {userLevel + 1}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Total: {totalXp} XP
            </div>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2 w-full max-w-[120px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#9ecfff]">{totalXp} XP</span>
        </div>
        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#9ecfff] to-[#bb86fc]"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}