import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from './BadgeDisplay';
import { BADGES } from '@shared/constants/badges';

// Empty state for when a user has no XP or progress
export const EmptyProgressState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-8 py-10 space-y-4 text-center rounded-lg border border-gray-800 bg-black/20 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">Your path is unwritten.</h3>
      <p className="text-gray-400 max-w-md">
        Begin your first Lab to earn XP and unlock your digital evolution.
      </p>
      <p className="text-sm text-gray-500 italic">
        No XP yet – but your journey starts with a single line of code.
      </p>
      <Link href="/labs">
        <Button className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white">
          Explore Labs
        </Button>
      </Link>
    </div>
  );
};

// Empty state for when a user has no labs started
export const EmptyLabsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-8 py-10 space-y-4 text-center rounded-lg border border-gray-800 bg-black/20 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">No Labs Started Yet</h3>
      <p className="text-gray-400 max-w-md">
        Explore topics like cybersecurity, AI, or mindful dev practices.
        Begin with a Beginner Lab to get grounded in your flow.
      </p>
      <p className="text-sm text-gray-500 italic">
        "In stillness, potential gathers. Choose a Lab to activate your path."
      </p>
      <Link href="/labs">
        <Button className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white">
          Browse Labs
        </Button>
      </Link>
    </div>
  );
};

// Empty state for when a user has no projects
export const EmptyProjectsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-8 py-10 space-y-4 text-center rounded-lg border border-gray-800 bg-black/20 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">Your creative space is waiting.</h3>
      <p className="text-gray-400 max-w-md">
        Projects let you build real-world apps and deepen your learning.
      </p>
      <p className="text-sm text-gray-500 italic">
        "What you create here becomes a reflection of your digital sovereignty."
        Start with a simple project—or remix a template to begin.
      </p>
      <Link href="/projects">
        <Button className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white">
          Discover Projects
        </Button>
      </Link>
    </div>
  );
};

// Empty state for when a user has no badges
export const EmptyBadgesState: React.FC = () => {
  // Show a few greyed-out badges to demonstrate what they can earn
  const sampleBadges = [
    BADGES.find(b => b.id === 'founder'),
    BADGES.find(b => b.id === 'lab_starter'),
    BADGES.find(b => b.id === 'project_builder')
  ].filter(Boolean);
  
  return (
    <div className="flex flex-col items-center justify-center px-8 py-10 space-y-6 text-center rounded-lg border border-gray-800 bg-black/20 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">No badges yet, but infinite potential.</h3>
      <p className="text-gray-400 max-w-md">
        Complete Labs, Projects, and reflections to earn unique digital artifacts.
      </p>
      <p className="text-sm text-gray-500 italic">
        "Badges aren't rewards—they're markers of transformation."
      </p>
      
      <div className="grid grid-cols-3 gap-6 w-full max-w-md">
        {sampleBadges.map(badge => badge && (
          <div key={badge.id} className="flex flex-col items-center">
            <BadgeDisplay badge={badge} size="md" />
            <p className="mt-2 text-xs text-gray-500">{badge.name}</p>
          </div>
        ))}
      </div>
      
      <Link href="/labs">
        <Button className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white">
          Begin Your Journey
        </Button>
      </Link>
    </div>
  );
};

// Empty state for when a user has no reflections
export const EmptyReflectionsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-8 py-10 space-y-4 text-center rounded-lg border border-gray-800 bg-black/20 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">No reflections yet.</h3>
      <p className="text-gray-400 max-w-md">
        When you complete Labs or Projects, you'll be prompted to journal your insights.
      </p>
      <p className="text-sm text-gray-500 italic">
        "Reflection makes experience meaningful. You'll know when it's time to pause and write."
      </p>
      <Link href="/forum">
        <Button className="bg-gradient-to-r from-[#9ecfff] to-[#6d28d9] hover:opacity-90 text-white">
          Browse Community Reflections
        </Button>
      </Link>
    </div>
  );
};