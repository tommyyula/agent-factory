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
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Save, X, Plus, Trash2, Shield, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  OBRRule, 
  ValidationError, 
  OBRRuleCondition,
  OBRRuleAction,
  OBRRuleScope,
  OBRTestCase,
  OBRRuleConflict 
} from '@/shared/types/obr.types';
import { obrValidationService } from '@/shared/services/obr-validation.service';
import { useOBRStore } from '@/stores/obr.store';

interface RuleEditorProps {
  ruleId?: string;
  initialData?: Partial<OBRRule>;
  onSave: (rule: OBRRule) => Promise<void>;
  onCancel: () => void;
  readonly?: boolean;
}

export function RuleEditor({ 
  ruleId, 
  initialData, 
  onSave, 
  onCancel, 
  readonly = false 
}: RuleEditorProps) {
  // State management
  const [rule, setRule] = useState<Partial<OBRRule>>(initialData || {
    id: '',
    name: '',
    displayName: '',
    description: '',
    category: 'invariant',
    priority: 5,
    condition: {
      expression: '',
      naturalLanguage: '',
      variables: {}
    },
    actions: [],
    scope: {
      objects: [],
      behaviors: [],
      scenarios: []
    },
    conflicts: [],
    testCases: []
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'condition' | 'actions' | 'scope' | 'tests'>('basic');
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store hooks
  const { currentBlueprint } = useOBRStore();

  // Available components for scope selection
  const availableObjects = currentBlueprint?.objects || [];
  const availableBehaviors = currentBlueprint?.behaviors || [];
  const availableScenarios = currentBlueprint?.scenarios || [];
  const availableRules = currentBlueprint?.rules?.filter(r => r.id !== rule.id) || [];

  // Load existing rule if ruleId provided
  useEffect(() => {
    if (ruleId && currentBlueprint) {
      const existingRule = currentBlueprint.rules.find(r => r.id === ruleId);
      if (existingRule) {
        setRule(existingRule);
      }
    }
  }, [ruleId, currentBlueprint]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [rule]);

  // Handle basic field changes
  const handleBasicFieldChange = useCallback((field: keyof OBRRule, value: any) => {
    setRule(prev => ({ ...prev, [field]: value }));
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
    setRule(prev => ({
      ...prev,
      name,
      id: prev.id || generateId(name)
    }));
  }, [generateId]);

  // Handle condition changes
  const handleConditionChange = useCallback((field: keyof OBRRuleCondition, value: any) => {
    setRule(prev => ({
      ...prev,
      condition: { ...prev.condition!, [field]: value }
    }));
  }, []);

  const addVariable = useCallback(() => {
    const varName = `var_${Object.keys(rule.condition?.variables || {}).length + 1}`;
    setRule(prev => ({
      ...prev,
      condition: {
        ...prev.condition!,
        variables: {
          ...prev.condition!.variables,
          [varName]: 'string'
        }
      }
    }));
  }, [rule.condition]);

  const updateVariable = useCallback((varName: string, newName: string, type: string) => {
    setRule(prev => {
      const variables = { ...prev.condition!.variables };
      if (newName !== varName) {
        delete variables[varName];
        variables[newName] = type;
      } else {
        variables[varName] = type;
      }
      return {
        ...prev,
        condition: { ...prev.condition!, variables }
      };
    });
  }, []);

  const removeVariable = useCallback((varName: string) => {
    setRule(prev => {
      const variables = { ...prev.condition!.variables };
      delete variables[varName];
      return {
        ...prev,
        condition: { ...prev.condition!, variables }
      };
    });
  }, []);

  // Handle actions
  const addAction = useCallback(() => {
    setRule(prev => ({
      ...prev,
      actions: [
        ...prev.actions!,
        { type: 'validate', severity: 'warning', message: '' }
      ]
    }));
  }, []);

  const updateAction = useCallback((index: number, action: OBRRuleAction) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions!.map((a, i) => i === index ? action : a)
    }));
  }, []);

  const removeAction = useCallback((index: number) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions!.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle scope changes
  const updateScope = useCallback((field: keyof OBRRuleScope, values: string[]) => {
    setRule(prev => ({
      ...prev,
      scope: { ...prev.scope!, [field]: values }
    }));
  }, []);

  const toggleScopeItem = useCallback((field: keyof OBRRuleScope, itemId: string) => {
    setRule(prev => {
      const currentItems = prev.scope![field];
      const newItems = currentItems.includes(itemId)
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId];
      return {
        ...prev,
        scope: { ...prev.scope!, [field]: newItems }
      };
    });
  }, []);

  // Handle test cases
  const addTestCase = useCallback(() => {
    setRule(prev => ({
      ...prev,
      testCases: [
        ...prev.testCases!,
        {
          id: `test_${prev.testCases!.length + 1}`,
          description: '',
          input: {},
          expectedResult: 'pass'
        }
      ]
    }));
  }, []);

  const updateTestCase = useCallback((index: number, testCase: OBRTestCase) => {
    setRule(prev => ({
      ...prev,
      testCases: prev.testCases!.map((tc, i) => i === index ? testCase : tc)
    }));
  }, []);

  const removeTestCase = useCallback((index: number) => {
    setRule(prev => ({
      ...prev,
      testCases: prev.testCases!.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle conflicts
  const addConflict = useCallback(() => {
    setRule(prev => ({
      ...prev,
      conflicts: [
        ...prev.conflicts!,
        { ruleId: '', resolution: 'error', description: '' }
      ]
    }));
  }, []);

  const updateConflict = useCallback((index: number, conflict: OBRRuleConflict) => {
    setRule(prev => ({
      ...prev,
      conflicts: prev.conflicts!.map((c, i) => i === index ? conflict : c)
    }));
  }, []);

  const removeConflict = useCallback((index: number) => {
    setRule(prev => ({
      ...prev,
      conflicts: prev.conflicts!.filter((_, i) => i !== index)
    }));
  }, []);

  // Save rule
  const handleSave = useCallback(async () => {
    try {
      setIsValidating(true);
      
      if (!rule.id || !rule.name) {
        throw new Error('ID and name are required');
      }

      // Ensure required fields
      const completeRule: OBRRule = {
        id: rule.id,
        name: rule.name,
        displayName: rule.displayName || rule.name,
        description: rule.description || '',
        category: rule.category || 'invariant',
        priority: rule.priority || 5,
        condition: rule.condition || {
          expression: '',
          naturalLanguage: '',
          variables: {}
        },
        actions: rule.actions || [],
        scope: rule.scope || {
          objects: [],
          behaviors: [],
          scenarios: []
        },
        ...(rule.conflicts && rule.conflicts.length > 0 && { conflicts: rule.conflicts }),
        ...(rule.testCases && rule.testCases.length > 0 && { testCases: rule.testCases })
      };

      await onSave(completeRule);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
    setIsValidating(false);
  }, [rule, onSave]);

  // Check if form is valid
  const isValid = rule.id && rule.name && rule.condition?.expression && validationErrors.filter(e => e.severity === 'error').length === 0;

  return (
    <div className="rule-editor space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                规则编辑器
                {hasUnsavedChanges && <Badge variant="secondary">未保存</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {ruleId ? '编辑现有业务规则' : '创建新业务规则'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="condition">条件定义</TabsTrigger>
              <TabsTrigger value="actions">动作配置</TabsTrigger>
              <TabsTrigger value="scope">应用范围</TabsTrigger>
              <TabsTrigger value="tests">测试用例</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">名称 *</Label>
                  <Input
                    id="rule-name"
                    placeholder="例如: minimumRest8Hours"
                    value={rule.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-id">标识符</Label>
                  <Input
                    id="rule-id"
                    value={rule.id || ''}
                    onChange={(e) => handleBasicFieldChange('id', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-display-name">显示名称</Label>
                  <Input
                    id="rule-display-name"
                    placeholder="例如: 最少休息8小时"
                    value={rule.displayName || ''}
                    onChange={(e) => handleBasicFieldChange('displayName', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-category">规则类型 *</Label>
                  <Select
                    value={rule.category || 'invariant'}
                    onValueChange={(value) => handleBasicFieldChange('category', value)}
                    disabled={readonly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择规则类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invariant">不变式 (Invariant)</SelectItem>
                      <SelectItem value="constraint">约束 (Constraint)</SelectItem>
                      <SelectItem value="validation">验证 (Validation)</SelectItem>
                      <SelectItem value="trigger">触发器 (Trigger)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-description">描述</Label>
                <Textarea
                  id="rule-description"
                  placeholder="详细描述该规则的目的、适用场景和业务意义..."
                  value={rule.description || ''}
                  onChange={(e) => handleBasicFieldChange('description', e.target.value)}
                  rows={3}
                  disabled={readonly}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="rule-priority">优先级: {rule.priority || 5}</Label>
                  <div className="mt-2">
                    <Slider
                      id="rule-priority"
                      min={1}
                      max={10}
                      step={1}
                      value={[rule.priority || 5]}
                      onValueChange={(value: number[]) => handleBasicFieldChange('priority', value[0])}
                      disabled={readonly}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>低 (1)</span>
                      <span>中 (5)</span>
                      <span>高 (10)</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="condition" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-expression">条件表达式 *</Label>
                  <Textarea
                    id="rule-expression"
                    placeholder="例如: timeDiff(previousShift.endTime, currentShift.startTime) >= 8 * 3600000"
                    value={rule.condition?.expression || ''}
                    onChange={(e) => handleConditionChange('expression', e.target.value)}
                    rows={3}
                    disabled={readonly}
                  />
                  <p className="text-xs text-muted-foreground">
                    使用 JavaScript 表达式语法，变量通过下面的变量定义表声明
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-natural-language">自然语言描述 *</Label>
                  <Textarea
                    id="rule-natural-language"
                    placeholder="例如: 当前班次开始时间与上个班次结束时间之间至少相隔8小时"
                    value={rule.condition?.naturalLanguage || ''}
                    onChange={(e) => handleConditionChange('naturalLanguage', e.target.value)}
                    rows={2}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>变量定义</Label>
                    {!readonly && (
                      <Button onClick={addVariable} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        添加变量
                      </Button>
                    )}
                  </div>
                  
                  {Object.entries(rule.condition?.variables || {}).map(([varName, varType]) => (
                    <VariableRow
                      key={varName}
                      varName={varName}
                      varType={varType}
                      onUpdate={(newName, newType) => updateVariable(varName, newName, newType)}
                      onRemove={() => removeVariable(varName)}
                      readonly={readonly}
                    />
                  ))}
                  
                  {Object.keys(rule.condition?.variables || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无变量定义</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>规则动作</Label>
                  {!readonly && (
                    <Button onClick={addAction} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加动作
                    </Button>
                  )}
                </div>

                {rule.actions?.map((action, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>动作类型</Label>
                        <Select
                          value={action.type}
                          onValueChange={(value) => updateAction(index, { ...action, type: value as any })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="validate">验证</SelectItem>
                            <SelectItem value="block">阻止</SelectItem>
                            <SelectItem value="warn">警告</SelectItem>
                            <SelectItem value="execute">执行</SelectItem>
                            <SelectItem value="notify">通知</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>严重级别</Label>
                        <Select
                          value={action.severity}
                          onValueChange={(value) => updateAction(index, { ...action, severity: value as any })}
                          disabled={readonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error">错误</SelectItem>
                            <SelectItem value="warning">警告</SelectItem>
                            <SelectItem value="info">信息</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>目标 (可选)</Label>
                        <Input
                          value={action.target || ''}
                          onChange={(e) => updateAction(index, { ...action, target: e.target.value })}
                          placeholder="目标对象或服务"
                          disabled={readonly}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>操作</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => removeAction(index)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={readonly}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label>消息内容</Label>
                      <Textarea
                        value={action.message || ''}
                        onChange={(e) => updateAction(index, { ...action, message: e.target.value })}
                        placeholder="用户看到的消息内容..."
                        rows={2}
                        disabled={readonly}
                      />
                    </div>

                    {action.type === 'execute' && (
                      <div className="mt-4 space-y-2">
                        <Label>数据 (JSON)</Label>
                        <Textarea
                          value={JSON.stringify(action.data || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const data = JSON.parse(e.target.value);
                              updateAction(index, { ...action, data });
                            } catch {
                              // Invalid JSON, ignore
                            }
                          }}
                          placeholder="{}"
                          rows={3}
                          disabled={readonly}
                        />
                      </div>
                    )}
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无规则动作</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scope" className="space-y-4">
              <div className="space-y-6">
                {/* Objects Scope */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">适用对象</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableObjects.map(obj => (
                      <div key={obj.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`scope-obj-${obj.id}`}
                          checked={rule.scope?.objects?.includes(obj.id) || false}
                          onCheckedChange={() => toggleScopeItem('objects', obj.id)}
                          disabled={readonly}
                        />
                        <Label htmlFor={`scope-obj-${obj.id}`} className="text-sm">
                          {obj.displayName || obj.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behaviors Scope */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">适用行为</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableBehaviors.map(behavior => (
                      <div key={behavior.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`scope-behavior-${behavior.id}`}
                          checked={rule.scope?.behaviors?.includes(behavior.id) || false}
                          onCheckedChange={() => toggleScopeItem('behaviors', behavior.id)}
                          disabled={readonly}
                        />
                        <Label htmlFor={`scope-behavior-${behavior.id}`} className="text-sm">
                          {behavior.displayName || behavior.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scenarios Scope */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">适用场景</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableScenarios.map(scenario => (
                      <div key={scenario.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`scope-scenario-${scenario.id}`}
                          checked={rule.scope?.scenarios?.includes(scenario.id) || false}
                          onCheckedChange={() => toggleScopeItem('scenarios', scenario.id)}
                          disabled={readonly}
                        />
                        <Label htmlFor={`scope-scenario-${scenario.id}`} className="text-sm">
                          {scenario.displayName || scenario.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">测试用例</Label>
                  {!readonly && (
                    <Button onClick={addTestCase} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      添加测试用例
                    </Button>
                  )}
                </div>

                {rule.testCases?.map((testCase, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">测试用例 {index + 1}</h4>
                        {!readonly && (
                          <Button
                            onClick={() => removeTestCase(index)}
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
                          <Label>测试描述</Label>
                          <Input
                            value={testCase.description}
                            onChange={(e) => updateTestCase(index, { ...testCase, description: e.target.value })}
                            placeholder="测试场景描述"
                            disabled={readonly}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>期望结果</Label>
                          <Select
                            value={testCase.expectedResult}
                            onValueChange={(value) => updateTestCase(index, { ...testCase, expectedResult: value as any })}
                            disabled={readonly}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pass">通过</SelectItem>
                              <SelectItem value="fail">失败</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>输入数据 (JSON)</Label>
                        <Textarea
                          value={JSON.stringify(testCase.input, null, 2)}
                          onChange={(e) => {
                            try {
                              const input = JSON.parse(e.target.value);
                              updateTestCase(index, { ...testCase, input });
                            } catch {
                              // Invalid JSON, ignore
                            }
                          }}
                          placeholder="{}"
                          rows={4}
                          disabled={readonly}
                        />
                      </div>

                      {testCase.actualResult && (
                        <div className="p-3 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">实际结果:</span>
                            <Badge variant={testCase.actualResult === 'pass' ? 'success' : 'destructive'}>
                              {testCase.actualResult === 'pass' ? '通过' : '失败'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )) || (
                  <p className="text-sm text-muted-foreground">暂无测试用例</p>
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

// Variable Row Component
interface VariableRowProps {
  varName: string;
  varType: string;
  onUpdate: (newName: string, newType: string) => void;
  onRemove: () => void;
  readonly: boolean;
}

function VariableRow({ varName, varType, onUpdate, onRemove, readonly }: VariableRowProps) {
  const [localName, setLocalName] = useState(varName);
  const [localType, setLocalType] = useState(varType);

  const handleUpdate = useCallback(() => {
    onUpdate(localName, localType);
  }, [localName, localType, onUpdate]);

  useEffect(() => {
    const timer = setTimeout(handleUpdate, 500);
    return () => clearTimeout(timer);
  }, [localName, localType, handleUpdate]);

  return (
    <Card className="p-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>变量名</Label>
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="变量名"
            disabled={readonly}
          />
        </div>
        <div className="space-y-2">
          <Label>类型</Label>
          <Select
            value={localType}
            onValueChange={setLocalType}
            disabled={readonly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">字符串</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="boolean">布尔值</SelectItem>
              <SelectItem value="Date">日期</SelectItem>
              <SelectItem value="object">对象</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          {!readonly && (
            <Button
              onClick={onRemove}
              size="sm"
              variant="ghost"
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default RuleEditor;