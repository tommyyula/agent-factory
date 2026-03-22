import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Box, 
  Database, 
  GitBranch, 
  Shield, 
  Eye, 
  Play, 
  Square, 
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

import { OBRObject } from '@/shared/types/obr.types';

interface ObjectPreviewProps {
  object: Partial<OBRObject>;
}

export function ObjectPreview({ object }: ObjectPreviewProps) {
  if (!object.name) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>暂无预览内容</p>
          <p className="text-sm">请先填写对象基本信息</p>
        </div>
      </div>
    );
  }

  const attributeCount = Object.keys(object.attributes || {}).length;
  const requiredAttributeCount = Object.values(object.attributes || {}).filter(attr => attr.required).length;
  const constraintCount = (object.constraints || []).length;
  const stateCount = object.stateMachine ? Object.keys(object.stateMachine.states).length : 0;
  const transitionCount = object.stateMachine ? object.stateMachine.transitions.length : 0;

  // Get category info
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      'entity': { 
        name: '实体', 
        description: '具有唯一标识的业务对象，有独立的生命周期',
        color: 'bg-blue-100 text-blue-800'
      },
      'value_object': { 
        name: '值对象', 
        description: '无唯一标识，通过属性值来区分的不可变对象',
        color: 'bg-green-100 text-green-800'
      },
      'aggregate': { 
        name: '聚合根', 
        description: '管理其他实体和值对象的复合对象',
        color: 'bg-purple-100 text-purple-800'
      },
      'service': { 
        name: '服务', 
        description: '无状态的业务逻辑处理对象',
        color: 'bg-orange-100 text-orange-800'
      }
    };
    
    return categoryMap[category as keyof typeof categoryMap] || categoryMap.entity;
  };

  const categoryInfo = getCategoryInfo(object.category || 'entity');

  // Get constraint severity icon
  const getConstraintIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'info':
        return <Info className="h-3 w-3 text-blue-500" />;
      default:
        return <Info className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="object-preview space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: object.visual?.color || '#3b82f6' }}
            >
              <Box className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {object.displayName || object.name}
                <Badge className={categoryInfo.color}>
                  {categoryInfo.name}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                ID: {object.id || '未设置'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        {object.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {object.description}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            对象类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge className={categoryInfo.color} variant="secondary">
              {categoryInfo.name} ({object.category})
            </Badge>
            <p className="text-sm text-muted-foreground">
              {categoryInfo.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            概览统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{attributeCount}</div>
              <div className="text-sm text-muted-foreground">属性</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{requiredAttributeCount}</div>
              <div className="text-sm text-muted-foreground">必填</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{constraintCount}</div>
              <div className="text-sm text-muted-foreground">约束</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stateCount}</div>
              <div className="text-sm text-muted-foreground">状态</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes */}
      {attributeCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              属性列表
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(object.attributes || {}).map(([attrName, attr]) => (
              <div key={attrName} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{attrName}</span>
                  <Badge variant="outline" className="text-xs">
                    {attr.type}
                  </Badge>
                  {attr.required && (
                    <Badge variant="destructive" className="text-xs">必填</Badge>
                  )}
                  {attr.type === 'reference' && attr.constraints?.references && (
                    <Badge variant="secondary" className="text-xs">
                      → {attr.constraints.references}
                    </Badge>
                  )}
                </div>
                {attr.description && (
                  <span className="text-xs text-muted-foreground max-w-xs truncate">
                    {attr.description}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* State Machine */}
      {object.stateMachine && stateCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              状态机
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* States */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                状态定义
                <Badge variant="outline">{stateCount} 个状态</Badge>
              </h4>
              <div className="space-y-2">
                {Object.entries(object.stateMachine.states).map(([stateName, stateData]) => {
                  const isInitial = object.stateMachine?.initialState === stateName;
                  const isTerminal = stateData.isTerminal;
                  
                  return (
                    <div key={stateName} className="flex items-center gap-2 p-2 border rounded">
                      <Badge 
                        variant={isInitial ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {isInitial && <Play className="h-3 w-3" />}
                        {isTerminal && <Square className="h-3 w-3" />}
                        {stateName}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {stateData.displayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Transitions */}
            {transitionCount > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  状态转换
                  <Badge variant="outline">{transitionCount} 个转换</Badge>
                </h4>
                <div className="space-y-2">
                  {object.stateMachine.transitions.map((transition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Badge variant="outline" className="text-xs">{transition.from}</Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">{transition.to}</Badge>
                      <span className="text-xs text-muted-foreground">
                        触发: {transition.trigger}
                      </span>
                      {transition.condition && (
                        <span className="text-xs text-muted-foreground">
                          条件: {transition.condition}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Constraints */}
      {constraintCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              业务约束
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(object.constraints || []).map((constraint, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getConstraintIcon(constraint.severity)}
                  <span className="font-medium">{constraint.description}</span>
                  <Badge variant="outline" className="text-xs">
                    {constraint.type}
                  </Badge>
                </div>
                <div className="bg-muted/30 rounded p-2">
                  <code className="text-sm font-mono text-gray-700">
                    {constraint.expression}
                  </code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Visual Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            可视化属性
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: object.visual?.color || '#3b82f6' }}
              ></div>
              <span className="text-sm">
                {object.visual?.color || '#3b82f6'}
              </span>
            </div>
            <div className="text-sm">
              图标: {object.visual?.icon || '未设置'}
            </div>
            <div className="text-sm">
              大小: {object.visual?.size || 'medium'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">JSON 结构预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded p-3 overflow-x-auto">
            <pre className="text-xs font-mono">
              {JSON.stringify({
                id: object.id || 'example_object',
                name: object.name || 'ExampleObject',
                displayName: object.displayName || object.name || '示例对象',
                description: object.description || '对象描述...',
                category: object.category || 'entity',
                attributeCount,
                constraintCount,
                hasStateMachine: !!object.stateMachine,
                visual: object.visual || { color: '#3b82f6', icon: 'circle' }
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ObjectPreview;