import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { SimpleDashboard } from '@/components/dashboard/SimpleDashboard';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(true);

  // Check if database is available
  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setIsDatabaseAvailable(data.database === 'connected');
      } catch (error) {
        console.error('Error checking database status:', error);
        setIsDatabaseAvailable(false);
      }
    };

    if (isAuthenticated) {
      checkDatabaseStatus();
    }
  }, [isAuthenticated]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-orbitron text-white">Loading your enlightenment journey...</h2>
        </div>
      </div>
    );
  }

  // Choose which dashboard to display based on database availability
  return isDatabaseAvailable ? <UserDashboard /> : <SimpleDashboard />;
}