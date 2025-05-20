import { Link } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ArrowRightIcon, GitForkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  difficulty: string;
  xpReward: number;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  // Define difficulty badge styling
  const difficultyStyles = {
    beginner: {
      gradientClasses: "from-[#9ecfff]/10 to-[#88c9b7]/10",
      borderClasses: "border-[#9ecfff]/20",
      label: "Beginner"
    },
    intermediate: {
      gradientClasses: "from-[#b166ff]/10 to-[#9ecfff]/10",
      borderClasses: "border-[#b166ff]/20",
      label: "Intermediate"
    },
    advanced: {
      gradientClasses: "from-[#ff5c5c]/10 to-[#b166ff]/10",
      borderClasses: "border-[#ff5c5c]/20",
      label: "Advanced"
    }
  };

  const difficultyStyle = difficultyStyles[project.difficulty as keyof typeof difficultyStyles] || difficultyStyles.beginner;

  // Image placeholders based on difficulty
  const imagePlaceholders = {
    beginner: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    intermediate: "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    advanced: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7"
  };

  const imageSrc = imagePlaceholders[project.difficulty as keyof typeof imagePlaceholders] || imagePlaceholders.intermediate;

  return (
    <GlassmorphicCard 
      className={cn("overflow-hidden flex flex-col h-full transition-all hover:border-[#9ecfff]/30 group", className)}
      hoverEffect
    >
      <div className="relative">
        <img 
          src={imageSrc} 
          alt={project.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-[#1e2535]/80 backdrop-blur text-xs px-3 py-1 rounded-full">
          PROJECT {project.id.toString().padStart(2, '0')}
        </div>
        <div className="absolute top-4 right-4 flex gap-1">
          <Badge 
            className="bg-[#1e2535]/80 backdrop-blur text-xs px-3 py-1 rounded-full flex items-center gap-1"
          >
            <StarIcon className="h-3 w-3 text-[#9ecfff]" /> {project.xpReward} XP
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-orbitron text-white text-xl mb-2">{project.title}</h3>
        <p className="text-gray-500 mb-4 flex-1">{project.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge 
            className={`text-xs uppercase tracking-wider bg-gradient-to-r ${difficultyStyle.gradientClasses} px-2 py-1 rounded border ${difficultyStyle.borderClasses}`}
          >
            {difficultyStyle.label}
          </Badge>
          
          <div className="flex items-center gap-2">
            <a 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-[#88c9b7] hover:underline flex items-center"
            >
              <GitForkIcon className="mr-1 h-3 w-3" /> Repo
            </a>
            <Link href={`/projects/${project.id}`}>
              <a className="text-sm text-[#9ecfff] font-medium group-hover:underline flex items-center">
                Start Project <ArrowRightIcon className="ml-1 h-3 w-3" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
