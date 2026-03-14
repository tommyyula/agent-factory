import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Server, Cpu, Database, Network, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArchitectureLayerData {
  key: string;
  icon: React.ElementType;
  description: string;
  details: string;
  status: 'running' | 'healthy' | 'active' | 'syncing' | 'connected';
  metrics?: string;
}

export function ArchitectureOverview() {
  const { t } = useTranslation();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const layers: ArchitectureLayerData[] = [
    {
      key: 'aaas',
      icon: Cloud,
      description: t('dashboard.architecture.layers.aaas'),
      details: 'Agent as a Service layer provides scalable agent deployment and management capabilities',
      status: 'running',
      metrics: '99.9% uptime'
    },
    {
      key: 'runtime',
      icon: Cpu,
      description: t('dashboard.architecture.layers.runtime'),
      details: 'Runtime environment manages agent execution, resource allocation, and task scheduling',
      status: 'healthy',
      metrics: '12 active instances'
    },
    {
      key: 'factory',
      icon: Server,
      description: t('dashboard.architecture.layers.factory'),
      details: 'Factory layer handles agent creation, compilation, and deployment pipelines',
      status: 'active',
      metrics: '8 builds today'
    },
    {
      key: 'ontology',
      icon: Network,
      description: t('dashboard.architecture.layers.ontology'),
      details: 'Knowledge ontology provides domain-specific understanding and reasoning capabilities',
      status: 'syncing',
      metrics: '6 domains indexed'
    },
    {
      key: 'dataSources',
      icon: Database,
      description: t('dashboard.architecture.layers.dataSources'),
      details: 'Data sources integration layer connects to external systems and APIs',
      status: 'connected',
      metrics: '24 sources connected'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'healthy': return 'bg-emerald-500';
      case 'active': return 'bg-blue-500';
      case 'syncing': return 'bg-yellow-500';
      case 'connected': return 'bg-violet-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'healthy': return 'success';
      case 'active': return 'default';
      case 'syncing': return 'warning';
      case 'connected': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return t('dashboard.architecture.status.running');
      case 'healthy': return t('dashboard.architecture.status.healthy');
      case 'active': return t('dashboard.architecture.status.active');
      case 'syncing': return t('dashboard.architecture.status.syncing');
      case 'connected': return t('dashboard.architecture.status.connected');
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t('dashboard.architecture.title')}
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.key;
            const isHovered = selectedLayer === layer.key;

            return (
              <div
                key={layer.key}
                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected ? 'bg-accent/80 shadow-md scale-[1.02]' : 'bg-accent/50 hover:bg-accent/70'
                }`}
                onClick={() => setSelectedLayer(isSelected ? null : layer.key)}
                onMouseEnter={() => setSelectedLayer(layer.key)}
                onMouseLeave={() => setSelectedLayer(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(layer.status)}`} />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{layer.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {layer.metrics && (
                      <span className="text-xs text-muted-foreground">{layer.metrics}</span>
                    )}
                    <Badge variant={getStatusVariant(layer.status)}>
                      {getStatusText(layer.status)}
                    </Badge>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {layer.details}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedLayer && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
            <p className="text-xs text-muted-foreground">
              💡 Click on any layer to explore its details. Each layer represents a critical component of the Agent Factory Platform architecture.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}