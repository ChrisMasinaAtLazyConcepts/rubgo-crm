// frontend/src/components/Breadcrumbs.tsx
import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

// Icon mapping for different routes
const routeIcons: { [key: string]: React.ReactNode } = {
  'dashboard': <HomeIcon className="w-4 h-4" />,
  'geofencing': <MapPinIcon className="w-4 h-4" />,
  'service-areas': <MapPinIcon className="w-4 h-4" />,
  'clients': <UserGroupIcon className="w-4 h-4" />,
  'therapists': <UserGroupIcon className="w-4 h-4" />,
  'appointments': <CalendarIcon className="w-4 h-4" />,
  'settings': <CogIcon className="w-4 h-4" />,
  'analytics': <ChartBarIcon className="w-4 h-4" />,
  'reports': <ChartBarIcon className="w-4 h-4" />
};

// Route labels for better readability
const routeLabels: { [key: string]: string } = {
  'dashboard': 'Dashboard',
  'geofencing': 'Service Areas',
  'service-areas': 'Service Areas',
  'clients': 'Clients',
  'therapists': 'Therapists',
  'appointments': 'Appointments',
  'settings': 'Settings',
  'profile': 'Profile',
  'billing': 'Billing',
  'reports': 'Reports',
  'analytics': 'Analytics',
  'support': 'Support',
  'management': 'Management',
  'create': 'Create New',
  'edit': 'Edit',
  'view': 'Details'
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <HomeIcon className="w-4 h-4" />,
      isCurrent: pathnames.length === 0
    }
  ];

  // Build breadcrumbs from current path
  let accumulatedPath = '';
  pathnames.forEach((pathname, index) => {
    accumulatedPath += `/${pathname}`;
    const isLast = index === pathnames.length - 1;
    
    // Handle dynamic parameters (like IDs)
    let label = routeLabels[pathname];
    if (!label) {
      // Check if this is a dynamic parameter (like ID)
      if (Object.values(params).includes(pathname)) {
        // This is likely an ID, try to get the label from the previous segment
        const previousSegment = pathnames[index - 1];
        label = routeLabels[previousSegment] ? `${routeLabels[previousSegment]} Details` : 'Details';
      } else {
        // Format the pathname for display
        label = pathname.charAt(0).toUpperCase() + pathname.slice(1).replace(/-/g, ' ');
      }
    }
    
    breadcrumbs.push({
      path: accumulatedPath,
      label,
      icon: routeIcons[pathname],
      isCurrent: isLast
    });
  });

  // Don't show breadcrumbs if we're only on the dashboard
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRightIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
            
            <div className="flex items-center space-x-2">
              {breadcrumb.icon && (
                <div className="flex-shrink-0">
                  {breadcrumb.icon}
                </div>
              )}
              
              {breadcrumb.isCurrent ? (
                <span className="font-semibold text-green-700 capitalize">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 capitalize flex items-center space-x-1"
                >
                  <span>{breadcrumb.label}</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Current page title */}
      {breadcrumbs.length > 0 && (
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {breadcrumbs[breadcrumbs.length - 1].label}
          </h1>
          {pathnames.length > 0 && (
            <p className="text-gray-600 text-sm mt-1">
              {getPageDescription(location.pathname)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get page descriptions
const getPageDescription = (pathname: string): string => {
  const descriptions: { [key: string]: string } = {
    '/geofencing': 'Manage service areas and location-based restrictions',
    '/service-areas': 'Define and manage geographic service boundaries',
    '/clients': 'View and manage client information and bookings',
    '/therapists': 'Manage therapist profiles and availability',
    '/appointments': 'Schedule and track therapy sessions',
    '/settings': 'Configure application settings and preferences',
    '/analytics': 'View insights and performance metrics',
    '/reports': 'Generate and export detailed reports'
  };

  return descriptions[pathname] || 'Manage your content and settings';
};

export default Breadcrumbs;