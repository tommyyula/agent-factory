import React from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Breadcrumb } from './Breadcrumb';
import { useSidebar } from './SidebarContext';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { isMobile, setIsOpen } = useSidebar();
  const location = useLocation();

  return (
    <header className="h-16 border-b border-border bg-background">
      <div className="flex h-full items-center justify-between px-6">
        {/* Mobile Menu Button + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Breadcrumb */}
          <Breadcrumb />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User Avatar */}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">TY</span>
          </div>
        </div>
      </div>
    </header>
  );
}