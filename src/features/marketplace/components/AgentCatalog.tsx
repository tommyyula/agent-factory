import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Download, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition } from '@/shared/types/agent.types';

interface AgentCatalogProps {
  onAgentSelect?: (agentId: string) => void;
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
}

export function AgentCatalog({
  onAgentSelect,
  viewMode: initialViewMode = 'grid',
  showFilters = true
}: AgentCatalogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        // Only show published agents in marketplace
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
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!agent.displayName.toLowerCase().includes(query) &&
            !agent.description.toLowerCase().includes(query) &&
            !agent.metadata.tags.some(tag => tag.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Division filter (agency-agents divisions)
      if (selectedDivision !== 'all') {
        const agentDivision = (agent.category as any).division || (agent.metadata as any).division;
        if (agentDivision !== selectedDivision) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && agent.category.function !== selectedCategory) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== 'all' && agent.category.industry !== selectedIndustry) {
        return false;
      }

      // Price filter
      if (priceFilter !== 'all') {
        if (priceFilter === 'free' && agent.pricing.price > 0) return false;
        if (priceFilter === 'paid' && agent.pricing.price === 0) return false;
        if (priceFilter === 'subscription' && agent.pricing.model !== 'subscription') return false;
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
          return a.displayName.localeCompare(b.displayName);
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
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

  const priceFilters = [
    { value: 'all', label: t('marketplace.filters.allPrices') },
    { value: 'free', label: t('marketplace.filters.freeOnly') },
    { value: 'paid', label: t('marketplace.filters.paidOnly') },
    { value: 'subscription', label: t('marketplace.filters.subscriptionOnly') }
  ];

  const sortOptions = [
    { value: 'rating', label: t('marketplace.sorting.byRating') },
    { value: 'downloads', label: t('marketplace.sorting.byDownloads') },
    { value: 'price', label: t('marketplace.sorting.byPrice') },
    { value: 'name', label: t('marketplace.sorting.byName') },
    { value: 'newest', label: t('marketplace.sorting.byNewest') }
  ];

  const handleAgentClick = (agent: AgentDefinition) => {
    if (onAgentSelect) {
      onAgentSelect(agent.id);
    } else {
      navigate(`/marketplace/agent/${agent.id}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedIndustry('all');
    setPriceFilter('all');
    setSortBy('rating');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('marketplace.catalog.title')}</h2>
            <p className="text-muted-foreground">{t('marketplace.catalog.loading')}</p>
          </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('marketplace.catalog.title')}</h2>
          <p className="text-muted-foreground">
            {filteredAndSortedAgents.length} {t('marketplace.agentsAvailable')}
          </p>
        </div>

        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('marketplace.filters.advanced')}
          </Button>
        )}
      </div>

      {/* Search and Basic Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('marketplace.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" onClick={clearFilters}>
              {t('marketplace.filters.clear')}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid gap-4 md:grid-cols-5 p-4 border rounded-lg bg-muted/30">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">全部领域</option>
                <option value="engineering">💻 工程</option>
                <option value="design">🎨 设计</option>
                <option value="marketing">📢 营销</option>
                <option value="sales">💼 销售</option>
                <option value="product">📊 产品</option>
                <option value="project-management">📋 项目管理</option>
                <option value="testing">🧪 测试</option>
                <option value="support">🛟 支持</option>
                <option value="specialized">⚙️ 专业</option>
                <option value="spatial-computing">🥽 空间计算</option>
                <option value="paid-media">💰 付费媒体</option>
                <option value="strategy">🎯 战略</option>
                <option value="game-development">🎮 游戏开发</option>
              </select>

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
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {priceFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end space-x-2">
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
      )}

      {/* Agent Grid/List */}
      <div className={viewMode === 'grid'
        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        : "space-y-4"
      }>
        {filteredAndSortedAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            viewMode={viewMode}
            onClick={() => handleAgentClick(agent)}
          />
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
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            {t('marketplace.filters.clear')}
          </Button>
        </div>
      )}
    </div>
  );
}

interface AgentCardProps {
  agent: AgentDefinition;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function AgentCard({ agent, viewMode, onClick }: AgentCardProps) {
  const { t } = useTranslation();

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

  const divisionLabels: Record<string, string> = {
    'engineering': '💻 工程', 'design': '🎨 设计', 'marketing': '📢 营销',
    'sales': '💼 销售', 'product': '📊 产品', 'project-management': '📋 项目管理',
    'testing': '🧪 测试', 'support': '🛟 支持', 'specialized': '⚙️ 专业',
    'spatial-computing': '🥽 空间计算', 'paid-media': '💰 付费媒体',
    'strategy': '🎯 战略', 'game-development': '🎮 游戏开发',
  };

  const getCategoryDisplay = (category: { industry: string; function: string }) => {
    const div = (category as any).division;
    if (div && divisionLabels[div]) {
      return divisionLabels[div];
    }
    return `${category.industry} • ${category.function}`;
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{agent.displayName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryDisplay(agent.category)}
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{agent.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getCategoryDisplay(agent.category)}
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