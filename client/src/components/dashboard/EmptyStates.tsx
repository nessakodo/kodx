import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  colorClass?: string;
  borderClass?: string;
}

const defaultColors = {
  labs: {
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    hover: "hover:bg-indigo-500/20"
  },
  projects: {
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    hover: "hover:bg-cyan-500/20"
  },
  badges: {
    text: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    hover: "hover:bg-purple-500/20"
  },
  forum: {
    text: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    hover: "hover:bg-blue-500/20"
  },
  reflection: {
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    hover: "hover:bg-emerald-500/20"
  },
  activity: {
    text: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    hover: "hover:bg-amber-500/20"
  },
  notification: {
    text: "text-pink-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
    hover: "hover:bg-pink-500/20"
  }
};

// Reusable base empty state
export function EmptyState({ 
  icon, 
  title, 
  message, 
  actionText, 
  actionLink, 
  colorClass = "text-blue-400",
  borderClass = "border-blue-500/30"
}: EmptyStateProps) {
  return (
    <Card className={`p-8 flex flex-col items-center justify-center text-center border ${borderClass} bg-[#0f172a]/70`}>
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      
      <h3 className={`text-xl font-orbitron mb-2 ${colorClass}`}>{title}</h3>
      
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      
      {actionText && actionLink && (
        <Link href={actionLink}>
          <Button 
            variant="outline" 
            className={`${borderClass} ${colorClass} bg-transparent hover:bg-[#1e293b]`}
          >
            {actionText}
          </Button>
        </Link>
      )}
    </Card>
  );
}

// Empty Labs State
export function EmptyLabsState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-indigo-400">🧪</span>}
      title="No Labs in Progress"
      message="Labs are interactive sessions designed to enhance your technical knowledge and skills in a guided environment."
      actionText="Explore Labs"
      actionLink="/labs"
      colorClass={defaultColors.labs.text}
      borderClass={defaultColors.labs.border}
    />
  );
}

// Empty Projects State
export function EmptyProjectsState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-cyan-400">🏗️</span>}
      title="No Projects Started"
      message="Projects are hands-on building experiences where you apply your skills to create real solutions."
      actionText="Browse Projects"
      actionLink="/projects"
      colorClass={defaultColors.projects.text}
      borderClass={defaultColors.projects.border}
    />
  );
}

// Empty Badges State
export function EmptyBadgesState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-purple-400">🏅</span>}
      title="No Badges Earned Yet"
      message="Badges represent milestones in your learning journey. Complete labs, projects, and engage with the community to earn them."
      actionText="View Badge System"
      actionLink="/profile/badges"
      colorClass={defaultColors.badges.text}
      borderClass={defaultColors.badges.border}
    />
  );
}

// Empty Forum State based on type (posts or saved)
export function EmptyForumState({ type = "posts" }: { type?: "posts" | "saved" }) {
  if (type === "saved") {
    return (
      <EmptyState
        icon={<span className="font-orbitron text-blue-400">🔖</span>}
        title="No Saved Posts"
        message="Save interesting forum posts to revisit them later. This is your personal knowledge collection."
        actionText="Browse Forum"
        actionLink="/forum"
        colorClass={defaultColors.forum.text}
        borderClass={defaultColors.forum.border}
      />
    );
  }
  
  return (
    <EmptyState
      icon={<span className="font-orbitron text-blue-400">💬</span>}
      title="No Forum Activity"
      message="Share your insights, ask questions, or contribute to discussions to build your presence in the community."
      actionText="Start a Discussion"
      actionLink="/forum/new"
      colorClass={defaultColors.forum.text}
      borderClass={defaultColors.forum.border}
    />
  );
}

// Empty Reflections State
export function EmptyReflectionsState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-emerald-400">🌱</span>}
      title="No Reflections Recorded"
      message="Reflections are your personal notes on your learning journey. Document insights, questions, and connections."
      actionText="Start Reflecting"
      actionLink="/reflect/new"
      colorClass={defaultColors.reflection.text}
      borderClass={defaultColors.reflection.border}
    />
  );
}

// Empty Activity State
export function EmptyActivityState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-amber-400">📊</span>}
      title="Your Timeline is a Blank Canvas"
      message="Activity will appear here as you engage with labs, projects, forums, and other experiences on the platform."
      colorClass={defaultColors.activity.text}
      borderClass={defaultColors.activity.border}
    />
  );
}

// Empty Notifications State
export function EmptyNotificationsState() {
  return (
    <EmptyState
      icon={<span className="font-orbitron text-pink-400">🔔</span>}
      title="Silence is Signal"
      message="No notifications at the moment. We'll alert you about important updates, achievements, and community interactions."
      colorClass={defaultColors.notification.text}
      borderClass={defaultColors.notification.border}
    />
  );
}