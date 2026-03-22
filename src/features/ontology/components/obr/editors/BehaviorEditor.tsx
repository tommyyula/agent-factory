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
import { AlertCircle, Save, X, Plus, Trash2, Eye, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  OBRBehavior, 
  ValidationError, 
  OBRPreconditions, 
  OBRParameter,
  OBRStateChange,
  OBRRuleLink,
  OBRSideEffect 
} from '@/shared/types/obr.types';
import { obrValidationService } from '@/shared/services/obr-validation.service';
import { useOBRStore } from '@/stores/obr.store';

interface BehaviorEditorProps {
  behaviorId?: string;
  initialData?: Partial<OBRBehavior>;
  onSave: (behavior: OBRBehavior) => Promise<void>;
  onCancel: () => void;
  readonly?: boolean;
}

export function BehaviorEditor({ 
  behaviorId, 
  initialData, 
  onSave, 
  onCancel, 
  readonly = false 
}: BehaviorEditorProps) {
  // State management
  const [behavior, setBehavior] = useState<Partial<OBRBehavior>>(initialData || {
    id: '',
    name: '',
    displayName: '',
    description: '',
    category: 'command',
    preconditions: {
      objectStates: [],
      ruleChecks: [],
      customConditions: []
    },
    inputs: {},
    outputs: {},
    stateChanges: [],
    linkedRules: [],
    sideEffects: [],
    visual: { color: '#22c55e', icon: 'zap' }
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'preconditions' | 'parameters' | 'effects' | 'rules'>('basic');
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store hooks
  const { currentBlueprint } = useOBRStore();

  // Available objects and rules for selection
  const availableObjects = currentBlueprint?.objects || [];
  const availableRules = currentBlueprint?.rules || [];

  // Load existing behavior if behaviorId provided
  useEffect(() => {
    if (behaviorId && currentBlueprint) {
      const existingBehavior = currentBlueprint.behaviors.find(b => b.id === behaviorId);
      if (existingBehavior) {
        setBehavior(existingBehavior);
      }
    }
  }, [behaviorId, currentBlueprint]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [behavior]);

  // Handle basic field changes
  const handleBasicFieldChange = useCallback((field: keyof OBRBehavior, value: any) => {
    setBehavior(prev => ({ ...prev, [field]: value }));
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
    setBehavior(prev => ({
      ...prev,
      name,
      id: prev.id || generateId(name)
    }));
  }, [generateId]);

  // Handle preconditions
  const handlePreconditionsChange = useCallback((preconditions: OBRPreconditions) => {
    setBehavior(prev => ({ ...prev, preconditions }));
  }, []);

  const addObjectState = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      preconditions: {
        ...prev.preconditions!,
        objectStates: [
          ...prev.preconditions!.objectStates,
          { objectId: '', requiredState: '' }
        ]
      }
    }));
  }, []);

  const removeObjectState = useCallback((index: number) => {
    setBehavior(prev => ({
      ...prev,
      preconditions: {
        ...prev.preconditions!,
        objectStates: prev.preconditions!.objectStates.filter((_, i) => i !== index)
      }
    }));
  }, []);

  const updateObjectState = useCallback((index: number, field: 'objectId' | 'requiredState', value: string) => {
    setBehavior(prev => ({
      ...prev,
      preconditions: {
        ...prev.preconditions!,
        objectStates: prev.preconditions!.objectStates.map((state, i) => 
          i === index ? { ...state, [field]: value } : state
        )
      }
    }));
  }, []);

  // Handle parameters
  const addParameter = useCallback((paramType: 'inputs' | 'outputs') => {
    const paramName = `param_${Object.keys(behavior[paramType] || {}).length + 1}`;
    setBehavior(prev => ({
      ...prev,
      [paramType]: {
        ...prev[paramType],
        [paramName]: { type: 'string', required: true, description: '' }
      }
    }));
  }, [behavior]);

  const removeParameter = useCallback((paramType: 'inputs' | 'outputs', paramName: string) => {
    setBehavior(prev => {
      const newParams = { ...(prev[paramType] as any) };
      delete newParams[paramName];
      return { ...prev, [paramType]: newParams };
    });
  }, []);

  const updateParameter = useCallback((paramType: 'inputs' | 'outputs', paramName: string, parameter: OBRParameter) => {
    setBehavior(prev => ({
      ...prev,
      [paramType]: {
        ...prev[paramType],
        [paramName]: parameter
      }
    }));
  }, []);

  // Handle state changes
  const addStateChange = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      stateChanges: [
        ...prev.stateChanges!,
        { objectId: '', newState: '', condition: '' }
      ]
    }));
  }, []);

  const removeStateChange = useCallback((index: number) => {
    setBehavior(prev => ({
      ...prev,
      stateChanges: prev.stateChanges!.filter((_, i) => i !== index)
    }));
  }, []);

  const updateStateChange = useCallback((index: number, stateChange: OBRStateChange) => {
    setBehavior(prev => ({
      ...prev,
      stateChanges: prev.stateChanges!.map((sc, i) => 
        i === index ? stateChange : sc
      )
    }));
  }, []);

  // Handle linked rules
  const addLinkedRule = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      linkedRules: [
        ...prev.linkedRules!,
        { ruleId: '', phase: 'before', required: true }
      ]
    }));
  }, []);

  const removeLinkedRule = useCallback((index: number) => {
    setBehavior(prev => ({
      ...prev,
      linkedRules: prev.linkedRules!.filter((_, i) => i !== index)
    }));
  }, []);

  const updateLinkedRule = useCallback((index: number, ruleLink: OBRRuleLink) => {
    setBehavior(prev => ({
      ...prev,
      linkedRules: prev.linkedRules!.map((rl, i) => 
        i === index ? ruleLink : rl
      )
    }));
  }, []);

  // Handle side effects
  const addSideEffect = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      sideEffects: [
        ...prev.sideEffects!,
        { type: 'notify', target: '', data: {} }
      ]
    }));
  }, []);

  const removeSideEffect = useCallback((index: number) => {
    setBehavior(prev => ({
      ...prev,
      sideEffects: prev.sideEffects!.filter((_, i) => i !== index)
    }));
  }, []);

  const updateSideEffect = useCallback((index: number, sideEffect: OBRSideEffect) => {
    setBehavior(prev => ({
      ...prev,
      sideEffects: prev.sideEffects!.map((se, i) => 
        i === index ? sideEffect : se
      )
    }));
  }, []);

  // Save behavior
  const handleSave = useCallback(async () => {
    try {
      setIsValidating(true);
      
      if (!behavior.id || !behavior.name) {
        throw new Error('ID and name are required');
      }

      // Ensure required fields
      const completeBehavior: OBRBehavior = {
        id: behavior.id,
        name: behavior.name,
        displayName: behavior.displayName || behavior.name,
        description: behavior.description || '',
        category: behavior.category || 'command',
        preconditions: behavior.preconditions || {
          objectStates: [],
          ruleChecks: [],
          customConditions: []
        },
        inputs: behavior.inputs || {},
        outputs: behavior.outputs || {},
        stateChanges: behavior.stateChanges || [],
        linkedRules: behavior.linkedRules || [],
        sideEffects: behavior.sideEffects || [],
        visual: behavior.visual || { color: '#22c55e', icon: 'zap' }
      };

      await onSave(completeBehavior);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
    setIsValidating(false);
  }, [behavior, onSave]);

  // Check if form is valid
  const isValid = behavior.id && behavior.name && validationErrors.filter(e => e.severity === 'error').length === 0;

  return (
    <div className="behavior-editor space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                行为编辑器
                {hasUnsavedChanges && <Badge variant="secondary">未保存</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {behaviorId ? '编辑现有行为' : '创建新业务行为'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="preconditions">前置条件</TabsTrigger>
              <TabsTrigger value="parameters">参数定义</TabsTrigger>
              <TabsTrigger value="effects">状态影响</TabsTrigger>
              <TabsTrigger value="rules">关联规则</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="behavior-name">名称 *</Label>
                  <Input
                    id="behavior-name"
                    placeholder="例如: createShift"
                    value={behavior.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavior-id">标识符</Label>
                  <Input
                    id="behavior-id"
                    value={behavior.id || ''}
                    onChange={(e) => handleBasicFieldChange('id', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavior-display-name">显示名称</Label>
                  <Input
                    id="behavior-display-name"
                    placeholder="例如: 创建班次"
                    value={behavior.displayName || ''}
                    onChange={(e) => handleBasicFieldChange('displayName', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavior-category">行为类型 *</Label>
                  <Select
                    value={behavior.category || 'command'}
                    onValueChange={(value) => handleBasicFieldChange('category', value)}
                    disabled={readonly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择行为类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="command">命令 (Command)</SelectItem>
                      <SelectItem value="query">查询 (Query)</SelectItem>
                      <SelectItem value="event">事件 (Event)</SelectItem>
                      <SelectItem value="workflow">工作流 (Workflow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavior-description">描述</Label>
                <Textarea
                  id="behavior-description"
                  placeholder="详细描述该行为的功能、目的和执行逻辑..."
                  value={behavior.description || ''}
                  onChange={(e) => handleBasicFieldChange('description', e.target.value)}
                  rows={3}
                  disabled={readonly}
                />
              </div>
            </TabsContent>

            <TabsContent value="preconditions" className="space-y-4">
              <div className="space-y-6">
                {/* Object States */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">对象状态要求</h4>
                    {!readonly && (
                      <Button onClick={addObjectState} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        添加状态要求
                      </Button>
                    )}
                  </div>
                  {behavior.preconditions?.objectStates?.map((state, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>对象</Label>
                          <Select
                            value={state.objectId}
                            onValueChange={(value) => updateObjectState(index, 'objectId', value)}
                            disabled={readonly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择对象" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableObjects.map(obj => (
                                <SelectItem key={obj.id} value={obj.id}>
                                  {obj.displayName || obj.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>要求状态</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={state.requiredState}
                              onChange={(e) => updateObjectState(index, 'requiredState', e.target.value)}
                              placeholder="状态名称"
                              disabled={readonly}
                            />
                            {!readonly && (
                              <Button
                                onClick={() => removeObjectState(index)}
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )) || (
                    <p className="text-sm text-muted-foreground">暂无对象状态要求</p>
                  )}
                </div>

                {/* Rule Checks */}
                <div className="space-y-4">
                  <h4 className="font-medium">规则检查</h4>
                  <div className="space-y-2">
                    {availableRules.map(rule => (
                      <div key={rule.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rule-${rule.id}`}
                          checked={behavior.preconditions?.ruleChecks?.includes(rule.id) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBehavior(prev => ({
                                ...prev,
                                preconditions: {
                                  ...prev.preconditions!,
                                  ruleChecks: [...prev.preconditions!.ruleChecks, rule.id]
                                }
                              }));
                            } else {
                              setBehavior(prev => ({
                                ...prev,
                                preconditions: {
                                  ...prev.preconditions!,
                                  ruleChecks: prev.preconditions!.ruleChecks.filter(id => id !== rule.id)
                                }
                              }));
                            }
                          }}
                          disabled={readonly}
                        />
                        <Label htmlFor={`rule-${rule.id}`} className="text-sm">
                          {rule.displayName || rule.name}
                        </Label>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">暂无可用规则</p>
                    )}
                  </div>
                </div>

                {/* Custom Conditions */}
                <div className="space-y-4">
                  <h4 className="font-medium">自定义条件</h4>
                  <Textarea
                    placeholder="输入自定义条件表达式，每行一个..."
                    value={behavior.preconditions?.customConditions?.join('\n') || ''}
                    onChange={(e) => {
                      const conditions = e.target.value.split('\n').filter(c => c.trim());
                      setBehavior(prev => ({
                        ...prev,
                        preconditions: {
                          ...prev.preconditions!,
                          customConditions: conditions
                        }
                      }));
                    }}
                    rows={3}
                    disabled={readonly}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              {/* Input Parameters */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">输入参数</h4>
                  {!readonly && (
                    <Button onClick={() => addParameter('inputs')} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加输入参数
                    </Button>
                  )}
                </div>
                {Object.entries(behavior.inputs || {}).map(([paramName, param]) => (
                  <ParameterRow
                    key={paramName}
                    paramName={paramName}
                    parameter={param}
                    onUpdate={(newParam) => updateParameter('inputs', paramName, newParam)}
                    onRemove={() => removeParameter('inputs', paramName)}
                    readonly={readonly}
                  />
                ))}
              </div>

              {/* Output Parameters */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">输出参数</h4>
                  {!readonly && (
                    <Button onClick={() => addParameter('outputs')} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加输出参数
                    </Button>
                  )}
                </div>
                {Object.entries(behavior.outputs || {}).map(([paramName, param]) => (
                  <ParameterRow
                    key={paramName}
                    paramName={paramName}
                    parameter={param}
                    onUpdate={(newParam) => updateParameter('outputs', paramName, newParam)}
                    onRemove={() => removeParameter('outputs', paramName)}
                    readonly={readonly}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              {/* State Changes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">状态变更</h4>
                  {!readonly && (
                    <Button onClick={addStateChange} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加状态变更
                    </Button>
                  )}
                </div>
                {behavior.stateChanges?.map((stateChange, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>对象</Label>
                        <Select
                          value={stateChange.objectId}
                          onValueChange={(value) => updateStateChange(index, { ...stateChange, objectId: value })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择对象" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableObjects.map(obj => (
                              <SelectItem key={obj.id} value={obj.id}>
                                {obj.displayName || obj.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>新状态</Label>
                        <Input
                          value={stateChange.newState}
                          onChange={(e) => updateStateChange(index, { ...stateChange, newState: e.target.value })}
                          placeholder="状态名称"
                          disabled={readonly}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>条件 (可选)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={stateChange.condition || ''}
                            onChange={(e) => updateStateChange(index, { ...stateChange, condition: e.target.value })}
                            placeholder="条件表达式"
                            disabled={readonly}
                          />
                          {!readonly && (
                            <Button
                              onClick={() => removeStateChange(index)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无状态变更</p>
                )}
              </div>

              {/* Side Effects */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">副作用</h4>
                  {!readonly && (
                    <Button onClick={addSideEffect} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加副作用
                    </Button>
                  )}
                </div>
                {behavior.sideEffects?.map((sideEffect, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>类型</Label>
                        <Select
                          value={sideEffect.type}
                          onValueChange={(value) => updateSideEffect(index, { ...sideEffect, type: value as any })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="create">创建</SelectItem>
                            <SelectItem value="update">更新</SelectItem>
                            <SelectItem value="delete">删除</SelectItem>
                            <SelectItem value="notify">通知</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>目标</Label>
                        <Input
                          value={sideEffect.target}
                          onChange={(e) => updateSideEffect(index, { ...sideEffect, target: e.target.value })}
                          placeholder="目标对象或服务"
                          disabled={readonly}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>数据 (JSON)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={JSON.stringify(sideEffect.data || {})}
                            onChange={(e) => {
                              try {
                                const data = JSON.parse(e.target.value);
                                updateSideEffect(index, { ...sideEffect, data });
                              } catch {
                                // Invalid JSON, ignore
                              }
                            }}
                            placeholder="{}"
                            disabled={readonly}
                          />
                          {!readonly && (
                            <Button
                              onClick={() => removeSideEffect(index)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无副作用</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">关联规则</h4>
                  {!readonly && (
                    <Button onClick={addLinkedRule} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加规则关联
                    </Button>
                  )}
                </div>
                {behavior.linkedRules?.map((ruleLink, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>规则</Label>
                        <Select
                          value={ruleLink.ruleId}
                          onValueChange={(value) => updateLinkedRule(index, { ...ruleLink, ruleId: value })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择规则" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRules.map(rule => (
                              <SelectItem key={rule.id} value={rule.id}>
                                {rule.displayName || rule.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>执行阶段</Label>
                        <Select
                          value={ruleLink.phase}
                          onValueChange={(value) => updateLinkedRule(index, { ...ruleLink, phase: value as any })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="before">执行前</SelectItem>
                            <SelectItem value="during">执行中</SelectItem>
                            <SelectItem value="after">执行后</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>是否必须</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={ruleLink.required}
                            onCheckedChange={(checked) => updateLinkedRule(index, { ...ruleLink, required: !!checked })}
                            disabled={readonly}
                          />
                          <span className="text-sm">必须通过</span>
                          {!readonly && (
                            <Button
                              onClick={() => removeLinkedRule(index)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive ml-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无关联规则</p>
                )}
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

// Parameter Row Component
interface ParameterRowProps {
  paramName: string;
  parameter: OBRParameter;
  onUpdate: (parameter: OBRParameter) => void;
  onRemove: () => void;
  readonly: boolean;
}

function ParameterRow({ paramName, parameter, onUpdate, onRemove, readonly }: ParameterRowProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>参数名</Label>
          <Input value={paramName} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>类型</Label>
          <Select
            value={parameter.type}
            onValueChange={(value) => onUpdate({ ...parameter, type: value })}
            disabled={readonly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">字符串</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="boolean">布尔值</SelectItem>
              <SelectItem value="date">日期</SelectItem>
              <SelectItem value="enum">枚举</SelectItem>
              <SelectItem value="object">对象</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>描述</Label>
          <Input
            value={parameter.description || ''}
            onChange={(e) => onUpdate({ ...parameter, description: e.target.value })}
            placeholder="参数说明"
            disabled={readonly}
          />
        </div>
        <div className="space-y-2">
          <Label>必须</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={parameter.required || false}
              onCheckedChange={(checked) => onUpdate({ ...parameter, required: !!checked })}
              disabled={readonly}
            />
            {!readonly && (
              <Button
                onClick={onRemove}
                size="sm"
                variant="ghost"
                className="text-destructive ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BehaviorEditor;