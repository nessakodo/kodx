import React from 'react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateLevel, calculateLevelProgress, getXpForNextLevel } from '@shared/constants/levels';

interface XPRingProps {
  xp: number;
  size?: number;
  strokeWidth?: number;
  showLevel?: boolean;
  showTooltip?: boolean;
}

export function XPRing({ 
  xp, 
  size = 80, 
  strokeWidth = 4, 
  showLevel = true,
  showTooltip = true
}: XPRingProps) {
  const currentLevel = calculateLevel(xp);
  const progressToNextLevel = calculateLevelProgress(xp);
  const xpToNext = getXpForNextLevel(xp);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="relative group cursor-pointer"
            style={{ width: size, height: size }}
          >
            <CircularProgress 
              value={progressToNextLevel} 
              size={size}
              strokeWidth={strokeWidth}
              maxValue={100}
              className="ring-color-glow"
            />
            
            {showLevel && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                style={{ fontSize: size * 0.25 }}
              >
                <span className="font-orbitron text-white">{currentLevel}</span>
                <span className="text-gray-500 text-xs">Level</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        
        {showTooltip && (
          <TooltipContent 
            side="right"
            className="p-3 border border-[#9ecfff]/20 bg-[#0f172a]/90 backdrop-blur-sm"
          >
            <div className="space-y-2 w-48">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Current Level</span>
                <span className="text-sm font-orbitron text-white">{currentLevel}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total XP</span>
                <span className="text-sm font-medium text-[#9ecfff]">{xp}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Next Level</span>
                <span className="text-sm text-gray-300">{xpToNext} XP needed</span>
              </div>
              
              <div className="h-1.5 w-full bg-[#1e2535]/70 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] rounded-full transition-all duration-300"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}