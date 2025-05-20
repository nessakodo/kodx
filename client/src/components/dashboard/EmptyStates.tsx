import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Code, Trophy, FileText, MessageSquare, BellOff } from "lucide-react";

// Base empty state component with cyber-zen styling
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  bgColor = "bg-blue-500/10",
  borderColor = "border-blue-500/30",
  iconColor = "text-blue-400" 
}) => {
  return (
    <div className={`p-8 rounded-lg border ${borderColor} ${bgColor} flex flex-col items-center justify-center text-center`}>
      <div className={`${iconColor} mb-4 p-3 rounded-full border ${borderColor} bg-black/20`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-orbitron text-lg text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className={`shadow-glow-sm ${borderColor.replace('border-', 'shadow-')}`}>
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

// Specific empty states for different content types
export function EmptyLabsState() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No Labs In Progress"
      description="Labs are interactive sessions designed to enhance your technical knowledge and skills in a guided environment."
      actionLabel="Explore Labs"
      actionHref="/labs"
      bgColor="bg-indigo-500/10"
      borderColor="border-indigo-500/30"
      iconColor="text-indigo-400"
    />
  );
}

export function EmptyProjectsState() {
  return (
    <EmptyState
      icon={Code}
      title="No Projects Started"
      description="Projects are practical applications with guided instructions to help you build your portfolio and apply your skills."
      actionLabel="Browse Projects"
      actionHref="/projects"
      bgColor="bg-cyan-500/10"
      borderColor="border-cyan-500/30"
      iconColor="text-cyan-400"
    />
  );
}

export function EmptyBadgesState() {
  return (
    <EmptyState
      icon={Trophy}
      title="No Badges Earned Yet"
      description="Badges represent milestones in your learning journey. Complete labs, projects, and engage with the community to earn them."
      actionLabel="View Badge System"
      actionHref="/badges"
      bgColor="bg-violet-500/10"
      borderColor="border-violet-500/30"
      iconColor="text-violet-400"
    />
  );
}

export function EmptyNotesState() {
  return (
    <EmptyState
      icon={FileText}
      title="No Notes Created"
      description="Create notes to document your learning journey, capture insights, and track your progress."
      actionLabel="Create a Note"
      actionHref="/notes/new"
      bgColor="bg-emerald-500/10"
      borderColor="border-emerald-500/30"
      iconColor="text-emerald-400"
    />
  );
}

export function EmptyActivityState() {
  return (
    <EmptyState
      icon={BellOff}
      title="No Activity Yet"
      description="Your recent activity will appear here as you engage with labs, projects, and the community."
      bgColor="bg-blue-500/10"
      borderColor="border-blue-500/30"
      iconColor="text-blue-400"
    />
  );
}

export function EmptyForumState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No Forum Activity"
      description="Join discussions and connect with other learners to enhance your learning experience."
      actionLabel="Visit Forum"
      actionHref="/forum"
      bgColor="bg-blue-500/10"
      borderColor="border-blue-500/30"
      iconColor="text-blue-400"
    />
  );
}