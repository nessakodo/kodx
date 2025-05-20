import { Link } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ArrowRightIcon, BeakerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lab {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  progress?: number;
}

interface LabCardProps {
  lab: Lab;
  className?: string;
}

export function LabCard({ lab, className }: LabCardProps) {
  // Define difficulty badge styling
  const difficultyColors = {
    beginner: {
      border: "border-[#6fcf97]/30",
      text: "text-[#6fcf97]",
      label: "Beginner"
    },
    intermediate: {
      border: "border-[#56ccf2]/30",
      text: "text-[#56ccf2]",
      label: "Intermediate"
    },
    advanced: {
      border: "border-[#bb86fc]/30",
      text: "text-[#bb86fc]",
      label: "Advanced"
    }
  };

  const difficultyStyle = difficultyColors[lab.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;

  // Image placeholders based on difficulty
  const imagePlaceholders = {
    beginner: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    intermediate: "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    advanced: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7"
  };

  const imageSrc = imagePlaceholders[lab.difficulty as keyof typeof imagePlaceholders] || imagePlaceholders.beginner;
  
  // Check if the lab is in progress
  const isInProgress = lab.progress && lab.progress > 0;

  return (
    <GlassmorphicCard 
      className={cn("overflow-hidden flex flex-col h-full transition-all hover:border-[#9ecfff]/30 group", className)}
    >
      <div className="relative">
        <img 
          src={imageSrc} 
          alt={lab.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-[#1e2535]/80 backdrop-blur text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <BeakerIcon className="h-3 w-3 text-[#9ecfff]" /> LAB {lab.id.toString().padStart(2, '0')}
        </div>
        <div className="absolute top-4 right-4 flex gap-1">
          <Badge 
            className="bg-[#1e2535]/80 backdrop-blur text-xs px-3 py-1 rounded-full flex items-center gap-1"
          >
            <StarIcon className="h-3 w-3 text-[#9ecfff]" /> {lab.xpReward} XP
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-orbitron text-white text-xl mb-2">{lab.title}</h3>
        <p className="text-gray-500 mb-4 flex-1">{lab.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge 
            className={`text-xs uppercase tracking-wider bg-transparent px-2 py-1 rounded border ${difficultyStyle.border} ${difficultyStyle.text} font-orbitron letter-spacing-wide`}
          >
            {difficultyStyle.label}
          </Badge>
          
          <Link href={`/labs/${lab.id}`}>
            <div className="inline-flex items-center px-3 py-1 rounded bg-[#1e2535]/50 border border-[#9ecfff]/20 
              text-[#9ecfff] text-sm hover:bg-[#1e2535]/80 hover:border-[#9ecfff]/30 transition-all">
              {isInProgress ? "Continue" : "Start"} Lab <ArrowRightIcon className="ml-1 h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
