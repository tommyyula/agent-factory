import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Check, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { OBRConstraint } from '@/shared/types/obr.types';

interface ConstraintEditorProps {
  constraints: OBRConstraint[];
  onChange: (constraints: OBRConstraint[]) => void;
  readonly?: boolean;
}

const CONSTRAINT_TEMPLATES = [
  {
    name: '非空约束',
    type: 'invariant' as const,
    expression: 'value != null && value !== ""',
    description: '字段值不能为空',
    severity: 'error' as const
  },
  {
    name: '邮箱格式',
    type: 'invariant' as const,
    expression: 'value.match(/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/)',
    description: '必须是有效的邮箱格式',
    severity: 'error' as const
  },
  {
    name: '手机号格式',
    type: 'invariant' as const,
    expression: 'value.match(/^1[3-9]\\d{9}$/)',
    description: '必须是有效的手机号格式',
    severity: 'error' as const
  },
  {
    name: '身份证号',
    type: 'invariant' as const,
    expression: 'value.match(/^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/',
    description: '必须是有效的身份证号格式',
    severity: 'error' as const
  },
  {
    name: '数值范围',
    type: 'invariant' as const,
    expression: 'value >= 0 && value <= 100',
    description: '值必须在0-100之间',
    severity: 'error' as const
  },
  {
    name: '日期有效性',
    type: 'invariant' as const,
    expression: 'new Date(value) > new Date()',
    description: '日期必须是未来时间',
    severity: 'warning' as const
  },
  {
    name: '字符串长度',
    type: 'invariant' as const,
    expression: 'value.length >= 6 && value.length <= 20',
    description: '字符串长度必须在6-20字符之间',
    severity: 'error' as const
  }
];

