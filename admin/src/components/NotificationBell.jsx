import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();

    // Connect to WebSocket
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Click outside listener
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/notifications/mark-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUnreadCount(0);
      setNotifications(
        notifications.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative"
        aria-label="Notifications"
      >
        <Bell className="text-gray-600 dark:text-gray-400" size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Notifications
            </h3>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 
                      ${
                        !notification.isRead
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                  >
                    <p className="text-sm font-semibold dark:text-gray-200">
                      {notification.title}
                    </p>
                    <p className="text-sm dark:text-gray-300">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No notifications
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
