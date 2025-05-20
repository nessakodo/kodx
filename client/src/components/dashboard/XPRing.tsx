import React, { useState, useEffect } from 'react';
import { CircleProgress } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateLevel, calculateLevelProgress, getLevelData, getXpForNextLevel } from '@/lib/utils';
import { LEVELS } from '@shared/constants/levels';

interface XPRingProps {
  user: {
    username?: string;
    profileImageUrl?: string;
    totalXp: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showLevelUp?: boolean;
}

export const XPRing: React.FC<XPRingProps> = ({ 
  user, 
  size = 'md', 
  showLevelUp = false 
}) => {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [prevXp, setPrevXp] = useState(user.totalXp);
  const [animatedXp, setAnimatedXp] = useState(user.totalXp);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get size values based on size prop
  const dimensions = {
    sm: { ringSize: 64, fontSize: 'text-xs', avatarSize: 'h-12 w-12' },
    md: { ringSize: 96, fontSize: 'text-sm', avatarSize: 'h-16 w-16' },
    lg: { ringSize: 128, fontSize: 'text-base', avatarSize: 'h-24 w-24' }
  }[size];
  
  // Calculate level and progress
  const level = calculateLevel(animatedXp);
  const nextLevelXp = getXpForNextLevel(animatedXp);
  const progress = calculateLevelProgress(animatedXp);
  const levelData = getLevelData(level);
  
  // Handle XP changes and animations
  useEffect(() => {
    // If XP increased, animate to new value
    if (user.totalXp > prevXp) {
      const prevLevel = calculateLevel(prevXp);
      const newLevel = calculateLevel(user.totalXp);
      
      // Track that we're animating
      setIsAnimating(true);
      
      // Animate XP increasing over time
      let startXp = prevXp;
      const increment = Math.max(1, Math.floor((user.totalXp - prevXp) / 30)); // 30 steps
      
      const animationInterval = setInterval(() => {
        if (startXp >= user.totalXp) {
          clearInterval(animationInterval);
          setAnimatedXp(user.totalXp);
          setIsAnimating(false);
          
          // Show level up modal if level increased
          if (newLevel > prevLevel && showLevelUp) {
            setShowLevelUpModal(true);
          }
        } else {
          startXp = Math.min(user.totalXp, startXp + increment);
          setAnimatedXp(startXp);
        }
      }, 50);
      
      setPrevXp(user.totalXp);
      
      // Cleanup
      return () => clearInterval(animationInterval);
    } else {
      // If XP decreased or stayed the same, just set it directly
      setAnimatedXp(user.totalXp);
      setPrevXp(user.totalXp);
    }
  }, [user.totalXp, prevXp, showLevelUp]);
  
  // SVG circle properties calculation
  const radius = dimensions.ringSize / 2;
  const circumference = 2 * Math.PI * (radius - 5); // 5px offset for border
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      {/* XP Ring Container */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ 
          width: dimensions.ringSize, 
          height: dimensions.ringSize 
        }}
      >
        {/* Background pulse effect (intensifies during animation) */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg transition-opacity duration-1000 ${
            isAnimating ? 'opacity-100 scale-110' : 'opacity-50'
          }`}
        ></div>
        
        {/* SVG Ring */}
        <svg 
          className="absolute inset-0 rotate-[-90deg] transform"
          width={dimensions.ringSize} 
          height={dimensions.ringSize}
        >
          {/* Background circle */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 5}
            className="fill-none stroke-gray-700/30"
            strokeWidth="3"
          />
          
          {/* Progress circle with gradient */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 5}
            className="fill-none stroke-[url(#gradient)] transition-all duration-300"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Avatar in the center */}
        <div className={`relative ${dimensions.avatarSize}`}>
          <Avatar className="h-full w-full border-2 border-[#9ecfff]/30 bg-black/30">
            <AvatarImage src={user.profileImageUrl || ""} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {/* Glow effect on the avatar (more intense during animation) */}
          <div 
            className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
              isAnimating ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(158, 207, 255, 0.2) 0%, rgba(109, 40, 217, 0) 70%)',
              filter: 'blur(8px)'
            }}
          ></div>
        </div>
        
        {/* Level badge */}
        <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
          <span className={`text-xs font-bold`}>{level}</span>
        </div>
      </div>
      
      {/* XP & Level Text */}
      <div className="mt-2 flex flex-col items-center">
        <h3 className={`font-orbitron ${dimensions.fontSize} font-semibold text-white`}>
          {levelData.title}
        </h3>
        <p className={`${dimensions.fontSize} text-center text-gray-400`}>
          {animatedXp.toLocaleString()} XP
          {nextLevelXp > animatedXp && (
            <span className="ml-1 text-[#9ecfff]">
              / {nextLevelXp.toLocaleString()}
            </span>
          )}
        </p>
        <div className="mt-2 h-1 w-full rounded-full bg-gray-800">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Level-Up Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="relative bg-gradient-to-b from-[#0f172a] to-[#0f1729] border border-[#9ecfff]/30 rounded-2xl p-8 max-w-md w-full shadow-xl">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowLevelUpModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="mb-6 h-24 w-24 rounded-full bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{level}</span>
              </div>
              
              <h2 className="text-2xl font-orbitron text-[#9ecfff] mb-2">
                Level {level} Unlocked!
              </h2>
              <h3 className="text-lg font-medium text-white mb-4">
                {levelData.title}
              </h3>
              <p className="text-gray-300 mb-6 text-center italic">
                "{levelData.message}"
              </p>
              
              <button
                className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setShowLevelUpModal(false)}
              >
                Continue Your Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};