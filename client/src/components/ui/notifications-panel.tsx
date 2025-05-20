import { useState, useEffect } from "react";
import { Link } from "wouter";
import { KodexModal } from "./kodex-modal";
import { Button } from "./button";
import { X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Badge Earned",
      message: "You've earned the Beginner's Mind badge!",
      timestamp: "2 hours ago",
      isRead: false,
      link: "/dashboard"
    },
    {
      id: "2",
      title: "Lab Progress Update",
      message: "You've completed 60% of Quantum Computing Basics",
      timestamp: "1 day ago",
      isRead: false,
      link: "/labs/1"
    },
    {
      id: "3",
      title: "Forum Activity",
      message: "Your post received 3 new comments",
      timestamp: "2 days ago",
      isRead: true,
      link: "/forum/1"
    },
    {
      id: "4",
      title: "New Lab Available",
      message: "Advanced Cryptography Lab is now available",
      timestamp: "4 days ago",
      isRead: true,
      link: "/labs"
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <KodexModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="md"
      position="right"
    >
      <div className="flex justify-between items-center mb-4 border-b border-[#1e293b] pb-2">
        <div className="text-sm text-gray-400">
          {notifications.filter(n => !n.isRead).length} unread
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead}
          className="text-[#9ecfff]/70 hover:text-[#9ecfff] hover:bg-[#1e293b]/50 text-xs"
        >
          Mark all as read
        </Button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`relative p-3 rounded-lg transition-all ${
                notification.isRead 
                  ? "bg-[#1e293b]/20" 
                  : "bg-[#1e293b]/40 border-l-2 border-[#9ecfff]"
              }`}
            >
              <div className="flex justify-between">
                <h4 className={`text-sm font-medium ${notification.isRead ? "text-gray-300" : "text-[#9ecfff]"}`}>
                  {notification.title}
                </h4>
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                {notification.link && (
                  <Link 
                    href={notification.link} 
                    onClick={() => {
                      markAsRead(notification.id);
                      onClose();
                    }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-[#9ecfff]/70 hover:text-[#9ecfff] hover:bg-[#1e293b]/50"
                    >
                      View
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
    </KodexModal>
  );
}