import React from 'react';
import { Button } from '@/components/ui/button';
import { KodexModal } from '@/components/ui/kodex-modal';
import { EmptyNotificationsBox } from '@/components/notifications/EmptyNotificationsBox';
import { Badge } from '@/components/ui/badge';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  positionElement?: HTMLElement;
  onMarkAllAsRead: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'achievement' | 'system' | 'progress' | 'welcome';
}

export function NotificationsPanel({
  isOpen,
  onClose,
  positionElement,
  onMarkAllAsRead,
}: NotificationsPanelProps) {
  // Mock notifications - will come from API in the real app
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to KOD•X',
      message: 'Begin your journey into mindful technology and cyber-zen practices.',
      time: '2 days ago',
      read: false,
      type: 'welcome',
    },
    {
      id: '2',
      title: 'New Badge Earned',
      message: 'You\'ve earned the "Digital Explorer" badge. Keep up the good work!',
      time: '1 day ago',
      read: false,
      type: 'achievement',
    },
    {
      id: '3',
      title: 'Lab Progress Saved',
      message: 'Your progress in "Quantum Computing Basics" has been saved.',
      time: '5 hours ago',
      read: false,
      type: 'progress',
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    onMarkAllAsRead();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'progress':
        return (
          <div className="h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'welcome':
        return (
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <KodexModal
      isOpen={isOpen}
      onClose={onClose}
      positionElement={positionElement}
      title="Notifications"
      width="sm"
    >
      <div className="px-1 py-2">
        {/* Header with Mark All as Read button */}
        <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#9ecfff]/10">
          <h3 className="text-sm font-orbitron">Recent Notifications</h3>
          {notifications.some(n => !n.read) && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-[#9ecfff]/70 hover:text-[#9ecfff] hover:bg-[#9ecfff]/10"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-md flex items-start gap-3 transition-colors ${
                  notification.read 
                    ? 'bg-[#1e2535]/30'
                    : 'bg-[#1e2535]/70 border-l-2 border-[#9ecfff]/50'
                }`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                    {!notification.read && (
                      <Badge className="bg-[#9ecfff]/20 text-[#9ecfff] text-[0.6rem] ml-2">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                  <p className="text-[0.65rem] text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyNotificationsBox />
        )}
      </div>
    </KodexModal>
  );
}