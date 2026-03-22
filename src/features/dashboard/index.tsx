import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ontologyDB, agentDB, runtimeDB } from '@/shared/services/database';
import { StatsCards } from './components/StatsCards';
import { ArchitectureOverview } from './components/ArchitectureOverview';
import { AgentStatusChart } from './components/AgentStatusChart';
import { ActivityTrendChart } from './components/ActivityTrendChart';
import { ActivityStream } from './components/ActivityStream';
import { AGENCY_DOMAINS, agencyStats } from '@/data/agency-agents-simple';
import { getAllDomains, getCombinedMetrics } from '@/data/obr-domains';

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  systemHealth: number;
}

function AgencyStatsCards() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">🏢 Agency 智能体统计</h3>
        <Badge variant="outline">UNIS 企业级</Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total Agency Agents */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agency 智能体</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyStats.total}</div>
            <p className="text-xs text-muted-foreground">跨五大业务域</p>
          </CardContent>
        </Card>

        {/* Domain-specific cards */}
        {Object.entries(AGENCY_DOMAINS).map(([domain, info]) => (
          <Card key={domain} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{info.name}</CardTitle>
              <div 
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: info.color }}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.count}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((info.count / agencyStats.total) * 100)}% 占比
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OBRStatsCards() {
  const { t } = useTranslation();
  const obrMetrics = getCombinedMetrics();
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">🧠 OBR 本体模型统计</h3>
        <Badge variant="outline">知识图谱</Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total Domains */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">业务域</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrMetrics.totalDomains}</div>
            <p className="text-xs text-muted-foreground">WMS/FMS/OMS/YMS/BNP</p>
          </CardContent>
        </Card>

        {/* Objects */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">对象</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrMetrics.totalObjects}</div>
            <p className="text-xs text-muted-foreground">业务实体对象</p>
          </CardContent>
        </Card>

        {/* Behaviors */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">行为</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrMetrics.totalBehaviors}</div>
            <p className="text-xs text-muted-foreground">业务行为流程</p>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">规则</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrMetrics.totalRules}</div>
            <p className="text-xs text-muted-foreground">业务规则约束</p>
          </CardContent>
        </Card>

        {/* Scenarios */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">场景</CardTitle>
            <div className="h-4 w-4 rounded-full bg-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrMetrics.totalScenarios}</div>
            <p className="text-xs text-muted-foreground">业务场景模型</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
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

  // Get OBR and Agency metrics
  const obrMetrics = getCombinedMetrics();
  const totalCombinedElements = obrMetrics.totalObjects + obrMetrics.totalBehaviors + obrMetrics.totalRules + obrMetrics.totalScenarios;

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
        // Get agent statistics (database agents + agency agents)
        const dbAgents = await agentDB.agents.count();
        const totalAgents = dbAgents + agencyStats.total; // Include 100 agency agents
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

      {/* Agency Stats Cards */}
      <AgencyStatsCards />

      {/* OBR Stats Cards */}
      <OBRStatsCards />

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