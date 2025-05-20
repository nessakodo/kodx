import React, { useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger, 
  TooltipProvider 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { calculateLevel, calculateLevelProgress, getXpForNextLevel } from '@shared/constants/levels';

interface XPRingProps {
  totalXp: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

export function XPRing({ 
  totalXp, 
  size = 'md', 
  showTooltip = true,
  className = '',
  onClick
}: XPRingProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Calculate level and progress
  const level = calculateLevel(totalXp);
  const progress = calculateLevelProgress(totalXp);
  const xpForNextLevel = getXpForNextLevel(level);
  const currentLevelXp = xpForNextLevel - (xpForNextLevel * (100 - progress) / 100);
  
  // Size maps
  const sizeMap = {
    sm: { ring: 'w-16 h-16', text: 'text-lg', innerPad: 'p-1' },
    md: { ring: 'w-24 h-24', text: 'text-xl', innerPad: 'p-1.5' },
    lg: { ring: 'w-32 h-32', text: 'text-2xl', innerPad: 'p-2' },
    xl: { ring: 'w-40 h-40', text: 'text-3xl', innerPad: 'p-2.5' }
  };
  
  const { ring, text, innerPad } = sizeMap[size];
  
  // Set glow color based on level
  const getGlowColor = () => {
    if (level < 5) return '#63B3ED'; // blue
    if (level < 10) return '#C4B5FD'; // purple
    if (level < 15) return '#F9A8D4'; // pink
    if (level < 25) return '#FCD34D'; // amber
    return '#34D399'; // emerald
  };
  
  const glowColor = getGlowColor();
  
  return (
    <TooltipProvider>
      <Tooltip open={showTooltip && isHovering}>
        <TooltipTrigger asChild>
          <div 
            className={`relative ${ring} ${className} select-none`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onClick}
          >
            {/* Outer ring with progress */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                background: `conic-gradient(
                  ${glowColor} ${progress}%, 
                  rgba(30, 41, 59, 0.5) ${progress}%
                )`,
                boxShadow: isHovering 
                  ? `0 0 15px ${glowColor}, 0 0 5px ${glowColor}`
                  : `0 0 10px ${glowColor}`,
                transition: 'box-shadow 0.3s ease'
              }}
            />
            
            {/* Inner background */}
            <div className={`absolute inset-0 rounded-full ${innerPad} bg-[#0f172a]`}>
              <div className="w-full h-full rounded-full bg-[#1e293b]/50 flex items-center justify-center flex-col">
                <span className={`font-orbitron ${text} text-white`}>{level}</span>
                <span className="text-xs text-gray-400">LEVEL</span>
              </div>
            </div>
            
            {/* Optional pulse animation when leveling up */}
            {isHovering && (
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-30" 
                style={{ background: glowColor }}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="bg-[#0f172a] border-[#1e293b] p-4 max-w-xs">
          <div className="text-center">
            <h4 className="font-orbitron text-lg text-white mb-1">Level {level}</h4>
            <p className="text-sm text-gray-400 mb-3">
              {totalXp === 0 
                ? "No XP yet, embark on your first learning challenge!"
                : `${Math.floor(currentLevelXp)} / ${xpForNextLevel} XP to Level ${level + 1}`
              }
            </p>
            <Progress
              value={progress}
              className="h-2 bg-[#1e293b]"
              style={{ 
                '--tw-progress-color': glowColor
              } as React.CSSProperties}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}