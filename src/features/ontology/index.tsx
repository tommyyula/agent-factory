import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, GitBranch, Search } from 'lucide-react';
import { ontologyDB } from '@/shared/services/database';
import { useOntologyStore } from '@/stores/ontologyStore';
import { OntologyDomain } from '@/shared/types/ontology.types';

export function OntologyOverview() {
  return (
    <Routes>
      <Route index element={<OntologyList />} />
      <Route path="graph/:ontologyId?" element={<div>Knowledge Graph Viewer (Coming Soon)</div>} />
      <Route path="versions/:ontologyId" element={<div>Version History (Coming Soon)</div>} />
    </Routes>
  );
}

function OntologyList() {
  const { t } = useTranslation();
  const { domains, setDomains, loading, setLoading } = useOntologyStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOntologies = async () => {
      setLoading(true);
      try {
        const ontologies = await ontologyDB.ontologies.toArray();
        setDomains(ontologies);
      } catch (error) {
        console.error('Failed to load ontologies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOntologies();
  }, [setDomains, setLoading]);

  const filteredDomains = domains.filter(domain =>
    domain.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case 'active': return 'success';
      case 'development': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('ontology.title')}</h1>
          <p className="text-muted-foreground">{t('ontology.subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('ontology.title')}</h1>
        <p className="text-muted-foreground">
          {t('ontology.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索知识域..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
          />
        </div>
        <Button variant="outline">
          <GitBranch className="mr-2 h-4 w-4" />
          版本历史
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">知识域总数</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">
              覆盖物流全流程
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">概念总数</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.metadata.conceptCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              结构化知识概念
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">关系总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.metadata.relationCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              概念间关联
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均完整度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(domains.reduce((sum, domain) => sum + domain.metadata.completeness, 0) / domains.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              知识覆盖程度
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ontology Domains Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDomains.map((domain) => (
          <OntologyCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}

interface OntologyCardProps {
  domain: OntologyDomain;
}

function OntologyCard({ domain }: OntologyCardProps) {
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
      case 'active': return 'success';
      case 'development': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'outline';
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
                {domain.status}
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
            <span className="text-muted-foreground">概念数量</span>
            <div className="font-semibold">{domain.metadata.conceptCount}</div>
          </div>
          <div>
            <span className="text-muted-foreground">关系数量</span>
            <div className="font-semibold">{domain.metadata.relationCount}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>CQ 覆盖率</span>
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
            <span>知识完整性</span>
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
          <Button size="sm" className="flex-1">
            <Brain className="mr-2 h-4 w-4" />
            查看图谱
          </Button>
          <Button size="sm" variant="outline">
            <GitBranch className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}