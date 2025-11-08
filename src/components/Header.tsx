// frontend/src/components/Header.tsx
import { BarChart3, CoinsIcon, Home, LayoutDashboard, Shield, Stethoscope, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CreditCard, Coins, Trophy, Megaphone } from 'lucide-react';

// Define types for menu items
interface MenuItem {
  icon: React.ReactNode; // Change from string to ReactNode;
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
        path: "/admin", 
        label: "Admin Dashboard", 
        icon: <LayoutDashboard className="w-5 h-5" />
      },
      { 
        path: "/analytics", 
        label: "Analytics", 
        icon: <BarChart3 className="w-5 h-5" />
      },
    ]
  },
  {
    category: "Therapy Management",
    items: [
      { 
        label: "Therapy Operations", 
        icon: <Stethoscope  className="w-5 h-5" />,
        submenu: [
          { path: "/therapists", label: "Therapist Management" },
          { path: "/therapists/onboarding", label: "Therapist Onboarding" },
          { path: "/targets", label: "Therapist Targets" },
          { path: "/services", label: "Service Management" },
          { path: "/bookings", label: "Booking Management" },
          { path: "/live-tracking", label: "Live Tracking" },
        ]
      },
      { 
        label: "Patient Care", 
        icon: <Users className="w-5 h-5" />,
        submenu: [
          { path: "/users", label: "User Management" },
          { path: "/communication", label: "Communication" },
          { path: "/support", label: "Support Center" },
        ]
      },
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
        label: "Security", 
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
      <div className="border-b border-green-800 last:border-b-0">
        {/* Main category item that acts as toggle */}
        <button
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-200
            ${isSubmenuActive
              ? 'bg-green-800 text-white'
              : 'text-green-100 hover:bg-green-800 hover:text-white'
            }
          `}
        >
          <div className="flex items-center">
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </div>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isSubmenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Submenu items */}
        {isSubmenuOpen && (
          <div className="bg-green-950/50 space-y-1 py-1">
            {item.submenu?.map(subItem => (
              <Link
                key={subItem.path}
                to={subItem.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center px-8 py-2 text-sm transition-colors duration-200
                  ${isActiveLink(subItem.path)
                    ? 'text-green-300 bg-green-900/50 border-r-2 border-green-400'
                    : 'text-green-200 hover:text-white hover:bg-green-800/50'
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
                  <div className="flex items-center">
                    <img
                      src={'./assets/images/Rubbgo2.png'}
                      alt={'RubGo Logo'}
                      className="h-10 w-auto object-contain transition-all duration-200 hover:opacity-90"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Center - Navigation (hidden on mobile) */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map(category => 
                category.items.map(item => (
                  item.path ? ( // Only render items with paths in header
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActiveLink(item.path)
                          ? 'border-blue-500 text-gray-700'
                          : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ) : (
                    // For submenu items, show first subitem as main nav
                    item.submenu && item.submenu[0] && (
                      <Link
                        key={item.submenu[0].path}
                        to={item.submenu[0].path}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActiveLink(item.submenu[0].path)
                            ? 'border-blue-500 text-gray-700'
                            : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    )
                  )
                ))
              )}
            </nav>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                </svg>
              </button>

              {/* User profile */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
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
        fixed top-0 left-0 z-50 h-full w-80 bg-[#0C235E] shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white">RubGo</span>
            <span className="text-sm text-green-300">CRM</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-white hover:text-white hover:bg-white transition-colors"
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
              <div key={category.category} className="border-b border-green-800 last:border-b-0">
                {/* Category Header */}
                <div className={`px-4 py-3 ${index === 0 ? 'pt-4' : ''}`}>
                  <h3 className="text-xs font-semibold text-green-300 uppercase tracking-wider">
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
                                ? 'bg-green-800 text-white border-r-2 border-green-400'
                                : 'text-green-100 hover:bg-green-800 hover:text-white'
                              }
                            `}
                          >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.label}
                            {isActiveLink(item.path) && (
                              <span className="ml-auto w-2 h-2 bg-green-400 rounded-full"></span>
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

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-green-700 bg-green-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-sm text-green-300 truncate">admin@rubgo.com</p>
            </div>
            <button className="p-2 text-green-300 hover:text-white hover:bg-green-700 rounded-md transition-colors">
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