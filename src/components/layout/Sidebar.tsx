import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Brain,
  Code,
  Store,
  Monitor,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

const navigationItems = [
  { key: 'dashboard', href: '/', icon: BarChart3 },
  { key: 'ontology', href: '/ontology', icon: Brain },
  { key: 'ide', href: '/ide', icon: Code },
  { key: 'marketplace', href: '/marketplace', icon: Store },
  { key: 'runtime', href: '/runtime', icon: Monitor },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, setIsCollapsed, isMobile, isOpen, setIsOpen } = useSidebar();

  const sidebarClasses = cn(
    "flex flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out",
    {
      // Desktop: fixed positioning
      "fixed inset-y-0 left-0 z-50": true,
      // Width based on collapsed state
      "w-16": isCollapsed,
      "w-64": !isCollapsed,
      // Mobile: slide in/out behavior
      "-translate-x-full lg:translate-x-0": isMobile && !isOpen,
      "translate-x-0": !isMobile || isOpen,
    }
  );

  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-foreground">Agent Factory</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="shrink-0"
          >
            {isMobile ? (
              <X className="h-4 w-4" />
            ) : isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.href}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="ml-3">{t(`navigation.${item.key}`)}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className={cn(
            "text-xs text-muted-foreground",
            isCollapsed ? "text-center" : ""
          )}>
            {isCollapsed ? "v1.0" : "Agent Factory v1.0"}
          </div>
        </div>
      </div>
    </>
  );
}