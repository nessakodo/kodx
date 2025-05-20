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
import {
  BADGE_CATEGORY_COLORS, 
  BADGE_RARITY_EFFECTS,
  type Badge as BadgeType
} from '@shared/constants/badges';

interface BadgeModalProps {
  badge: BadgeType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BadgeModal({ badge, open, onOpenChange }: BadgeModalProps) {
  const [animate, setAnimate] = useState(false);
  
  // Start animation when modal opens with a badge
  useEffect(() => {
    if (open && badge) {
      // Small delay to ensure modal is visible before animation starts
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [open, badge]);
  
  if (!badge) {
    return null;
  }
  
  // Get badge styling based on category and rarity
  const categoryColors = BADGE_CATEGORY_COLORS[badge.category];
  const rarityEffects = BADGE_RARITY_EFFECTS[badge.rarity];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a]/95 border-[#9ecfff]/30 backdrop-blur-lg max-w-lg overflow-hidden">
        {/* Animation overlay - rays */}
        <div 
          className={`absolute inset-0 ${animate ? 'opacity-50' : 'opacity-0'} transition-opacity duration-1000 pointer-events-none`}
          style={{ 
            background: `radial-gradient(circle, transparent 30%, #0f172a 70%), 
                         conic-gradient(from 0deg, 
                          ${categoryColors.gradient} 0%, 
                          transparent 10%, 
                          transparent 45%, 
                          ${categoryColors.gradient} 50%, 
                          transparent 55%, 
                          transparent 90%, 
                          ${categoryColors.gradient} 100%)` 
          }}
        />
        
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-orbitron text-white">
            <span className="text-blue-300">Badge Earned!</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You've unlocked a new achievement
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center">
          {/* Badge display */}
          <div 
            className={`mb-6 transition-all duration-1000 ${animate ? 'scale-100' : 'scale-0'}`}
          >
            {/* Badge icon wrapper */}
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mb-4 border-4 mx-auto"
              style={{ 
                borderColor: rarityEffects.borderColor,
                boxShadow: rarityEffects.glow,
                animation: animate ? rarityEffects.animation : 'none',
                background: `radial-gradient(circle, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)`,
              }}
            >
              {/* Badge icon */}
              <span 
                className={`text-6xl font-orbitron ${categoryColors.text}`}
                style={{ 
                  textShadow: `0 0 15px ${categoryColors.gradient}` 
                }}
              >
                {badge.name.charAt(0)}
              </span>
            </div>
            
            {/* Badge info */}
            <div className="text-center">
              <h3 className="font-orbitron text-xl text-white mb-2">
                {badge.name}
              </h3>
              <p className="text-gray-300 mb-4">
                {badge.description}
              </p>
              
              <div className="flex justify-center gap-2 mb-6">
                <Badge className={`${categoryColors.bg} ${categoryColors.text}`}>
                  {badge.category}
                </Badge>
                <Badge className="bg-[#1e293b] text-white capitalize">
                  {badge.rarity}
                </Badge>
              </div>
              
              <p className="text-gray-400 text-sm">
                Earned {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => onOpenChange(false)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}