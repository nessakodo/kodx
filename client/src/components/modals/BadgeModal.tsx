import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCategory, BadgeRarity, BADGE_CATEGORY_COLORS, BADGE_RARITY_EFFECTS } from '@shared/constants/badges';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    id: string;
    name: string;
    description: string;
    category: BadgeCategory;
    rarity: BadgeRarity;
    reward?: string;
  };
}

export function BadgeModal({
  isOpen,
  onClose,
  badge
}: BadgeModalProps) {
  // Play sound effect on open
  useEffect(() => {
    if (isOpen) {
      // Sound effect code would go here if implemented
    }
  }, [isOpen]);

  // Get category color
  const categoryColor = BADGE_CATEGORY_COLORS[badge.category] || { text: 'text-gray-400', bg: 'bg-gray-400/10' };
  
  // Get rarity effect
  const rarityEffect = BADGE_RARITY_EFFECTS[badge.rarity] || {};
  
  // Determine gradient based on rarity
  const getGradient = () => {
    switch (badge.rarity) {
      case 'common':
        return 'from-gray-400 to-white';
      case 'uncommon':
        return 'from-blue-400 to-cyan-300';
      case 'rare':
        return 'from-purple-400 to-indigo-300';
      case 'epic':
        return 'from-amber-400 to-yellow-300';
      case 'legendary':
        return 'from-red-400 to-rose-300';
      default:
        return 'from-gray-400 to-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-[#0f172a]/95 backdrop-blur-sm border border-[#9ecfff]/20 max-w-lg overflow-hidden p-0">
            <DialogHeader className="bg-gradient-to-r from-[#1e2535]/80 to-[#1e2535]/40 p-6 pb-8 relative">
              <motion.div
                className="absolute inset-0 z-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Particle effect background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(158,207,255,0.15)_0%,rgba(187,134,252,0.05)_50%,rgba(0,0,0,0)_100%)]"></div>
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: Math.random() * 4,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15, 
                      delay: 0.2 
                    }}
                    className="relative"
                  >
                    <div 
                      className="absolute inset-0 rounded-full opacity-30 blur-md"
                      style={{ 
                        background: `radial-gradient(circle, ${rarityEffect.glowColor || '#9ecfff'} 0%, transparent 70%)` 
                      }}
                    ></div>
                    
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-[#1e2535] border-2 border-[#9ecfff]/30">
                      <div 
                        className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${getGradient()} bg-opacity-20`}
                        style={{
                          boxShadow: rarityEffect.glow,
                          animation: rarityEffect.animation
                        }}
                      >
                        <span className="text-4xl font-orbitron text-white">
                          {badge.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <DialogTitle className="font-orbitron text-2xl text-center bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent mb-1">
                    New Badge Earned
                  </DialogTitle>
                  
                  <div className="font-orbitron text-xl text-white text-center mb-4">
                    {badge.name}
                  </div>
                  
                  <div className="flex gap-2 justify-center mb-2">
                    <Badge className={`${categoryColor.text} ${categoryColor.bg}`}>
                      {badge.category}
                    </Badge>
                    <Badge className={`text-${
                      badge.rarity === 'common' ? 'gray-400' :
                      badge.rarity === 'uncommon' ? 'blue-400' :
                      badge.rarity === 'rare' ? 'purple-400' :
                      badge.rarity === 'epic' ? 'amber-400' : 'red-400'
                    } bg-[#1e2535]`}>
                      {badge.rarity}
                    </Badge>
                  </div>
                </motion.div>
              </div>
            </DialogHeader>
            
            <div className="p-6 pt-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <div className="text-center text-gray-300 mb-4">
                  {badge.description}
                </div>
                
                {badge.reward && (
                  <div className="text-center text-sm text-cyan-400 mb-4 p-3 border border-cyan-500/20 bg-cyan-500/5 rounded-md">
                    <div className="font-medium mb-1">Reward Unlocked</div>
                    {badge.reward}
                  </div>
                )}
                
                <div className="text-center text-sm text-gray-500">
                  View your badge collection in your profile to track your progress.
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <Button 
                  className="bg-gradient-to-r from-[#9ecfff]/20 to-[#bb86fc]/20 hover:from-[#9ecfff]/30 hover:to-[#bb86fc]/30 border border-[#9ecfff]/30"
                  onClick={onClose}
                >
                  Accept
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}