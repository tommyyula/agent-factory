import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Wrench, TestTube } from 'lucide-react';
import { AgentDefinition } from '@/shared/types/agent.types';

interface AgentCardProps {
  agent: AgentDefinition;
  onEdit?: (agentId: string) => void;
  onBuild?: (agentId: string) => void;
  onTest?: (agentId: string) => void;
}

export function AgentCard({ agent, onEdit, onBuild, onTest }: AgentCardProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'building': return 'secondary';
      case 'testing': return 'outline';
      case 'published': return 'default';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return t('ide.status.draft', '草稿');
      case 'building': return t('ide.status.building', '构建中');
      case 'testing': return t('ide.status.testing', '测试中');
      case 'published': return t('ide.status.published', '已发布');
      case 'archived': return t('ide.status.archived', '已归档');
      default: return status;
    }
  };

  const getCategoryText = (category: { industry: string; function: string }) => {
    const industryMap = {
      'WMS': t('industry.wms', '仓储'),
      'TMS': t('industry.tms', '运输'),
      'HRM': t('industry.hrm', '人事'),
      'general': t('industry.general', '通用')
    };

    const functionMap = {
      'data-analysis': t('function.dataAnalysis', '数据分析'),
      'automation': t('function.automation', '自动化'),
      'customer-service': t('function.customerService', '客服'),
      'monitoring': t('function.monitoring', '监控')
    };

    return `${industryMap[category.industry as keyof typeof industryMap] || category.industry} • ${functionMap[category.function as keyof typeof functionMap] || category.function}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{agent.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getCategoryText(agent.category)}
            </p>
          </div>
          <Badge variant={getStatusColor(agent.status)}>
            {getStatusText(agent.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agent.description}
        </p>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('ide.version', '版本')}</span>
          <span className="font-mono">{agent.version}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('ide.lastUpdated', '最后更新')}</span>
          <span>{new Date(agent.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>

        {agent.status === 'testing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('ide.testCoverage', '测试覆盖率')}</span>
              <span>{agent.test.coverage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${agent.test.coverage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(agent.id)}
          >
            <Code className="mr-2 h-4 w-4" />
            {t('ide.edit', '编辑')}
          </Button>
          {agent.status === 'draft' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBuild?.(agent.id)}
            >
              <Wrench className="h-4 w-4" />
            </Button>
          )}
          {agent.status === 'building' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTest?.(agent.id)}
            >
              <TestTube className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}