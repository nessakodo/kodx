import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  borderColor: string;
  titleColor: string;
}

export function EmptyState({
  title,
  subtitle,
  description,
  actionLabel,
  actionHref,
  borderColor,
  titleColor
}: EmptyStateProps) {
  return (
    <div className={`p-6 rounded-md border ${borderColor} bg-black/40 backdrop-blur-sm`}>
      <h3 className={`text-xl font-orbitron ${titleColor} mb-1`}>{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{subtitle}</p>
      <p className="text-gray-300 text-sm mb-6">{description}</p>
      
      {actionLabel && actionHref && (
        <div className="flex justify-center">
          <Link href={actionHref}>
            <Button 
              className={`${borderColor.replace('border-', 'bg-').replace('/30', '/20')} hover:${borderColor.replace('border-', 'bg-').replace('/30', '/30')}`}
            >
              {actionLabel}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function EmptyLabsState() {
  return (
    <EmptyState
      title="No Labs In Progress"
      subtitle="Your journey of digital enlightenment awaits"
      description="Labs are interactive learning experiences that guide you through key concepts in technology, cybersecurity, and digital mindfulness. Each completed lab earns you XP and unlocks new possibilities."
      actionLabel="Explore Labs"
      actionHref="/labs"
      borderColor="border-indigo-500/30"
      titleColor="text-indigo-300"
    />
  );
}

export function EmptyProjectsState() {
  return (
    <EmptyState
      title="No Projects In Progress"
      subtitle="Your digital craftsmanship begins here"
      description="Projects are hands-on challenges that let you apply what you've learned in labs to real-world scenarios. Complete projects to earn badges and build your digital portfolio."
      actionLabel="Browse Projects"
      actionHref="/projects"
      borderColor="border-cyan-500/30"
      titleColor="text-cyan-300"
    />
  );
}

export function EmptyBadgesState() {
  return (
    <EmptyState
      title="No Badges Yet"
      subtitle="Your achievements will be recognized here"
      description="Badges represent milestones in your journey through KodexZen. They're awarded for completing labs, projects, and contributing to the community. Your first badge awaits your actions."
      actionLabel="Badge System"
      actionHref="/profile/badges"
      borderColor="border-purple-500/30"
      titleColor="text-purple-300"
    />
  );
}

export function EmptyReflectionsState() {
  return (
    <EmptyState
      title="No Reflections Yet"
      subtitle="The mindful learner documents their path"
      description="Reflections are your personal insights captured during labs and projects. They help you process what you've learned and create a record of your growth journey through technology."
      actionLabel="Learn About Reflections"
      actionHref="/reflections"
      borderColor="border-emerald-500/30"
      titleColor="text-emerald-300"
    />
  );
}

export function EmptyForumActivityState() {
  return (
    <EmptyState
      title="No Forum Activity"
      subtitle="Your voice awaits its expression"
      description="Share your insights, ask questions, or connect with others to begin your community engagement. Your contributions will shape the collective knowledge of KODΞX.WORLD."
      actionLabel="Browse Forum"
      actionHref="/forum"
      borderColor="border-teal-500/30"
      titleColor="text-teal-300"
    />
  );
}

export function EmptySavedPostsState() {
  return (
    <EmptyState
      title="No Saved Posts"
      subtitle="Wisdom awaits your curation"
      description="Save insightful forum posts to revisit them later. Your saved collection becomes a personalized repository of knowledge that evolves alongside your journey."
      actionLabel="Discover Posts"
      actionHref="/forum"
      borderColor="border-blue-500/30"
      titleColor="text-blue-300"
    />
  );
}