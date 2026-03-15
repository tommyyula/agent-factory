import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw, Clock, Cpu, MemoryStick } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRuntimeStore } from '@/stores/runtimeStore';

interface AgentInstance {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
  lastHeartbeat: string;
  version: string;
  environment: string;
}

// Mock data for 3 running agent instances
const mockInstances: AgentInstance[] = [
  {
    id: 'agent-001',
    name: 'DataAnalyzer Pro',
    status: 'running',
    uptime: '2d 14h 32m',
    memoryUsage: 256,
    cpuUsage: 23,
    lastHeartbeat: '2s ago',
    version: '1.2.4',
    environment: 'production'
  },
  {
    id: 'agent-002',
    name: 'TaskScheduler',
    status: 'running',
    uptime: '1d 8h 16m',
    memoryUsage: 128,
    cpuUsage: 8,
    lastHeartbeat: '1s ago',
    version: '2.1.0',
    environment: 'production'
  },
  {
    id: 'agent-003',
    name: 'NotificationBot',
    status: 'running',
    uptime: '5d 2h 45m',
    memoryUsage: 64,
    cpuUsage: 5,
    lastHeartbeat: '3s ago',
    version: '1.0.8',
    environment: 'staging'
  }
];

export function DeploymentList() {
  const { t } = useTranslation();
  const { startAgent, stopAgent, pauseAgent, restartAgent } = useRuntimeStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'stopped': return <Square className="h-4 w-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return t('runtime.deployments.status.running');
      case 'paused': return t('runtime.deployments.status.paused');
      case 'stopped': return t('runtime.deployments.status.stopped');
      case 'error': return t('runtime.deployments.status.error');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('runtime.deployments.title')}</h2>
        <p className="text-muted-foreground">
          {t('runtime.deployments.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {mockInstances.map((instance) => (
          <Card key={instance.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(instance.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{instance.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {instance.environment} • v{instance.version}
                      </p>
                    </div>
                  </div>

                  <Badge variant={getStatusVariant(instance.status)}>
                    {getStatusText(instance.status)}
                  </Badge>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t('runtime.deployments.uptime')}</div>
                        <div className="text-muted-foreground">{instance.uptime}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t('runtime.deployments.cpu')}</div>
                        <div className="text-muted-foreground">{instance.cpuUsage}%</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MemoryStick className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t('runtime.deployments.memory')}</div>
                        <div className="text-muted-foreground">{instance.memoryUsage}MB</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{t('runtime.deployments.heartbeat')}</div>
                        <div className="text-green-600">{instance.lastHeartbeat}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-1">
                    {instance.status === 'stopped' && (
                      <Button size="icon" variant="outline" onClick={() => startAgent(instance.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {instance.status === 'running' && (
                      <Button size="icon" variant="outline" onClick={() => pauseAgent(instance.id)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {instance.status !== 'stopped' && (
                      <Button size="icon" variant="outline" onClick={() => stopAgent(instance.id)}>
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="outline" onClick={() => restartAgent(instance.id)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}