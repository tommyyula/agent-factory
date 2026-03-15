import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Database, GitBranch, Search } from 'lucide-react';
import { ontologyDB } from '@/shared/services/database';
import { useOntologyStore } from '@/stores/ontologyStore';
import { OntologyCard } from './OntologyCard';

export function OntologyList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalDomainsDesc', '覆盖物流全流程')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalConcepts', '概念总数')}
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.metadata.conceptCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalConceptsDesc', '结构化知识概念')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.totalRelations', '关系总数')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.metadata.relationCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.totalRelationsDesc', '概念间关联')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('ontology.stats.avgCompleteness', '平均完整度')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(domains.reduce((sum, domain) => sum + domain.metadata.completeness, 0) / domains.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t('ontology.stats.avgCompletenessDesc', '知识覆盖程度')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ontology Domains Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDomains.map((domain) => (
          <OntologyCard
            key={domain.id}
            domain={domain}
            onViewGraph={handleViewGraph}
            onViewVersions={handleViewVersions}
          />
        ))}
      </div>
    </div>
  );
}