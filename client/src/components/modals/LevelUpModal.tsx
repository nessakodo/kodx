import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { XPRing } from '@/components/dashboard/XPRing';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  title: string;
  message: string;
  xp: number;
}

export function LevelUpModal({
  isOpen,
  onClose,
  level,
  title,
  message,
  xp
}: LevelUpModalProps) {
  // Play sound effect on open
  useEffect(() => {
    if (isOpen) {
      // Sound effect code would go here if implemented
    }
  }, [isOpen]);

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
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] opacity-30 blur-md"></div>
                      <XPRing xp={xp} size={120} strokeWidth={6} />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <DialogTitle className="font-orbitron text-2xl text-center bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent mb-1">
                    Level {level} Achieved
                  </DialogTitle>
                  
                  <div className="font-orbitron text-xl text-white text-center mb-4">
                    {title}
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
                  {message}
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  Continue your journey to unlock new abilities and insights.
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
                  Continue
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}