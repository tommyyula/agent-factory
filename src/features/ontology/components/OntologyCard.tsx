import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, GitBranch } from 'lucide-react';
import { OntologyDomain } from '@/shared/types/ontology.types';

interface OntologyCardProps {
  domain: OntologyDomain;
  onViewGraph?: (domainId: string) => void;
  onViewVersions?: (domainId: string) => void;
}

export function OntologyCard({ domain, onViewGraph, onViewVersions }: OntologyCardProps) {
  const { t } = useTranslation();

  const getIndustryColor = (industry: string) => {
    const colors = {
      'WMS': 'bg-blue-500',
      'TMS': 'bg-green-500',
      'FMS': 'bg-yellow-500',
      'HRM': 'bg-purple-500',
      'YMS': 'bg-orange-500',
      'OMS': 'bg-red-500'
    };
    return colors[industry as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'development': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('ontology.status.active', '活跃');
      case 'development': return t('ontology.status.development', '开发中');
      case 'inactive': return t('ontology.status.inactive', '非活跃');
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getIndustryColor(domain.industry)}`} />
              <CardTitle className="text-lg">{domain.displayName}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(domain.status)}>
                {getStatusText(domain.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">v{domain.version}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Brain className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {domain.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">{t('ontology.conceptCount', '概念数量')}</span>
            <div className="font-semibold">{domain.metadata.conceptCount}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('ontology.relationCount', '关系数量')}</span>
            <div className="font-semibold">{domain.metadata.relationCount}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('ontology.cqCoverage', 'CQ 覆盖率')}</span>
            <span>{domain.metadata.cqCoverage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${domain.metadata.cqCoverage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('ontology.completeness', '知识完整性')}</span>
            <span>{domain.metadata.completeness}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${domain.metadata.completeness}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onViewGraph?.(domain.id)}
          >
            <Brain className="mr-2 h-4 w-4" />
            {t('ontology.viewGraph', '查看图谱')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewVersions?.(domain.id)}
          >
            <GitBranch className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}