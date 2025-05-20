import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface XPRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  currentValue?: number;
  totalValue?: number;
  pulseEffect?: boolean;
  animationSpeed?: "slow" | "medium" | "fast";
}

export function XPRing({
  percentage = 0,
  size = "md", 
  showValue = false,
  currentValue,
  totalValue,
  pulseEffect = false,
  animationSpeed = "medium"
}: XPRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  // Canvas ring animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ringRadius = (size === "sm" ? 30 : size === "md" ? 40 : 50);
    const ringThickness = (size === "sm" ? 4 : size === "md" ? 5 : 6);
    
    const drawRing = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background ring
      context.beginPath();
      context.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      context.strokeStyle = "rgba(30, 41, 59, 0.5)";
      context.lineWidth = ringThickness;
      context.stroke();
      
      // Draw progress ring
      if (percentage > 0) {
        const startAngle = -Math.PI / 2; // Start at top
        const endAngle = (-Math.PI / 2) + (2 * Math.PI * (percentage / 100));
        
        // Gradient for progress ring
        const gradient = context.createLinearGradient(
          centerX - ringRadius, 
          centerY, 
          centerX + ringRadius, 
          centerY
        );
        gradient.addColorStop(0, "#9ecfff");
        gradient.addColorStop(0.5, "#88c9b7");
        gradient.addColorStop(1, "#6fcf97");
        
        context.beginPath();
        context.arc(centerX, centerY, ringRadius, startAngle, endAngle);
        context.strokeStyle = gradient;
        context.lineWidth = ringThickness;
        context.stroke();
        
        // Add glowing effect to progress ring
        context.beginPath();
        context.arc(centerX, centerY, ringRadius, startAngle, endAngle);
        context.strokeStyle = "rgba(158, 207, 255, 0.3)";
        context.lineWidth = ringThickness + 3;
        context.globalAlpha = 0.5;
        context.stroke();
        context.globalAlpha = 1;
        
        // Draw small circles along the progress ring (particle effect)
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
          const particleAngle = startAngle + ((endAngle - startAngle) * (i / (particleCount - 1)));
          const particleX = centerX + (ringRadius * Math.cos(particleAngle));
          const particleY = centerY + (ringRadius * Math.sin(particleAngle));
          
          context.beginPath();
          context.arc(particleX, particleY, ringThickness / 2, 0, 2 * Math.PI);
          context.fillStyle = "rgba(158, 207, 255, 0.8)";
          context.fill();
        }
      }
    };
    
    drawRing();
    
    // Rotate the entire canvas for animation effect
    const animateRotation = () => {
      const speedFactor = animationSpeed === "slow" ? 0.1 : animationSpeed === "medium" ? 0.2 : 0.3;
      setRotationAngle(prev => (prev + speedFactor) % 360);
    };
    
    // Only animate if there's progress
    let animationFrame: number;
    if (percentage > 0) {
      const animate = () => {
        animateRotation();
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [percentage, size, animationSpeed]);
  
  // Apply rotation to the ring wrapper
  useEffect(() => {
    if (ringRef.current && percentage > 0) {
      ringRef.current.style.transform = `rotate(${rotationAngle}deg)`;
    }
  }, [rotationAngle, percentage]);
  
  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };
  
  // Font size classes
  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  return (
    <div className="relative inline-flex items-center justify-center z-10">
      {/* Rotating canvas for ambient effect */}
      <div 
        ref={ringRef}
        className={cn(
          "absolute inset-0 transition-transform duration-1000",
          sizeClasses[size]
        )}
      >
        <canvas 
          ref={canvasRef}
          width={size === "sm" ? 80 : size === "md" ? 120 : 160}
          height={size === "sm" ? 80 : size === "md" ? 120 : 160}
          className="w-full h-full"
        />
      </div>
      
      {/* Outer glow effect */}
      {percentage > 0 && pulseEffect && (
        <div 
          className={cn(
            "absolute rounded-full opacity-20 animate-pulse-slow",
            sizeClasses[size],
            "shadow-[0_0_15px_rgba(158,207,255,0.8)]"
          )}
        />
      )}
      
      {/* Inner content */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          sizeClasses[size],
          pulseEffect && percentage > 0 && "animate-pulse-slow"
        )}
      >
        {showValue ? (
          <div className="text-center">
            <div className={cn("font-orbitron text-white", {
              "text-lg": size === "lg",
              "text-base": size === "md",
              "text-sm": size === "sm",
            })}>
              {currentValue || percentage}
            </div>
            {totalValue && (
              <div className={cn("text-gray-400", fontSizeClasses[size])}>
                / {totalValue}
              </div>
            )}
          </div>
        ) : (
          <div className={cn("font-orbitron text-white", {
            "text-lg": size === "lg",
            "text-base": size === "md",
            "text-sm": size === "sm",
          })}>
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );
}