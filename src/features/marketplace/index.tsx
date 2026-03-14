import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Star, Download, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition } from '@/shared/types/agent.types';

export function AgentCatalog() {
  return (
    <Routes>
      <Route index element={<MarketplaceHome />} />
      <Route path="agent/:agentId" element={<div>Agent Details (Coming Soon)</div>} />
      <Route path="hire/:agentId" element={<div>Hiring Workflow (Coming Soon)</div>} />
    </Routes>
  );
}

function MarketplaceHome() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        // 只显示已发布的 Agent
        const publishedAgents = await agentDB.agents.where('status').equals('published').toArray();
        setAgents(publishedAgents);
      } catch (error) {
        console.error('Failed to load marketplace agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  // Filter and sort logic
  const filteredAndSortedAgents = agents
    .filter(agent => {
      if (searchQuery && !agent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !agent.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && agent.category.function !== selectedCategory) {
        return false;
      }
      if (selectedIndustry !== 'all' && agent.category.industry !== selectedIndustry) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.metadata.rating - a.metadata.rating;
        case 'downloads':
          return b.metadata.downloads - a.metadata.downloads;
        case 'price':
          return a.pricing.price - b.pricing.price;
        case 'name':
          return a.displayName.localeCompare(b.displayName, 'zh-CN');
        default:
          return 0;
      }
    });

  const categories = [
    { value: 'all', label: t('marketplace.categories.all') },
    { value: 'data-analysis', label: t('marketplace.categories.dataAnalysis') },
    { value: 'automation', label: t('marketplace.categories.automation') },
    { value: 'customer-service', label: t('marketplace.categories.customerService') },
    { value: 'monitoring', label: t('marketplace.categories.monitoring') },
    { value: 'productivity', label: t('marketplace.categories.productivity') },
    { value: 'optimization', label: t('marketplace.categories.optimization') },
    { value: 'analytics', label: t('marketplace.categories.analytics') },
    { value: 'self-improvement', label: t('marketplace.categories.selfImprovement') },
    { value: 'code-analysis', label: t('marketplace.categories.codeAnalysis') },
    { value: 'generation', label: t('marketplace.categories.generation') },
    { value: 'integration', label: t('marketplace.categories.integration') },
    { value: 'visualization', label: t('marketplace.categories.visualization') },
    { value: 'memory-management', label: t('marketplace.categories.memoryManagement') },
    { value: 'lifestyle', label: t('marketplace.categories.lifestyle') }
  ];

  const industries = [
    { value: 'all', label: t('marketplace.industries.all') },
    { value: 'WMS', label: t('marketplace.industries.wms') },
    { value: 'TMS', label: t('marketplace.industries.tms') },
    { value: 'HRM', label: t('marketplace.industries.hrm') },
    { value: 'FMS', label: t('marketplace.industries.fms') },
    { value: 'YMS', label: t('marketplace.industries.yms') },
    { value: 'OMS', label: t('marketplace.industries.oms') },
    { value: 'general', label: t('marketplace.industries.general') },
    { value: 'healthcare', label: t('marketplace.industries.healthcare') },
    { value: 'ai-tools', label: t('marketplace.industries.aiTools') },
    { value: 'development', label: t('marketplace.industries.development') },
    { value: 'creative', label: t('marketplace.industries.creative') },
    { value: 'knowledge', label: t('marketplace.industries.knowledge') },
    { value: 'marketing', label: t('marketplace.industries.marketing') }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('marketplace.title')}</h1>
          <p className="text-muted-foreground">{t('marketplace.subtitle')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                  <div className="h-8 bg-muted animate-pulse rounded" />
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
        <h1 className="text-3xl font-bold tracking-tight">MarketPlace</h1>
        <p className="text-muted-foreground">
          {t('marketplace.subtitle')} - {filteredAndSortedAgents.length} {t('marketplace.agentsAvailable')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('marketplace.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t('marketplace.search.filter')}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              {industries.map(ind => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="rating">{t('marketplace.sorting.byRating')}</option>
              <option value="downloads">{t('marketplace.sorting.byDownloads')}</option>
              <option value="price">{t('marketplace.sorting.byPrice')}</option>
              <option value="name">{t('marketplace.sorting.byName')}</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Agent Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
        : "space-y-4"
      }>
        {filteredAndSortedAgents.map((agent) => (
          <AgentMarketCard key={agent.id} agent={agent} viewMode={viewMode} />
        ))}
      </div>

      {filteredAndSortedAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t('marketplace.noResults')}
          </p>
          <p className="text-muted-foreground mt-2">
            {t('marketplace.tryAdjusting')}
          </p>
        </div>
      )}
    </div>
  );
}

