import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface XPRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  pulseEffect?: boolean;
  showValue?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
  currentValue?: number;
  totalValue?: number;
}

export function XPRing({ 
  percentage,
  size = "md",
  className,
  pulseEffect = false,
  showValue = false,
  animationSpeed = "normal",
  currentValue,
  totalValue
}: XPRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  // Determine the size of the ring
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };
  
  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 6
  };
  
  const animationSpeedValues = {
    slow: 3000,
    normal: 1200,
    fast: 800
  };
  
  // Animate the percentage on mount
  useEffect(() => {
    const duration = animationSpeedValues[animationSpeed]; 
    const startTime = Date.now();
    const endValue = percentage;
    
    const animatePercentage = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use ease-out cubic function for smoother animation
      const progressEased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercentage(progressEased * endValue);
      
      if (progress < 1) {
        requestAnimationFrame(animatePercentage);
      }
    };
    
    requestAnimationFrame(animatePercentage);
  }, [percentage, animationSpeed]);

  // Calculate the ring properties
  const circleRadius = {
    sm: 16,
    md: 26,
    lg: 40
  }[size];
  
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference * (1 - animatedPercentage / 100);
  
  // Subtle constant rotation effect
  const rotationAnimation = "animate-ring-rotate";
  
  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Background Circle */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            strokeWidth={strokeWidth[size]} 
            stroke="#1e293b" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset="0"
            className="opacity-30"
          />
        </svg>
        
        {/* Glow effect for progress near completion */}
        {percentage > 85 && (
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 -rotate-90 transform">
            <circle 
              cx="50" 
              cy="50" 
              r={circleRadius + 2} 
              strokeWidth="1" 
              stroke="url(#gradientGlow)" 
              fill="none" 
              strokeLinecap="round"
              filter="blur(4px)"
              className="opacity-70 animate-pulse"
            />
            <defs>
              <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ecfff" />
                <stop offset="100%" stopColor="#88c9b7" />
              </linearGradient>
            </defs>
          </svg>
        )}
        
        {/* Subtle rotating background to create motion */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className={cn("absolute inset-0", rotationAnimation)}>
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius + 1} 
            strokeWidth="1" 
            stroke="url(#gradientAmbient)" 
            fill="none" 
            strokeDasharray="3,5" 
            className="opacity-20"
          />
          <defs>
            <linearGradient id="gradientAmbient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Progress Circle with Animation */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 -rotate-90 transform">
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            strokeWidth={strokeWidth[size]} 
            stroke="url(#gradientXP)" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            className={cn(
              "transition-all duration-1000 ease-out",
              pulseEffect && "animate-pulse"
            )}
          />
          <defs>
            <linearGradient id="gradientXP" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Percentage Display in Center */}
        <div className="z-10 text-center flex items-center justify-center font-medium">
          <span className={cn(
            "bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}>
            {Math.round(animatedPercentage)}%
          </span>
        </div>
      </div>
      
      {/* XP Value Below (Optional) */}
      {showValue && currentValue !== undefined && totalValue !== undefined && (
        <div className="mt-1 text-xs text-center">
          <span className="text-[#9ecfff] font-medium">{currentValue}</span>
          <span className="text-gray-500"> / {totalValue} XP</span>
        </div>
      )}
    </div>
  );
}