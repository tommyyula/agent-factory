/**
 * Agent Context Panel Component
 * Shows agent information, available tables, execution history, and metrics
 */

import React, { useState } from 'react';
import { 
  Database, 
  Activity, 
  Clock, 
  Coins, 
  Settings, 
  Table,
  Eye,
  BarChart3,
  History,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AgentSession } from '@/stores/agentRuntimeStore';
import { SimpleAgencyAgent } from '@/data/agency-agents-simple';
import { getTablesByDomain } from '@/data/agency-schemas';

interface AgentContextPanelProps {
  session: AgentSession;
  agent: SimpleAgencyAgent;
}

export function AgentContextPanel({ session, agent }: AgentContextPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metrics']));
  const tables = getTablesByDomain(agent.domain);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const tokenBudget = 10000; // Mock token budget
  const tokenUsagePercent = (session.metrics.totalTokens / tokenBudget) * 100;

  return (
    <div className="h-full bg-muted/50 border-l">
      <div className="p-4 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          智能体上下文
        </h3>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-4">
          
          {/* Agent Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">智能体信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-xs text-muted-foreground">{agent.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">域:</span> {agent.domain.toUpperCase()}
                </div>
                <div>
                  <span className="text-muted-foreground">状态:</span> 
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="ml-1 text-xs">
                    {agent.status === 'active' ? '活跃' : '非活跃'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">部门:</span> {agent.department}
                </div>
                <div>
                  <span className="text-muted-foreground">角色:</span> {agent.role}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">能力 ({agent.capabilities.length})</div>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 4).map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.capabilities.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('metrics')}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  实时指标
                </CardTitle>
                {expandedSections.has('metrics') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </div>
            </CardHeader>
            {expandedSections.has('metrics') && (
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token 使用</span>
                    <span>{session.metrics.totalTokens} / {tokenBudget}</span>
                  </div>
                  <Progress value={tokenUsagePercent} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">执行时间</span>
                    <span>{Math.round(session.metrics.executionTime / 1000)}s</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">工具调用</span>
                    <span>{session.metrics.toolCallCount}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">消息数</span>
                    <span>{session.metrics.totalMessages}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">访问表数</span>
                    <span>{session.metrics.tablesAccessed.size}</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Available Tables */}
          <Card>
            <CardHeader className="pb-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('tables')}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  可用数据表 ({session.context.availableTables.length})
                </CardTitle>
                {expandedSections.has('tables') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </div>
            </CardHeader>
            {expandedSections.has('tables') && (
              <CardContent>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {session.context.availableTables.map((tableName, index) => {
                    const table = tables.find(t => t.name === tableName);
                    const isAccessed = session.metrics.tablesAccessed.has(tableName);
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-2 rounded text-xs ${
                          isAccessed ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Table className="h-3 w-3" />
                          <span className="font-mono">{tableName}</span>
                          {isAccessed && <Badge variant="outline" className="text-xs">已访问</Badge>}
                        </div>
                        {table && (
                          <span className="text-muted-foreground">{table.columns.length} 列</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Execution History */}
          <Card>
            <CardHeader className="pb-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('history')}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4" />
                  执行历史
                </CardTitle>
                {expandedSections.has('history') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </div>
            </CardHeader>
            {expandedSections.has('history') && (
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {session.messages
                    .filter(m => m.type === 'user' || m.type === 'agent')
                    .slice(-5)
                    .map((message, index) => (
                      <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <Badge variant={message.type === 'user' ? 'default' : 'secondary'} className="text-xs">
                            {message.type === 'user' ? '用户' : '智能体'}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="line-clamp-2">{message.content}</div>
                        {message.metadata && (
                          <div className="flex gap-2 mt-1 text-muted-foreground">
                            {message.metadata.tokenCount && (
                              <span>{message.metadata.tokenCount} tokens</span>
                            )}
                            {message.metadata.executionTime && (
                              <span>{message.metadata.executionTime}ms</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  }
                  {session.messages.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-xs">
                      还没有执行历史
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">会话信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">会话ID:</span>
                  <span className="font-mono text-xs">{session.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">开始时间:</span>
                  <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最后活动:</span>
                  <span>{new Date(session.lastActivity).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态:</span>
                  <Badge variant={session.status === 'running' ? 'default' : session.status === 'error' ? 'destructive' : 'secondary'}>
                    {getStatusText(session.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                查看完整上下文
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                配置智能体
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                导出会话日志
              </Button>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}

function getStatusText(status: string): string {
  switch (status) {
    case 'idle': return '空闲';
    case 'running': return '运行中';
    case 'error': return '错误';
    default: return status;
  }
}