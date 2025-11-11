import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Shield, User, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Panic Button Activated',
      message: 'Sarah Wilson activated panic button in Johannesburg',
      time: '2 minutes ago',
      unread: true,
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      type: 'therapist',
      title: 'Therapist Unavailable',
      message: 'Mike Johnson is sick and cannot make the appointment. System has automatically reassigned to Emily Chen.',
      time: '15 minutes ago',
      unread: true,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'Weekly maintenance completed successfully',
      time: '1 hour ago',
      unread: true,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]);

  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark all as read when opening
    if (!isOpen) {
      setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => notif.unread).length;

  return (
    <div className="relative" ref={popupRef}>
      {/* Notification Bell Button */}
      <button 
        onClick={toggleNotifications}
        className="relative p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popup */}
      <div className={`
        absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50
        transform transition-all duration-300 ease-out
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`
                      p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200
                      ${notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'}
                      hover:bg-green-50 hover:shadow-sm
                    `}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex space-x-3">
                      <div className={`p-2 rounded-full ${notification.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-semibold ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-8 px-4">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-1">No notifications</h4>
              <p className="text-gray-500 text-sm">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-xl">
            <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
              View All Notifications
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationsPopup;