import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-3xl">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-12">
        <UserDashboard />
      </div>
    </MainLayout>
  );
}