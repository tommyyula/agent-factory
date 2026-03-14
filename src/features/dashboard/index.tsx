import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Bot, Activity, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ontologyDB, agentDB, runtimeDB } from '@/shared/services/database';

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  systemHealth: number;
}

export function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalTasks: 0,
    systemHealth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get agent statistics
        const totalAgents = await agentDB.agents.count();
        const publishedAgents = await agentDB.agents.where('status').equals('published').count();
        
        // Get runtime statistics
        const runningDeployments = await runtimeDB.deployments.where('status').equals('running').count();
        const totalTasks = await runtimeDB.jobs.count();
        
        // Calculate system health (mock calculation)
        const healthyDeployments = await runtimeDB.deployments.where('health.status').equals('healthy').count();
        const totalDeployments = await runtimeDB.deployments.count();
        const systemHealth = totalDeployments > 0 ? Math.round((healthyDeployments / totalDeployments) * 100) : 100;

        setStats({
          totalAgents,
          activeAgents: runningDeployments,
          totalTasks,
          systemHealth
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.totalAgents')}
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> {t('dashboard.stats.newThisMonth')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.activeAgents')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.running')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.totalTasks')}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> {t('dashboard.stats.comparedToYesterday')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.systemHealth')}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}%</div>
            <p className="text-xs">
              <Badge variant={stats.systemHealth > 90 ? "success" : stats.systemHealth > 70 ? "warning" : "destructive"}>
                {stats.systemHealth > 90 ? t('dashboard.stats.excellent') : stats.systemHealth > 70 ? t('dashboard.stats.good') : t('dashboard.stats.needsAttention')}
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.architecture.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">{t('dashboard.architecture.layers.aaas')}</span>
                <Badge variant="success">{t('dashboard.architecture.status.running')}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">{t('dashboard.architecture.layers.runtime')}</span>
                <Badge variant="success">{t('dashboard.architecture.status.healthy')}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">{t('dashboard.architecture.layers.factory')}</span>
                <Badge variant="success">{t('dashboard.architecture.status.active')}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">{t('dashboard.architecture.layers.ontology')}</span>
                <Badge variant="warning">{t('dashboard.architecture.status.syncing')}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">{t('dashboard.architecture.layers.dataSources')}</span>
                <Badge variant="success">{t('dashboard.architecture.status.connected')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Email Triage Agent {t('dashboard.recentActivity.deploySuccess')}</p>
                  <p className="text-xs text-muted-foreground">2 {t('dashboard.recentActivity.minutes')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">WMS 知识域 {t('dashboard.recentActivity.updateComplete')}</p>
                  <p className="text-xs text-muted-foreground">15 {t('dashboard.recentActivity.minutes')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Knowledge Base Agent {t('dashboard.recentActivity.performanceIssue')}</p>
                  <p className="text-xs text-muted-foreground">1 {t('dashboard.recentActivity.hours')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Calendar Brief Agent {t('dashboard.recentActivity.creationComplete')}</p>
                  <p className="text-xs text-muted-foreground">3 {t('dashboard.recentActivity.hours')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}