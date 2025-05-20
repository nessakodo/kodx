import { useState } from "react";
import { KodexModal } from "@/components/ui/kodex-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckIcon, CalendarIcon, BookIcon, AwardIcon, MessageSquareIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "wouter";

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'achievement' | 'system' | 'message' | 'reminder' | 'update';
  link?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead?: () => void;
}

// Mock notifications - this would come from the API in a real app
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Achievement Unlocked",
    message: "You've earned the 'Digital Pioneer' badge for completing your first lab.",
    timestamp: "2025-05-19T10:30:00Z",
    read: false,
    type: "achievement",
    link: "/dashboard/badges"
  },
  {
    id: 2,
    title: "Forum Activity",
    message: "Your post 'Quantum Computing Ethics' received 5 new comments.",
    timestamp: "2025-05-18T15:45:00Z",
    read: false,
    type: "message",
    link: "/forum/12"
  },
  {
    id: 3,
    title: "New Lab Available",
    message: "Try our new 'Advanced Cryptography' lab to earn XP and badges.",
    timestamp: "2025-05-17T09:15:00Z",
    read: true,
    type: "update",
    link: "/labs/advanced-cryptography"
  },
  {
    id: 4,
    title: "Project Reminder",
    message: "You're making good progress on 'Secure Password Manager'. Keep it up!",
    timestamp: "2025-05-16T14:20:00Z",
    read: true,
    type: "reminder",
    link: "/projects/secure-password-manager"
  },
  {
    id: 5,
    title: "System Update",
    message: "KODEX platform will undergo maintenance on May 25, 2025, from 2-4 AM UTC.",
    timestamp: "2025-05-15T11:10:00Z",
    read: true,
    type: "system"
  }
];

export function NotificationsPanel({ isOpen, onClose, positionElement, onMarkAllAsRead }: NotificationsPanelProps & { positionElement?: HTMLElement }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 3;
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get notifications for the current page
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
  
  // Calculate total pages
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
    
    // Call the parent callback to update the badge count in the header
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };
  
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <AwardIcon className="h-5 w-5 text-[#bb86fc]" />;
      case 'message':
        return <MessageSquareIcon className="h-5 w-5 text-[#9ecfff]" />;
      case 'reminder':
        return <CalendarIcon className="h-5 w-5 text-[#03dac6]" />;
      case 'update':
        return <BookIcon className="h-5 w-5 text-[#cf6679]" />;
      case 'system':
      default:
        return <BellIcon className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  };
  
  return (
    <KodexModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="sm"
      position={{
        element: positionElement,
        placement: "bottom",
        offset: 5
      }}
    >
      <div className="space-y-3 max-h-[80vh]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#1e2535]/70 text-white px-2 py-1">
              {unreadCount} New
            </Badge>
            <span className="text-sm text-gray-400">
              {notifications.length} Total
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-[#9ecfff] hover:text-white text-xs h-8"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckIcon className="h-3 w-3 mr-1" />
            Mark all as read
          </Button>
        </div>
        
        <div className="divide-y divide-[#1e2535] max-h-[50vh] overflow-y-auto">
          {currentNotifications.length > 0 ? (
            currentNotifications.map(notification => (
              <div
                key={notification.id}
                className={`py-3 ${!notification.read ? 'bg-[#1e2535]/30' : ''} transition-colors cursor-pointer hover:bg-[#1e2535]/60`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-[#1e2535]/70 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 mb-2">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs text-[#9ecfff] hover:text-white"
                        >
                          View details
                        </Button>
                      </Link>
                    )}
                    {!notification.read && (
                      <div className="flex justify-end">
                        <Badge className="h-2 w-2 rounded-full bg-[#9ecfff] p-0" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <BellIcon className="h-12 w-12 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-2 mt-2 border-t border-[#1e2535]">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                className={`w-8 h-8 p-0 ${
                  currentPage === index + 1
                    ? "bg-[#9ecfff]/20 border-[#9ecfff]/40"
                    : "bg-transparent border-[#1e2535]"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex justify-center pt-2 border-t border-[#1e2535]">
          <Link href="/dashboard/notifications">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-sm text-[#9ecfff] hover:text-white flex items-center gap-1"
            >
              View all in dashboard
              <ArrowRightIcon className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </KodexModal>
  );
}