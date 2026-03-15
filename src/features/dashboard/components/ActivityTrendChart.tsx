import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ActivityData {
  date: string;
  tasks: number;
  agents: number;
  deployments: number;
  formattedDate?: string;
}

interface ActivityTrendChartProps {
  data: ActivityData[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const { t } = useTranslation();

  // Calculate trend (compare last day with previous day)
  const calculateTrend = (data: ActivityData[]) => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 };

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const totalLatest = latest.tasks + latest.agents + latest.deployments;
    const totalPrevious = previous.tasks + previous.agents + previous.deployments;

    if (totalPrevious === 0) return { direction: 'stable', percentage: 0 };

    const percentage = ((totalLatest - totalPrevious) / totalPrevious) * 100;
    const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable';

    return { direction, percentage: Math.abs(percentage) };
  };

  const trend = calculateTrend(data);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium mb-2">{dataPoint.formattedDate || label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">{t('dashboard.charts.tasks')}</span>
              </div>
              <span className="text-sm font-bold">{dataPoint.tasks}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">{t('dashboard.charts.agents')}</span>
              </div>
              <span className="text-sm font-bold">{dataPoint.agents}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">{t('dashboard.charts.deployments')}</span>
              </div>
              <span className="text-sm font-bold">{dataPoint.deployments}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.charts.sevenDayActivityTrend')}</span>
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon(trend.direction)}
            <span className={getTrendColor(trend.direction)}>
              {trend.direction === 'stable' ? t('dashboard.charts.stable') :
               `${trend.percentage.toFixed(1)}% ${trend.direction === 'up' ? t('dashboard.charts.increase') : t('dashboard.charts.decrease')}`}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="agentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deploymentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis fontSize={12} stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#tasksGradient)"
              name="Tasks"
            />
            <Area
              type="monotone"
              dataKey="agents"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#agentsGradient)"
              name="Agents"
            />
            <Area
              type="monotone"
              dataKey="deployments"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#deploymentsGradient)"
              name="Deployments"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">{t('dashboard.charts.tasks')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">{t('dashboard.charts.agents')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">{t('dashboard.charts.deployments')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}