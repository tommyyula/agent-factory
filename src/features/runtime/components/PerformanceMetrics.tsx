import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CheckCircle, Clock, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  data: Array<{ value: number }>;
  color: string;
}

// Mock data for 24-hour sparklines
const totalTasksData = Array.from({ length: 24 }, (_, i) => ({
  value: Math.floor(Math.random() * 50) + 20 + (i < 12 ? i * 2 : (24 - i) * 2)
}));

const successRateData = Array.from({ length: 24 }, (_, i) => ({
  value: Math.floor(Math.random() * 15) + 85 + Math.sin(i / 4) * 5
}));

const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
  value: Math.floor(Math.random() * 100) + 150 + Math.sin(i / 3) * 50
}));

const activeConnectionsData = Array.from({ length: 24 }, (_, i) => ({
  value: Math.floor(Math.random() * 20) + 30 + (i > 8 && i < 20 ? 15 : 0)
}));

function MetricCard({ title, value, subtitle, icon, trend, trendValue, data, color }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {trendValue}
              </span>
              <span className="text-xs text-muted-foreground">vs yesterday</span>
            </div>
          </div>

          <div className="h-16 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceMetrics() {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t('runtime.metrics.totalTasks'),
      value: '2,847',
      subtitle: t('runtime.metrics.totalTasksSubtitle'),
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      trend: 'up' as const,
      trendValue: '+12.5%',
      data: totalTasksData,
      color: '#3b82f6'
    },
    {
      title: t('runtime.metrics.successRate'),
      value: '94.2%',
      subtitle: t('runtime.metrics.successRateSubtitle'),
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      trend: 'up' as const,
      trendValue: '+2.1%',
      data: successRateData,
      color: '#10b981'
    },
    {
      title: t('runtime.metrics.avgResponseTime'),
      value: '187ms',
      subtitle: t('runtime.metrics.avgResponseTimeSubtitle'),
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      trend: 'down' as const,
      trendValue: '-8.3%',
      data: responseTimeData,
      color: '#f59e0b'
    },
    {
      title: t('runtime.metrics.activeConnections'),
      value: '42',
      subtitle: t('runtime.metrics.activeConnectionsSubtitle'),
      icon: <Users className="h-4 w-4 text-blue-500" />,
      trend: 'stable' as const,
      trendValue: '+0.8%',
      data: activeConnectionsData,
      color: '#6366f1'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('runtime.metrics.title')}</h2>
        <p className="text-muted-foreground">
          {t('runtime.metrics.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Additional System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>{t('runtime.metrics.systemHealth.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('runtime.metrics.systemHealth.cpuUsage')}</span>
                <Badge variant="success">67%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('runtime.metrics.systemHealth.memoryUsage')}</span>
                <Badge variant="warning">82%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('runtime.metrics.systemHealth.diskUsage')}</span>
                <Badge variant="success">45%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('runtime.metrics.systemHealth.overallStatus')}</span>
              <Badge variant="success" className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>{t('runtime.metrics.systemHealth.healthy')}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}