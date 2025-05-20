import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";

interface XpRingProgressProps {
  xp: number;
  username: string;
  profileImageUrl?: string;
}

export function XpRingProgress({ xp, username, profileImageUrl }: XpRingProgressProps) {
  const [animatedXp, setAnimatedXp] = useState(0);
  const level = calculateLevel(xp);
  const progress = calculateLevelProgress(xp);
  
  // Animate XP value on mount
  useEffect(() => {
    const duration = 1500; // Animation duration in ms
    const startTime = Date.now();
    const endValue = xp;
    
    const animateXp = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use ease-out cubic function for smoother animation
      const progressEased = 1 - Math.pow(1 - progress, 3);
      setAnimatedXp(Math.floor(progressEased * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animateXp);
      }
    };
    
    requestAnimationFrame(animateXp);
  }, [xp]);

  // Calculate the ring circumference and stroke-dashoffset
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference * (1 - progress / 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Background Circle */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="8" 
            stroke="#1e293b" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset="0"
            className="opacity-30"
          />
        </svg>
        
        {/* Progress Circle with Animation */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2 -rotate-90 transform">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="8" 
            stroke="url(#gradient)" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow Effect */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2 -rotate-90 transform">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="2" 
            stroke="url(#gradientGlow)" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            filter="blur(4px)"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Avatar */}
        <div className="relative flex items-center justify-center">
          <Avatar className="h-32 w-32 border-4 border-[#1e293b] shadow-xl">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback className="text-2xl font-medium bg-gradient-to-r from-[#2a3a4a] to-[#1e2535]">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Level and XP Display */}
      <div className="mt-4 text-center">
        <div className="text-base sm:text-lg font-orbitron bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent mb-1">
          @{username}
        </div>
        <div className="text-base sm:text-lg text-gray-300 mb-1">Level {level}</div>
        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {animatedXp.toLocaleString()} XP
        </div>
        <div className="text-xs text-gray-500 mt-1">{progress}% to Level {level + 1}</div>
      </div>
    </div>
  );
}