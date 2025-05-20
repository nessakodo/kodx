import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Eye,
  Trophy,
  BookOpen,
  Heart,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyActivityState } from './EmptyStates';

export function NotificationsSection() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 4;
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications', page, pageSize],
    enabled: isAuthenticated,
  });
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  // Parse notifications data
  const totalNotifications = Array.isArray(notifications) 
    ? notifications.length 
    : (notifications?.totalCount || 0);
  const notificationItems = Array.isArray(notifications) 
    ? notifications 
    : (notifications?.items || []);
  const totalPages = Math.ceil(totalNotifications / pageSize);
  
  // Get notification type icon and styling
  const getNotificationTypeInfo = (type: string) => {
    switch(type) {
      case 'lab_progress':
        return {
          icon: <BookOpen className="h-5 w-5 text-indigo-400" />,
          label: 'Lab Progress',
          bgColor: 'bg-indigo-500/10', 
          borderColor: 'border-indigo-500/30',
          textColor: 'text-indigo-400'
        };
      case 'project_update':
        return {
          icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
          label: 'Project Update',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/30',
          textColor: 'text-cyan-400'
        };
      case 'badge_earned':
        return {
          icon: <Trophy className="h-5 w-5 text-violet-400" />,
          label: 'Badge Earned',
          bgColor: 'bg-violet-500/10',
          borderColor: 'border-violet-500/30',
          textColor: 'text-violet-400'
        };
      case 'post_liked':
        return {
          icon: <Heart className="h-5 w-5 text-blue-400" />,
          label: 'Post Liked',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30', 
          textColor: 'text-blue-400'
        };
      case 'welcome':
        return {
          icon: <Bell className="h-5 w-5 text-emerald-400" />,
          label: 'Welcome',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400'
        };
      default:
        return {
          icon: <Bell className="h-5 w-5 text-gray-400" />,
          label: 'Notification',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-400'
        };
    }
  };
  
  // Render notification item
  const renderNotificationItem = (notification: any) => {
    const { icon, label, bgColor, borderColor, textColor } = getNotificationTypeInfo(notification.type);
    const isNew = notification.isNew || notification.isUnread;
    
    return (
      <div 
        key={notification.id} 
        className={`p-4 border-l-4 ${borderColor} hover:bg-[#1e293b]/20 transition-colors relative ${
          isNew ? 'bg-[#1e293b]/30' : 'bg-transparent'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`${bgColor} rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-start justify-between mb-1">
              <div>
                {isNew && (
                  <Badge className="bg-blue-600 mb-1">New</Badge>
                )}
                <h3 className="font-orbitron text-lg text-white line-clamp-1">{notification.title}</h3>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(notification.timestamp)}</span>
            </div>
            
            <p className="text-sm text-gray-300 line-clamp-2 mb-2">{notification.message}</p>
            
            {notification.link && (
              <div className="flex justify-end">
                <Link href={notification.link}>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-right text-sm" 
                    size="sm"
                  >
                    <span className={textColor}>View</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {notification.link && (
            <ChevronRight className="h-4 w-4 text-gray-400 absolute top-4 right-4" />
          )}
        </div>
      </div>
    );
  };
  
  // Check if notifications exist
  const hasData = notificationItems.length > 0;
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-blue-300">
          Notifications
        </h2>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && hasData && (
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
          
          {totalNotifications > 0 && (
            <Badge className="bg-blue-600">
              {totalNotifications} {totalNotifications === 1 ? 'notification' : 'notifications'}
            </Badge>
          )}
        </div>
      </div>
      
      <Card className="border border-[#1e293b] bg-[#0c1527]/50">
        {isLoading ? (
          // Loading skeleton
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="h-10 w-10 rounded-full bg-[#1e293b]/50 animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 bg-[#1e293b]/50 rounded mb-2 w-3/4 animate-pulse" />
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-2 w-2/3 animate-pulse" />
                  <div className="flex justify-end">
                    <div className="h-4 w-16 bg-[#1e293b]/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasData ? (
          <div className="divide-y divide-[#1e293b]">
            {notificationItems.slice(0, pageSize).map((notification: any) => renderNotificationItem(notification))}
            
            {totalNotifications > pageSize && (
              <div className="p-4 text-center">
                <Link href="/notifications">
                  <Button
                    variant="outline"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                  >
                    View All Notifications
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8">
            <EmptyActivityState />
          </div>
        )}
      </Card>
    </section>
  );
}