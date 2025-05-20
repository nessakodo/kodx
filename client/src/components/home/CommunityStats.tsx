import { useState, useEffect } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { BeakerIcon, UsersIcon, CodeIcon } from "lucide-react";

export function CommunityStats() {
  const [labsCount, setLabsCount] = useState(16);
  const [usersCount, setUsersCount] = useState(200);
  const [projectsCount, setProjectsCount] = useState(78);
  
  // Animate counting effect
  useEffect(() => {
    const duration = 2000; // ms for the animation
    const framesPerSecond = 60;
    const totalFrames = duration / 1000 * framesPerSecond;
    
    let currentFrame = 0;
    
    const targetLabsCount = 16;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<BeakerIcon className="h-6 w-6 text-[#88c9b7]" />}
        value={labsCount}
        label="Labs Completed"
        color="[#88c9b7]"
      />
      
      <StatCard 
        icon={<UsersIcon className="h-6 w-6 text-[#9ecfff]" />}
        value={usersCount}
        label="Active Technologists"
        color="[#9ecfff]"
        showPlus
      />
      
      <StatCard 
        icon={<CodeIcon className="h-6 w-6 text-[#bb86fc]" />}
        value={projectsCount}
        label="Projects Published"
        color="[#bb86fc]"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  showPlus?: boolean;
}

function StatCard({ icon, value, label, color, showPlus = false }: StatCardProps) {
  return (
    <GlassmorphicCard className="p-6 text-center flex flex-col items-center transition-all hover:shadow-[0_0_15px_rgba(30,41,59,0.5)]">
      <div className={`mb-3 bg-${color}/10 p-3 rounded-full border border-${color}/30`}>
        {icon}
      </div>
      
      <div className="font-orbitron text-3xl text-white mb-1">
        {showPlus ? value + "+" : value}
      </div>
      
      <div className="text-gray-400">{label}</div>
    </GlassmorphicCard>
  );
}