import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

// UI Components
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Icons
import {
  Bell,
  Award,
  MessageSquare,
  Heart,
  Star,
  CheckCircle,
  Calendar,
  BookOpenCheck,
  Code,
  Eye
} from 'lucide-react';

// Types
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

interface NotificationsSectionProps {
  limit?: number;
}

// Helper function to get the appropriate icon for each notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'welcome':
      return <Eye className="h-5 w-5" />;
    case 'badge_earned':
      return <Award className="h-5 w-5" />;
    case 'lab_progress':
      return <BookOpenCheck className="h-5 w-5" />;
    case 'project_progress':
      return <Code className="h-5 w-5" />;
    case 'forum_like':
      return <Heart className="h-5 w-5" />;
    case 'forum_comment':
      return <MessageSquare className="h-5 w-5" />;
    case 'forum_featured':
      return <Star className="h-5 w-5" />;
    case 'event':
      return <Calendar className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

// Helper function to get appropriate background color for notification type
const getNotificationBgColor = (type: NotificationType): string => {
  switch (type) {
    case 'welcome':
      return 'bg-green-500/20 border-green-500/30'; 
    case 'badge_earned':
      return 'bg-violet-500/20 border-violet-500/30';
    case 'lab_progress':
      return 'bg-indigo-500/20 border-indigo-500/30'; 
    case 'project_progress':
      return 'bg-cyan-500/20 border-cyan-500/30';
    case 'forum_like':
      return 'bg-pink-500/20 border-pink-500/30';
    case 'forum_comment':
      return 'bg-blue-500/20 border-blue-500/30'; 
    case 'forum_featured':
      return 'bg-amber-500/20 border-amber-500/30';
    case 'event':
      return 'bg-emerald-500/20 border-emerald-500/30';
    default:
      return 'bg-blue-900/10 border-blue-500/30';
  }
};

export function NotificationsSection({ limit = 4 }: NotificationsSectionProps) {
  // Fetch notifications from API
  const { data = {}, isLoading, refetch } = useQuery({
    queryKey: ['/api/notifications'],
  });
  
  // Extract notifications and total count, handle pagination
  const notifications: Notification[] = data.items || [];
  const totalCount = data.totalCount || 0;
  const [page, setPage] = useState(1);
  const hasMore = totalCount > limit;
  
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      refetch();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Empty state for when there are no notifications
  if (notifications.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl text-blue-300">
            Notifications
          </h2>
        </div>
        
        <Card className="border border-[#1e293b] bg-[#0c1527]/50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-orbitron text-blue-300">Recent Notifications</h3>
            </div>
            
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-500/10 border border-blue-500/30">
                <Bell className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-orbitron text-blue-300 mb-3">No Recent Activity</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Your timeline is a blank canvas. Once you begin your first Lab, Project, 
                or Forum thread, your journey will unfold here.
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
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-blue-300">
          Notifications
        </h2>
        {totalCount > 0 && (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            {totalCount} {totalCount === 1 ? 'notification' : 'notifications'}
          </Badge>
        )}
      </div>
      
      <Card className="border border-[#1e293b] bg-[#0c1527]/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-orbitron text-blue-300">Recent Notifications</h3>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-blue-300 hover:text-blue-200"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {notifications.slice(0, limit).map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 flex items-start space-x-4 rounded-md border ${notification.read ? 'opacity-70' : ''} ${getNotificationBgColor(notification.type)}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
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
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                    
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-200 p-0 h-auto">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {hasMore && (
          <div className="p-4 border-t border-[#1e293b] text-center">
            <Button
              variant="ghost"
              onClick={() => setPage(page => page + 1)}
              className="text-blue-300 hover:text-blue-200"
            >
              View All Notifications
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}