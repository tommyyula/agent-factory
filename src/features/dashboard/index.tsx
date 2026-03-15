import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ontologyDB, agentDB, runtimeDB } from '@/shared/services/database';
import { StatsCards } from './components/StatsCards';
import { ArchitectureOverview } from './components/ArchitectureOverview';
import { AgentStatusChart } from './components/AgentStatusChart';
import { ActivityTrendChart } from './components/ActivityTrendChart';
import { ActivityStream } from './components/ActivityStream';

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

  // Mock data for charts
  const [agentStatusData] = useState([
    { name: t('dashboard.charts.running'), value: 15, color: '#10b981' },
    { name: t('dashboard.charts.paused'), value: 3, color: '#f59e0b' },
    { name: t('dashboard.charts.stopped'), value: 5, color: '#6b7280' },
    { name: t('dashboard.charts.error'), value: 1, color: '#ef4444' },
    { name: t('dashboard.charts.deploying'), value: 2, color: '#3b82f6' }
  ]);

  const [activityTrendData] = useState(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseTaskCount = 45 + Math.floor(Math.random() * 30);
      const baseAgentCount = 12 + Math.floor(Math.random() * 8);
      const baseDeploymentCount = 3 + Math.floor(Math.random() * 5);

      data.push({
        date: date.toISOString().split('T')[0],
        formattedDate: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        tasks: baseTaskCount,
        agents: baseAgentCount,
        deployments: baseDeploymentCount
      });
    }
    return data;
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get agent statistics
        const totalAgents = await agentDB.agents.count();
        const publishedAgents = await agentDB.agents.where('status').equals('published').count();

        // Get runtime statistics
        const runningDeployments = await runtimeDB.deployments.where('status').equals('running').count();
        const totalTasks = await runtimeDB.jobs.count();

        // Calculate system health (health.status is not an indexed field, so filter in JS)
        const allDeployments = await runtimeDB.deployments.toArray();
        const totalDeployments = allDeployments.length;
        const healthyDeployments = allDeployments.filter(d => d.health?.status === 'healthy').length;
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
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
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
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentStatusChart data={agentStatusData} />
        <ActivityTrendChart data={activityTrendData} />
      </div>

      {/* Architecture Overview and Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ArchitectureOverview />
        <ActivityStream />
      </div>
    </div>
  );
}