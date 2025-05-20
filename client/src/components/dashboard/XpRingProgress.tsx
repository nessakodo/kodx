import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";
import { XPRing } from "@/components/ui/xp-ring";

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
      <div className="relative mt-10">
        {/* Free-floating XP ring, positioned outside the avatar */}
        <div className="absolute -top-3 -left-3 z-10">
          <XPRing 
            percentage={progress}
            size="lg"
            showValue={false}
            pulseEffect={true}
            animationSpeed="slow"
          />
        </div>
        
        {/* Avatar centered without ring */}
        <div className="relative flex items-center justify-center">
          <Avatar className="h-28 w-28 border-4 border-[#1e293b] shadow-xl">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback className="text-2xl font-medium bg-gradient-to-r from-[#2a3a4a] to-[#1e2535]">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Level badge on avatar */}
          <div className="absolute -bottom-2 -right-2 bg-[#1e293b] border border-[#9ecfff]/30 rounded-full h-10 w-10 flex items-center justify-center shadow-lg">
            <span className="text-sm font-orbitron text-white">{level}</span>
          </div>
        </div>
      </div>
      
      {/* Level and XP Display */}
      <div className="mt-6 text-center">
        <div className="text-xl sm:text-2xl font-orbitron tracking-wider text-white mb-1">
          {username}
        </div>
        <div className="text-lg sm:text-xl font-orbitron text-[#9ecfff] tracking-wide">
          {animatedXp.toLocaleString()} XP
        </div>
        <div className="text-sm text-gray-400 mt-1">{progress}% to Level {level + 1}</div>
      </div>
    </div>
  );
}