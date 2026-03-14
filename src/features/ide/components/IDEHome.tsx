import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Code, Wrench, TestTube, FileText, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agentDB } from '@/shared/services/database';
import { useAgentStore } from '@/stores/agentStore';
import { AgentCard } from './AgentCard';

export function IDEHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agents, setAgents, loading, setLoading } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    building: 0,
    testing: 0,
    published: 0
  });

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        const allAgents = await agentDB.agents.toArray();
        setAgents(allAgents);

        // Calculate stats
        const statsData = allAgents.reduce((acc, agent) => {
          acc.total++;
          acc[agent.status]++;
          return acc;
        }, { total: 0, draft: 0, building: 0, testing: 0, published: 0, archived: 0 });

        setStats(statsData);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [setAgents, setLoading]);

  const handleCreateAgent = () => {
    navigate('/ide/create');
  };

  const handleEditAgent = (agentId: string) => {
    navigate(`/ide/agent/${agentId}`);
  };

  const handleBuildAgent = async (agentId: string) => {
    try {
      await agentDB.agents.update(agentId, {
        status: 'building',
        updatedAt: new Date()
      });
      // Refresh the agents list
      const allAgents = await agentDB.agents.toArray();
      setAgents(allAgents);
    } catch (error) {
      console.error('Failed to start build:', error);
    }
  };

  const handleTestAgent = async (agentId: string) => {
    try {
      await agentDB.agents.update(agentId, {
        status: 'testing',
        updatedAt: new Date()
      });
      // Refresh the agents list
      const allAgents = await agentDB.agents.toArray();
      setAgents(allAgents);
    } catch (error) {
      console.error('Failed to start tests:', error);
    }
  };

  // Filter agents based on search and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('ide.title', 'IDE')}</h1>
            <p className="text-muted-foreground">{t('ide.subtitle', 'Integrated Development Environment')}</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            {t('ide.createAgent', '创建 Agent')}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('ide.title', 'IDE')}</h1>
          <p className="text-muted-foreground">
            {t('ide.subtitle', 'Agent 开发工作台')}
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="mr-2 h-4 w-4" />
          {t('ide.createAgent', '创建 Agent')}
        </Button>
      </div>

      {/* Development Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ide.stats.total', '总数')}</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('ide.stats.totalDesc', 'Agent 总数')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ide.stats.draft', '草稿')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">{t('ide.stats.draftDesc', '开发中')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ide.stats.building', '构建中')}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.building}</div>
            <p className="text-xs text-muted-foreground">{t('ide.stats.buildingDesc', '正在编译')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ide.stats.testing', '测试中')}</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testing}</div>
            <p className="text-xs text-muted-foreground">{t('ide.stats.testingDesc', '质量验证')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ide.stats.published', '已发布')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{t('ide.stats.publishedDesc', '可部署')}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('ide.searchPlaceholder', '搜索 Agent...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('ide.filter.all', '全部状态')}</SelectItem>
            <SelectItem value="draft">{t('ide.filter.draft', '草稿')}</SelectItem>
            <SelectItem value="building">{t('ide.filter.building', '构建中')}</SelectItem>
            <SelectItem value="testing">{t('ide.filter.testing', '测试中')}</SelectItem>
            <SelectItem value="published">{t('ide.filter.published', '已发布')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {t('ide.myAgents', '我的 Agent')}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredAgents.length})
            </span>
          </h2>
        </div>

        {filteredAgents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || statusFilter !== 'all'
                  ? t('ide.noFilterResults', '没有找到匹配的 Agent')
                  : t('ide.noAgents', '还没有 Agent')}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? t('ide.tryDifferentFilter', '尝试调整搜索条件或筛选器')
                  : t('ide.createFirstAgent', '创建您的第一个 AI Agent 开始开发')}
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <Button onClick={handleCreateAgent}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('ide.createAgent', '创建 Agent')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={handleEditAgent}
                onBuild={handleBuildAgent}
                onTest={handleTestAgent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}