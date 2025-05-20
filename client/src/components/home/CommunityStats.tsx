import { useState, useEffect } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { BeakerIcon, UsersIcon, CodeIcon } from "lucide-react";

export function CommunityStats() {
  const [labsCount, setLabsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  
  // Animate counting effect
  useEffect(() => {
    const duration = 2000; // ms for the animation
    const framesPerSecond = 60;
    const totalFrames = duration / 1000 * framesPerSecond;
    
    let currentFrame = 0;
    
    const targetLabsCount = 216;
    const targetUsersCount = 200;
    const targetProjectsCount = 78;
    
    const interval = setInterval(() => {
      const progress = currentFrame / totalFrames;
      
      // Apply easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setLabsCount(Math.floor(easedProgress * targetLabsCount));
      setUsersCount(Math.floor(easedProgress * targetUsersCount));
      setProjectsCount(Math.floor(easedProgress * targetProjectsCount));
      
      currentFrame++;
      
      if (currentFrame > totalFrames) {
        setLabsCount(targetLabsCount);
        setUsersCount(targetUsersCount);
        setProjectsCount(targetProjectsCount);
        clearInterval(interval);
      }
    }, 1000 / framesPerSecond);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-12 mb-8">
      <h2 className="font-orbitron text-2xl md:text-3xl text-center mb-8 text-white tracking-wide">Community Impact</h2>
      
      <GlassmorphicCard className="p-6 md:p-8 relative overflow-hidden border border-[#1e293b]/50">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/70 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              icon={<BeakerIcon className="h-7 w-7" />}
              value={labsCount}
              label="Labs Completed"
              colorClass="text-[#9ecfff] border-[#9ecfff]/30 bg-[#0f1c2e]"
            />
            
            <StatCard 
              icon={<UsersIcon className="h-7 w-7" />}
              value={usersCount}
              label="Active Members"
              colorClass="text-[#88c9b7] border-[#88c9b7]/30 bg-[#0f1c2e]"
              showPlus
            />
            
            <StatCard 
              icon={<CodeIcon className="h-7 w-7" />}
              value={projectsCount}
              label="Projects Published"
              colorClass="text-[#a29eff] border-[#a29eff]/30 bg-[#0f1c2e]"
            />
          </div>
        </div>
      </GlassmorphicCard>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  colorClass: string;
  showPlus?: boolean;
}

function StatCard({ icon, value, label, colorClass, showPlus = false }: StatCardProps) {
  return (
    <div className={`flex flex-col items-center text-center py-6 px-4 rounded-xl border ${colorClass} transition-all`}>
      <div className="mb-4">
        {icon}
      </div>
      <div className="font-orbitron text-4xl text-white tracking-wider mb-2">
        {showPlus ? value + "+" : value}
      </div>
      <div className="text-gray-400 uppercase text-xs tracking-wider">{label}</div>
    </div>
  );
}