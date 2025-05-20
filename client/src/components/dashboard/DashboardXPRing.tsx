import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { calculateLevel } from "@/lib/utils";

interface DashboardXPRingProps {
  userXP?: number;
  userLevel?: number; 
  nextLevelXP?: number;
  showExtraInfo?: boolean;
}

export function DashboardXPRing({ 
  userXP: propUserXP, 
  userLevel: propUserLevel, 
  nextLevelXP: propNextLevelXP,
  showExtraInfo = true 
}: DashboardXPRingProps) {
  const { user } = useAuth();
  
  // Use props or fallback to user data from auth context
  const userXP = propUserXP ?? user?.totalXp ?? 0;
  const userLevel = propUserLevel ?? (user ? calculateLevel(userXP) : 1);
  
  // Calculate XP needed for current and next level
  const baseXP = 1000; // Base XP per level
  const currentLevelMinXP = (userLevel - 1) * baseXP;
  const nextLevelXP = propNextLevelXP ?? (userLevel * baseXP);
  
  // Calculate progress percentage for the current level
  const currentLevelXP = userXP - currentLevelMinXP;
  const xpRequiredForLevel = nextLevelXP - currentLevelMinXP;
  const progressPercentage = Math.min(Math.floor((currentLevelXP / xpRequiredForLevel) * 100), 100);
  
  // State for animation
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Animate the progress ring on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* XP Ring Container */}
      <div className="relative w-32 h-32">
        {/* Outer static ring - represents the level */}
        <div className="absolute inset-0 rounded-full border-8 border-[#1e2535]/80 opacity-70"></div>
        
        {/* Glow effect - cyber zen aesthetic */}
        <div className="absolute inset-0 rounded-full filter blur-md bg-gradient-to-r from-[#9ecfff]/30 to-[#bb86fc]/30 opacity-40 animate-pulse"></div>
        
        {/* Inner progress ring - shows progress to next level */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#bb86fc" />
            </linearGradient>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="url(#xpGradient)" 
            strokeWidth="8"
            strokeDasharray={`${animatedProgress * 2.51} 251`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Level Number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-orbitron bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">{userLevel}</span>
          <span className="text-xs text-gray-300 font-mono tracking-wide">LEVEL</span>
        </div>
      </div>
      
      {/* XP Counter below the ring */}
      <div className="mt-2 text-center">
        <p className="text-sm font-mono">
          <span className="text-[#9ecfff]">{userXP}</span>
          <span className="text-gray-400"> / {nextLevelXP} XP</span>
        </p>
        {showExtraInfo && (
          <p className="text-xs text-[#bb86fc] mt-1">+{nextLevelXP - userXP} XP to level {userLevel + 1}</p>
        )}
      </div>
    </div>
  );
}