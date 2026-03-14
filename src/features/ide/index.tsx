import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, Code, Wrench, TestTube, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentDB } from '@/shared/services/database';
import { useAgentStore } from '@/stores/agentStore';
import { AgentDefinition } from '@/shared/types/agent.types';

export function IDEOverview() {
  return (
    <Routes>
      <Route index element={<IDEHome />} />
      <Route path="create" element={<div>Agent Wizard (Coming Soon)</div>} />
      <Route path="agent/:agentId/*" element={<div>Agent Editor (Coming Soon)</div>} />
    </Routes>
  );
}

function IDEHome() {
  const { agents, setAgents, loading, setLoading } = useAgentStore();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'building': return 'warning';
      case 'testing': return 'outline';
      case 'published': return 'success';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'building': return '构建中';
      case 'testing': return '测试中';
      case 'published': return '已发布';
      case 'archived': return '已归档';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IDE</h1>
            <p className="text-muted-foreground">Agent 开发环境</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            创建 Agent
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
          <h1 className="text-3xl font-bold tracking-tight">IDE</h1>
          <p className="text-muted-foreground">
            Agent 开发环境 - 管理 {stats.total} 个 Agent
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          创建 Agent
        </Button>
      </div>

      {/* Development Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总数</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Agent 总数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">草稿</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">开发中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">构建中</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.building}</div>
            <p className="text-xs text-muted-foreground">正在编译</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">测试中</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testing}</div>
            <p className="text-xs text-muted-foreground">质量验证</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已发布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">可部署</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">我的 Agent</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              过滤
            </Button>
            <Button variant="outline" size="sm">
              排序
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: AgentDefinition;
}

function AgentCard({ agent }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'building': return 'warning';
      case 'testing': return 'outline';
      case 'published': return 'success';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'building': return '构建中';
      case 'testing': return '测试中';
      case 'published': return '已发布';
      case 'archived': return '已归档';
      default: return status;
    }
  };

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
          <span className="text-muted-foreground">版本</span>
          <span className="font-mono">{agent.version}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">最后更新</span>
          <span>{new Date(agent.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>

        {agent.status === 'testing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>测试覆盖率</span>
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
          <Button size="sm" className="flex-1">
            <Code className="mr-2 h-4 w-4" />
            编辑
          </Button>
          {agent.status === 'draft' && (
            <Button size="sm" variant="outline">
              <Wrench className="h-4 w-4" />
            </Button>
          )}
          {agent.status === 'building' && (
            <Button size="sm" variant="outline">
              <TestTube className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}