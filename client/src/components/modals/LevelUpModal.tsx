import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XPRing } from '@/components/dashboard/XPRing';
import { getLevelData } from '@shared/constants/levels';

interface LevelUpModalProps {
  level: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelUpModal({ level, open, onOpenChange }: LevelUpModalProps) {
  const [animate, setAnimate] = useState(false);
  
  // Get level data
  const levelData = getLevelData(level);
  
  // Start animation when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure modal is visible before animation starts
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [open]);
  
  // Calculate color based on level
  const getLevelColor = () => {
    if (level < 5) return 'blue';
    if (level < 10) return 'purple';
    if (level < 20) return 'pink';
    if (level < 35) return 'amber';
    return 'emerald';
  };
  
  // Generate color classes based on level
  const colorClass = getLevelColor();
  const textColor = `text-${colorClass}-400`;
  const bgColor = `bg-${colorClass}-500/10`;
  const borderColor = `border-${colorClass}-500/30`;
  const glowColor = {
    blue: 'rgba(96, 165, 250, 0.5)',
    purple: 'rgba(167, 139, 250, 0.5)',
    pink: 'rgba(244, 114, 182, 0.5)',
    amber: 'rgba(251, 191, 36, 0.5)',
    emerald: 'rgba(52, 211, 153, 0.5)'
  }[colorClass];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a]/95 border-[#9ecfff]/30 backdrop-blur-lg max-w-lg overflow-hidden">
        {/* Animation overlay - rays */}
        <div 
          className={`absolute inset-0 ${animate ? 'opacity-40' : 'opacity-0'} transition-opacity duration-1000 pointer-events-none`}
          style={{ 
            background: `radial-gradient(circle, transparent 30%, #0f172a 70%), 
                         repeating-conic-gradient(from 0deg, 
                          ${glowColor} 0%, 
                          transparent 5%, 
                          transparent 47.5%,  
                          ${glowColor} 50%,
                          transparent 52.5%,
                          transparent 95%,
                          ${glowColor} 100%)` 
          }}
        />
        
        <DialogHeader className="text-center mb-4 relative z-10">
          <DialogTitle className="text-2xl font-orbitron-wide text-white">
            <span className={textColor}>LEVEL UP!</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You've reached a new milestone in your journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center relative z-10">
          {/* Level ring with animation */}
          <div 
            className={`mb-6 transition-all duration-1000 transform ${animate ? 'scale-100' : 'scale-0'}`}
          >
            <div 
              className={`p-8 rounded-full ${bgColor} ${borderColor} border-2`}
              style={{ 
                boxShadow: animate ? `0 0 30px ${glowColor}` : 'none',
                transition: 'box-shadow 1s ease-in-out' 
              }}
            >
              <XPRing 
                totalXp={levelData.xpRequired} 
                size="xl"
                showTooltip={false}
                className="translate-z-0"
              />
            </div>
          </div>
          
          {/* Level details */}
          <div className={`text-center transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-orbitron text-2xl text-white mb-2">
              <span className={textColor}>Level {level}</span> Achieved
            </h3>
            
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              <span className="font-medium text-white">{levelData.title}:</span>{" "}
              {levelData.message}
            </p>
            
            <h4 className="text-sm font-medium text-gray-400 mb-3">Milestone Rewards</h4>
            <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-xs mx-auto">
              <Badge className={`${bgColor} ${textColor}`}>
                +500 XP Bonus
              </Badge>
              <Badge className={`${bgColor} ${textColor}`}>
                New Capabilities
              </Badge>
              {level % 5 === 0 && (
                <Badge className="bg-amber-500/10 text-amber-400">
                  Special Badge
                </Badge>
              )}
              {level % 10 === 0 && (
                <Badge className="bg-purple-500/10 text-purple-400">
                  Advanced Features
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => onOpenChange(false)}
            className={`mt-2 bg-${colorClass}-600 hover:bg-${colorClass}-700 text-white`}
            style={{ backgroundColor: glowColor, color: 'white' }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}