export function ConstraintEditor({
  constraints,
  onChange,
  readonly = false
}: ConstraintEditorProps) {
  const [editingConstraint, setEditingConstraint] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newConstraint, setNewConstraint] = useState<Partial<OBRConstraint>>({
    id: '',
    type: 'invariant',
    expression: '',
    description: '',
    severity: 'error'
  });

  // Generate unique constraint ID
  const generateConstraintId = useCallback((description: string) => {
    const baseId = description.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 20);
    
    let id = baseId;
    let counter = 1;
    
    while (constraints.some(c => c.id === id)) {
      id = `${baseId}_${counter}`;
      counter++;
    }
    
    return id;
  }, [constraints]);

  // Handle add constraint
  const handleAddConstraint = useCallback(() => {
    if (newConstraint.expression && newConstraint.description) {
      const constraint: OBRConstraint = {
        id: newConstraint.id || generateConstraintId(newConstraint.description),
        type: newConstraint.type as OBRConstraint['type'],
        expression: newConstraint.expression,
        description: newConstraint.description,
        severity: newConstraint.severity as OBRConstraint['severity']
      };

      onChange([...constraints, constraint]);
      
      // Reset form
      setNewConstraint({
        id: '',
        type: 'invariant',
        expression: '',
        description: '',
        severity: 'error'
      });
      setIsAddingNew(false);
    }
  }, [newConstraint, constraints, onChange, generateConstraintId]);

  // Handle update constraint
  const handleUpdateConstraint = useCallback((index: number, updatedConstraint: OBRConstraint) => {
    const newConstraints = [...constraints];
    newConstraints[index] = updatedConstraint;
    onChange(newConstraints);
    setEditingConstraint(null);
  }, [constraints, onChange]);

  // Handle remove constraint
  const handleRemoveConstraint = useCallback((index: number) => {
    const newConstraints = constraints.filter((_, i) => i !== index);
    onChange(newConstraints);
  }, [constraints, onChange]);

  // Handle apply template
  const handleApplyTemplate = useCallback((template: typeof CONSTRAINT_TEMPLATES[0]) => {
    const constraint: OBRConstraint = {
      id: generateConstraintId(template.name),
      type: template.type,
      expression: template.expression,
      description: template.description,
      severity: template.severity
    };

    onChange([...constraints, constraint]);
    setShowTemplates(false);
  }, [constraints, onChange, generateConstraintId]);

  // Get severity icon and color
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Constraint row component
  const ConstraintRow = ({ constraint, index, isEditing }: {
    constraint: OBRConstraint;
    index: number;
    isEditing: boolean;
  }) => {
    const [editingConstraintData, setEditingConstraintData] = useState<OBRConstraint>(constraint);

    if (isEditing) {
      return (
        <Card className="border-primary">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">编辑约束: {constraint.id}</h4>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUpdateConstraint(index, editingConstraintData)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingConstraint(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">约束类型</Label>
                <Select
                  value={editingConstraintData.type}
                  onValueChange={(value) => setEditingConstraintData({ 
                    ...editingConstraintData, 
                    type: value as OBRConstraint['type']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invariant">不变式 (Invariant)</SelectItem>
                    <SelectItem value="precondition">前置条件 (Precondition)</SelectItem>
                    <SelectItem value="postcondition">后置条件 (Postcondition)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">严重级别</Label>
                <Select
                  value={editingConstraintData.severity}
                  onValueChange={(value) => setEditingConstraintData({ 
                    ...editingConstraintData, 
                    severity: value as OBRConstraint['severity']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">错误 (Error)</SelectItem>
                    <SelectItem value="warning">警告 (Warning)</SelectItem>
                    <SelectItem value="info">信息 (Info)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">约束表达式</Label>
              <Textarea
                value={editingConstraintData.expression}
                onChange={(e) => setEditingConstraintData({ 
                  ...editingConstraintData, 
                  expression: e.target.value 
                })}
                placeholder="例如: value >= 0 && value <= 100"
                rows={3}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">描述</Label>
              <Textarea
                value={editingConstraintData.description}
                onChange={(e) => setEditingConstraintData({ 
                  ...editingConstraintData, 
                  description: e.target.value 
                })}
                placeholder="约束的详细说明..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={`p-4 border rounded-lg ${getSeverityColor(constraint.severity)}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {getSeverityIcon(constraint.severity)}
              <span className="font-medium">{constraint.description}</span>
              <Badge variant="outline" className="text-xs">
                {constraint.type}
              </Badge>
            </div>
            
            <div className="bg-white/50 rounded p-2 border">
              <code className="text-sm font-mono text-gray-700">
                {constraint.expression}
              </code>
            </div>
          </div>

          {!readonly && (
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingConstraint(constraint.id)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveConstraint(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="constraint-editor space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">业务约束</h3>
          <p className="text-sm text-muted-foreground">
            定义对象的业务规则和验证逻辑
          </p>
        </div>
        {!readonly && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTemplates(true)}
              size="sm"
              variant="outline"
            >
              选择模板
            </Button>
            <Button
              onClick={() => setIsAddingNew(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加约束
            </Button>
          </div>
        )}
      </div>

      {/* Constraint types info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>约束类型说明:</strong>
          <ul className="mt-1 space-y-1">
            <li>• <strong>不变式 (Invariant):</strong> 对象在任何时候都必须满足的条件</li>
            <li>• <strong>前置条件 (Precondition):</strong> 操作执行前必须满足的条件</li>
            <li>• <strong>后置条件 (Postcondition):</strong> 操作执行后必须满足的条件</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Constraints list */}
      <div className="space-y-3">
        {constraints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>暂无业务约束</p>
            <p className="text-sm">添加约束来确保数据的完整性和业务逻辑的正确性</p>
          </div>
        ) : (
          constraints.map((constraint, index) => (
            <ConstraintRow
              key={constraint.id}
              constraint={constraint}
              index={index}
              isEditing={editingConstraint === constraint.id}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {constraints.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>共 {constraints.length} 个约束</span>
            <span>{constraints.filter(c => c.severity === 'error').length} 个错误级别</span>
            <span>{constraints.filter(c => c.severity === 'warning').length} 个警告级别</span>
            <span>{constraints.filter(c => c.type === 'invariant').length} 个不变式</span>
          </div>
        </div>
      )}

      {/* Add constraint dialog */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加新约束</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>约束ID</Label>
              <Input
                value={newConstraint.id || ''}
                onChange={(e) => setNewConstraint({ ...newConstraint, id: e.target.value })}
                placeholder="留空自动生成"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>约束类型 *</Label>
                <Select
                  value={newConstraint.type}
                  onValueChange={(value) => setNewConstraint({ 
                    ...newConstraint, 
                    type: value as OBRConstraint['type']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invariant">不变式 (Invariant)</SelectItem>
                    <SelectItem value="precondition">前置条件 (Precondition)</SelectItem>
                    <SelectItem value="postcondition">后置条件 (Postcondition)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>严重级别 *</Label>
                <Select
                  value={newConstraint.severity}
                  onValueChange={(value) => setNewConstraint({ 
                    ...newConstraint, 
                    severity: value as OBRConstraint['severity']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">错误 (Error)</SelectItem>
                    <SelectItem value="warning">警告 (Warning)</SelectItem>
                    <SelectItem value="info">信息 (Info)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>约束表达式 *</Label>
              <Textarea
                value={newConstraint.expression || ''}
                onChange={(e) => setNewConstraint({ ...newConstraint, expression: e.target.value })}
                placeholder="例如: value >= 0 && value <= 100"
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                使用 JavaScript 表达式语法，可引用 value 变量代表字段值
              </p>
            </div>

            <div>
              <Label>描述 *</Label>
              <Textarea
                value={newConstraint.description || ''}
                onChange={(e) => setNewConstraint({ ...newConstraint, description: e.target.value })}
                placeholder="约束的详细说明..."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddConstraint}
                disabled={!newConstraint.expression || !newConstraint.description}
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>约束模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {CONSTRAINT_TEMPLATES.map((template, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleApplyTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        {getSeverityIcon(template.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="bg-muted/30 rounded p-2">
                        <code className="text-xs font-mono">
                          {template.expression}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ConstraintEditor;