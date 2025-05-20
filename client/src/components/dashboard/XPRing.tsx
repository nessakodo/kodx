import React, { useState } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { calculateLevel, calculateLevelProgress, getXpForNextLevel } from '@shared/constants/levels';

interface XPRingProps {
  totalXp: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  showLevel?: boolean;
  className?: string;
}

export function XPRing({ 
  totalXp, 
  size = 'md',
  showTooltip = true,
  showLevel = true,
  className = ''
}: XPRingProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Calculate level and progress
  const currentLevel = calculateLevel(totalXp);
  const progress = calculateLevelProgress(totalXp);
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const currentLevelXp = nextLevelXp - Math.ceil(nextLevelXp * (progress / 100));
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      ring: 'w-16 h-16',
      fontSize: 'text-lg',
      strokeWidth: 4,
      levelFontSize: 'text-xs'
    },
    md: {
      ring: 'w-24 h-24',
      fontSize: 'text-2xl',
      strokeWidth: 5,
      levelFontSize: 'text-sm'
    },
    lg: {
      ring: 'w-32 h-32',
      fontSize: 'text-3xl',
      strokeWidth: 6,
      levelFontSize: 'text-base'
    },
    xl: {
      ring: 'w-40 h-40',
      fontSize: 'text-4xl',
      strokeWidth: 8,
      levelFontSize: 'text-lg'
    }
  };
  
  // Calculate SVG parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Color based on level
  const getColorClass = () => {
    if (currentLevel < 5) return 'text-blue-400';
    if (currentLevel < 10) return 'text-purple-400';
    if (currentLevel < 20) return 'text-pink-400';
    if (currentLevel < 35) return 'text-amber-400';
    return 'text-emerald-400';
  };
  
  const getGlowColor = () => {
    if (currentLevel < 5) return 'rgba(96, 165, 250, 0.6)';
    if (currentLevel < 10) return 'rgba(167, 139, 250, 0.6)';
    if (currentLevel < 20) return 'rgba(244, 114, 182, 0.6)';
    if (currentLevel < 35) return 'rgba(251, 191, 36, 0.6)';
    return 'rgba(52, 211, 153, 0.6)';
  };
  
  const levelColorClass = getColorClass();
  const currentClassConfig = sizeConfig[size];
  
  // Animation classes for hover effect
  const hoverAnimationClass = isHovering ? 'scale-105' : 'scale-100';
  
  // Render tooltip content
  const tooltipContent = (
    <div className="text-center p-2">
      <p className="font-bold text-white">Level {currentLevel}</p>
      <p className="text-sm text-gray-300">
        {totalXp === 0 ? (
          "No XP yet, embark on your first journey!"
        ) : (
          <>XP: {currentLevelXp} / {xpToNextLevel} to next level</>
        )}
      </p>
    </div>
  );
  
  const ringContent = (
    <div 
      className={`relative ${currentClassConfig.ring} transition-transform duration-300 ${hoverAnimationClass} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Circle */}
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="rgba(30, 41, 59, 0.5)"
          strokeWidth={currentClassConfig.strokeWidth}
          className="opacity-30"
        />
        
        {/* Progress Circle with Glow */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke={getGlowColor()}
          strokeWidth={currentClassConfig.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className={`transition-all duration-500 ${isHovering ? 'filter drop-shadow-glow' : ''}`}
          style={{ 
            filter: isHovering ? `drop-shadow(0 0 5px ${getGlowColor()})` : 'none',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      </svg>
      
      {/* Level Number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-orbitron ${currentClassConfig.fontSize} ${levelColorClass}`}>
          {currentLevel}
        </span>
        {showLevel && (
          <span className={`${currentClassConfig.levelFontSize} text-gray-400 font-semibold -mt-1`}>
            LEVEL
          </span>
        )}
      </div>
    </div>
  );
  
  // Wrap with tooltip if showTooltip is true
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {ringContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0f172a] border-[#1e293b]">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : ringContent;
}