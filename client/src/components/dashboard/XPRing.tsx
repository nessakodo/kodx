import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface XPRingProps {
  totalXp?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPRing({ totalXp = 0, size = 'md', className = '' }: XPRingProps) {
  // Calculate level and next level XP requirement
  const { data: levelData } = useQuery({
    queryKey: ['/api/levels'],
  });
  
  // Calculate level from XP
  const calculateLevel = (xp: number): { level: number; currentLevelXp: number; nextLevelXp: number } => {
    if (!levelData || !Array.isArray(levelData.levels)) {
      // Default level progression if no data
      const level = Math.max(1, Math.floor(Math.sqrt(xp / 100)));
      const currentLevelXp = (level - 1) * (level - 1) * 100;
      const nextLevelXp = level * level * 100;
      return { level, currentLevelXp, nextLevelXp };
    }
    
    // Find level in data
    let level = 1;
    let currentLevelXp = 0;
    let nextLevelXp = levelData.levels[0].xpRequired;
    
    for (let i = 0; i < levelData.levels.length; i++) {
      if (xp < levelData.levels[i].xpRequired) {
        break;
      }
      level = levelData.levels[i].level + 1;
      currentLevelXp = levelData.levels[i].xpRequired;
      nextLevelXp = i < levelData.levels.length - 1 
        ? levelData.levels[i + 1].xpRequired 
        : currentLevelXp * 1.5; // Estimate for max level
    }
    
    return { level, currentLevelXp, nextLevelXp };
  };
  
  const { level, currentLevelXp, nextLevelXp } = calculateLevel(totalXp);
  
  // Calculate progress for current level
  const levelProgress = nextLevelXp - currentLevelXp;
  const currentProgress = totalXp - currentLevelXp;
  const progressPercentage = Math.min(Math.floor((currentProgress / levelProgress) * 100), 100);
  
  // State for animation
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Size configuration based on prop
  const sizeConfig = {
    sm: {
      ringSize: 'w-16 h-16',
      textSize: 'text-xl',
      labelSize: 'text-[8px]',
      strokeWidth: 5
    },
    md: {
      ringSize: 'w-24 h-24',
      textSize: 'text-3xl',
      labelSize: 'text-[10px]',
      strokeWidth: 6
    },
    lg: {
      ringSize: 'w-32 h-32',
      textSize: 'text-4xl',
      labelSize: 'text-xs',
      strokeWidth: 8
    }
  };
  
  // Animate the progress ring on load and when totalXp changes
  useEffect(() => {
    setAnimatedProgress(0); // Reset for animation
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage, totalXp]);
  
  const { ringSize, textSize, labelSize, strokeWidth } = sizeConfig[size];
  
  return (
    <div className={`relative ${ringSize} ${className}`}>
      {/* Outer static ring - represents the max level */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-700 opacity-30"></div>
      
      {/* Inner progress ring - shows progress to next level */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="#0362c3" 
          strokeWidth={strokeWidth}
          strokeDasharray={`${animatedProgress * 2.827} 282.7`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="#4f99ff" 
          strokeWidth={strokeWidth / 2}
          strokeDasharray={`${animatedProgress * 2.827} 282.7`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out opacity-50"
        />
      </svg>
      
      {/* Level Number in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSize} font-orbitron font-bold text-white`}>{level}</span>
        <span className={`${labelSize} text-gray-400 font-orbitron`}>LEVEL</span>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full filter blur-md bg-blue-500 opacity-10"></div>
    </div>
  );
}