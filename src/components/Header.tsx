// frontend/src/components/Header.tsx
import { BarChart3, Bell, Home, Shield, Stethoscope, Users, CreditCard, X, User, CheckCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GrLocationPin } from 'react-icons/gr';

// Define types for menu items
interface MenuItem {
  icon: React.ReactNode;
  path?: string;
  label: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  path: string;
  label: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

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

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems: MenuCategory[] = [
    {
      category: "Dashboard",
      items: [
        { 
          path: "/", 
          label: "Home", 
          icon: <Home className="w-5 h-5" />
        },
        { 
          path: "/analytics", 
          label: "Analytics", 
          icon: <BarChart3 className="w-5 h-5" />
        },
      ]
    },
    {
      category: "Therapy Operations",
      items: [
        { 
          label: "Therapy Operations", 
          icon: <Stethoscope className="w-5 h-5" />,
          submenu: [
            { path: "/therapists", label: "Therapist Management" },
            { path: "/therapists/onboarding", label: "Therapist Onboarding" },
            { path: "/targets", label: "Therapist Targets" },
            { path: "/services", label: "Service Management" },
            { path: "/bookings", label: "Booking Management" },
          ]
        },
        { 
          label: "User Management", 
          icon: <Users className="w-5 h-5" />,
          submenu: [
            { path: "/users", label: "User Management" },
            { path: "/communication", label: "Communication" },
            { path: "/support", label: "Support Center" },
          ]
        },
        { 
          label: "Geofencing", 
          icon: <GrLocationPin className="w-5 h-5" />,
          submenu: [
            { path: "/geofencing", label: "Service Area Management" }
          ]
        }
      ]
    },
    {
      category: "Business",
      items: [
        { 
          label: "Billing & Payments", 
          icon: <CreditCard className="w-5 h-5" />,
          submenu: [
            { path: "/payments", label: "Payment Management" },
            { path: "/loyalty", label: "Loyalty Program" },
            { path: "/promotions", label: "Promotions" },
          ]
        },
        { 
          path: "/security", 
          label: "Security Center", 
          icon: <Shield className="w-5 h-5" />
        },
      ]
    }
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Collapsible Submenu Component
  const CollapsibleMenu: React.FC<{ 
    item: MenuItem; 
    isActiveLink: (path: string) => boolean; 
    setIsMenuOpen: (open: boolean) => void;
  }> = ({ item, isActiveLink, setIsMenuOpen }) => {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    
    // Check if any submenu item is active
    const isSubmenuActive = item.submenu?.some(subItem => isActiveLink(subItem.path)) || false;

    return (
      <div className="border-b border-green-200/20 last:border-b-0">
        {/* Main category item that acts as toggle */}
        <button
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200
            ${isSubmenuActive
              ? 'bg-green-600/10 text-green-600 border-r-2 border-green-600'
              : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
            }
          `}
        >
          <div className="flex items-center">
            <span className={`mr-3 ${isSubmenuActive ? 'text-green-600' : 'text-gray-500'}`}>
              {item.icon}
            </span>
            {item.label}
          </div>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isSubmenuOpen ? 'rotate-180' : ''
            } ${isSubmenuActive ? 'text-green-600' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Submenu items */}
        {isSubmenuOpen && (
          <div className="bg-green-50/50 space-y-1 py-1">
            {item.submenu?.map(subItem => (
              <Link
                key={subItem.path}
                to={subItem.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center px-8 py-2 text-sm transition-all duration-200
                  ${isActiveLink(subItem.path)
                    ? 'text-green-600 bg-green-600/10 border-r-2 border-green-600 font-semibold'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-600/5'
                  }
                `}
              >
                <span className={`mr-2 text-sm ${isActiveLink(subItem.path) ? 'text-green-600' : 'text-gray-400'}`}>•</span>
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Burger menu and Logo */}
            <div className="flex items-center space-x-4">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">RubHub</span>
                  <span className="text-sm text-gray-500 font-normal">CRM</span>
                </div>
              </Link>
            </div>

            {/* Center - Navigation (hidden on mobile) */}
            <nav className="hidden md:flex space-x-1">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>

              <Link
                to="/analytics"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/analytics'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>

              <Link
                to="/security"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/security'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Center
              </Link>
            </nav>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-3">
              {/* Replace the old bell button with the new NotificationsPopup */}
              <NotificationsPopup />

              {/* User profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                  <span className="text-green-600 text-sm font-semibold">A</span>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-700">Administrator</p>
                  <p className="text-xs text-gray-500">admin@rubhub.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}

      {/* Sidebar Menu */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Menu Header */}
        <div className="bg-gray-100  flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">RubHub</span>
              <span className="text-sm">CRM</span>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content - Scrollable */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="py-4">
            {menuItems.map((category, index) => (
              <div key={category.category} className="mb-6 last:mb-0">
                {/* Category Header */}
                <div className={`px-6 py-2 ${index === 0 ? 'pt-0' : ''}`}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category.category}
                  </h3>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-1">
                  {category.items.map(item => (
                    <div key={item.label}>
                      {item.submenu ? (
                        // Collapsible submenu for Therapy sections
                        <CollapsibleMenu 
                          item={item} 
                          isActiveLink={isActiveLink}
                          setIsMenuOpen={setIsMenuOpen}
                        />
                      ) : (
                        // Regular menu item
                        item.path && (
                          <Link
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`
                              flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 mx-2 rounded-lg
                              ${isActiveLink(item.path)
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                              }
                            `}
                          >
                            <span className={`mr-3 ${isActiveLink(item.path) ? 'text-white' : 'text-gray-500'}`}>
                              {item.icon}
                            </span>
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
              <span className="text-green-600 font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
              <p className="text-sm text-gray-500 truncate">admin@rubhub.com</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;