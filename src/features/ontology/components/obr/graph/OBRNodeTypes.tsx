// @ts-nocheck
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Circle, 
  Zap, 
  Shield, 
  Workflow,
  User,
  Building,
  Clock,
  Calendar,
  CheckCircle,
  Award,
  Briefcase,
  ChevronRight
} from 'lucide-react';

import { 
  OBRObject, 
  OBRBehavior, 
  OBRRule, 
  OBRScenario 
} from '@/shared/types/obr.types';

// Icon mapping for objects
const getObjectIcon = (iconName?: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    user: User,
    building: Building,
    clock: Clock,
    calendar: Calendar,
    'check-circle': CheckCircle,
    award: Award,
    briefcase: Briefcase,
    circle: Circle
  };
  return icons[iconName || 'circle'] || Circle;
};

// Object Node
export function ObjectNode({ data, selected }: NodeProps) {
  const { object, isSelected, onClick } = data as {
    object: OBRObject;
    isSelected: boolean;
    onClick: () => void;
  };
  const IconComponent = getObjectIcon(object.visual?.icon);

  const categoryLabels: Record<string, string> = {
    entity: '实体',
    value_object: '值对象',
    aggregate: '聚合根',
    service: '服务'
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <Card 
        className={`w-36 p-3 transition-all hover:shadow-md ${
          isSelected || selected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        style={{
          borderLeft: `4px solid ${object.visual?.color || '#3b82f6'}`
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconComponent 
              className="h-4 w-4" 
              style={{ color: object.visual?.color || '#3b82f6' }}
            />
            <span className="font-medium text-sm truncate">
              {object.displayName || object.name}
            </span>
          </div>
          
          <div className="space-y-1">
            <Badge 
              variant="outline" 
              className="text-xs px-1 py-0"
              style={{ 
                borderColor: object.visual?.color || '#3b82f6',
                color: object.visual?.color || '#3b82f6'
              }}
            >
              {categoryLabels[object.category]}
            </Badge>
            
            <div className="text-xs text-muted-foreground truncate">
              {Object.keys(object.attributes).length} 属性
            </div>
            
            {object.stateMachine && (
              <div className="text-xs text-muted-foreground">
                {Object.keys(object.stateMachine.states).length} 状态
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Behavior Node
export function BehaviorNode({ data, selected }: NodeProps) {
  const { behavior, isSelected, onClick } = data as {
    behavior: OBRBehavior;
    isSelected: boolean;
    onClick: () => void;
  };

  const categoryLabels: Record<string, string> = {
    command: '命令',
    query: '查询',
    event: '事件',
    workflow: '工作流'
  };

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    command: Zap,
    query: Circle,
    event: Circle,
    workflow: Workflow
  };

  const IconComponent = categoryIcons[behavior.category] || Zap;

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <Card 
        className={`w-40 p-3 transition-all hover:shadow-md ${
          isSelected || selected ? 'ring-2 ring-green-500 shadow-lg' : ''
        }`}
        style={{
          borderLeft: `4px solid ${behavior.visual?.color || '#22c55e'}`
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconComponent 
              className="h-4 w-4" 
              style={{ color: behavior.visual?.color || '#22c55e' }}
            />
            <span className="font-medium text-sm truncate">
              {behavior.displayName || behavior.name}
            </span>
          </div>
          
          <div className="space-y-1">
            <Badge 
              variant="outline" 
              className="text-xs px-1 py-0"
              style={{ 
                borderColor: behavior.visual?.color || '#22c55e',
                color: behavior.visual?.color || '#22c55e'
              }}
            >
              {categoryLabels[behavior.category]}
            </Badge>
            
            <div className="text-xs text-muted-foreground">
              {Object.keys(behavior.inputs).length} 输入参数
            </div>
            
            <div className="text-xs text-muted-foreground">
              {Object.keys(behavior.outputs).length} 输出参数
            </div>
            
            {behavior.linkedRules.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {behavior.linkedRules.length} 关联规则
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Rule Node
export function RuleNode({ data, selected }: NodeProps) {
  const { rule, isSelected, onClick } = data as {
    rule: OBRRule;
    isSelected: boolean;
    onClick: () => void;
  };

  const categoryLabels: Record<string, string> = {
    invariant: '不变式',
    constraint: '约束',
    validation: '验证',
    trigger: '触发器'
  };

  const priorityColors = {
    low: '#6b7280',      // 1-3
    medium: '#f59e0b',   // 4-6  
    high: '#ef4444',     // 7-10
  };

  const getPriorityLevel = (priority: number): keyof typeof priorityColors => {
    if (priority <= 3) return 'low';
    if (priority <= 6) return 'medium';
    return 'high';
  };

  const priorityLevel = getPriorityLevel(rule.priority);

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <Card 
        className={`w-36 p-3 transition-all hover:shadow-md ${
          isSelected || selected ? 'ring-2 ring-orange-500 shadow-lg' : ''
        }`}
        style={{
          borderLeft: `4px solid #f97316`
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="font-medium text-sm truncate">
              {rule.displayName || rule.name}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex gap-1">
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0 border-orange-500 text-orange-500"
              >
                {categoryLabels[rule.category]}
              </Badge>
              
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0"
                style={{ 
                  borderColor: priorityColors[priorityLevel],
                  color: priorityColors[priorityLevel]
                }}
              >
                P{rule.priority}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {rule.actions.length} 动作
            </div>
            
            {rule.scope && (
              <div className="text-xs text-muted-foreground">
                作用域: {[
                  ...rule.scope.objects,
                  ...rule.scope.behaviors,
                  ...rule.scope.scenarios
                ].length} 项
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Scenario Node
export function ScenarioNode({ data, selected }: NodeProps) {
  const { scenario, isSelected, onClick } = data as {
    scenario: OBRScenario;
    isSelected: boolean;
    onClick: () => void;
  };

  const categoryLabels: Record<string, string> = {
    process: '流程',
    workflow: '工作流',
    event_handling: '事件处理',
    decision_flow: '决策流'
  };

  // Get scenario complexity based on steps and actors
  const complexity = scenario.steps.length > 10 || scenario.actors.length > 5 ? '复杂' :
                    scenario.steps.length > 5 || scenario.actors.length > 2 ? '中等' : '简单';

  const complexityColors = {
    '简单': '#22c55e',
    '中等': '#f59e0b', 
    '复杂': '#ef4444'
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <Card 
        className={`w-44 p-3 transition-all hover:shadow-md ${
          isSelected || selected ? 'ring-2 ring-purple-500 shadow-lg' : ''
        }`}
        style={{
          borderLeft: `4px solid #8b5cf6`
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-purple-500" />
            <span className="font-medium text-sm truncate">
              {scenario.displayName || scenario.name}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex gap-1">
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0 border-purple-500 text-purple-500"
              >
                {categoryLabels[scenario.category]}
              </Badge>
              
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0"
                style={{ 
                  borderColor: complexityColors[complexity],
                  color: complexityColors[complexity]
                }}
              >
                {complexity}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {scenario.steps.length} 步骤
            </div>
            
            <div className="text-xs text-muted-foreground">
              {scenario.actors.length} 参与者
            </div>
            
            {scenario.triggers.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {scenario.triggers.length} 触发器
              </div>
            )}
            
            {scenario.metrics && (
              <div className="text-xs text-green-600">
                成功率: {Math.round((scenario.metrics.successRate || 0) * 100)}%
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

// Mini Node for scenario steps (used in scenario visualization)
export function StepNode({ data, selected }: NodeProps) {
  const { step, isSelected, onClick } = data as {
    step: any;
    isSelected: boolean;
    onClick: () => void;
  };

  const stepTypeIcons: Record<string, React.ComponentType<any>> = {
    start: Circle,
    end: Circle,
    task: Zap,
    decision: ChevronRight,
    parallel: Workflow,
    merge: Workflow
  };

  const stepTypeColors: Record<string, string> = {
    start: '#22c55e',
    end: '#ef4444',
    task: '#3b82f6',
    decision: '#f59e0b',
    parallel: '#8b5cf6',
    merge: '#06b6d4'
  };

  const IconComponent = stepTypeIcons[step.type] || Circle;
  const color = stepTypeColors[step.type] || '#6b7280';

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Handle type="target" position={Position.Left} className="w-1 h-1" />
      
      <Card 
        className={`w-24 p-2 transition-all hover:shadow-md ${
          isSelected || selected ? 'ring-1 ring-blue-400 shadow-md' : ''
        }`}
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <IconComponent className="h-3 w-3" style={{ color }} />
            <span className="font-medium text-xs truncate">
              {step.name}
            </span>
          </div>
          
          <Badge 
            variant="outline" 
            className="text-xs px-1 py-0"
            style={{ borderColor: color, color }}
          >
            {step.type}
          </Badge>
        </div>
      </Card>
      
      <Handle type="source" position={Position.Right} className="w-1 h-1" />
    </div>
  );
}

export default { 
  ObjectNode, 
  BehaviorNode, 
  RuleNode, 
  ScenarioNode, 
  StepNode 
};