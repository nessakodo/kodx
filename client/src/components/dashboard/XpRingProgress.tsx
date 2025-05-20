import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";

interface XpRingProgressProps {
  xp: number;
  username: string;
  profileImageUrl?: string;
}

export function XpRingProgress({ xp, username, profileImageUrl }: XpRingProgressProps) {
  const level = calculateLevel(xp);
  const progress = calculateLevelProgress(xp);
  const [rotation, setRotation] = useState(0);
  
  // Slow constant rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Create the SVG for the XP ring
  const size = 120;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Rotating background ring */}
        <svg 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" 
          width={size + 12} 
          height={size + 12} 
          style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ecfff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#b166ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#88c9b7" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle 
            cx={(size + 12) / 2} 
            cy={(size + 12) / 2} 
            r={radius + 6} 
            fill="none" 
            stroke="url(#ringGradient)" 
            strokeWidth="1" 
          />
        </svg>
        
        {/* Progress ring */}
        <svg 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" 
          width={size} 
          height={size}
        >
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            fill="none" 
            stroke="rgba(158, 207, 255, 0.1)" 
            strokeWidth={strokeWidth} 
          />
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            fill="none" 
            stroke="url(#progressGradient)" 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="drop-shadow-glow"
          />
        </svg>
        
        {/* Avatar in the center */}
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-[#9ecfff]/20">
            <AvatarImage src={profileImageUrl} alt={username} />
            <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Level and XP info */}
      <div className="mt-4 flex flex-col items-center">
        <div className="text-sm font-medium text-[#9ecfff]">Level {level}</div>
        <div className="text-xs text-gray-400 mt-1">{progress}% to Level {level + 1}</div>
        <div className="text-xs text-gray-500 mt-1">{xp} XP Total</div>
      </div>
    </div>
  );
}