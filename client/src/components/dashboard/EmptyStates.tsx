import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Empty state for labs section
export function EmptyLabsState() {
  return (
    <Card className="border border-indigo-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-indigo-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-indigo-300">No Labs In Progress</CardTitle>
        <CardDescription className="text-indigo-200/80">
          Your journey of digital enlightenment awaits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Labs are interactive learning experiences that guide you through key concepts in technology, 
          cybersecurity, and digital mindfulness. Each completed lab earns you XP and unlocks new possibilities.
        </p>
        <div className="flex justify-center">
          <Button asChild className="bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500/50">
            <Link href="/labs">
              Explore Labs
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state for projects section
export function EmptyProjectsState() {
  return (
    <Card className="border border-cyan-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-cyan-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-cyan-300">No Projects In Progress</CardTitle>
        <CardDescription className="text-cyan-200/80">
          Where theory meets practice on your learning path
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Projects are practical, hands-on challenges that help you apply your knowledge in real-world scenarios.
          Each project you undertake expands your skillset and demonstrates your growing mastery.
        </p>
        <div className="flex justify-center">
          <Button asChild className="bg-cyan-700 hover:bg-cyan-600 text-white border border-cyan-500/50">
            <Link href="/projects">
              Discover Projects
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state for badges section
export function EmptyBadgesState() {
  return (
    <Card className="border border-violet-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-violet-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-violet-300">No Badges Yet</CardTitle>
        <CardDescription className="text-violet-200/80">
          Your achievements will be recognized here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Badges represent milestones in your journey through KodexZen. They're awarded for completing labs, 
          projects, and contributing to the community. Your first badge awaits your actions.
        </p>
        <div className="flex justify-center">
          <Button asChild className="bg-violet-700 hover:bg-violet-600 text-white border border-violet-500/50">
            <Link href="/profile/badges">
              Badge System
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state for reflections section (renamed from Notes)
export function EmptyReflectionsState() {
  return (
    <Card className="border border-emerald-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-emerald-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-emerald-300">No Reflections Yet</CardTitle>
        <CardDescription className="text-emerald-200/80">
          The mindful learner documents their path
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Reflections are your personal insights captured during labs and projects. They help you
          process what you've learned and create a record of your growth journey through technology.
        </p>
        <div className="flex justify-center">
          <Button className="bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50">
            Learn About Reflections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state for XP with 0 XP
export function EmptyXPState() {
  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-blue-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-blue-900/20">
      <h3 className="text-blue-300 font-medium text-lg">No XP Yet</h3>
      <p className="text-center text-gray-300 text-sm">
        Embark on your first lab or project to begin earning experience points and advancing your journey.
      </p>
    </div>
  );
}