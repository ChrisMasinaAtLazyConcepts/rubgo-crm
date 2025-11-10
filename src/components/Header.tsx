// frontend/src/components/Header.tsx
import { BarChart3, Bell, BellDotIcon, BellIcon, Home, LayoutDashboard, Shield, Stethoscope, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CreditCard, Coins, Trophy, Megaphone } from 'lucide-react';
import { BiNotification } from 'react-icons/bi';
import { FaLocationPin } from 'react-icons/fa6';
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
            { path: "/bookings", label: "Booking Management" }
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
      <div className="border-b border-blue-600 last:border-b-0">
        {/* Main category item that acts as toggle */}
        <button
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-200
            ${isSubmenuActive
              ? 'bg-white text-blue-900'
              : 'text-blue-100 hover:bg-[#051025] hover:text-white'
            }
          `}
        >
          <div className="flex items-center">
            <span className={`mr-3 ${isSubmenuActive ? 'text-blue-900' : 'text-blue-200'}`}>
              {item.icon}
            </span>
            {item.label}
          </div>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isSubmenuOpen ? 'rotate-180' : ''
            } ${isSubmenuActive ? 'text-blue-900' : 'text-blue-300'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Submenu items */}
        {isSubmenuOpen && (
          <div className="bg-[#08172F] space-y-1 py-1">
            {item.submenu?.map(subItem => (
              <Link
                key={subItem.path}
                to={subItem.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center px-8 py-2 text-sm transition-colors duration-200
                  ${isActiveLink(subItem.path)
                    ? 'text-white bg-white/20 border-r-2 border-white'
                    : 'text-blue-200 hover:text-white hover:bg-[#051025]'
                  }
                `}
              >
                <span className="mr-2 text-sm">•</span>
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
            <div className="flex items-center">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center ml-4">
                <div className="flex-shrink-0">
                 
                </div>
              </Link>
            </div>
{/* Center - Navigation (hidden on mobile) */}
<nav className="hidden md:flex space-x-8">
  {/* Home */}
  <Link
    to="/"
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      location.pathname === '/'
        ? 'border-green-500 text-green-500'
        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
    }`}
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
    Home
  </Link>

  {/* Analytics */}
  <Link
    to="/analytics"
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      location.pathname === '/analytics'
        ? 'border-green-500 text-green-500'
        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
    }`}
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    Analytics
  </Link>

  {/* Security Centre */}
  <Link
    to="/security-centre"
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      location.pathname === '/security'
        ? 'border-green-500 text-green-500'
        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
    }`}
  >
     <Shield className="w-5 h-5 mr-2" />
      
    Security Centre
  </Link>
</nav>

        {/* Right - Notifications with Counter */}
        <div className="flex items-center space-x-4">
          {/* Notifications Bell with Counter */}
        

          
        </div>
            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                </svg>
                  {/* Notification Counter */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    3
                  </span>
              </button>

              {/* User profile */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-700 text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
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
        fixed top-0 left-0 z-50 h-full w-80 bg-[#0B1F3D] shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-600 bg-whitesmoke">
          <div className="flex items-center space-x-4">
  {/* Logo */}
  <div className="flex items-center">
    <img
      src={'./assets/images/Rubbgo2.png'}
      alt={'RubGo Logo'}
      className="h-12 w-auto object-contain transition-all duration-200 hover:opacity-90"
    />
  </div>
  
  {/* Brand Name and Details */}
  <div className="flex flex-col">
    <div className="flex items-baseline space-x-2">
      <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">RubGo</span>
              <span className="text-sm text-white">CRM</span>
            </div>
    </div>
  </div>
</div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-[#051025] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content - Scrollable with hidden scrollbar */}
        <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
          <div className="py-2">
            {menuItems.map((category, index) => (
              <div key={category.category} className="border-b border-blue-600 last:border-b-0">
                {/* Category Header */}
                <div className={`px-4 py-3 ${index === 0 ? 'pt-4' : ''}`}>
                  <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    {category.category}
                  </h3>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-1 pb-2">
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
                              flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200
                              ${isActiveLink(item.path)
                                ? 'bg-[#051025] text-white border-r-2 border-white'
                                : 'text-blue-100 hover:bg-[#051025] hover:text-white'
                              }
                            `}
                          >
                            <span className={`mr-3 ${isActiveLink(item.path) ? 'text-blue-900' : 'text-blue-200'}`}>
                              {item.icon}
                            </span>
                            {item.label}
                            {isActiveLink(item.path) && (
                              <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                            )}
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

        {/* Menu Footer - Whitesmoke Background */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-blue-600 bg-gray-50 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-600 truncate">Administrator</p>
              <p className="text-sm text-green-600 truncate">admin@rubgo.com</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
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