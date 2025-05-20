import { useState } from "react";
import { KodexModal } from "@/components/ui/kodex-modal";
import { Bell, Clock, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Notification {
  id: string;
  title: string;
  description?: string;
  type: "lab" | "comment" | "like" | "system";
  time: string;
  read: boolean;
  link?: string;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Mock notifications - would be fetched from API in real implementation
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Quantum Mechanics lab is now available",
      type: "lab",
      time: "2 hours ago",
      read: false,
      link: "/labs/2",
    },
    {
      id: "2",
      title: "@codemaster commented on your forum post",
      type: "comment",
      time: "Yesterday",
      read: false,
      link: "/forum/post/1",
    },
    {
      id: "3",
      title: "Your post received 5 new likes",
      type: "like",
      time: "3 days ago",
      read: true,
      link: "/forum/post/1",
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    // In a real application, we would send a request to mark the notification as read
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <Bell className="h-5 w-5 text-[#9ecfff]" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-[#9ecfff]" />;
      case "like":
        return <ThumbsUp className="h-5 w-5 text-[#9ecfff]" />;
      default:
        return <Bell className="h-5 w-5 text-[#9ecfff]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <KodexModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      showCloseButton={true}
    >
      <div className="divide-y divide-[#1e293b]">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <div className="flex justify-end py-2">
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="ghost"
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Mark all as read
                </Button>
              </div>
            )}

            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link || "#"}
                onClick={() => {
                  handleNotificationClick(notification.id);
                  onClose();
                }}
              >
                <div
                  className={`flex items-start gap-3 p-3 hover:bg-[#1e293b]/30 cursor-pointer transition-colors ${
                    !notification.read ? "bg-[#1e293b]/20" : ""
                  }`}
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        notification.read ? "text-gray-400" : "text-gray-200"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {notification.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-[#9ecfff] self-center"></div>
                  )}
                </div>
              </Link>
            ))}

            <div className="p-3 text-center">
              <Link href="/dashboard" onClick={onClose}>
                <Button
                  variant="ghost"
                  className="text-sm text-[#9ecfff] hover:text-[#9ecfff]/80"
                >
                  View all in Dashboard
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </KodexModal>
  );
}