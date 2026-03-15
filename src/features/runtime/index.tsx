import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runtimeDB, agentDB } from '@/shared/services/database';
import { useRuntimeStore } from '@/stores/runtimeStore';
import { AgentDeployment } from '@/shared/types/runtime.types';
import { DeploymentList } from './components/DeploymentList';
import { JobLog } from './components/JobLog';
import { MessageBoard } from './components/MessageBoard';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export function RuntimeOverview() {
  return (
    <Routes>
      <Route index element={<RuntimeHome />} />
      <Route path="agents" element={<DeploymentList />} />
      <Route path="agent/:deploymentId" element={<div>Agent Monitor (Coming Soon)</div>} />
      <Route path="jobs" element={<JobLog />} />
      <Route path="messages" element={<div>Message Board (Coming Soon)</div>} />
    </Routes>
  );
}

function RuntimeHome() {
  const { t } = useTranslation();
  const { deployments, tasks, setDeployments, setTasks, loading, setLoading } = useRuntimeStore();

  useEffect(() => {
    const loadRuntimeData = async () => {
      setLoading(true);
      try {
        const [deploymentsData, tasksData] = await Promise.all([
          runtimeDB.deployments.toArray(),
          runtimeDB.jobs.toArray()
        ]);

        setDeployments(deploymentsData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load runtime data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRuntimeData();
  }, [setDeployments, setTasks, setLoading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('runtime.title')}</h1>
          <p className="text-muted-foreground">{t('runtime.subtitle')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('runtime.title')}</h1>
        <p className="text-muted-foreground">
          {t('runtime.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deployments">{t('runtime.tabs.deployments')}</TabsTrigger>
          <TabsTrigger value="jobs">{t('runtime.tabs.jobs')}</TabsTrigger>
          <TabsTrigger value="messages">{t('runtime.tabs.messages')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('runtime.tabs.metrics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          <DeploymentList />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <JobLog />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <MessageBoard />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}


