import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
    { value: 'all', label: '全部类别' },
    { value: 'data-analysis', label: '数据分析' },
    { value: 'automation', label: '自动化' },
    { value: 'customer-service', label: '客户服务' },
    { value: 'monitoring', label: '监控' }
  ];

  const industries = [
    { value: 'all', label: '全部行业' },
    { value: 'WMS', label: '仓储管理' },
    { value: 'TMS', label: '运输管理' },
    { value: 'HRM', label: '人力资源' },
    { value: 'general', label: '通用' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MarketPlace</h1>
          <p className="text-muted-foreground">Agent 发布和交易市场</p>
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
          Agent 发布和交易市场 - {filteredAndSortedAgents.length} 个可用 Agent
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索 Agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            筛选
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
              <option value="rating">按评分排序</option>
              <option value="downloads">按下载量排序</option>
              <option value="price">按价格排序</option>
              <option value="name">按名称排序</option>
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
            没有找到符合条件的 Agent
          </p>
          <p className="text-muted-foreground mt-2">
            尝试调整搜索条件或筛选器
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
  const getCategoryText = (category: { industry: string; function: string }) => {
    const industryMap = {
      'WMS': '仓储',
      'TMS': '运输',
      'HRM': '人事',
      'general': '通用'
    };
    
    const functionMap = {
      'data-analysis': '数据分析',
      'automation': '自动化',
      'customer-service': '客服',
      'monitoring': '监控'
    };

    return `${industryMap[category.industry as keyof typeof industryMap] || category.industry} • ${functionMap[category.function as keyof typeof functionMap] || category.function}`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? '免费' : `$${price}/月`;
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
                  <div className="text-lg font-bold">{formatPrice(agent.pricing.price)}</div>
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
              <Button className="w-32">雇佣</Button>
              <Button variant="outline" className="w-32">详情</Button>
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
            <div className="text-lg font-bold">{formatPrice(agent.pricing.price)}</div>
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
            {agent.metadata.downloads} 次下载
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
            雇佣
          </Button>
          <Button size="sm" variant="outline">
            详情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}