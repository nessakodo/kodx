import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateLevel, calculateLevelProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, TrophyIcon, SparklesIcon } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface XpRingProgressProps {
  xp: number;
  username: string;
  profileImageUrl?: string;
}

export function XpRingProgress({ xp, username, profileImageUrl }: XpRingProgressProps) {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [lastLevelShown, setLastLevelShown] = useState(0);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const level = calculateLevel(xp);
  const progress = calculateLevelProgress(xp);
  
  // Check for level up on xp changes
  useEffect(() => {
    if (lastLevelShown === 0) {
      // Initialize the last level shown
      setLastLevelShown(level);
    } else if (level > lastLevelShown) {
      // User has leveled up!
      setShowLevelUpModal(true);
      setLastLevelShown(level);
    }
  }, [level, lastLevelShown]);
  
  // Animate XP value on mount
  useEffect(() => {
    const duration = 1500; // Animation duration in ms
    const startTime = Date.now();
    const endValue = xp;
    
    const animateXp = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use ease-out cubic function for smoother animation
      const progressEased = 1 - Math.pow(1 - progress, 3);
      setAnimatedXp(Math.floor(progressEased * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animateXp);
      }
    };
    
    requestAnimationFrame(animateXp);
  }, [xp]);
  
  // Calculate level-specific rewards and messages
  const getLevelRewards = (level: number) => {
    const rewards = [
      { name: "Digital Sanctuary Basic Access", description: "You can now access basic digital privacy tools" },
      { name: "Project Creation", description: "You can now create your own custom projects" },
      { name: "Advanced Lab Access", description: "Intermediate labs are now available to you" },
      { name: "Mentor Connection", description: "Connect with mentors in the community" },
      { name: "Custom Badge Creator", description: "Create and share custom badges with the community" }
    ];
    
    // Return appropriate rewards based on level
    return rewards.slice(0, Math.min(level, rewards.length));
  };

  // Calculate the ring circumference and stroke-dashoffset
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference * (1 - progress / 100);
  
  // Level-specific messages
  const getLevelMessage = (level: number) => {
    const messages = [
      "You've started your journey. The path to digital zen begins.",
      "Foundations established. Your tech sanctuary is taking shape.",
      "Growing expertise. Your digital skills are flourishing.",
      "Approaching mastery. Your digital zen presence is noticed.",
      "Zen master status achieved. You're guiding others on their journey.",
    ];
    
    return messages[Math.min(level - 1, messages.length - 1)];
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative cursor-help"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {/* XP Tooltip */}
        {isTooltipVisible && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-[#1e2535]/90 border border-[#9ecfff]/30 rounded-lg shadow-lg z-10 text-center">
            <div className="text-sm font-medium text-gray-200">Level {level} – {progress}% complete</div>
            <div className="text-xs text-gray-400 mt-1">
              {progress < 100 ? `Keep going! ${xp} / ${Math.pow(level + 1, 2) * 500} XP` : "Ready to level up!"}
            </div>
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-[#1e2535]/90 border-r border-b border-[#9ecfff]/30"></div>
          </div>
        )}
      
        {/* Background Circle */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="8" 
            stroke="#1e293b" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset="0"
            className="opacity-30"
          />
        </svg>
        
        {/* Progress Circle with Animation */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2 -rotate-90 transform">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="8" 
            stroke="url(#gradient)" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow Effect */}
        <svg width="140" height="140" viewBox="0 0 140 140" className="absolute -top-2 -left-2 -rotate-90 transform">
          <circle 
            cx="70" 
            cy="70" 
            r={circleRadius} 
            strokeWidth="2" 
            stroke="url(#gradientGlow)" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            filter="blur(4px)"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ecfff" />
              <stop offset="100%" stopColor="#88c9b7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Avatar */}
        <div className="relative flex items-center justify-center">
          <Avatar className="h-32 w-32 border-4 border-[#1e293b] shadow-xl">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback className="text-2xl font-medium bg-gradient-to-r from-[#2a3a4a] to-[#1e2535]">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Level and XP Display */}
      <div className="mt-4 text-center">
        <div className="text-base sm:text-lg font-orbitron bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent mb-1">
          @{username}
        </div>
        <div className="text-base sm:text-lg text-gray-300 mb-1">Level {level}</div>
        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">
          {animatedXp.toLocaleString()} XP
        </div>
        <div className="text-xs text-gray-500 mt-1">{progress}% to Level {level + 1}</div>
      </div>
      
      {/* Level Up Modal */}
      <Dialog open={showLevelUpModal} onOpenChange={setShowLevelUpModal}>
        <DialogContent className="bg-gradient-to-br from-[#1e2535] to-[#111827] border border-[#9ecfff]/30 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center border-2 border-[#9ecfff]/40">
                <SparklesIcon className="h-8 w-8 text-[#9ecfff]" />
              </div>
              <span>Level Up!</span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              You've reached <span className="text-[#9ecfff] font-bold">Level {level}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <p className="text-gray-300 mb-6">"{getLevelMessage(level)}"</p>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium flex items-center justify-center gap-2">
                <TrophyIcon className="h-5 w-5 text-amber-400" /> 
                Rewards Unlocked
              </h4>
              
              <div className="space-y-3">
                {getLevelRewards(level).map((reward, index) => (
                  <div 
                    key={index} 
                    className="bg-[#1e293b] border border-[#9ecfff]/20 p-3 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#9ecfff]/20 text-[#9ecfff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LightbulbIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-200">{reward.name}</h5>
                      <p className="text-sm text-gray-400">{reward.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
              <Button
                className="sm:flex-1 bg-[#1e293b]/80 hover:bg-[#1e293b] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-gray-200"
                onClick={() => setShowLevelUpModal(false)}
              >
                Continue
              </Button>
              <Button
                className="sm:flex-1 bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 border border-[#9ecfff]/30 hover:border-[#9ecfff]/60 text-[#9ecfff]"
                onClick={() => {
                  // Add forum reflection functionality here
                  setShowLevelUpModal(false);
                }}
              >
                Share Your Journey
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}