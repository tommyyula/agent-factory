import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeNames: Record<string, string> = {
  '': 'Dashboard',
  'ontology': 'Ontology KB',
  'ide': 'IDE',
  'marketplace': 'MarketPlace',
  'runtime': 'Runtime',
  'settings': 'Settings'
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'Dashboard', href: '/', isHome: true }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = routeNames[segment] || segment;
    breadcrumbItems.push({
      name,
      href: currentPath,
      isHome: false
    });
  });

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4" />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-foreground font-medium">
              {item.isHome ? (
                <Home className="h-4 w-4" />
              ) : (
                item.name
              )}
            </span>
          ) : (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.isHome ? (
                <Home className="h-4 w-4" />
              ) : (
                item.name
              )}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}