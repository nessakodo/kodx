import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { calculateLevel, calculateLevelProgress, getXpForNextLevel } from '@shared/constants/levels';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface XPRingProps {
  totalXp: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  showTooltip?: boolean;
  className?: string;
  onLevelUp?: (level: number) => void;
}

export function XPRing({ 
  totalXp = 0, 
  size = 'md', 
  showLevel = true,
  showTooltip = true,
  className = '',
  onLevelUp
}: XPRingProps) {
  const [prevXp, setPrevXp] = useState(totalXp);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [animationPercent, setAnimationPercent] = useState(0);
  
  // Calculate level and progress
  const level = calculateLevel(totalXp);
  const progress = calculateLevelProgress(totalXp);
  const xpForNext = getXpForNextLevel(totalXp);
  const xpNeeded = xpForNext - totalXp;
  
  // Size mappings
  const sizeMap = {
    sm: {
      width: 40,
      strokeWidth: 3,
      fontSize: 'text-xs',
      padding: 'p-1'
    },
    md: {
      width: 60,
      strokeWidth: 4,
      fontSize: 'text-sm',
      padding: 'p-2'
    },
    lg: {
      width: 80,
      strokeWidth: 5,
      fontSize: 'text-base',
      padding: 'p-3'
    },
    xl: {
      width: 120,
      strokeWidth: 6,
      fontSize: 'text-lg',
      padding: 'p-4'
    }
  };
  
  const { width, strokeWidth, fontSize, padding } = sizeMap[size];
  const radius = (width / 2) - (strokeWidth * 2);
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;
  const gap = circumference - dash;
  
  // Handle XP changes and level up animation
  useEffect(() => {
    if (prevXp > 0 && totalXp > prevXp && calculateLevel(totalXp) > calculateLevel(prevXp)) {
      // Level up occurred!
      setIsLevelingUp(true);
      
      // Animate from 0 to 100%
      let startTime: number;
      const animateFill = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const duration = 1500; // 1.5 seconds for full animation
        
        // Calculate progress (0 to 100)
        const currentPercent = Math.min(100, (elapsed / duration) * 100);
        setAnimationPercent(currentPercent);
        
        if (currentPercent < 100) {
          requestAnimationFrame(animateFill);
        } else {
          // Animation complete
          setTimeout(() => {
            setIsLevelingUp(false);
            if (onLevelUp) onLevelUp(level);
          }, 500);
        }
      };
      
      requestAnimationFrame(animateFill);
    }
    
    setPrevXp(totalXp);
  }, [totalXp, prevXp, level, onLevelUp]);
  
  // Calculate glow color based on level
  const getGlowColor = () => {
    if (level < 5) return 'rgba(96, 165, 250, 0.5)'; // blue
    if (level < 10) return 'rgba(167, 139, 250, 0.5)'; // purple
    if (level < 20) return 'rgba(244, 114, 182, 0.5)'; // pink
    if (level < 35) return 'rgba(251, 191, 36, 0.5)'; // amber
    return 'rgba(52, 211, 153, 0.5)'; // emerald
  };
  
  // Get text color class based on level
  const getTextColorClass = () => {
    if (level < 5) return 'text-blue-300';
    if (level < 10) return 'text-purple-300';
    if (level < 20) return 'text-pink-300';
    if (level < 35) return 'text-amber-300';
    return 'text-emerald-300';
  };
  
  // No XP state
  if (totalXp <= 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`relative flex items-center justify-center ${padding} ${className}`}
              style={{ width: width, height: width }}
            >
              <svg width={width} height={width} className="rotate-[-90deg]">
                <circle
                  cx={width / 2}
                  cy={width / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(30, 41, 59, 0.5)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${0}`}
                />
              </svg>
              <div className="absolute flex items-center justify-center">
                <span className={`font-orbitron ${fontSize} text-gray-400`}>0</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="text-sm">
              <p className="font-medium text-white mb-1">No XP yet</p>
              <p className="text-gray-300">Embark on your first challenge to start earning XP</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Render normal ring or level up animation
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`relative flex items-center justify-center ${padding} ${className} cursor-help`}
            style={{ width: width, height: width }}
          >
            <svg width={width} height={width} className="rotate-[-90deg] ring-color-glow">
              {/* Background circle */}
              <circle
                cx={width / 2}
                cy={width / 2}
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.5)"
                strokeWidth={strokeWidth}
              />
              
              {/* Progress circle - normal or level up animation */}
              <circle
                cx={width / 2}
                cy={width / 2}
                r={radius}
                fill="none"
                stroke={getGlowColor()}
                strokeWidth={strokeWidth}
                strokeDasharray={`${isLevelingUp ? (animationPercent / 100) * circumference : dash} ${isLevelingUp ? circumference - (animationPercent / 100) * circumference : gap}`}
                className={isLevelingUp ? "transition-none" : "transition-all duration-700 ease-out"}
                style={{
                  filter: `drop-shadow(0 0 3px ${getGlowColor()})`,
                }}
              />
            </svg>
            
            {/* Level number */}
            {showLevel && (
              <div className="absolute flex items-center justify-center">
                <span className={`font-orbitron ${fontSize} ${getTextColorClass()}`}>
                  {level}
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        
        {showTooltip && (
          <TooltipContent side="right" className="border border-[#9ecfff]/20 bg-[#0f172a]/90 backdrop-blur-sm">
            <div className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-white">Level {level}</p>
                <p className={getTextColorClass()}>{progress}%</p>
              </div>
              <p className="text-gray-300 mb-1">Total XP: {totalXp}</p>
              <p className="text-gray-400 text-xs">
                {xpNeeded} XP needed for Level {level + 1}
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}