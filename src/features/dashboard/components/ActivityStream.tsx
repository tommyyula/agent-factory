import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Upload,
  Download,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Users,
  Database,
  Shield,
  Rocket
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  icon: React.ElementType;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  agentName?: string;
  details?: string;
  category: 'deployment' | 'agent' | 'system' | 'security' | 'data' | 'user';
}

export function ActivityStream() {
  const { t } = useTranslation();

  // Generate realistic activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'success',
      icon: CheckCircle,
      title: t('dashboard.activity.emailTriageDeployed'),
      description: t('dashboard.activity.emailTriageDesc'),
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      relativeTime: '2 ' + t('dashboard.recentActivity.minutes'),
      agentName: 'Email Triage Agent',
      category: 'deployment'
    },
    {
      id: '2',
      type: 'info',
      icon: RefreshCw,
      title: t('dashboard.activity.wmsKnowledgeUpdated'),
      description: t('dashboard.activity.wmsKnowledgeDesc'),
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      relativeTime: '15 ' + t('dashboard.recentActivity.minutes'),
      category: 'system'
    },
    {
      id: '3',
      type: 'warning',
      icon: AlertTriangle,
      title: t('dashboard.activity.performanceIssueDetected'),
      description: t('dashboard.activity.performanceIssueDesc'),
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      relativeTime: '45 ' + t('dashboard.recentActivity.minutes'),
      agentName: 'Knowledge Base Agent',
      category: 'agent'
    },
    {
      id: '4',
      type: 'success',
      icon: Rocket,
      title: t('dashboard.activity.calendarAgentCreated'),
      description: t('dashboard.activity.calendarAgentDesc'),
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      relativeTime: '3 ' + t('dashboard.recentActivity.hours'),
      agentName: 'Calendar Brief Agent',
      category: 'agent'
    },
    {
      id: '5',
      type: 'info',
      icon: Upload,
      title: t('dashboard.activity.dataModelUploaded'),
      description: t('dashboard.activity.dataModelDesc'),
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      relativeTime: '4 ' + t('dashboard.recentActivity.hours'),
      category: 'data'
    },
    {
      id: '6',
      type: 'success',
      icon: Shield,
      title: t('dashboard.activity.securityScanCompleted'),
      description: t('dashboard.activity.securityScanDesc'),
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      relativeTime: '6 ' + t('dashboard.recentActivity.hours'),
      category: 'security'
    },
    {
      id: '7',
      type: 'info',
      icon: Users,
      title: t('dashboard.activity.newUserOnboarded'),
      description: t('dashboard.activity.newUserDesc'),
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      relativeTime: '8 ' + t('dashboard.recentActivity.hours'),
      category: 'user'
    },
    {
      id: '8',
      type: 'success',
      icon: Play,
      title: t('dashboard.activity.chatbotAgentStarted'),
      description: t('dashboard.activity.chatbotAgentDesc'),
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      relativeTime: '12 ' + t('dashboard.recentActivity.hours'),
      agentName: 'Customer Service Chatbot',
      category: 'deployment'
    },
    {
      id: '9',
      type: 'info',
      icon: Database,
      title: t('dashboard.activity.databaseBackupCompleted'),
      description: t('dashboard.activity.databaseBackupDesc'),
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      relativeTime: '18 ' + t('dashboard.recentActivity.hours'),
      category: 'system'
    },
    {
      id: '10',
      type: 'warning',
      icon: Pause,
      title: t('dashboard.activity.maintenanceScheduled'),
      description: t('dashboard.activity.maintenanceDesc'),
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: '1 ' + t('dashboard.activity.dayAgo'),
      category: 'system'
    },
    {
      id: '11',
      type: 'success',
      icon: Zap,
      title: t('dashboard.activity.optimizationApplied'),
      description: t('dashboard.activity.optimizationDesc'),
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      relativeTime: '1.5 ' + t('dashboard.activity.daysAgo'),
      category: 'system'
    },
    {
      id: '12',
      type: 'info',
      icon: Download,
      title: t('dashboard.activity.reportGenerated'),
      description: t('dashboard.activity.reportDesc'),
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      relativeTime: '2 ' + t('dashboard.activity.daysAgo'),
      category: 'data'
    },
    {
      id: '13',
      type: 'success',
      icon: Settings,
      title: t('dashboard.activity.configurationUpdated'),
      description: t('dashboard.activity.configurationDesc'),
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      relativeTime: '3 ' + t('dashboard.activity.daysAgo'),
      category: 'system'
    }
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deployment':
        return 'text-blue-600';
      case 'agent':
        return 'text-purple-600';
      case 'system':
        return 'text-gray-600';
      case 'security':
        return 'text-red-600';
      case 'data':
        return 'text-green-600';
      case 'user':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.type)}`} />
                <Icon className={`h-4 w-4 mt-1.5 ${getCategoryColor(activity.category)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      {activity.agentName && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs"
                        >
                          {activity.agentName}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {activity.relativeTime}
                      </p>
                      <Badge
                        variant={getTypeVariant(activity.type)}
                        className="mt-1 text-xs capitalize"
                      >
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('dashboard.activity.totalEvents', { count: activities.length })}</span>
            <span>{t('dashboard.activity.last7Days')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}