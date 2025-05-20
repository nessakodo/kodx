import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EmptyActivityState } from './EmptyStates';

interface ActivityProps {
  type?: 'all' | 'lab' | 'project' | 'forum' | 'note';
  limit?: number;
}

export function ActivitySection({ type = 'all', limit = 4 }: ActivityProps) {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 4;
  
  // Fetch user activity
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/user-activity', type, page, pageSize],
    enabled: isAuthenticated,
  });
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  // Parse activity data
  const totalActivities = activities?.totalCount || 0;
  const activityItems = activities?.items || [];
  const totalPages = Math.ceil(totalActivities / pageSize);
  
  // Activity type icon and color
  const getActivityTypeInfo = (activityType: string) => {
    switch(activityType) {
      case 'lab':
        return {
          icon: '🧪',
          label: 'Lab Progress',
          color: {
            text: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/30'
          }
        };
      case 'project':
        return {
          icon: '🏗️',
          label: 'Project Update',
          color: {
            text: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30'
          }
        };
      case 'forum':
        return {
          icon: '💬',
          label: 'Forum Activity',
          color: {
            text: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30'
          }
        };
      case 'badge':
        return {
          icon: '🏅',
          label: 'Badge Earned',
          color: {
            text: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30'
          }
        };
      case 'note':
        return {
          icon: '🌱',
          label: 'Note Added',
          color: {
            text: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30'
          }
        };
      default:
        return {
          icon: '📊',
          label: 'Activity',
          color: {
            text: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30'
          }
        };
    }
  };

  // Render activity item
  const renderActivityItem = (activity: any) => {
    const { icon, label, color } = getActivityTypeInfo(activity.type);
    
    return (
      <div key={activity.id} className="flex items-start gap-3 py-4">
        <div className={`${color.bg} ${color.border} border rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Badge className={`${color.bg} ${color.text} mr-2`}>
                {label}
              </Badge>
              <h3 className="font-medium text-white line-clamp-1">{activity.title}</h3>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatRelativeTime(activity.timestamp)}</span>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-2 mb-1">{activity.description}</p>
          
          {activity.link && (
            <Link href={activity.link}>
              <a className="text-xs text-blue-400 hover:text-blue-300">View details</a>
            </Link>
          )}
        </div>
      </div>
    );
  };
  
  // Check if activity has data
  const hasData = Array.isArray(activityItems) && activityItems.length > 0;
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-amber-300">
          Recent Activity
        </h2>
        
        {totalActivities > pageSize && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-8 h-8 p-0 border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-gray-400">
              {page} / {totalPages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-8 h-8 p-0 border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <Card className="border border-[#1e293b] bg-[#0c1527]/50">
        {isLoading ? (
          // Loading skeleton
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1e293b]/50 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-2 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/50 rounded mb-2 w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : hasData ? (
          <div className="divide-y divide-[#1e293b]">
            {activityItems.map((activity: any, idx: number) => (
              <div key={activity.id || idx} className="px-6">
                {renderActivityItem(activity)}
              </div>
            ))}
            
            {totalActivities > pageSize && (
              <div className="px-6 py-4 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyActivityState />
        )}
      </Card>
    </section>
  );
}