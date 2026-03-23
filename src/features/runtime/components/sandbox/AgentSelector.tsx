/**
 * Agent Selector Component
 * Interface for browsing and selecting agents from the agency catalog
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Bot, 
  ChevronRight, 
  Users, 
  Activity,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { simpleAgencyAgents, AGENCY_DOMAINS } from '@/data/agency-agents-simple';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';

export function AgentSelector() {
  const navigate = useNavigate();
  const { selectAgent } = useAgentRuntimeStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAgents = useMemo(() => {
    return simpleAgencyAgents.filter(agent => {
      const matchesSearch = !searchQuery || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDomain = selectedDomain === 'all' || agent.domain === selectedDomain;
      const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
      
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [searchQuery, selectedDomain, selectedStatus]);

  const groupedAgents = useMemo(() => {
    const groups: Record<string, typeof filteredAgents> = {};
    filteredAgents.forEach(agent => {
      if (!groups[agent.domain]) {
        groups[agent.domain] = [];
      }
      groups[agent.domain].push(agent);
    });
    return groups;
  }, [filteredAgents]);

  const handleSelectAgent = (agent: typeof simpleAgencyAgents[0]) => {
    selectAgent(agent);
    navigate(`/runtime/sandbox/${agent.id}`);
  };

  const stats = useMemo(() => {
    const domains = new Set(filteredAgents.map(a => a.domain));
    const activeAgents = filteredAgents.filter(a => a.status === 'active').length;
    return {
      total: filteredAgents.length,
      domains: domains.size,
      active: activeAgents
    };
  }, [filteredAgents]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          智能体运行环境
        </h1>
        <p className="text-muted-foreground">
          选择一个智能体开始测试和调试。支持 {simpleAgencyAgents.length} 个跨域智能体。
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">筛选结果</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.domains}</div>
            <div className="text-sm text-muted-foreground">业务域</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">活跃智能体</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {Object.values(AGENCY_DOMAINS).reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">总智能体</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索智能体名称、描述或能力..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有域</SelectItem>
              {Object.entries(AGENCY_DOMAINS).map(([key, domain]) => (
                <SelectItem key={key} value={key}>
                  {domain.name} ({domain.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="inactive">非活跃</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            显示 {filteredAgents.length} 个智能体
          </span>
        </div>
      </div>

      {/* Agent Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">网格视图</TabsTrigger>
          <TabsTrigger value="domain">按域分组</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onClick={() => handleSelectAgent(agent)}
              />
            ))}
          </div>
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">未找到匹配的智能体</p>
              <p className="text-sm text-muted-foreground">尝试调整搜索条件或筛选器</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          {Object.entries(groupedAgents).map(([domain, agents]) => (
            <Card key={domain}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: AGENCY_DOMAINS[domain as keyof typeof AGENCY_DOMAINS]?.color }}
                  />
                  {AGENCY_DOMAINS[domain as keyof typeof AGENCY_DOMAINS]?.name || domain.toUpperCase()} 域
                  <Badge variant="secondary">{agents.length} 个智能体</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {agents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onClick={() => handleSelectAgent(agent)}
                      compact
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AgentCardProps {
  agent: typeof simpleAgencyAgents[0];
  onClick: () => void;
  compact?: boolean;
}

function AgentCard({ agent, onClick, compact }: AgentCardProps) {
  const domainInfo = AGENCY_DOMAINS[agent.domain as keyof typeof AGENCY_DOMAINS];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`${compact ? 'text-sm' : 'text-base'} mb-1`}>
              {agent.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: domainInfo?.color,
                  color: domainInfo?.color 
                }}
              >
                {agent.domain.toUpperCase()}
              </Badge>
              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                {agent.status === 'active' ? '活跃' : '非活跃'}
              </Badge>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
        
        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className={compact ? "pt-0" : undefined}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{agent.department}</span>
            <span>•</span>
            <span>{agent.role}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              <span>核心能力 ({agent.capabilities.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, compact ? 2 : 3).map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {agent.capabilities.length > (compact ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.length - (compact ? 2 : 3)}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <Button size="sm" className="flex-1">
              <Activity className="h-3 w-3 mr-1" />
              开始测试
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}