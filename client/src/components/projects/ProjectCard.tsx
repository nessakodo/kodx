import { Link } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ArrowRightIcon, GithubIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  difficulty: string;
  xpReward: number;
  progress?: number;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
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

  const difficultyStyle = difficultyColors[project.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;

  // Image placeholders based on difficulty
  const imagePlaceholders = {
    beginner: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    intermediate: "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    advanced: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7"
  };

  const imageSrc = imagePlaceholders[project.difficulty as keyof typeof imagePlaceholders] || imagePlaceholders.intermediate;

  // Check if the project is in progress
  const isInProgress = project.progress && project.progress > 0;

  return (
    <GlassmorphicCard 
      className={cn("overflow-hidden flex flex-col h-full transition-all hover:border-[#9ecfff]/30 group", className)}
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
          <DifficultyBadge level={project.difficulty} />
          
          <div className="flex items-center gap-3">
            <a 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Fork on GitHub"
              aria-label="Fork on GitHub"
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center h-8 w-8 bg-[#1e2535]/50 rounded-full border border-[#1e2535]/70 hover:border-[#1e2535]/90"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <Link href={`/projects/${project.id}`}>
              <div className="btn-kodex inline-flex items-center px-3 py-1 rounded text-sm">
                {isInProgress ? "Continue" : "Start"} Project <ArrowRightIcon className="ml-1 h-3 w-3" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
