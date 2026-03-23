/**
 * Agent Sandbox Component
 * Main chat interface for interacting with individual agents
 * Provides real-time agent interaction with context panel
 */

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Settings, 
  Activity, 
  Database, 
  Clock, 
  Coins, 
  MessageCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { simpleAgencyAgents } from '@/data/agency-agents-simple';
import { getTablesByDomain } from '@/data/agency-schemas';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
import { SandboxChat } from './SandboxChat';
import { AgentContextPanel } from './AgentContextPanel';
import { AgentSelector } from './AgentSelector';

export function AgentSandbox() {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  
  const {
    selectedAgent,
    currentSession,
    activeSessions,
    loading,
    selectAgent,
    createSession,
    setCurrentSession
  } = useAgentRuntimeStore();

  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);

  useEffect(() => {
    // Load agent if specified in URL
    if (agentId && !selectedAgent) {
      const agent = simpleAgencyAgents.find(a => a.id === agentId);
      if (agent) {
        selectAgent(agent);
        
        // Create new session if none exists
        const existingSession = activeSessions.find(s => s.agentId === agentId);
        if (!existingSession) {
          const tables = getTablesByDomain(agent.domain);
          const sessionId = createSession(agent, {
            domain: agent.domain,
            availableTables: tables.map(t => t.name).slice(0, 10), // Limit for demo
            parameters: {}
          });
          setCurrentSession(sessionId);
        } else {
          setCurrentSession(existingSession.id);
        }
      }
    }
  }, [agentId, selectedAgent, activeSessions, selectAgent, createSession, setCurrentSession]);

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center">
        <AgentSelector />
      </div>
    );
  }

  if (loading.sessions) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">初始化智能体运行环境...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">{selectedAgent.name}</h1>
              <Badge variant="outline" className="text-xs">
                {selectedAgent.domain.toUpperCase()}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>{selectedAgent.department}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{selectedAgent.role}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentSession && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>{currentSession.messages.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span>{currentSession.metrics.totalTokens}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{Math.round(currentSession.metrics.executionTime / 1000)}s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <Badge variant={currentSession.status === 'running' ? 'default' : 'secondary'}>
                    {getStatusText(currentSession.status)}
                  </Badge>
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
            >
              <Database className="h-4 w-4 mr-1" />
              上下文
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              配置
            </Button>
          </div>
        </div>
        
        {/* Agent Description */}
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedAgent.capabilities.slice(0, 5).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {selectedAgent.capabilities.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedAgent.capabilities.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${isContextPanelOpen ? 'border-r' : ''}`}>
          {currentSession ? (
            <SandboxChat session={currentSession} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">选择智能体开始对话</p>
                <p className="text-sm text-muted-foreground">
                  与 {selectedAgent.name} 智能体进行实时交互测试
                </p>
                <Button 
                  onClick={() => {
                    const tables = getTablesByDomain(selectedAgent.domain);
                    const sessionId = createSession(selectedAgent, {
                      domain: selectedAgent.domain,
                      availableTables: tables.map(t => t.name).slice(0, 10),
                      parameters: {}
                    });
                    setCurrentSession(sessionId);
                  }}
                  className="mt-4"
                >
                  开始会话
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Context Panel */}
        {isContextPanelOpen && currentSession && (
          <div className="w-80 flex-shrink-0">
            <AgentContextPanel session={currentSession} agent={selectedAgent} />
          </div>
        )}
      </div>
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