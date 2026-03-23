import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Play,
  Bot,
  Network,
  FileText,
  Zap,
  Shield,
  Workflow,
  Search,
  Filter
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

import { useOBRStore } from '@/stores/obr.store';
import { OBR_DOMAINS, getDomain, DomainId } from '@/data/obr-domains';
import { 
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario
} from '@/shared/types/obr.types';

// Import editors and components
import { ObjectEditor } from './editors/ObjectEditor';
import { BehaviorEditor } from './editors/BehaviorEditor';
import { RuleEditor } from './editors/RuleEditor';
import { ScenarioEditor } from './editors/ScenarioEditor';
import { OBRGraphView } from './graph/OBRGraphView';
import { SimulationPanel } from './simulation/SimulationPanel';
import { ImportExport } from './ImportExport';

interface OBRPanelProps {
  readonly?: boolean;
}

type ActiveTab = 'objects' | 'behaviors' | 'rules' | 'scenarios' | 'graph' | 'simulation' | 'import-export';
type EditorMode = 'list' | 'create' | 'edit' | 'view';

export function OBRPanel({ readonly = false }: OBRPanelProps) {
  // Get domainId from URL params
  const { domainId } = useParams<{ domainId?: string }>();
  
  // Store hooks
  const { 
    currentBlueprint,
    selectedNodeId,
    selectedNodeType,
    addObject,
    updateObject,
    removeObject,
    addBehavior,
    updateBehavior,
    removeBehavior,
    addRule,
    updateRule,
    removeRule,
    addScenario,
    updateScenario,
    removeScenario,
    selectNode
  } = useOBRStore();

  // Load domain data when domainId changes
  useEffect(() => {
    if (domainId) {
      const domainKey = domainId.toLowerCase() as DomainId;
      if (OBR_DOMAINS[domainKey]) {
        const blueprint = getDomain(domainKey);
        // Set directly in store
        useOBRStore.setState({ currentBlueprint: blueprint });
      }
    }
  }, [domainId]);

  // Local state
  const [activeTab, setActiveTab] = useState<ActiveTab>('objects');
  const [editorMode, setEditorMode] = useState<EditorMode>('list');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Available data
  const objects = currentBlueprint?.objects || [];
  const behaviors = currentBlueprint?.behaviors || [];
  const rules = currentBlueprint?.rules || [];
  const scenarios = currentBlueprint?.scenarios || [];

  // Filter items based on search
  const filterItems = useCallback((items: any[], searchTerm: string) => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.displayName && item.displayName.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  }, []);

  // Handle item actions
  const handleCreate = useCallback((type: 'object' | 'behavior' | 'rule' | 'scenario') => {
    setActiveTab(type + 's' as ActiveTab);
    setEditorMode('create');
    setEditingItemId(null);
  }, []);

  const handleEdit = useCallback((type: 'object' | 'behavior' | 'rule' | 'scenario', id: string) => {
    setActiveTab(type + 's' as ActiveTab);
    setEditorMode('edit');
    setEditingItemId(id);
  }, []);

  const handleView = useCallback((type: 'object' | 'behavior' | 'rule' | 'scenario', id: string) => {
    setActiveTab(type + 's' as ActiveTab);
    setEditorMode('view');
    setEditingItemId(id);
    selectNode(id, type);
  }, [selectNode]);

  const handleDelete = useCallback(async (type: 'object' | 'behavior' | 'rule' | 'scenario', id: string) => {
    if (!confirm('确定要删除吗？此操作不可撤销。')) return;
    
    try {
      switch (type) {
        case 'object':
          removeObject(id);
          break;
        case 'behavior':
          removeBehavior(id);
          break;
        case 'rule':
          removeRule(id);
          break;
        case 'scenario':
          removeScenario(id);
          break;
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [removeObject, removeBehavior, removeRule, removeScenario]);

  const handleSave = useCallback(async (type: 'object' | 'behavior' | 'rule' | 'scenario', item: any) => {
    try {
      if (editorMode === 'create') {
        switch (type) {
          case 'object':
            addObject(item);
            break;
          case 'behavior':
            addBehavior(item);
            break;
          case 'rule':
            addRule(item);
            break;
          case 'scenario':
            addScenario(item);
            break;
        }
      } else {
        switch (type) {
          case 'object':
            updateObject(item.id, item);
            break;
          case 'behavior':
            updateBehavior(item.id, item);
            break;
          case 'rule':
            updateRule(item.id, item);
            break;
          case 'scenario':
            updateScenario(item.id, item);
            break;
        }
      }
      setEditorMode('list');
      setEditingItemId(null);
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [editorMode, addObject, updateObject, addBehavior, updateBehavior, addRule, updateRule, addScenario, updateScenario]);

  const handleCancel = useCallback(() => {
    setEditorMode('list');
    setEditingItemId(null);
  }, []);

  // No blueprint available
  if (!currentBlueprint) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">请先加载一个本体蓝图以使用 OBR 管理功能</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="obr-panel space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>OBR 本体管理</CardTitle>
              <p className="text-sm text-muted-foreground">
                管理对象-行为-规则 (Object-Behavior-Rule) 本体模型
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentBlueprint.metadata.domain}</Badge>
              <Badge variant="outline">v{currentBlueprint.metadata.version}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="objects" className="flex items-center gap-1">
            <Bot className="h-4 w-4" />
            对象
          </TabsTrigger>
          <TabsTrigger value="behaviors" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            行为
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            规则
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-1">
            <Workflow className="h-4 w-4" />
            场景
          </TabsTrigger>
          <TabsTrigger value="graph" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            图形
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            模拟
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            导入导出
          </TabsTrigger>
        </TabsList>

        {/* Objects Tab */}
        <TabsContent value="objects">
          {editorMode === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">业务对象</h3>
                  <Badge variant="outline">{objects.length} 个对象</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="搜索对象..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  {!readonly && (
                    <Button onClick={() => handleCreate('object')}>
                      <Plus className="h-4 w-4 mr-2" />
                      新建对象
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterItems(objects, searchTerm).map(obj => (
                  <ObjectCard
                    key={obj.id}
                    object={obj}
                    onEdit={() => handleEdit('object', obj.id)}
                    onView={() => handleView('object', obj.id)}
                    onDelete={() => handleDelete('object', obj.id)}
                    readonly={readonly}
                  />
                ))}
              </div>

              {filterItems(objects, searchTerm).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? '未找到匹配的对象' : '暂无业务对象'}
                </div>
              )}
            </div>
          ) : (
            <ObjectEditor
              objectId={editorMode === 'edit' ? editingItemId || undefined : undefined}
              onSave={(obj) => handleSave('object', obj)}
              onCancel={handleCancel}
              readonly={editorMode === 'view' || readonly}
            />
          )}
        </TabsContent>

        {/* Behaviors Tab */}
        <TabsContent value="behaviors">
          {editorMode === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">业务行为</h3>
                  <Badge variant="outline">{behaviors.length} 个行为</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="搜索行为..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  {!readonly && (
                    <Button onClick={() => handleCreate('behavior')}>
                      <Plus className="h-4 w-4 mr-2" />
                      新建行为
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterItems(behaviors, searchTerm).map(behavior => (
                  <BehaviorCard
                    key={behavior.id}
                    behavior={behavior}
                    onEdit={() => handleEdit('behavior', behavior.id)}
                    onView={() => handleView('behavior', behavior.id)}
                    onDelete={() => handleDelete('behavior', behavior.id)}
                    readonly={readonly}
                  />
                ))}
              </div>

              {filterItems(behaviors, searchTerm).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? '未找到匹配的行为' : '暂无业务行为'}
                </div>
              )}
            </div>
          ) : (
            <BehaviorEditor
              behaviorId={editorMode === 'edit' ? editingItemId || undefined : undefined}
              onSave={(behavior) => handleSave('behavior', behavior)}
              onCancel={handleCancel}
              readonly={editorMode === 'view' || readonly}
            />
          )}
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          {editorMode === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">业务规则</h3>
                  <Badge variant="outline">{rules.length} 个规则</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="搜索规则..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  {!readonly && (
                    <Button onClick={() => handleCreate('rule')}>
                      <Plus className="h-4 w-4 mr-2" />
                      新建规则
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterItems(rules, searchTerm).map(rule => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onEdit={() => handleEdit('rule', rule.id)}
                    onView={() => handleView('rule', rule.id)}
                    onDelete={() => handleDelete('rule', rule.id)}
                    readonly={readonly}
                  />
                ))}
              </div>

              {filterItems(rules, searchTerm).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? '未找到匹配的规则' : '暂无业务规则'}
                </div>
              )}
            </div>
          ) : (
            <RuleEditor
              ruleId={editorMode === 'edit' ? editingItemId || undefined : undefined}
              onSave={(rule) => handleSave('rule', rule)}
              onCancel={handleCancel}
              readonly={editorMode === 'view' || readonly}
            />
          )}
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios">
          {editorMode === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">业务场景</h3>
                  <Badge variant="outline">{scenarios.length} 个场景</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="搜索场景..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  {!readonly && (
                    <Button onClick={() => handleCreate('scenario')}>
                      <Plus className="h-4 w-4 mr-2" />
                      新建场景
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterItems(scenarios, searchTerm).map(scenario => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onEdit={() => handleEdit('scenario', scenario.id)}
                    onView={() => handleView('scenario', scenario.id)}
                    onDelete={() => handleDelete('scenario', scenario.id)}
                    readonly={readonly}
                  />
                ))}
              </div>

              {filterItems(scenarios, searchTerm).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? '未找到匹配的场景' : '暂无业务场景'}
                </div>
              )}
            </div>
          ) : (
            <ScenarioEditor
              scenarioId={editorMode === 'edit' ? editingItemId || undefined : undefined}
              onSave={(scenario) => handleSave('scenario', scenario)}
              onCancel={handleCancel}
              readonly={editorMode === 'view' || readonly}
            />
          )}
        </TabsContent>

        {/* Graph Tab */}
        <TabsContent value="graph">
          <div className="h-96">
            <OBRGraphView
              blueprint={currentBlueprint}
              selectedNodeId={selectedNodeId}
              onNodeSelect={selectNode}
              readonly={readonly}
            />
          </div>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <SimulationPanel readonly={readonly} />
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import-export">
          <ImportExport readonly={readonly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component Cards
function ObjectCard({ 
  object, 
  onEdit, 
  onView, 
  onDelete, 
  readonly 
}: { 
  object: OBRObject; 
  onEdit: () => void; 
  onView: () => void; 
  onDelete: () => void; 
  readonly: boolean; 
}) {
  const categoryLabels = {
    entity: '实体',
    value_object: '值对象',
    aggregate: '聚合根',
    service: '服务'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{object.displayName || object.name}</h4>
              <Badge variant="outline" className="mt-1">
                {categoryLabels[object.category]}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button onClick={onView} size="sm" variant="ghost">
                <Eye className="h-3 w-3" />
              </Button>
              {!readonly && (
                <>
                  <Button onClick={onEdit} size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button onClick={onDelete} size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {object.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {object.description}
            </p>
          )}

          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{Object.keys(object.attributes).length} 属性</span>
            <span>{object.constraints.length} 约束</span>
            {object.stateMachine && (
              <span>{Object.keys(object.stateMachine.states).length} 状态</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BehaviorCard({ 
  behavior, 
  onEdit, 
  onView, 
  onDelete, 
  readonly 
}: { 
  behavior: OBRBehavior; 
  onEdit: () => void; 
  onView: () => void; 
  onDelete: () => void; 
  readonly: boolean; 
}) {
  const categoryLabels = {
    command: '命令',
    query: '查询',
    event: '事件',
    workflow: '工作流'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{behavior.displayName || behavior.name}</h4>
              <Badge variant="outline" className="mt-1">
                {categoryLabels[behavior.category]}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button onClick={onView} size="sm" variant="ghost">
                <Eye className="h-3 w-3" />
              </Button>
              {!readonly && (
                <>
                  <Button onClick={onEdit} size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button onClick={onDelete} size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {behavior.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {behavior.description}
            </p>
          )}

          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{Object.keys(behavior.inputs).length} 输入</span>
            <span>{Object.keys(behavior.outputs).length} 输出</span>
            <span>{behavior.linkedRules.length} 规则</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RuleCard({ 
  rule, 
  onEdit, 
  onView, 
  onDelete, 
  readonly 
}: { 
  rule: OBRRule; 
  onEdit: () => void; 
  onView: () => void; 
  onDelete: () => void; 
  readonly: boolean; 
}) {
  const categoryLabels = {
    invariant: '不变式',
    constraint: '约束',
    validation: '验证',
    trigger: '触发器'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{rule.displayName || rule.name}</h4>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline">
                  {categoryLabels[rule.category]}
                </Badge>
                <Badge variant="secondary">P{rule.priority}</Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button onClick={onView} size="sm" variant="ghost">
                <Eye className="h-3 w-3" />
              </Button>
              {!readonly && (
                <>
                  <Button onClick={onEdit} size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button onClick={onDelete} size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {rule.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {rule.description}
            </p>
          )}

          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{rule.actions.length} 动作</span>
            <span>{rule.scope.objects.length + rule.scope.behaviors.length} 作用域</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScenarioCard({ 
  scenario, 
  onEdit, 
  onView, 
  onDelete, 
  readonly 
}: { 
  scenario: OBRScenario; 
  onEdit: () => void; 
  onView: () => void; 
  onDelete: () => void; 
  readonly: boolean; 
}) {
  const categoryLabels = {
    process: '流程',
    workflow: '工作流',
    event_handling: '事件处理',
    decision_flow: '决策流'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{scenario.displayName || scenario.name}</h4>
              <Badge variant="outline" className="mt-1">
                {categoryLabels[scenario.category]}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button onClick={onView} size="sm" variant="ghost">
                <Eye className="h-3 w-3" />
              </Button>
              {!readonly && (
                <>
                  <Button onClick={onEdit} size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button onClick={onDelete} size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {scenario.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {scenario.description}
            </p>
          )}

          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{scenario.steps.length} 步骤</span>
            <span>{scenario.actors.length} 参与者</span>
            <span>{scenario.triggers.length} 触发器</span>
          </div>

          {scenario.metrics && (
            <div className="text-xs text-green-600">
              成功率: {Math.round((scenario.metrics.successRate || 0) * 100)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default OBRPanel;