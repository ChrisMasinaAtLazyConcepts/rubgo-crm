// frontend/src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      category: 'Dashboard',
      items: [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/admin', label: 'Admin Dashboard', icon: '📊' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
      ]
    },
    {
      category: 'Management',
      items: [
        { path: '/therapists', label: 'Therapist Management', icon: '👨‍⚕️' },
        { path: '/therapists/onboarding', label: 'Therapist Onboarding', icon: '➕' },
        { path: '/users', label: 'User Management', icon: '👥' },
        { path: '/bookings', label: 'Booking Management', icon: '📅' },
        { path: '/services', label: 'Service Management', icon: '💆' },
      ]
    },
    {
      category: 'Business',
      items: [
        { path: '/payments', label: 'Payment Management', icon: '💰' },
        { path: '/promotions', label: 'Promotion Management', icon: '🎯' },
        { path: '/loyalty', label: 'Loyalty Management', icon: '⭐' },
        { path: '/targets', label: 'Therapist Targets', icon: '🎯' },
      ]
    },
    {
      category: 'Operations',
      items: [
        { path: '/live-tracking', label: 'Live Tracking', icon: '📍' },
        { path: '/communication', label: 'Communication Center', icon: '💬' },
        { path: '/security', label: 'Security Dashboard', icon: '🛡️' },
      ]
    },
    {
      category: 'Support',
      items: [
        { path: '/support', label: 'Support Center', icon: '❓' },
      ]
    }
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
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
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0">
                 <img
                    src={'./assets/images/Rubbgo3.png'}
                    alt={'Korporate Logo'}
                    className="w-30 h-16 md:w-25 md:h-16 object-contain transition-all duration-200 hover:opacity-90"
                  />
                </div>
              </Link>
            </div>

            {/* Center - Navigation (hidden on mobile) */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.slice(0, 2).map(category => 
                category.items.slice(0, 2).map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActiveLink(item.path)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
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
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">RubGo Admin</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="h-full overflow-y-auto pb-20">
          {menuItems.map((category, index) => (
            <div key={category.category} className="border-b border-gray-100 last:border-b-0">
              {/* Category Header */}
              <div className={`px-4 py-3 ${index === 0 ? 'pt-4' : ''}`}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category.category}
                </h3>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-1 pb-2">
                {category.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200
                      ${isActiveLink(item.path)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                    {isActiveLink(item.path) && (
                      <span className="ml-auto w-2 h-2 bg-blue-700 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
              <p className="text-sm text-gray-500 truncate">admin@rubgo.com</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
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