import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface XPRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  pulseEffect?: boolean;
}

export function XPRing({ 
  percentage,
  size = "md",
  className,
  pulseEffect = false
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
  
  // Animate the percentage on mount
  useEffect(() => {
    const duration = 1200; // Animation duration in ms
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
  }, [percentage]);

  // Calculate the ring properties
  const circleRadius = {
    sm: 16,
    md: 26,
    lg: 40
  }[size];
  
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference * (1 - animatedPercentage / 100);
  
  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
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
  );
}