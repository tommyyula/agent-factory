/**
 * Team Composer Component
 * Interface for building and configuring agent teams
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Save,
  GripVertical,
  Bot,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { simpleAgencyAgents, AGENCY_DOMAINS } from '@/data/agency-agents-simple';
import { workflowTemplates } from '@/shared/services/workflow-simulator.service';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
// Note: Using simplified drag and drop without dnd-kit dependency

interface SelectedAgent {
  agentId: string;
  role: 'initiator' | 'processor' | 'validator' | 'finalizer';
  order: number;
  dependencies: string[];
}

export function TeamComposer() {
  const {
    currentTeam,
    availableAgents,
    createTeam,
    updateTeamWorkflow,
    setAvailableAgents,
    startTeamExecution
  } = useAgentRuntimeStore();

  const [teamName, setTeamName] = useState('新团队');
  const [selectedAgents, setSelectedAgents] = useState<SelectedAgent[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Simplified without drag and drop for now

  useEffect(() => {
    // Initialize available agents
    setAvailableAgents(simpleAgencyAgents);
  }, [setAvailableAgents]);

  useEffect(() => {
    // Validate team configuration
    const errors: string[] = [];
    
    if (selectedAgents.length < 2) {
      errors.push('团队至少需要2个智能体');
    }
    
    if (selectedAgents.length > 10) {
      errors.push('团队最多支持10个智能体');
    }

    const hasInitiator = selectedAgents.some(a => a.role === 'initiator');
    if (!hasInitiator && selectedAgents.length > 0) {
      errors.push('团队需要至少一个启动器角色');
    }

    // Check circular dependencies
    const hasCycles = checkCircularDependencies(selectedAgents);
    if (hasCycles) {
      errors.push('检测到循环依赖，请调整智能体依赖关系');
    }

    setValidationErrors(errors);
  }, [selectedAgents]);

  const filteredAgents = selectedDomain 
    ? simpleAgencyAgents.filter(agent => agent.domain === selectedDomain)
    : simpleAgencyAgents;

  const handleAddAgent = (agentId: string) => {
    if (selectedAgents.length >= 10) return;
    if (selectedAgents.some(a => a.agentId === agentId)) return;

    const newAgent: SelectedAgent = {
      agentId,
      role: selectedAgents.length === 0 ? 'initiator' : 'processor',
      order: selectedAgents.length,
      dependencies: []
    };

    setSelectedAgents([...selectedAgents, newAgent]);
  };

  const handleRemoveAgent = (agentId: string) => {
    const filtered = selectedAgents.filter(a => a.agentId !== agentId);
    // Update dependencies for remaining agents
    const updated = filtered.map(agent => ({
      ...agent,
      dependencies: agent.dependencies.filter(dep => dep !== agentId),
      order: filtered.indexOf(agent)
    }));
    setSelectedAgents(updated);
  };

  const handleRoleChange = (agentId: string, role: SelectedAgent['role']) => {
    setSelectedAgents(prev => 
      prev.map(agent => 
        agent.agentId === agentId ? { ...agent, role } : agent
      )
    );
  };

  const handleDependencyChange = (agentId: string, dependencies: string[]) => {
    setSelectedAgents(prev => 
      prev.map(agent => 
        agent.agentId === agentId ? { ...agent, dependencies } : agent
      )
    );
  };

  const handleMoveUp = (agentId: string) => {
    setSelectedAgents(prev => {
      const index = prev.findIndex(a => a.agentId === agentId);
      if (index <= 0) return prev;
      
      const newAgents = [...prev];
      [newAgents[index], newAgents[index - 1]] = [newAgents[index - 1], newAgents[index]];
      return newAgents.map((agent, idx) => ({ ...agent, order: idx }));
    });
  };

  const handleMoveDown = (agentId: string) => {
    setSelectedAgents(prev => {
      const index = prev.findIndex(a => a.agentId === agentId);
      if (index >= prev.length - 1) return prev;
      
      const newAgents = [...prev];
      [newAgents[index], newAgents[index + 1]] = [newAgents[index + 1], newAgents[index]];
      return newAgents.map((agent, idx) => ({ ...agent, order: idx }));
    });
  };

  const handleCreateTeam = () => {
    if (validationErrors.length > 0) return;

    const teamId = createTeam(teamName, selectedAgents.map(a => a.agentId));
    
    // If workflow is selected, attach it to the team
    if (selectedWorkflow) {
      const workflow = workflowTemplates.find(w => w.id === selectedWorkflow);
      if (workflow) {
        // Convert to full workflow definition
        const fullWorkflow = {
          ...workflow,
          agents: selectedAgents.map(agent => ({
            agentId: agent.agentId,
            role: agent.role,
            order: agent.order,
            dependencies: agent.dependencies,
            configuration: {
              domain: getAgentById(agent.agentId)?.domain || 'wms',
              accessibleTables: [],
              parameters: {},
              timeoutMs: 30000,
              retryCount: 2
            }
          })),
          orchestrationRules: [],
          qualityGates: [],
          expectedOutcomes: []
        };

        updateTeamWorkflow(teamId, fullWorkflow as any);
      }
    }
  };

  const handleStartExecution = async () => {
    if (!currentTeam || validationErrors.length > 0) return;
    
    await startTeamExecution(currentTeam.id);
  };

  const getAgentById = (agentId: string) => {
    return simpleAgencyAgents.find(a => a.id === agentId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            团队编排器
          </h1>
          <p className="text-muted-foreground">
            组建智能体团队，配置协作流程，测试多智能体工作流程
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCreateTeam}
            disabled={validationErrors.length > 0}
          >
            <Save className="h-4 w-4 mr-2" />
            保存团队
          </Button>
          <Button 
            onClick={handleStartExecution}
            disabled={!currentTeam || validationErrors.length > 0}
          >
            <Play className="h-4 w-4 mr-2" />
            开始执行
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Panel - Agent Pool */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">智能体库</CardTitle>
              <div className="flex gap-2">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择域" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">所有域</SelectItem>
                    {Object.entries(AGENCY_DOMAINS).map(([key, domain]) => (
                      <SelectItem key={key} value={key}>
                        {domain.name} ({domain.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredAgents.map((agent) => (
                    <AgentPoolItem
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgents.some(a => a.agentId === agent.id)}
                      onAdd={() => handleAddAgent(agent.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Team Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>团队配置</CardTitle>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="team-name">团队名称</Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="输入团队名称"
                  />
                </div>
                
                <div>
                  <Label htmlFor="workflow">工作流模板（可选）</Label>
                  <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择工作流模板" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id!}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">团队成员 ({selectedAgents.length}/10)</span>
                  <Badge variant={selectedAgents.length === 0 ? 'secondary' : 'default'}>
                    {selectedAgents.length > 0 ? '已配置' : '未配置'}
                  </Badge>
                </div>

                {/* Validation Messages */}
                {validationErrors.length > 0 && (
                  <div className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Team Members */}
                <ScrollArea className="h-[350px]">
                  {selectedAgents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p>从左侧选择智能体组建团队</p>
                    </div>
                  ) : (
                        <div className="space-y-2">
                          {selectedAgents.map((selectedAgent, index) => (
                            <TeamMemberItem
                              key={selectedAgent.agentId}
                              selectedAgent={selectedAgent}
                              agent={getAgentById(selectedAgent.agentId)!}
                              index={index}
                              allSelectedAgents={selectedAgents}
                              onRemove={() => handleRemoveAgent(selectedAgent.agentId)}
                              onRoleChange={(role) => handleRoleChange(selectedAgent.agentId, role)}
                              onDependencyChange={(deps) => handleDependencyChange(selectedAgent.agentId, deps)}
                              onMoveUp={() => handleMoveUp(selectedAgent.agentId)}
                              onMoveDown={() => handleMoveDown(selectedAgent.agentId)}
                              canMoveUp={index > 0}
                              canMoveDown={index < selectedAgents.length - 1}
                            />
                          ))}
                        </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Workflow Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>工作流预览</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {selectedAgents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ArrowRight className="h-8 w-8 mx-auto mb-2" />
                    <p>配置团队成员后显示工作流</p>
                  </div>
                ) : (
                  <WorkflowPreview selectedAgents={selectedAgents} />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Supporting Components

interface AgentPoolItemProps {
  agent: typeof simpleAgencyAgents[0];
  isSelected: boolean;
  onAdd: () => void;
}

function AgentPoolItem({ agent, isSelected, onAdd }: AgentPoolItemProps) {
  const domainInfo = AGENCY_DOMAINS[agent.domain as keyof typeof AGENCY_DOMAINS];

  return (
    <div className={`p-3 border rounded-lg ${isSelected ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm">{agent.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{agent.description}</div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: domainInfo?.color, color: domainInfo?.color }}
            >
              {agent.domain.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">{agent.department}</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant={isSelected ? "secondary" : "default"}
          onClick={onAdd}
          disabled={isSelected}
        >
          {isSelected ? <CheckCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}

interface TeamMemberItemProps {
  selectedAgent: SelectedAgent;
  agent: typeof simpleAgencyAgents[0];
  index: number;
  allSelectedAgents: SelectedAgent[];
  onRemove: () => void;
  onRoleChange: (role: SelectedAgent['role']) => void;
  onDependencyChange: (dependencies: string[]) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function TeamMemberItem({ 
  selectedAgent, 
  agent, 
  index, 
  allSelectedAgents, 
  onRemove, 
  onRoleChange, 
  onDependencyChange,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: TeamMemberItemProps) {
  const availableDependencies = allSelectedAgents.filter(a => 
    a.agentId !== selectedAgent.agentId && a.order < selectedAgent.order
  );

  return (
    <div className="p-3 border rounded-lg bg-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onMoveUp} 
              disabled={!canMoveUp}
              className="h-4 w-4 p-0"
            >
              ↑
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onMoveDown} 
              disabled={!canMoveDown}
              className="h-4 w-4 p-0"
            >
              ↓
            </Button>
          </div>
          <Badge variant="outline">{index + 1}</Badge>
          <span className="font-medium text-sm">{agent.name}</span>
        </div>
        
        <Button size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-2">
        <div>
          <Label className="text-xs">角色</Label>
          <Select value={selectedAgent.role} onValueChange={onRoleChange}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initiator">启动器</SelectItem>
              <SelectItem value="processor">处理器</SelectItem>
              <SelectItem value="validator">验证器</SelectItem>
              <SelectItem value="finalizer">完成器</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {availableDependencies.length > 0 && (
          <div>
            <Label className="text-xs">依赖智能体</Label>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {availableDependencies.map(dep => {
                const depAgent = simpleAgencyAgents.find(a => a.id === dep.agentId);
                return (
                  <div key={dep.agentId} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dep-${dep.agentId}`}
                      checked={selectedAgent.dependencies.includes(dep.agentId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onDependencyChange([...selectedAgent.dependencies, dep.agentId]);
                        } else {
                          onDependencyChange(selectedAgent.dependencies.filter(d => d !== dep.agentId));
                        }
                      }}
                    />
                    <label htmlFor={`dep-${dep.agentId}`} className="text-xs">
                      {depAgent?.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface WorkflowPreviewProps {
  selectedAgents: SelectedAgent[];
}

function WorkflowPreview({ selectedAgents }: WorkflowPreviewProps) {
  const sortedAgents = [...selectedAgents].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">执行顺序</div>
      
      {sortedAgents.map((selectedAgent, index) => {
        const agent = simpleAgencyAgents.find(a => a.id === selectedAgent.agentId);
        const dependencies = selectedAgent.dependencies.map(dep => 
          simpleAgencyAgents.find(a => a.id === dep)?.name
        ).filter(Boolean);

        return (
          <div key={selectedAgent.agentId}>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge variant="outline">{index + 1}</Badge>
              <Bot className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium text-sm">{agent?.name}</div>
                <div className="text-xs text-muted-foreground">{selectedAgent.role}</div>
                {dependencies.length > 0 && (
                  <div className="text-xs text-blue-600">
                    依赖: {dependencies.join(', ')}
                  </div>
                )}
              </div>
            </div>
            
            {index < sortedAgents.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Utility Functions

function checkCircularDependencies(agents: SelectedAgent[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (agentId: string): boolean => {
    if (recursionStack.has(agentId)) return true;
    if (visited.has(agentId)) return false;

    visited.add(agentId);
    recursionStack.add(agentId);

    const agent = agents.find(a => a.agentId === agentId);
    if (agent) {
      for (const dep of agent.dependencies) {
        if (hasCycle(dep)) return true;
      }
    }

    recursionStack.delete(agentId);
    return false;
  };

  return agents.some(agent => hasCycle(agent.agentId));
}