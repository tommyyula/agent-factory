import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Save, X, Plus, Trash2, Move, Play, Users, Workflow, ArrowDown, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  OBRScenario, 
  ValidationError, 
  OBRScenarioStep,
  OBRActor,
  OBRTask,
  OBRDecision,
  OBRParallel,
  OBRTrigger,
  OBRScenarioConstraints
} from '@/shared/types/obr.types';
import { obrValidationService } from '@/shared/services/obr-validation.service';
import { useOBRStore } from '@/stores/obr.store';

interface ScenarioEditorProps {
  scenarioId?: string;
  initialData?: Partial<OBRScenario>;
  onSave: (scenario: OBRScenario) => Promise<void>;
  onCancel: () => void;
  readonly?: boolean;
}

export function ScenarioEditor({ 
  scenarioId, 
  initialData, 
  onSave, 
  onCancel, 
  readonly = false 
}: ScenarioEditorProps) {
  // State management
  const [scenario, setScenario] = useState<Partial<OBRScenario>>(initialData || {
    id: '',
    name: '',
    displayName: '',
    description: '',
    category: 'process',
    actors: [],
    steps: [],
    triggers: [],
    constraints: {
      timeLimit: 3600000, // 1 hour default
      businessRules: []
    }
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'actors' | 'steps' | 'triggers' | 'constraints'>('basic');
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Store hooks
  const { currentBlueprint } = useOBRStore();

  // Available components for reference
  const availableBehaviors = currentBlueprint?.behaviors || [];
  const availableRules = currentBlueprint?.rules || [];

  // Load existing scenario if scenarioId provided
  useEffect(() => {
    if (scenarioId && currentBlueprint) {
      const existingScenario = currentBlueprint.scenarios.find(s => s.id === scenarioId);
      if (existingScenario) {
        setScenario(existingScenario);
      }
    }
  }, [scenarioId, currentBlueprint]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [scenario]);

  // Handle basic field changes
  const handleBasicFieldChange = useCallback((field: keyof OBRScenario, value: any) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  }, []);

  // Generate unique ID based on name
  const generateId = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }, []);

  // Handle name change with ID auto-generation
  const handleNameChange = useCallback((name: string) => {
    setScenario(prev => ({
      ...prev,
      name,
      id: prev.id || generateId(name)
    }));
  }, [generateId]);

  // Handle actors
  const addActor = useCallback(() => {
    setScenario(prev => ({
      ...prev,
      actors: [
        ...prev.actors!,
        {
          id: `actor_${prev.actors!.length + 1}`,
          name: '',
          role: '',
          permissions: []
        }
      ]
    }));
  }, []);

  const updateActor = useCallback((index: number, actor: OBRActor) => {
    setScenario(prev => ({
      ...prev,
      actors: prev.actors!.map((a, i) => i === index ? actor : a)
    }));
  }, []);

  const removeActor = useCallback((index: number) => {
    setScenario(prev => ({
      ...prev,
      actors: prev.actors!.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle steps
  const addStep = useCallback((stepType: OBRScenarioStep['type'] = 'task') => {
    const stepId = `step_${scenario.steps!.length + 1}`;
    const newStep: OBRScenarioStep = {
      id: stepId,
      name: `步骤 ${scenario.steps!.length + 1}`,
      type: stepType,
      next: [],
      visual: { 
        position: { x: 100 + scenario.steps!.length * 150, y: 100 }, 
        type: 'bpmn' 
      }
    };

    // Add specific properties based on type
    if (stepType === 'task') {
      newStep.task = {
        behaviorId: '',
        inputs: {}
      };
    } else if (stepType === 'decision') {
      newStep.decision = {
        condition: '',
        branches: []
      };
    } else if (stepType === 'parallel') {
      newStep.parallel = {
        branches: [],
        syncType: 'all'
      };
    }

    setScenario(prev => ({
      ...prev,
      steps: [...prev.steps!, newStep]
    }));
    setSelectedStepId(stepId);
  }, [scenario.steps]);

  const updateStep = useCallback((index: number, step: OBRScenarioStep) => {
    setScenario(prev => ({
      ...prev,
      steps: prev.steps!.map((s, i) => i === index ? step : s)
    }));
  }, []);

  const removeStep = useCallback((index: number) => {
    const stepToRemove = scenario.steps![index];
    setScenario(prev => ({
      ...prev,
      steps: prev.steps!.filter((_, i) => i !== index).map(step => ({
        ...step,
        next: Array.isArray(step.next) 
          ? step.next.filter(nextId => nextId !== stepToRemove.id)
          : step.next === stepToRemove.id ? [] : step.next
      }))
    }));
    if (selectedStepId === stepToRemove.id) {
      setSelectedStepId(null);
    }
  }, [scenario.steps, selectedStepId]);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    setScenario(prev => {
      const steps = [...prev.steps!];
      const [movedStep] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, movedStep);
      return { ...prev, steps };
    });
  }, []);

  // Handle triggers
  const addTrigger = useCallback(() => {
    setScenario(prev => ({
      ...prev,
      triggers: [
        ...prev.triggers!,
        { type: 'manual' }
      ]
    }));
  }, []);

  const updateTrigger = useCallback((index: number, trigger: OBRTrigger) => {
    setScenario(prev => ({
      ...prev,
      triggers: prev.triggers!.map((t, i) => i === index ? trigger : t)
    }));
  }, []);

  const removeTrigger = useCallback((index: number) => {
    setScenario(prev => ({
      ...prev,
      triggers: prev.triggers!.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle constraints
  const updateConstraints = useCallback((constraints: OBRScenarioConstraints) => {
    setScenario(prev => ({ ...prev, constraints }));
  }, []);

  // Save scenario
  const handleSave = useCallback(async () => {
    try {
      setIsValidating(true);
      
      if (!scenario.id || !scenario.name) {
        throw new Error('ID and name are required');
      }

      // Ensure required fields
      const completeScenario: OBRScenario = {
        id: scenario.id,
        name: scenario.name,
        displayName: scenario.displayName || scenario.name,
        description: scenario.description || '',
        category: scenario.category || 'process',
        actors: scenario.actors || [],
        steps: scenario.steps || [],
        triggers: scenario.triggers || [],
        constraints: scenario.constraints || {
          timeLimit: 3600000,
          businessRules: []
        },
        ...(scenario.metrics && { metrics: scenario.metrics })
      };

      await onSave(completeScenario);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
    setIsValidating(false);
  }, [scenario, onSave]);

  // Get selected step
  const selectedStep = scenario.steps?.find(s => s.id === selectedStepId);

  // Check if form is valid
  const isValid = scenario.id && scenario.name && validationErrors.filter(e => e.severity === 'error').length === 0;

  return (
    <div className="scenario-editor space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                场景编辑器
                {hasUnsavedChanges && <Badge variant="secondary">未保存</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {scenarioId ? '编辑现有业务场景' : '创建新业务场景'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="actors">参与者</TabsTrigger>
              <TabsTrigger value="steps">流程步骤</TabsTrigger>
              <TabsTrigger value="triggers">触发条件</TabsTrigger>
              <TabsTrigger value="constraints">约束配置</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">名称 *</Label>
                  <Input
                    id="scenario-name"
                    placeholder="例如: normalScheduling"
                    value={scenario.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario-id">标识符</Label>
                  <Input
                    id="scenario-id"
                    value={scenario.id || ''}
                    onChange={(e) => handleBasicFieldChange('id', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario-display-name">显示名称</Label>
                  <Input
                    id="scenario-display-name"
                    placeholder="例如: 正常排班流程"
                    value={scenario.displayName || ''}
                    onChange={(e) => handleBasicFieldChange('displayName', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario-category">场景类型 *</Label>
                  <Select
                    value={scenario.category || 'process'}
                    onValueChange={(value) => handleBasicFieldChange('category', value)}
                    disabled={readonly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择场景类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">流程 (Process)</SelectItem>
                      <SelectItem value="workflow">工作流 (Workflow)</SelectItem>
                      <SelectItem value="event_handling">事件处理 (Event Handling)</SelectItem>
                      <SelectItem value="decision_flow">决策流 (Decision Flow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario-description">描述</Label>
                <Textarea
                  id="scenario-description"
                  placeholder="详细描述该场景的目的、适用情况和执行逻辑..."
                  value={scenario.description || ''}
                  onChange={(e) => handleBasicFieldChange('description', e.target.value)}
                  rows={3}
                  disabled={readonly}
                />
              </div>
            </TabsContent>

            <TabsContent value="actors" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">场景参与者</Label>
                  {!readonly && (
                    <Button onClick={addActor} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加参与者
                    </Button>
                  )}
                </div>

                {scenario.actors?.map((actor, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          参与者 {index + 1}
                        </h4>
                        {!readonly && (
                          <Button
                            onClick={() => removeActor(index)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>标识符</Label>
                          <Input
                            value={actor.id}
                            onChange={(e) => updateActor(index, { ...actor, id: e.target.value })}
                            placeholder="actor_id"
                            disabled={readonly}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>名称</Label>
                          <Input
                            value={actor.name}
                            onChange={(e) => updateActor(index, { ...actor, name: e.target.value })}
                            placeholder="参与者名称"
                            disabled={readonly}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>角色</Label>
                          <Input
                            value={actor.role}
                            onChange={(e) => updateActor(index, { ...actor, role: e.target.value })}
                            placeholder="角色职责"
                            disabled={readonly}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>权限列表</Label>
                        <Textarea
                          value={actor.permissions.join(', ')}
                          onChange={(e) => {
                            const permissions = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                            updateActor(index, { ...actor, permissions });
                          }}
                          placeholder="权限1, 权限2, 权限3..."
                          rows={2}
                          disabled={readonly}
                        />
                      </div>
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无参与者</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Steps List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">流程步骤</Label>
                    {!readonly && (
                      <div className="flex gap-2">
                        <Button onClick={() => addStep('start')} size="sm" variant="outline">
                          开始
                        </Button>
                        <Button onClick={() => addStep('task')} size="sm" variant="outline">
                          任务
                        </Button>
                        <Button onClick={() => addStep('decision')} size="sm" variant="outline">
                          决策
                        </Button>
                        <Button onClick={() => addStep('end')} size="sm" variant="outline">
                          结束
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {scenario.steps?.map((step, index) => (
                      <Card 
                        key={step.id} 
                        className={`p-3 cursor-pointer transition-all ${
                          selectedStepId === step.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              {step.type === 'start' && '开始'}
                              {step.type === 'end' && '结束'}
                              {step.type === 'task' && '任务'}
                              {step.type === 'decision' && '决策'}
                              {step.type === 'parallel' && '并行'}
                              {step.type === 'merge' && '合并'}
                            </Badge>
                            <span className="font-medium">{step.name}</span>
                            {step.type === 'task' && step.task?.behaviorId && (
                              <Badge variant="secondary" className="text-xs">
                                {availableBehaviors.find(b => b.id === step.task!.behaviorId)?.displayName || step.task.behaviorId}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!readonly && (
                              <>
                                {index > 0 && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveStep(index, index - 1);
                                    }}
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <ArrowDown className="h-3 w-3 rotate-180" />
                                  </Button>
                                )}
                                {index < scenario.steps!.length - 1 && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveStep(index, index + 1);
                                    }}
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeStep(index);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {step.next && step.next.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            下一步: {Array.isArray(step.next) ? step.next.join(', ') : step.next}
                          </div>
                        )}
                      </Card>
                    )) || (
                      <p className="text-sm text-muted-foreground">暂无流程步骤</p>
                    )}
                  </div>
                </div>

                {/* Step Editor */}
                <div className="space-y-4">
                  {selectedStep ? (
                    <StepEditor
                      step={selectedStep}
                      availableBehaviors={availableBehaviors}
                      availableSteps={scenario.steps || []}
                      onUpdate={(updatedStep) => {
                        const index = scenario.steps!.findIndex(s => s.id === selectedStep.id);
                        if (index !== -1) {
                          updateStep(index, updatedStep);
                        }
                      }}
                      readonly={readonly}
                    />
                  ) : (
                    <Card className="p-6">
                      <div className="text-center text-muted-foreground">
                        <Workflow className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>选择左侧步骤进行编辑</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="triggers" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">触发条件</Label>
                  {!readonly && (
                    <Button onClick={addTrigger} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加触发条件
                    </Button>
                  )}
                </div>

                {scenario.triggers?.map((trigger, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">触发条件 {index + 1}</h4>
                        {!readonly && (
                          <Button
                            onClick={() => removeTrigger(index)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>触发类型</Label>
                          <Select
                            value={trigger.type}
                            onValueChange={(value) => updateTrigger(index, { ...trigger, type: value as any })}
                            disabled={readonly}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">手动触发</SelectItem>
                              <SelectItem value="event">事件触发</SelectItem>
                              <SelectItem value="schedule">定时触发</SelectItem>
                              <SelectItem value="condition">条件触发</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {trigger.type === 'event' && (
                          <div className="space-y-2">
                            <Label>事件名称</Label>
                            <Input
                              value={trigger.event || ''}
                              onChange={(e) => updateTrigger(index, { ...trigger, event: e.target.value })}
                              placeholder="事件名称"
                              disabled={readonly}
                            />
                          </div>
                        )}

                        {trigger.type === 'schedule' && (
                          <div className="space-y-2">
                            <Label>定时表达式</Label>
                            <Input
                              value={trigger.schedule || ''}
                              onChange={(e) => updateTrigger(index, { ...trigger, schedule: e.target.value })}
                              placeholder="0 9 * * 1 (Cron表达式)"
                              disabled={readonly}
                            />
                          </div>
                        )}

                        {trigger.type === 'condition' && (
                          <div className="space-y-2">
                            <Label>条件表达式</Label>
                            <Input
                              value={trigger.condition || ''}
                              onChange={(e) => updateTrigger(index, { ...trigger, condition: e.target.value })}
                              placeholder="条件表达式"
                              disabled={readonly}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无触发条件</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="constraints" className="space-y-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">执行约束</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>时间限制 (毫秒)</Label>
                      <Input
                        type="number"
                        value={scenario.constraints?.timeLimit || 3600000}
                        onChange={(e) => updateConstraints({
                          ...scenario.constraints!,
                          timeLimit: parseInt(e.target.value) || 3600000
                        })}
                        disabled={readonly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>资源限制 (JSON)</Label>
                      <Input
                        value={JSON.stringify(scenario.constraints?.resourceLimits || {})}
                        onChange={(e) => {
                          try {
                            const resourceLimits = JSON.parse(e.target.value);
                            updateConstraints({
                              ...scenario.constraints!,
                              resourceLimits
                            });
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        placeholder='{"budget": 1000}'
                        disabled={readonly}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">业务规则</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableRules.map(rule => (
                      <div key={rule.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`constraint-rule-${rule.id}`}
                          checked={scenario.constraints?.businessRules?.includes(rule.id) || false}
                          onCheckedChange={(checked) => {
                            const currentRules = scenario.constraints?.businessRules || [];
                            const newRules = checked
                              ? [...currentRules, rule.id]
                              : currentRules.filter(id => id !== rule.id);
                            updateConstraints({
                              ...scenario.constraints!,
                              businessRules: newRules
                            });
                          }}
                          disabled={readonly}
                        />
                        <Label htmlFor={`constraint-rule-${rule.id}`} className="text-sm">
                          {rule.displayName || rule.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {!readonly && (
            <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isValid || isValidating}
                className="min-w-[100px]"
              >
                <Save className="h-4 w-4 mr-2" />
                {isValidating ? '保存中...' : '保存'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Step Editor Component
interface StepEditorProps {
  step: OBRScenarioStep;
  availableBehaviors: any[];
  availableSteps: OBRScenarioStep[];
  onUpdate: (step: OBRScenarioStep) => void;
  readonly: boolean;
}

function StepEditor({ step, availableBehaviors, availableSteps, onUpdate, readonly }: StepEditorProps) {
  const handleFieldChange = useCallback((field: keyof OBRScenarioStep, value: any) => {
    onUpdate({ ...step, [field]: value });
  }, [step, onUpdate]);

  const handleTaskChange = useCallback((task: OBRTask) => {
    onUpdate({ ...step, task });
  }, [step, onUpdate]);

  const handleDecisionChange = useCallback((decision: OBRDecision) => {
    onUpdate({ ...step, decision });
  }, [step, onUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">编辑步骤: {step.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>步骤名称</Label>
            <Input
              value={step.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={readonly}
            />
          </div>

          <div className="space-y-2">
            <Label>步骤类型</Label>
            <Select
              value={step.type}
              onValueChange={(value) => handleFieldChange('type', value)}
              disabled={readonly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">开始</SelectItem>
                <SelectItem value="end">结束</SelectItem>
                <SelectItem value="task">任务</SelectItem>
                <SelectItem value="decision">决策</SelectItem>
                <SelectItem value="parallel">并行</SelectItem>
                <SelectItem value="merge">合并</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task Configuration */}
        {step.type === 'task' && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">任务配置</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>关联行为</Label>
                <Select
                  value={step.task?.behaviorId || ''}
                  onValueChange={(value) => handleTaskChange({ 
                    ...step.task!, 
                    behaviorId: value 
                  })}
                  disabled={readonly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择行为" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBehaviors.map(behavior => (
                      <SelectItem key={behavior.id} value={behavior.id}>
                        {behavior.displayName || behavior.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>输入参数 (JSON)</Label>
                <Textarea
                  value={JSON.stringify(step.task?.inputs || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const inputs = JSON.parse(e.target.value);
                      handleTaskChange({ ...step.task!, inputs });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={3}
                  disabled={readonly}
                />
              </div>

              <div className="space-y-2">
                <Label>超时时间 (毫秒)</Label>
                <Input
                  type="number"
                  value={step.task?.timeout || ''}
                  onChange={(e) => handleTaskChange({ 
                    ...step.task!, 
                    timeout: parseInt(e.target.value) || undefined 
                  })}
                  disabled={readonly}
                />
              </div>
            </div>
          </div>
        )}

        {/* Decision Configuration */}
        {step.type === 'decision' && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">决策配置</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>决策条件</Label>
                <Input
                  value={step.decision?.condition || ''}
                  onChange={(e) => handleDecisionChange({ 
                    ...step.decision!, 
                    condition: e.target.value 
                  })}
                  placeholder="决策表达式"
                  disabled={readonly}
                />
              </div>

              <div className="space-y-2">
                <Label>分支配置 (JSON)</Label>
                <Textarea
                  value={JSON.stringify(step.decision?.branches || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const branches = JSON.parse(e.target.value);
                      handleDecisionChange({ ...step.decision!, branches });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={4}
                  disabled={readonly}
                />
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">下一步</h4>
          <div className="space-y-2">
            <Label>连接到</Label>
            <Select
              value={Array.isArray(step.next) ? step.next[0] || '' : step.next || ''}
              onValueChange={(value) => handleFieldChange('next', value ? [value] : [])}
              disabled={readonly}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择下一步" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">无</SelectItem>
                {availableSteps
                  .filter(s => s.id !== step.id)
                  .map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScenarioEditor;