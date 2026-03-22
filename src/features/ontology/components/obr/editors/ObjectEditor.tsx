import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, X, Plus, Trash2, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { OBRObject, ValidationError, OBRAttribute, OBRStateMachine, OBRConstraint } from '@/shared/types/obr.types';
import { obrValidationService } from '@/shared/services/obr-validation.service';
import { useOBRStore } from '@/stores/obr.store';

import { AttributeEditor } from './AttributeEditor';
import { StateMachineEditor } from './StateMachineEditor';
import { ConstraintEditor } from './ConstraintEditor';
import { ObjectPreview } from './ObjectPreview';

interface ObjectEditorProps {
  objectId?: string;
  initialData?: Partial<OBRObject>;
  onSave: (object: OBRObject) => Promise<void>;
  onCancel: () => void;
  readonly?: boolean;
}

export function ObjectEditor({ 
  objectId, 
  initialData, 
  onSave, 
  onCancel, 
  readonly = false 
}: ObjectEditorProps) {
  // State management
  const [object, setObject] = useState<Partial<OBRObject>>(initialData || {
    id: '',
    name: '',
    displayName: '',
    description: '',
    category: 'entity',
    attributes: {},
    constraints: [],
    visual: { color: '#3b82f6', icon: 'circle' }
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'attributes' | 'states' | 'constraints' | 'preview'>('basic');
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store hooks
  const { currentBlueprint, updateObject } = useOBRStore();

  // Load existing object if objectId provided
  useEffect(() => {
    if (objectId && currentBlueprint) {
      const existingObject = currentBlueprint.objects.find(o => o.id === objectId);
      if (existingObject) {
        setObject(existingObject);
      }
    }
  }, [objectId, currentBlueprint]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [object]);

  // Real-time validation
  useEffect(() => {
    const validateObject = async () => {
      if (!object.name || !object.id) return; // Skip validation for incomplete objects
      
      setIsValidating(true);
      try {
        // Create a minimal blueprint for validation
        const testBlueprint = {
          $schema: 'https://schemas.agent-factory.com/obr/v1.0.0' as const,
          metadata: {
            id: 'test',
            name: 'Test Blueprint',
            version: '1.0.0',
            domain: 'Test',
            description: 'Test Blueprint',
            author: 'Test',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            checksum: 'test'
          },
          objects: [object as OBRObject],
          behaviors: [],
          rules: [],
          scenarios: [],
          links: []
        };

        const result = await obrValidationService.validateBlueprint(testBlueprint);
        const objectErrors = result.errors.filter(error => 
          error.path.startsWith('objects[0]')
        );
        setValidationErrors(objectErrors);
      } catch (error) {
        console.error('Validation error:', error);
      }
      setIsValidating(false);
    };

    const debounceTimer = setTimeout(validateObject, 500);
    return () => clearTimeout(debounceTimer);
  }, [object]);

  // Handle basic field changes
  const handleBasicFieldChange = useCallback((field: keyof OBRObject, value: any) => {
    setObject(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle attribute changes
  const handleAttributeAdd = useCallback((attributeName: string, attribute: OBRAttribute) => {
    setObject(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attributeName]: attribute }
    }));
  }, []);

  const handleAttributeUpdate = useCallback((attributeName: string, attribute: OBRAttribute) => {
    setObject(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attributeName]: attribute }
    }));
  }, []);

  const handleAttributeRemove = useCallback((attributeName: string) => {
    setObject(prev => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[attributeName];
      return { ...prev, attributes: newAttributes };
    });
  }, []);

  // Handle state machine changes
  const handleStateMachineChange = useCallback((stateMachine?: OBRStateMachine) => {
    setObject(prev => ({ ...prev, stateMachine }));
  }, []);

  // Handle constraint changes
  const handleConstraintsChange = useCallback((constraints: OBRConstraint[]) => {
    setObject(prev => ({ ...prev, constraints }));
  }, []);

  // Handle visual property changes
  const handleVisualChange = useCallback((field: string, value: any) => {
    setObject(prev => ({
      ...prev,
      visual: { ...prev.visual, [field]: value }
    }));
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
    setObject(prev => ({
      ...prev,
      name,
      id: prev.id || generateId(name)
    }));
  }, [generateId]);

  // Save object
  const handleSave = useCallback(async () => {
    try {
      // Final validation
      setIsValidating(true);
      
      if (!object.id || !object.name) {
        throw new Error('ID and name are required');
      }

      // Ensure required fields
      const completeObject: OBRObject = {
        id: object.id,
        name: object.name,
        displayName: object.displayName || object.name,
        description: object.description || '',
        category: object.category || 'entity',
        attributes: object.attributes || {},
        constraints: object.constraints || [],
        visual: object.visual || { color: '#3b82f6', icon: 'circle' },
        ...(object.stateMachine && { stateMachine: object.stateMachine })
      };

      await onSave(completeObject);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
      // You might want to show an error toast here
    }
    setIsValidating(false);
  }, [object, onSave]);

  // Check if form is valid
  const isValid = object.id && object.name && validationErrors.filter(e => e.severity === 'error').length === 0;
  const hasErrors = validationErrors.some(e => e.severity === 'error');
  const hasWarnings = validationErrors.some(e => e.severity === 'warning');

  return (
    <div className="object-editor space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                对象编辑器
                {hasUnsavedChanges && <Badge variant="secondary">未保存</Badge>}
                {isValidating && <Badge variant="outline">验证中...</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {objectId ? '编辑现有对象' : '创建新业务对象'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasErrors && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.filter(e => e.severity === 'error').length} 错误
                </Badge>
              )}
              {hasWarnings && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.filter(e => e.severity === 'warning').length} 警告
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="attributes">属性</TabsTrigger>
              <TabsTrigger value="states">状态机</TabsTrigger>
              <TabsTrigger value="constraints">约束</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="object-name">名称 *</Label>
                  <Input
                    id="object-name"
                    placeholder="例如: Employee"
                    value={object.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="object-id">标识符</Label>
                  <Input
                    id="object-id"
                    placeholder="自动生成或手动输入"
                    value={object.id || ''}
                    onChange={(e) => handleBasicFieldChange('id', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="object-display-name">显示名称</Label>
                  <Input
                    id="object-display-name"
                    placeholder="例如: 员工"
                    value={object.displayName || ''}
                    onChange={(e) => handleBasicFieldChange('displayName', e.target.value)}
                    disabled={readonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="object-category">对象类型 *</Label>
                  <Select
                    value={object.category || 'entity'}
                    onValueChange={(value) => handleBasicFieldChange('category', value)}
                    disabled={readonly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择对象类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity">实体 (Entity)</SelectItem>
                      <SelectItem value="value_object">值对象 (Value Object)</SelectItem>
                      <SelectItem value="aggregate">聚合根 (Aggregate)</SelectItem>
                      <SelectItem value="service">服务 (Service)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="object-description">描述</Label>
                <Textarea
                  id="object-description"
                  placeholder="详细描述该对象的用途、职责和特征..."
                  value={object.description || ''}
                  onChange={(e) => handleBasicFieldChange('description', e.target.value)}
                  rows={3}
                  disabled={readonly}
                />
              </div>

              {/* Visual Properties */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">可视化属性</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="object-color">颜色</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="object-color"
                        type="color"
                        value={object.visual?.color || '#3b82f6'}
                        onChange={(e) => handleVisualChange('color', e.target.value)}
                        disabled={readonly}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input
                        value={object.visual?.color || '#3b82f6'}
                        onChange={(e) => handleVisualChange('color', e.target.value)}
                        disabled={readonly}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-icon">图标</Label>
                    <Input
                      id="object-icon"
                      placeholder="例如: user, building"
                      value={object.visual?.icon || ''}
                      onChange={(e) => handleVisualChange('icon', e.target.value)}
                      disabled={readonly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-size">大小</Label>
                    <Select
                      value={object.visual?.size || 'medium'}
                      onValueChange={(value) => handleVisualChange('size', value)}
                      disabled={readonly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择大小" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">小</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="large">大</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attributes">
              <AttributeEditor
                attributes={object.attributes || {}}
                onAdd={handleAttributeAdd}
                onUpdate={handleAttributeUpdate}
                onRemove={handleAttributeRemove}
                readonly={readonly}
              />
            </TabsContent>

            <TabsContent value="states">
              <StateMachineEditor
                stateMachine={object.stateMachine}
                onChange={handleStateMachineChange}
                readonly={readonly}
              />
            </TabsContent>

            <TabsContent value="constraints">
              <ConstraintEditor
                constraints={object.constraints || []}
                onChange={handleConstraintsChange}
                readonly={readonly}
              />
            </TabsContent>

            <TabsContent value="preview">
              <ObjectPreview object={object as OBRObject} />
            </TabsContent>
          </Tabs>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-sm">验证问题</h4>
              {validationErrors.map((error, index) => (
                <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">{error.path}:</span> {error.message}
                    {error.suggestions && (
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {error.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

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

export default ObjectEditor;