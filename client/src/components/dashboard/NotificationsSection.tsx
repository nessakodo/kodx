import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronRight, 
  ChevronLeft, 
  Bell, 
  Heart, 
  CheckCircle, 
  Award, 
  MessageSquare, 
  Eye 
} from 'lucide-react';

// Notification types
export type NotificationType = 
  | 'welcome' 
  | 'badge_earned' 
  | 'lab_progress' 
  | 'project_progress' 
  | 'forum_like' 
  | 'forum_comment' 
  | 'forum_featured' 
  | 'event';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  iconColor: string;
}

// Interface for props
interface NotificationsSectionProps {
  limit?: number;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'welcome':
      return <Eye className="h-5 w-5" />;
    case 'badge_earned':
      return <Award className="h-5 w-5" />;
    case 'lab_progress':
    case 'project_progress':
      return <CheckCircle className="h-5 w-5" />;
    case 'forum_like':
      return <Heart className="h-5 w-5" />;
    case 'forum_comment':
      return <MessageSquare className="h-5 w-5" />;
    case 'forum_featured':
      return <Award className="h-5 w-5" />;
    case 'event':
      return <Bell className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

export function NotificationsSection({ limit = 4 }: NotificationsSectionProps) {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  // Fetch notifications with React Query
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['/api/notifications', page, limit],
    enabled: isAuthenticated,
  });

  // Default to empty array if no data or loading
  const notifications: Notification[] = notificationsData?.items || [];
  const totalCount = notificationsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Invalidate query to refresh the data
      // Note: In a full implementation, this would use queryClient.invalidateQueries
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Empty state when no notifications
  if (notifications.length === 0 && !isLoading) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl text-blue-300">
            Notifications
          </h2>
        </div>
        
        <Card className="border border-[#1e293b] bg-[#0c1527]/50">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Bell className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-orbitron text-blue-300 mb-3">No Notifications</h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Your notification timeline is a blank canvas. 
              Engage with labs, projects, and the community to see updates here.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/labs">
                <Button 
                  variant="outline" 
                  className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                >
                  Explore Labs
                </Button>
              </Link>
              
              <Link href="/forum">
                <Button 
                  variant="outline" 
                  className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  Join Community Forum
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl text-blue-300">
            Notifications
          </h2>
        </div>
        
        <Card className="border border-[#1e293b] bg-[#0c1527]/50 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#1e293b]/70 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#1e293b]/70 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/70 rounded w-full animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/70 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Render notifications with pagination
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-blue-300">
          Notifications
        </h2>
        
        {notifications.length > 0 && (
          <Button 
            variant="ghost" 
            className="text-blue-300 hover:text-blue-200"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <Card className="border border-[#1e293b] bg-[#0c1527]/50">
        <div className="divide-y divide-[#1e293b]">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 flex items-start space-x-4 ${!notification.read ? 'bg-blue-900/10' : ''}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: `${notification.iconColor}30`, borderColor: notification.iconColor }}
              >
                <div className="text-[#fff]">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white">
                    {notification.title}
                    {!notification.read && (
                      <Badge className="ml-2 bg-blue-500 text-white">
                        New
                      </Badge>
                    )}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-300 mt-1">
                  {notification.message}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {notification.timestamp}
                  </span>
                  
                  {notification.link && (
                    <Link href={notification.link}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-300 hover:text-blue-200 p-0 h-auto"
                      >
                        View <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination - only show if we have more than the limit */}
        {totalCount > limit && (
          <div className="p-4 border-t border-[#1e293b] flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {`Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} of ${totalCount}`}
            </span>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-300">
                Page {page} of {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={page === totalPages}
                className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}