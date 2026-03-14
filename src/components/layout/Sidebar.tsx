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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { key: 'dashboard', href: '/', icon: BarChart3 },
  { key: 'ontology', href: '/ontology', icon: Brain },
  { key: 'ide', href: '/ide', icon: Code },
  { key: 'marketplace', href: '/marketplace', icon: Store },
  { key: 'runtime', href: '/runtime', icon: Monitor },
];

export function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={cn(
      "fixed inset-y-0 z-50 flex flex-col bg-card border-r border-border",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-foreground">Agent Factory</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.href}
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
  );
}