import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit3, Check, X, Play, Square, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { OBRStateMachine, OBRStateTransition } from '@/shared/types/obr.types';

interface StateMachineEditorProps {
  stateMachine?: OBRStateMachine;
  onChange: (stateMachine?: OBRStateMachine) => void;
  readonly?: boolean;
}

interface StateDefinition {
  name: string;
  displayName: string;
  description?: string;
  isTerminal?: boolean;
}

export function StateMachineEditor({
  stateMachine,
  onChange,
  readonly = false
}: StateMachineEditorProps) {
  const [isEnabled, setIsEnabled] = useState(!!stateMachine);
  const [editingState, setEditingState] = useState<string | null>(null);
  const [isAddingState, setIsAddingState] = useState(false);
  const [isAddingTransition, setIsAddingTransition] = useState(false);
  const [newState, setNewState] = useState<StateDefinition>({
    name: '',
    displayName: '',
    description: '',
    isTerminal: false
  });
  const [newTransition, setNewTransition] = useState<OBRStateTransition>({
    from: '',
    to: '',
    trigger: '',
    condition: ''
  });

  const currentStateMachine = stateMachine || {
    initialState: '',
    states: {},
    transitions: []
  };

  // Handle enable/disable state machine
  const handleToggleEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    if (enabled && !stateMachine) {
      onChange({
        initialState: '',
        states: {},
        transitions: []
      });
    } else if (!enabled) {
      onChange(undefined);
    }
  }, [stateMachine, onChange]);

  // Handle initial state change
  const handleInitialStateChange = useCallback((initialState: string) => {
    if (stateMachine) {
      onChange({
        ...stateMachine,
        initialState
      });
    }
  }, [stateMachine, onChange]);

  // Handle add new state
  const handleAddState = useCallback(() => {
    if (newState.name.trim() && stateMachine && !stateMachine.states[newState.name]) {
      const updatedStates = {
        ...stateMachine.states,
        [newState.name]: {
          displayName: newState.displayName || newState.name,
          description: newState.description,
          ...(newState.isTerminal && { isTerminal: true })
        }
      };

      onChange({
        ...stateMachine,
        states: updatedStates,
        // Set as initial state if none exists
        initialState: stateMachine.initialState || newState.name
      });

      // Reset form
      setNewState({
        name: '',
        displayName: '',
        description: '',
        isTerminal: false
      });
      setIsAddingState(false);
    }
  }, [newState, stateMachine, onChange]);

  // Handle update state
  const handleUpdateState = useCallback((stateName: string, stateData: any) => {
    if (stateMachine) {
      const updatedStates = {
        ...stateMachine.states,
        [stateName]: stateData
      };

      onChange({
        ...stateMachine,
        states: updatedStates
      });
    }
  }, [stateMachine, onChange]);

  // Handle remove state
  const handleRemoveState = useCallback((stateName: string) => {
    if (stateMachine) {
      const updatedStates = { ...stateMachine.states };
      delete updatedStates[stateName];

      // Remove transitions involving this state
      const updatedTransitions = stateMachine.transitions.filter(
        t => t.from !== stateName && t.to !== stateName
      );

      // Update initial state if it was removed
      const newInitialState = stateMachine.initialState === stateName 
        ? Object.keys(updatedStates)[0] || ''
        : stateMachine.initialState;

      onChange({
        ...stateMachine,
        states: updatedStates,
        transitions: updatedTransitions,
        initialState: newInitialState
      });
    }
  }, [stateMachine, onChange]);

  // Handle add transition
  const handleAddTransition = useCallback(() => {
    if (newTransition.from && newTransition.to && newTransition.trigger && stateMachine) {
      const updatedTransitions = [
        ...stateMachine.transitions,
        { ...newTransition }
      ];

      onChange({
        ...stateMachine,
        transitions: updatedTransitions
      });

      // Reset form
      setNewTransition({
        from: '',
        to: '',
        trigger: '',
        condition: ''
      });
      setIsAddingTransition(false);
    }
  }, [newTransition, stateMachine, onChange]);

  // Handle remove transition
  const handleRemoveTransition = useCallback((index: number) => {
    if (stateMachine) {
      const updatedTransitions = stateMachine.transitions.filter((_, i) => i !== index);
      onChange({
        ...stateMachine,
        transitions: updatedTransitions
      });
    }
  }, [stateMachine, onChange]);

  // Get available states for dropdown
  const stateOptions = useMemo(() => {
    return Object.keys(currentStateMachine.states).map(stateName => ({
      value: stateName,
      label: `${stateName} (${currentStateMachine.states[stateName].displayName})`
    }));
  }, [currentStateMachine.states]);

  // Render state badge
  const renderStateBadge = (stateName: string, stateData: any) => {
    const isInitial = currentStateMachine.initialState === stateName;
    const isTerminal = stateData.isTerminal;

    return (
      <div className="flex items-center gap-2">
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
  };

  // State row component
  const StateRow = ({ stateName, stateData, isEditing }: {
    stateName: string;
    stateData: any;
    isEditing: boolean;
  }) => {
    const [editingStateData, setEditingStateData] = useState(stateData);

    if (isEditing) {
      return (
        <Card className="border-primary">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">编辑状态: {stateName}</h4>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleUpdateState(stateName, editingStateData);
                    setEditingState(null);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingState(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">显示名称</Label>
                <Input
                  value={editingStateData.displayName || ''}
                  onChange={(e) => setEditingStateData({ ...editingStateData, displayName: e.target.value })}
                  placeholder="状态的中文名称"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`terminal-${stateName}`}
                  checked={!!editingStateData.isTerminal}
                  onCheckedChange={(checked) => setEditingStateData({ ...editingStateData, isTerminal: checked === true })}
                />
                <Label htmlFor={`terminal-${stateName}`} className="text-xs">终止状态</Label>
              </div>
            </div>

            <div>
              <Label className="text-xs">描述</Label>
              <Textarea
                value={editingStateData.description || ''}
                onChange={(e) => setEditingStateData({ ...editingStateData, description: e.target.value })}
                placeholder="状态的详细说明..."
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
        <div className="flex flex-col gap-1">
          {renderStateBadge(stateName, stateData)}
          {stateData.description && (
            <p className="text-sm text-muted-foreground ml-0">{stateData.description}</p>
          )}
        </div>

        {!readonly && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingState(stateName)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRemoveState(stateName)}
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
    <div className="state-machine-editor space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleEnabled}
            disabled={readonly}
          />
          <div>
            <h3 className="font-medium">状态机</h3>
            <p className="text-sm text-muted-foreground">
              为对象定义状态和状态转换规则
            </p>
          </div>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-6">
          {/* Initial State Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">初始状态</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={currentStateMachine.initialState}
                onValueChange={handleInitialStateChange}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择初始状态" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* States */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">状态定义</CardTitle>
                {!readonly && (
                  <Button
                    onClick={() => setIsAddingState(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加状态
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.keys(currentStateMachine.states).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>暂无状态定义</p>
                  <p className="text-sm">点击"添加状态"开始创建状态机</p>
                </div>
              ) : (
                Object.entries(currentStateMachine.states).map(([stateName, stateData]) => (
                  <StateRow
                    key={stateName}
                    stateName={stateName}
                    stateData={stateData}
                    isEditing={editingState === stateName}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Transitions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">状态转换</CardTitle>
                {!readonly && stateOptions.length >= 2 && (
                  <Button
                    onClick={() => setIsAddingTransition(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加转换
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentStateMachine.transitions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>暂无状态转换</p>
                  {stateOptions.length >= 2 && (
                    <p className="text-sm">点击"添加转换"定义状态间的转换规则</p>
                  )}
                </div>
              ) : (
                currentStateMachine.transitions.map((transition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{transition.from}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{transition.to}</Badge>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">触发: {transition.trigger}</span>
                        {transition.condition && (
                          <span className="text-xs text-muted-foreground">条件: {transition.condition}</span>
                        )}
                      </div>
                    </div>
                    {!readonly && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveTransition(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span>{Object.keys(currentStateMachine.states).length} 个状态</span>
              <span>{currentStateMachine.transitions.length} 个转换</span>
              <span>{Object.values(currentStateMachine.states).filter(s => s.isTerminal).length} 个终止状态</span>
            </div>
          </div>
        </div>
      )}

      {/* Add State Dialog */}
      <Dialog open={isAddingState} onOpenChange={setIsAddingState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新状态</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>状态名称 *</Label>
              <Input
                value={newState.name}
                onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                placeholder="例如: active, pending, completed"
              />
            </div>

            <div>
              <Label>显示名称</Label>
              <Input
                value={newState.displayName}
                onChange={(e) => setNewState({ ...newState, displayName: e.target.value })}
                placeholder="例如: 激活状态, 待处理, 已完成"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="new-terminal"
                checked={newState.isTerminal}
                onCheckedChange={(checked) => setNewState({ ...newState, isTerminal: checked === true })}
              />
              <Label htmlFor="new-terminal">终止状态</Label>
            </div>

            <div>
              <Label>描述</Label>
              <Textarea
                value={newState.description || ''}
                onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                placeholder="状态的详细说明..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingState(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddState}
                disabled={!newState.name.trim() || !!currentStateMachine.states[newState.name]}
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Transition Dialog */}
      <Dialog open={isAddingTransition} onOpenChange={setIsAddingTransition}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加状态转换</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>起始状态 *</Label>
                <Select
                  value={newTransition.from}
                  onValueChange={(value) => setNewTransition({ ...newTransition, from: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择起始状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>目标状态 *</Label>
                <Select
                  value={newTransition.to}
                  onValueChange={(value) => setNewTransition({ ...newTransition, to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择目标状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>触发行为 *</Label>
              <Input
                value={newTransition.trigger}
                onChange={(e) => setNewTransition({ ...newTransition, trigger: e.target.value })}
                placeholder="例如: activate, suspend, complete"
              />
            </div>

            <div>
              <Label>转换条件</Label>
              <Input
                value={newTransition.condition || ''}
                onChange={(e) => setNewTransition({ ...newTransition, condition: e.target.value })}
                placeholder="例如: user.role === 'admin'"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingTransition(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddTransition}
                disabled={!newTransition.from || !newTransition.to || !newTransition.trigger}
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StateMachineEditor;