import { useState, useEffect } from "react";

interface XPRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
}

export function XPRing({ percentage, size = "md" }: XPRingProps) {
  const [rotation, setRotation] = useState(0);
  
  // Size mappings
  const sizesMap = {
    sm: { width: 80, height: 80, strokeWidth: 3 },
    md: { width: 100, height: 100, strokeWidth: 4 },
    lg: { width: 120, height: 120, strokeWidth: 5 },
  };
  
  const { width, height, strokeWidth } = sizesMap[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Slow constant rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      {/* Rotating background ring */}
      <svg 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" 
        width={width + 10} 
        height={height + 10} 
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
          cx={(width + 10) / 2} 
          cy={(height + 10) / 2} 
          r={radius + 5} 
          fill="none" 
          stroke="url(#ringGradient)" 
          strokeWidth="1" 
        />
      </svg>
      
      {/* Progress ring */}
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ecfff" />
            <stop offset="100%" stopColor="#88c9b7" />
          </linearGradient>
        </defs>
        <circle 
          cx={width / 2} 
          cy={height / 2} 
          r={radius} 
          fill="none" 
          stroke="rgba(158, 207, 255, 0.1)" 
          strokeWidth={strokeWidth} 
        />
        <circle 
          cx={width / 2} 
          cy={height / 2} 
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
    </div>
  );
}