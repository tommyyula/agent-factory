import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { OBRAttribute } from '@/shared/types/obr.types';

interface AttributeEditorProps {
  attributes: { [key: string]: OBRAttribute };
  onAdd: (attributeName: string, attribute: OBRAttribute) => void;
  onUpdate: (attributeName: string, attribute: OBRAttribute) => void;
  onRemove: (attributeName: string) => void;
  readonly?: boolean;
}

export function AttributeEditor({
  attributes,
  onAdd,
  onUpdate,
  onRemove,
  readonly = false
}: AttributeEditorProps) {
  const [editingAttribute, setEditingAttribute] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttribute, setNewAttribute] = useState<OBRAttribute>({
    type: 'string',
    required: false,
    description: ''
  });

  // Handle new attribute creation
  const handleAddAttribute = useCallback(() => {
    if (newAttributeName.trim() && !attributes[newAttributeName]) {
      onAdd(newAttributeName, { ...newAttribute });
      setNewAttributeName('');
      setNewAttribute({
        type: 'string',
        required: false,
        description: ''
      });
      setIsAddingNew(false);
    }
  }, [newAttributeName, newAttribute, attributes, onAdd]);

  // Handle attribute update
  const handleUpdateAttribute = useCallback((attrName: string, updatedAttribute: OBRAttribute) => {
    onUpdate(attrName, updatedAttribute);
    setEditingAttribute(null);
  }, [onUpdate]);

  // Get type-specific constraint inputs
  const getConstraintInputs = (attrType: string, constraints: any = {}, onChange: (constraints: any) => void) => {
    switch (attrType) {
      case 'number':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">最小值</Label>
              <Input
                type="number"
                value={constraints.min?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange({ ...constraints, min: value ? Number(value) : undefined });
                }}
                placeholder="无限制"
              />
            </div>
            <div>
              <Label className="text-xs">最大值</Label>
              <Input
                type="number"
                value={constraints.max?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange({ ...constraints, max: value ? Number(value) : undefined });
                }}
                placeholder="无限制"
              />
            </div>
          </div>
        );

      case 'string':
        return (
          <div>
            <Label className="text-xs">正则表达式</Label>
            <Input
              value={constraints.pattern || ''}
              onChange={(e) => onChange({ ...constraints, pattern: e.target.value })}
              placeholder="例如: ^[a-zA-Z0-9]+$"
            />
          </div>
        );

      case 'enum':
        return (
          <div>
            <Label className="text-xs">枚举值 (逗号分隔)</Label>
            <Input
              value={constraints.enum?.join(', ') || ''}
              onChange={(e) => onChange({ ...constraints, enum: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
              placeholder="例如: active, inactive, pending"
            />
          </div>
        );

      case 'reference':
        return (
          <div>
            <Label className="text-xs">引用对象ID</Label>
            <Input
              value={constraints.references || ''}
              onChange={(e) => onChange({ ...constraints, references: e.target.value })}
              placeholder="例如: employee, department"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Render attribute type badge
  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      string: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      boolean: 'bg-purple-100 text-purple-800',
      date: 'bg-orange-100 text-orange-800',
      enum: 'bg-yellow-100 text-yellow-800',
      reference: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`${colors[type] || 'bg-gray-100 text-gray-800'} text-xs`}>
        {type}
      </Badge>
    );
  };

  // Attribute row component
  const AttributeRow = ({ attrName, attribute, isEditing }: { 
    attrName: string; 
    attribute: OBRAttribute; 
    isEditing: boolean; 
  }) => {
    const [editingAttr, setEditingAttr] = useState<OBRAttribute>(attribute);

    if (isEditing) {
      return (
        <Card className="border-primary">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">编辑属性: {attrName}</h4>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUpdateAttribute(attrName, editingAttr)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingAttribute(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">数据类型</Label>
                <Select
                  value={editingAttr.type}
                  onValueChange={(value) => setEditingAttr({ ...editingAttr, type: value as any, constraints: {} })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">文本 (String)</SelectItem>
                    <SelectItem value="number">数字 (Number)</SelectItem>
                    <SelectItem value="boolean">布尔 (Boolean)</SelectItem>
                    <SelectItem value="date">日期 (Date)</SelectItem>
                    <SelectItem value="enum">枚举 (Enum)</SelectItem>
                    <SelectItem value="reference">引用 (Reference)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${attrName}`}
                  checked={editingAttr.required}
                  onCheckedChange={(checked) => setEditingAttr({ ...editingAttr, required: checked === true })}
                />
                <Label htmlFor={`required-${attrName}`} className="text-xs">必填字段</Label>
              </div>
            </div>

            <div>
              <Label className="text-xs">默认值</Label>
              <Input
                value={editingAttr.defaultValue || ''}
                onChange={(e) => setEditingAttr({ ...editingAttr, defaultValue: e.target.value })}
                placeholder="可选"
              />
            </div>

            {/* Type-specific constraints */}
            {editingAttr.type !== 'boolean' && (
              <div className="space-y-2">
                <Label className="text-xs">约束条件</Label>
                {getConstraintInputs(
                  editingAttr.type, 
                  editingAttr.constraints, 
                  (constraints) => setEditingAttr({ ...editingAttr, constraints })
                )}
              </div>
            )}

            <div>
              <Label className="text-xs">描述</Label>
              <Textarea
                value={editingAttr.description || ''}
                onChange={(e) => setEditingAttr({ ...editingAttr, description: e.target.value })}
                placeholder="属性用途和说明..."
                rows={2}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{attrName}</span>
              {getTypeBadge(attribute.type)}
              {attribute.required && (
                <Badge variant="outline" className="text-xs">必填</Badge>
              )}
            </div>
            {attribute.description && (
              <p className="text-sm text-muted-foreground mt-1">{attribute.description}</p>
            )}
            {attribute.constraints && Object.keys(attribute.constraints).length > 0 && (
              <div className="flex gap-2 mt-1">
                {Object.entries(attribute.constraints).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {!readonly && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingAttribute(attrName)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(attrName)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="attribute-editor space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">对象属性</h3>
          <p className="text-sm text-muted-foreground">
            定义对象的数据字段和属性
          </p>
        </div>
        {!readonly && (
          <Button
            onClick={() => setIsAddingNew(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加属性
          </Button>
        )}
      </div>

      {/* Add new attribute dialog */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加新属性</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>属性名称 *</Label>
              <Input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                placeholder="例如: firstName, age, email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>数据类型 *</Label>
                <Select
                  value={newAttribute.type}
                  onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value as any, constraints: {} })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">文本 (String)</SelectItem>
                    <SelectItem value="number">数字 (Number)</SelectItem>
                    <SelectItem value="boolean">布尔 (Boolean)</SelectItem>
                    <SelectItem value="date">日期 (Date)</SelectItem>
                    <SelectItem value="enum">枚举 (Enum)</SelectItem>
                    <SelectItem value="reference">引用 (Reference)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-required"
                  checked={newAttribute.required}
                  onCheckedChange={(checked) => setNewAttribute({ ...newAttribute, required: checked === true })}
                />
                <Label htmlFor="new-required">必填字段</Label>
              </div>
            </div>

            <div>
              <Label>默认值</Label>
              <Input
                value={newAttribute.defaultValue || ''}
                onChange={(e) => setNewAttribute({ ...newAttribute, defaultValue: e.target.value })}
                placeholder="可选"
              />
            </div>

            {/* Type-specific constraints */}
            {newAttribute.type !== 'boolean' && (
              <div className="space-y-2">
                <Label>约束条件</Label>
                {getConstraintInputs(
                  newAttribute.type, 
                  newAttribute.constraints, 
                  (constraints) => setNewAttribute({ ...newAttribute, constraints })
                )}
              </div>
            )}

            <div>
              <Label>描述</Label>
              <Textarea
                value={newAttribute.description || ''}
                onChange={(e) => setNewAttribute({ ...newAttribute, description: e.target.value })}
                placeholder="属性的用途和说明..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddAttribute}
                disabled={!newAttributeName.trim() || !!attributes[newAttributeName]}
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attributes list */}
      <div className="space-y-2">
        {Object.keys(attributes).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>暂无属性</p>
            <p className="text-sm">点击"添加属性"开始定义对象字段</p>
          </div>
        ) : (
          Object.entries(attributes).map(([attrName, attribute]) => (
            <AttributeRow
              key={attrName}
              attrName={attrName}
              attribute={attribute}
              isEditing={editingAttribute === attrName}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {Object.keys(attributes).length > 0 && (
        <div className="border-t pt-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>共 {Object.keys(attributes).length} 个属性</span>
            <span>{Object.values(attributes).filter(attr => attr.required).length} 个必填</span>
            <span>{Object.values(attributes).filter(attr => attr.type === 'reference').length} 个引用</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttributeEditor;