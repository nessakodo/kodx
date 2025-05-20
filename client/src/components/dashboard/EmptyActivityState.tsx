import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Empty state for recent activity section
export function EmptyActivityState() {
  return (
    <Card className="border border-blue-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-blue-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-blue-300 font-orbitron">No Recent Activity</CardTitle>
        <CardDescription className="text-blue-200/80">
          Your timeline is a blank canvas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Once you begin your first Lab, Project, or Forum thread, your journey will unfold here.
          Each step you take will be recorded to track your progress through KODΞX.WORLD.
        </p>
      </CardContent>
    </Card>
  );
}

// Empty state for notifications
export function EmptyNotificationsState() {
  return (
    <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-purple-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-purple-300 font-orbitron">No Notifications</CardTitle>
        <CardDescription className="text-purple-200/80">
          Silence is signal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          You have no new notifications right now. Stay present. When the time comes, you'll be notified.
          Engage in Labs, Projects, or Forum to spark activity.
        </p>
      </CardContent>
    </Card>
  );
}

// Empty state for forum activity
export function EmptyForumActivityState() {
  return (
    <Card className="border border-teal-500/30 bg-black/40 backdrop-blur-sm shadow-lg shadow-teal-900/20 w-full">
      <CardHeader>
        <CardTitle className="text-teal-300 font-orbitron">No Forum Activity</CardTitle>
        <CardDescription className="text-teal-200/80">
          Your voice awaits its expression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Share your insights, ask questions, or connect with others to begin your community engagement.
          Your contributions will shape the collective knowledge of KODΞX.WORLD.
        </p>
      </CardContent>
    </Card>
  );
}