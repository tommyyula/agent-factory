import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, GitBranch, Search, Table, Settings, Eye, Play } from 'lucide-react';
import { ontologyDB } from '@/shared/services/database';
import { useOntologyStore } from '@/stores/ontologyStore';
import { OntologyCard } from './OntologyCard';
import { schemaStats, DOMAIN_COLORS } from '@/data/agency-schemas-simple';
import { OBR_DOMAINS, getCombinedMetrics, getAllDomains, DomainId } from '@/data/obr-domains';

export function OntologyList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Get OBR domains and metrics
  const obrDomains = getAllDomains();
  const metrics = getCombinedMetrics();

  useEffect(() => {
    // Simulate loading for consistent UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredDomains = obrDomains.filter(domain =>
    domain.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.metadata.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewGraph = (domainId: string) => {
    navigate(`/ontology/graph/${domainId}`);
  };

  const handleViewVersions = (domainId: string) => {
    navigate(`/ontology/versions/${domainId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('ontology.title', '本体知识')}</h1>
          <p className="text-muted-foreground">{t('ontology.subtitle', '物流领域知识图谱管理')}</p>
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
        <h1 className="text-3xl font-bold tracking-tight">{t('ontology.title', '本体知识')}</h1>
        <p className="text-muted-foreground">
          {t('ontology.subtitle', '物流领域知识图谱管理')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('ontology.searchPlaceholder', '搜索知识域...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
          />
        </div>
        <Button variant="outline" onClick={() => navigate('/ontology/graph')}>
          <GitBranch className="mr-2 h-4 w-4" />
          {t('ontology.viewAllGraphs', '查看全部图谱')}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalDomains', '知识域总数')}
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDomains}</div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalDomainsDesc', '覆盖物流全流程')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalObjects', '对象总数')}
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalObjects}</div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalObjectsDesc', '业务实体对象')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalBehaviors', '行为总数')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBehaviors}</div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalBehaviorsDesc', '业务行为流程')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalScenarios', '场景总数')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalScenarios}</div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalScenariosDesc', '业务场景模型')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agency Schema Statistics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">🗄️ Agency 数据架构</h3>
          <Badge variant="outline">SQLite Schema</Badge>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Total Tables */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">数据表总数</CardTitle>
              <Table className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schemaStats.totalTables}</div>
              <p className="text-xs text-muted-foreground">跨五大业务域</p>
            </CardContent>
          </Card>

          {/* Domain-specific tables */}
          {Object.entries(schemaStats.domains).map(([domain, stats]) => (
            <Card key={domain}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{domain}</CardTitle>
                <div 
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] }}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tables}</div>
                <p className="text-xs text-muted-foreground">{stats.columns} 列</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* OBR Domains Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('ontology.obrDomains', 'OBR 业务域')}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({filteredDomains.length})
          </span>
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDomains.map((domain) => (
            <Card key={domain.metadata.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {domain.metadata.domain}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {domain.metadata.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    v{domain.metadata.version}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {domain.metadata.description}
                </p>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">对象:</span>
                      <span className="font-medium">{domain.objects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">行为:</span>
                      <span className="font-medium">{domain.behaviors.length}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">规则:</span>
                      <span className="font-medium">{domain.rules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">场景:</span>
                      <span className="font-medium">{domain.scenarios.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/ontology/obr/${domain.metadata.domain.toLowerCase()}`)}
                    className="flex-1"
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    OBR 管理
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/ontology/graph/${domain.metadata.domain.toLowerCase()}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    查看图谱
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/ontology/simulation`)}
                >
                  <Play className="mr-1 h-3 w-3" />
                  模拟场景
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}