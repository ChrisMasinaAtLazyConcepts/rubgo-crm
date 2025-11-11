// frontend/src/components/Breadcrumbs.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  path: string;
  label: string;
  isCurrent?: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Define route labels for better readability
  const routeLabels: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'geofencing': 'Service Areas',
    'clients': 'Clients',
    'therapists': 'Therapists',
    'appointments': 'Appointments',
    'settings': 'Settings',
    'profile': 'Profile',
    'billing': 'Billing',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'support': 'Support',
    'service-areas': 'Service Areas',
    'management': 'Management'
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      isCurrent: pathnames.length === 0
    }
  ];

  // Build breadcrumbs from current path
  let accumulatedPath = '';
  pathnames.forEach((pathname, index) => {
    accumulatedPath += `/${pathname}`;
    const isLast = index === pathnames.length - 1;
    
    breadcrumbs.push({
      path: accumulatedPath,
      label: routeLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1).replace(/-/g, ' '),
      isCurrent: isLast
    });
  });

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center space-x-2">
          {index === 0 ? (
            <HomeIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
          )}
          
          {breadcrumb.isCurrent ? (
            <span className="font-medium text-gray-900 capitalize">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-green-600 transition-colors duration-200 capitalize"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;