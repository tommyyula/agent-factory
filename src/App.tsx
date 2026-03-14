import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from './stores/themeStore';
import { initializeDatabases } from './shared/services/database';
import { seedDatabase } from './data/seedDatabase';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './features/dashboard';
import { OntologyOverview } from './features/ontology';
import { IDEOverview } from './features/ide';
import { AgentCatalog } from './features/marketplace';
import { RuntimeOverview } from './features/runtime';

function App() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Initialize database and seed data
    const initApp = async () => {
      try {
        console.log('Initializing Agent Factory Platform...');
        
        // Initialize databases
        const dbInitialized = await initializeDatabases();
        if (!dbInitialized) {
          throw new Error('Failed to initialize databases');
        }

        // Seed initial data
        const seedSuccess = await seedDatabase();
        if (!seedSuccess) {
          throw new Error('Failed to seed database');
        }

        console.log('Agent Factory Platform initialized successfully!');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsInitialized(true); // Still show the app even if initialization fails
      }
    };

    initApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">{t('common.initializing')}</h2>
          <p className="text-muted-foreground">{t('common.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (initError) {
    console.warn('App initialized with errors:', initError);
    // Continue to show the app even with init errors, for development
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ontology/*" element={<OntologyOverview />} />
        <Route path="ide/*" element={<IDEOverview />} />
        <Route path="marketplace/*" element={<AgentCatalog />} />
        <Route path="runtime/*" element={<RuntimeOverview />} />
        <Route path="*" element={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">{t('common.pageNotFound')}</h2>
            <p className="text-muted-foreground mt-2">{t('common.checkUrl')}</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;