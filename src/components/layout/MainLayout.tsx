import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';

function MainContent() {
  const { isCollapsed, isMobile } = useSidebar();

  const contentClasses = cn(
    "flex-1 transition-all duration-300 ease-in-out",
    {
      // Desktop: dynamic margin based on sidebar state
      "lg:ml-16": !isMobile && isCollapsed,
      "lg:ml-64": !isMobile && !isCollapsed,
      // Mobile: no margin (sidebar slides over content)
      "ml-0": isMobile,
    }
  );

  return (
    <div className={contentClasses}>
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <MainContent />
        </div>
      </div>
    </SidebarProvider>
  );
}