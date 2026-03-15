import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, ArrowRight, Clock, AlertCircle, Zap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'request' | 'response' | 'notification' | 'status';
}

// Mock data for 10+ inter-agent communication messages
const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    from: 'DataAnalyzer Pro',
    to: 'TaskScheduler',
    content: 'Request to schedule data processing job for Q1 reports',
    timestamp: '2026-03-14 09:15:42',
    priority: 'high',
    type: 'request'
  },
  {
    id: 'MSG-002',
    from: 'TaskScheduler',
    to: 'DataAnalyzer Pro',
    content: 'Job scheduled successfully. Execution time: 09:30 EST',
    timestamp: '2026-03-14 09:16:05',
    priority: 'medium',
    type: 'response'
  },
  {
    id: 'MSG-003',
    from: 'NotificationBot',
    to: 'ALL',
    content: 'System maintenance window scheduled for tonight 2:00-4:00 AM',
    timestamp: '2026-03-14 09:14:22',
    priority: 'urgent',
    type: 'notification'
  },
  {
    id: 'MSG-004',
    from: 'DataAnalyzer Pro',
    to: 'NotificationBot',
    content: 'Data processing completed. Ready to send summary reports.',
    timestamp: '2026-03-14 09:13:18',
    priority: 'medium',
    type: 'status'
  },
  {
    id: 'MSG-005',
    from: 'TaskScheduler',
    to: 'DataAnalyzer Pro',
    content: 'Resource allocation increased due to high workload',
    timestamp: '2026-03-14 09:12:45',
    priority: 'low',
    type: 'notification'
  },
  {
    id: 'MSG-006',
    from: 'NotificationBot',
    to: 'TaskScheduler',
    content: 'Email delivery queue is full. Please reduce task frequency.',
    timestamp: '2026-03-14 09:11:33',
    priority: 'high',
    type: 'request'
  },
  {
    id: 'MSG-007',
    from: 'DataAnalyzer Pro',
    to: 'ALL',
    content: 'Database connection restored after temporary outage',
    timestamp: '2026-03-14 09:10:15',
    priority: 'medium',
    type: 'status'
  },
  {
    id: 'MSG-008',
    from: 'TaskScheduler',
    to: 'NotificationBot',
    content: 'Task frequency reduced to 50% for next 2 hours',
    timestamp: '2026-03-14 09:09:52',
    priority: 'medium',
    type: 'response'
  },
  {
    id: 'MSG-009',
    from: 'NotificationBot',
    to: 'DataAnalyzer Pro',
    content: 'API rate limit warning: approaching daily quota',
    timestamp: '2026-03-14 09:08:37',
    priority: 'high',
    type: 'notification'
  },
  {
    id: 'MSG-010',
    from: 'DataAnalyzer Pro',
    to: 'TaskScheduler',
    content: 'Request backup storage allocation for large dataset',
    timestamp: '2026-03-14 09:07:28',
    priority: 'low',
    type: 'request'
  },
  {
    id: 'MSG-011',
    from: 'TaskScheduler',
    to: 'ALL',
    content: 'New job queue algorithm deployed successfully',
    timestamp: '2026-03-14 09:06:14',
    priority: 'medium',
    type: 'status'
  },
  {
    id: 'MSG-012',
    from: 'NotificationBot',
    to: 'DataAnalyzer Pro',
    content: 'Performance metrics report generated and sent to admins',
    timestamp: '2026-03-14 09:05:41',
    priority: 'low',
    type: 'notification'
  }
];

export function MessageBoard() {
  const { t } = useTranslation();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />;
      case 'high': return <Zap className="h-3 w-3" />;
      case 'medium': return <Info className="h-3 w-3" />;
      case 'low': return <Clock className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return t('runtime.messages.priority.urgent');
      case 'high': return t('runtime.messages.priority.high');
      case 'medium': return t('runtime.messages.priority.medium');
      case 'low': return t('runtime.messages.priority.low');
      default: return priority;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request': return '❓';
      case 'response': return '✅';
      case 'notification': return '📢';
      case 'status': return '📊';
      default: return '💬';
    }
  };

  const getAgentInitials = (agentName: string) => {
    return agentName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('runtime.messages.title')}</h2>
        <p className="text-muted-foreground">
          {t('runtime.messages.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>{t('runtime.messages.recentMessages')}</span>
            </CardTitle>
            <Badge variant="outline">{mockMessages.length} {t('runtime.messages.messagesCount')}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMessages.map((message, index) => (
              <div
                key={message.id}
                className={`border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback className="text-xs font-semibold text-white">
                        {getAgentInitials(message.from)}
                      </AvatarFallback>
                    </Avatar>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Avatar className="h-8 w-8 bg-green-500">
                      <AvatarFallback className="text-xs font-semibold text-white">
                        {message.to === 'ALL' ? 'ALL' : getAgentInitials(message.to)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{message.from}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">{message.to}</span>
                        <span className="text-lg">{getTypeIcon(message.type)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityVariant(message.priority)} className="flex items-center space-x-1">
                          {getPriorityIcon(message.priority)}
                          <span>{getPriorityText(message.priority)}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}