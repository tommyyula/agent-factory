import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  ChevronRight, 
  ChevronLeft,
  Check,
  X,
  Lightbulb,
  Bot,
  Zap,
  Shield,
  Users,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  OntologyBlueprint,
  OBRScenario,
  OBRObject,
  OBRBehavior,
  OBRRule
} from '@/shared/types/obr.types';
import { useOBRStore } from '@/stores/obr.store';

interface OBRAgentWizardProps {
  onComplete: (agentConfig: AgentConfiguration) => void;
  onCancel: () => void;
}

interface AgentConfiguration {
  name: string;
  description: string;
  domain: string;
  scenario: OBRScenario;
  selectedObjects: string[];
  selectedBehaviors: string[];
  selectedRules: string[];
  customSkills: string[];
  promptTemplate: string;
  agentType: 'assistant' | 'executor' | 'validator' | 'orchestrator';
}

type WizardStep = 'domain' | 'scenario' | 'components' | 'skills' | 'template' | 'review';

export function OBRAgentWizard({ onComplete, onCancel }: OBRAgentWizardProps) {
// Store hooks
  const { currentBlueprint } = useOBRStore();
  const { t } = useTranslation();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('domain');
  const [agentConfig, setAgentConfig] = useState<Partial<AgentConfiguration>>({
    name: '',
    description: '',
    domain: '',
    selectedObjects: [],
    selectedBehaviors: [],
    selectedRules: [],
    customSkills: [],
    promptTemplate: '',
    agentType: 'assistant'
  });

  // Available data
  const availableDomains = currentBlueprint ? [currentBlueprint.metadata.domain] : [];
  const availableScenarios = currentBlueprint?.scenarios || [];
  const availableObjects = currentBlueprint?.objects || [];
  const availableBehaviors = currentBlueprint?.behaviors || [];
  const availableRules = currentBlueprint?.rules || [];

  // Wizard navigation
  const steps: WizardStep[] = ['domain', 'scenario', 'components', 'skills', 'template', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = useCallback(() => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStep(steps[nextIndex]);
  }, [currentStepIndex, steps]);

  const prevStep = useCallback(() => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex]);
  }, [currentStepIndex, steps]);

  // Auto-generate agent name and description when scenario is selected
  useEffect(() => {
    if (agentConfig.scenario && !agentConfig.name) {
      const scenario = agentConfig.scenario;
      setAgentConfig(prev => ({
        ...prev,
        name: `${scenario.displayName || scenario.name} Agent`,
        description: `AI agent for handling ${scenario.displayName || scenario.name} scenarios. ${scenario.description || ''}`
      }));
    }
  }, [agentConfig.scenario, agentConfig.name]);

  // Auto-select related components when scenario is selected
  useEffect(() => {
    if (agentConfig.scenario && currentBlueprint) {
      const scenario = agentConfig.scenario;
      
      // Auto-select objects that are referenced in the scenario
      const referencedObjects = new Set<string>();
      scenario.steps.forEach(step => {
        if (step.task?.behaviorId) {
          const behavior = availableBehaviors.find(b => b.id === step.task!.behaviorId);
          if (behavior) {
            // Add objects from state changes
            behavior.stateChanges.forEach(sc => referencedObjects.add(sc.objectId));
            
            // Add objects from preconditions
            behavior.preconditions.objectStates.forEach(os => referencedObjects.add(os.objectId));
          }
        }
      });

      // Auto-select behaviors used in the scenario
      const referencedBehaviors = new Set<string>();
      scenario.steps.forEach(step => {
        if (step.task?.behaviorId) {
          referencedBehaviors.add(step.task.behaviorId);
        }
      });

      // Auto-select rules from scenario constraints
      const referencedRules = new Set(scenario.constraints.businessRules || []);

      setAgentConfig(prev => ({
        ...prev,
        selectedObjects: Array.from(referencedObjects),
        selectedBehaviors: Array.from(referencedBehaviors),
        selectedRules: Array.from(referencedRules)
      }));
    }
  }, [agentConfig.scenario, currentBlueprint, availableBehaviors]);

  // Generate prompt template
  const generatePromptTemplate = useCallback(() => {
    if (!agentConfig.scenario || !currentBlueprint) return '';

    const scenario = agentConfig.scenario;
    const selectedObjNames = agentConfig.selectedObjects?.map(id => 
      availableObjects.find(o => o.id === id)?.displayName || id
    ) || [];
    const selectedBehaviorNames = agentConfig.selectedBehaviors?.map(id =>
      availableBehaviors.find(b => b.id === id)?.displayName || id
    ) || [];

    return `# ${agentConfig.name}

You are an AI agent specialized in handling **${scenario.displayName || scenario.name}** scenarios within the ${currentBlueprint.metadata.domain} domain.

## Your Role
You are a ${agentConfig.agentType} agent responsible for:
${scenario.description || 'Managing business processes and ensuring compliance with organizational rules.'}

## Domain Knowledge
You have deep understanding of the ${currentBlueprint.metadata.domain} domain, including:

### Business Objects
${selectedObjNames.map(name => `- **${name}**: Core business entity`).join('\n')}

### Available Operations
${selectedBehaviorNames.map(name => `- **${name}**: Business operation you can execute`).join('\n')}

### Business Rules
You must always comply with the following business rules:
${agentConfig.selectedRules?.map(id => {
  const rule = availableRules.find(r => r.id === id);
  return `- **${rule?.displayName || id}**: ${rule?.description || 'Business constraint'}`;
}).join('\n') || '- Standard business rules apply'}

## Scenario Workflow
The typical ${scenario.displayName || scenario.name} process involves:

${scenario.steps.map((step, index) => {
  let stepDescription = `${index + 1}. **${step.name}**`;
  if (step.task) {
    const behavior = availableBehaviors.find(b => b.id === step.task!.behaviorId);
    stepDescription += ` - Execute ${behavior?.displayName || step.task.behaviorId}`;
  } else if (step.decision) {
    stepDescription += ` - Make decision based on: ${step.decision.condition}`;
  }
  return stepDescription;
}).join('\n')}

## Your Capabilities
${agentConfig.customSkills?.map(skill => `- ${skill}`).join('\n') || ''}

## Instructions
1. Always follow the business rules and constraints
2. Execute steps in the correct sequence
3. Validate preconditions before taking actions
4. Handle errors gracefully and provide clear feedback
5. Maintain audit trail of all actions taken

## Communication Style
- Be professional yet approachable
- Use domain-specific terminology correctly
- Provide clear explanations for your decisions
- Ask for clarification when requirements are ambiguous

When handling ${scenario.displayName || scenario.name} scenarios:
- Gather all necessary information upfront
- Validate business rules at each step
- Provide progress updates during long-running processes
- Escalate issues that require human intervention

Remember: You are here to streamline business processes while ensuring compliance and quality.`;
  }, [agentConfig, currentBlueprint, availableObjects, availableBehaviors, availableRules]);

  // Auto-generate prompt template when scenario changes
  useEffect(() => {
    if (agentConfig.scenario && currentStep === 'template') {
      const template = generatePromptTemplate();
      setAgentConfig(prev => ({ ...prev, promptTemplate: template }));
    }
  }, [agentConfig.scenario, currentStep, generatePromptTemplate]);

  // Handle form updates
  const updateConfig = useCallback((updates: Partial<AgentConfiguration>) => {
    setAgentConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle completion
  const handleComplete = useCallback(() => {
    if (agentConfig.scenario && agentConfig.name) {
      onComplete(agentConfig as AgentConfiguration);
    }
  }, [agentConfig, onComplete]);

  // Check if current step is valid
  const isStepValid = (step: WizardStep): boolean => {
    switch (step) {
      case 'domain':
        return !!agentConfig.domain;
      case 'scenario':
        return !!agentConfig.scenario;
      case 'components':
        return (agentConfig.selectedObjects?.length || 0) > 0 || 
               (agentConfig.selectedBehaviors?.length || 0) > 0;
      case 'skills':
        return true; // Optional step
      case 'template':
        return !!agentConfig.promptTemplate;
      case 'review':
        return !!agentConfig.name && !!agentConfig.description;
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);

  if (!currentBlueprint) {
    return (
      <Card>
        <CardContent className="text-center py-8">
<p className="text-muted-foreground">{t('ide.obrWizard.loadBlueprint', '请先加载一个本体蓝图以使用智能代理向导')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="obr-agent-wizard space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              OBR 智能代理向导
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              步骤 {currentStepIndex + 1} / {steps.length}
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 'domain' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">选择领域</h3>
                <p className="text-muted-foreground">
                  选择代理要工作的业务领域
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>业务领域</Label>
                  <Select 
                    value={agentConfig.domain} 
                    onValueChange={(value) => updateConfig({ domain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择领域" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDomains.map(domain => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentBlueprint && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">领域信息</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">名称:</span> {currentBlueprint.metadata.name}</div>
                      <div><span className="text-muted-foreground">版本:</span> {currentBlueprint.metadata.version}</div>
                      <div><span className="text-muted-foreground">描述:</span> {currentBlueprint.metadata.description}</div>
                      
                      <div className="mt-3 flex gap-2">
                        <Badge variant="outline">{currentBlueprint.objects.length} 对象</Badge>
                        <Badge variant="outline">{currentBlueprint.behaviors.length} 行为</Badge>
                        <Badge variant="outline">{currentBlueprint.rules.length} 规则</Badge>
                        <Badge variant="outline">{currentBlueprint.scenarios.length} 场景</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 'scenario' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">选择业务场景</h3>
                <p className="text-muted-foreground">
                  选择代理要专门处理的业务场景
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {availableScenarios.map(scenario => (
                    <Card 
                      key={scenario.id}
                      className={`cursor-pointer transition-all ${
                        agentConfig.scenario?.id === scenario.id 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => updateConfig({ scenario })}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{scenario.displayName || scenario.name}</h4>
                            <Badge variant="outline">{scenario.category}</Badge>
                          </div>
                          
                          {scenario.description && (
                            <p className="text-sm text-muted-foreground">
                              {scenario.description}
                            </p>
                          )}
                          
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {scenario.steps.length} 步骤
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {scenario.actors.length} 参与者
                            </Badge>
                            {scenario.metrics && (
                              <Badge variant="secondary" className="text-xs">
                                成功率: {Math.round((scenario.metrics.successRate || 0) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'components' && agentConfig.scenario && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">配置组件</h3>
                <p className="text-muted-foreground">
                  选择代理需要了解和使用的业务组件
                </p>
              </div>

              {/* Objects */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  业务对象
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableObjects.map(obj => (
                    <div key={obj.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`obj-${obj.id}`}
                        checked={agentConfig.selectedObjects?.includes(obj.id) || false}
                        onCheckedChange={(checked) => {
                          const current = agentConfig.selectedObjects || [];
                          const updated = checked 
                            ? [...current, obj.id]
                            : current.filter(id => id !== obj.id);
                          updateConfig({ selectedObjects: updated });
                        }}
                      />
                      <Label htmlFor={`obj-${obj.id}`} className="text-sm">
                        {obj.displayName || obj.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behaviors */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  业务行为
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableBehaviors.map(behavior => (
                    <div key={behavior.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`behavior-${behavior.id}`}
                        checked={agentConfig.selectedBehaviors?.includes(behavior.id) || false}
                        onCheckedChange={(checked) => {
                          const current = agentConfig.selectedBehaviors || [];
                          const updated = checked 
                            ? [...current, behavior.id]
                            : current.filter(id => id !== behavior.id);
                          updateConfig({ selectedBehaviors: updated });
                        }}
                      />
                      <Label htmlFor={`behavior-${behavior.id}`} className="text-sm">
                        {behavior.displayName || behavior.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  业务规则
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableRules.map(rule => (
                    <div key={rule.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rule-${rule.id}`}
                        checked={agentConfig.selectedRules?.includes(rule.id) || false}
                        onCheckedChange={(checked) => {
                          const current = agentConfig.selectedRules || [];
                          const updated = checked 
                            ? [...current, rule.id]
                            : current.filter(id => id !== rule.id);
                          updateConfig({ selectedRules: updated });
                        }}
                      />
                      <Label htmlFor={`rule-${rule.id}`} className="text-sm">
                        {rule.displayName || rule.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'skills' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">自定义技能</h3>
                <p className="text-muted-foreground">
                  为代理添加额外的技能和能力
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>代理类型</Label>
                  <Select 
                    value={agentConfig.agentType} 
                    onValueChange={(value) => updateConfig({ agentType: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assistant">助手型 - 提供信息和建议</SelectItem>
                      <SelectItem value="executor">执行型 - 自动执行业务操作</SelectItem>
                      <SelectItem value="validator">验证型 - 检查规则合规性</SelectItem>
                      <SelectItem value="orchestrator">协调型 - 管理复杂工作流</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>自定义技能</Label>
                  <Textarea
                    placeholder="每行输入一个技能，例如：&#10;- 数据分析能力&#10;- 多语言支持&#10;- API 集成能力"
                    value={agentConfig.customSkills?.join('\n') || ''}
                    onChange={(e) => {
                      const skills = e.target.value.split('\n').filter(s => s.trim());
                      updateConfig({ customSkills: skills });
                    }}
                    rows={6}
                  />
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    技能将自动根据选择的行为生成。自定义技能用于添加额外的能力，如集成外部系统、特殊的数据处理等。
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === 'template' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">生成提示模板</h3>
                <p className="text-muted-foreground">
                  基于选择的组件自动生成代理提示模板
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => updateConfig({ promptTemplate: generatePromptTemplate() })}
                    variant="outline"
                    size="sm"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    重新生成
                  </Button>
                  <Button 
                    onClick={() => navigator.clipboard.writeText(agentConfig.promptTemplate || '')}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>提示模板</Label>
                  <Textarea
                    value={agentConfig.promptTemplate || ''}
                    onChange={(e) => updateConfig({ promptTemplate: e.target.value })}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-medium">审核配置</h3>
                <p className="text-muted-foreground">
                  最终确认代理配置并完成创建
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>代理名称</Label>
                    <Input
                      value={agentConfig.name || ''}
                      onChange={(e) => updateConfig({ name: e.target.value })}
                      placeholder="输入代理名称"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>代理类型</Label>
                    <Input
                      value={agentConfig.agentType || ''}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea
                    value={agentConfig.description || ''}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    placeholder="输入代理描述"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">配置摘要</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">业务领域:</span> {agentConfig.domain}
                    </div>
                    <div>
                      <span className="text-muted-foreground">目标场景:</span> {agentConfig.scenario?.displayName || agentConfig.scenario?.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">对象组件:</span> {agentConfig.selectedObjects?.length || 0} 个
                    </div>
                    <div>
                      <span className="text-muted-foreground">行为组件:</span> {agentConfig.selectedBehaviors?.length || 0} 个
                    </div>
                    <div>
                      <span className="text-muted-foreground">规则组件:</span> {agentConfig.selectedRules?.length || 0} 个
                    </div>
                    <div>
                      <span className="text-muted-foreground">自定义技能:</span> {agentConfig.customSkills?.length || 0} 个
                    </div>
                  </div>
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    配置完成！点击"完成创建"将生成具有 OBR 知识的智能代理。
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={currentStepIndex === 0 ? onCancel : prevStep}
          variant="outline"
        >
          {currentStepIndex === 0 ? (
            <>
              <X className="h-4 w-4 mr-2" />
              取消
            </>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              上一步
            </>
          )}
        </Button>

        <Button
          onClick={currentStepIndex === steps.length - 1 ? handleComplete : nextStep}
          disabled={!canProceed}
        >
          {currentStepIndex === steps.length - 1 ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              完成创建
            </>
          ) : (
            <>
              下一步
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default OBRAgentWizard;