interface AgentMarketCardProps {
  agent: AgentDefinition;
  viewMode: 'grid' | 'list';
}

function AgentMarketCard({ agent, viewMode }: AgentMarketCardProps) {
  const { t } = useTranslation();

  const getCategoryText = (category: { industry: string; function: string }) => {
    const industryMap = {
      'WMS': t('marketplace.industries.wms'),
      'TMS': t('marketplace.industries.tms'),
      'HRM': t('marketplace.industries.hrm'),
      'FMS': t('marketplace.industries.fms'),
      'YMS': t('marketplace.industries.yms'),
      'OMS': t('marketplace.industries.oms'),
      'general': t('marketplace.industries.general'),
      'healthcare': t('marketplace.industries.healthcare'),
      'ai-tools': t('marketplace.industries.aiTools'),
      'development': t('marketplace.industries.development'),
      'creative': t('marketplace.industries.creative'),
      'knowledge': t('marketplace.industries.knowledge'),
      'marketing': t('marketplace.industries.marketing')
    };

    const functionMap = {
      'data-analysis': t('marketplace.categories.dataAnalysis'),
      'automation': t('marketplace.categories.automation'),
      'customer-service': t('marketplace.categories.customerService'),
      'monitoring': t('marketplace.categories.monitoring'),
      'productivity': t('marketplace.categories.productivity'),
      'optimization': t('marketplace.categories.optimization'),
      'analytics': t('marketplace.categories.analytics'),
      'self-improvement': t('marketplace.categories.selfImprovement'),
      'code-analysis': t('marketplace.categories.codeAnalysis'),
      'generation': t('marketplace.categories.generation'),
      'integration': t('marketplace.categories.integration'),
      'visualization': t('marketplace.categories.visualization'),
      'memory-management': t('marketplace.categories.memoryManagement'),
      'lifestyle': t('marketplace.categories.lifestyle')
    };

    return `${industryMap[category.industry as keyof typeof industryMap] || category.industry} • ${functionMap[category.function as keyof typeof functionMap] || category.function}`;
  };

  const formatPrice = (agent: AgentDefinition) => {
    if (agent.pricing.price === 0) {
      return t('marketplace.agent.free');
    }

    switch (agent.pricing.model) {
      case 'subscription':
        return `$${agent.pricing.price}${t('marketplace.agent.perMonth')}`;
      case 'usage':
        return `$${agent.pricing.price}${t('marketplace.agent.perUse')}`;
      case 'pay-per-use':
        return `$${agent.pricing.price}${t('marketplace.agent.perUse')}`;
      case 'free':
        return t('marketplace.agent.free');
      default:
        return `$${agent.pricing.price}`;
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{agent.displayName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryText(agent.category)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatPrice(agent)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                    {agent.metadata.rating.toFixed(1)}
                    <span className="mx-1">•</span>
                    <Download className="h-3 w-3 mr-1" />
                    {agent.metadata.downloads}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description}
              </p>
              
              <div className="flex items-center space-x-2">
                {agent.metadata.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button className="w-32">{t('marketplace.agent.hire')}</Button>
              <Button variant="outline" className="w-32">{t('marketplace.agent.details')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="text-right">
            <div className="text-lg font-bold">{formatPrice(agent)}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {agent.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
            {agent.metadata.rating.toFixed(1)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Download className="h-3 w-3 mr-1" />
            {agent.metadata.downloads} {t('marketplace.agent.downloads')}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {agent.metadata.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            {t('marketplace.agent.hire')}
          </Button>
          <Button size="sm" variant="outline">
            {t('marketplace.agent.details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}