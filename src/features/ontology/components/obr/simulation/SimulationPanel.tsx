import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Info,
  Users,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  OBRScenario,
  SimulationStep,
  SimulationResult,
  StepExecutionResult,
  RuleExecutionResult
} from '@/shared/types/obr.types';
import { useOBRStore } from '@/stores/obr.store';
import { OBR_DOMAINS, getDomain, getDomainIds, DomainId } from '@/data/obr-domains';
import { SimulationTimeline } from './SimulationTimeline';

interface SimulationPanelProps {
  readonly?: boolean;
}

export function SimulationPanel({ readonly = false }: SimulationPanelProps) {
  // Get scenarioId from URL params (which could include domain info)
  const { scenarioId } = useParams<{ scenarioId?: string }>();
  
  // Store hooks
  const { 
    currentBlueprint,
    simulationState,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    executeNextStep,
    resetSimulation
  } = useOBRStore();

  // Local state
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId | ''>('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepResult, setCurrentStepResult] = useState<StepExecutionResult | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showDetails, setShowDetails] = useState(true);

  // Load domain data on mount or when domain selection changes
  useEffect(() => {
    if (selectedDomainId) {
      const blueprint = getDomain(selectedDomainId);
      useOBRStore.setState({ currentBlueprint: blueprint });
    }
  }, [selectedDomainId]);

  // Auto-select first domain if none selected and no blueprint loaded
  useEffect(() => {
    if (!selectedDomainId && !currentBlueprint) {
      const domainIds = getDomainIds();
      if (domainIds.length > 0) {
        setSelectedDomainId(domainIds[0]);
      }
    }
  }, [selectedDomainId, currentBlueprint]);

  // Available scenarios
  const availableScenarios = currentBlueprint?.scenarios || [];
  
  // Current scenario
  const currentScenario = availableScenarios.find(s => s.id === simulationState.activeScenario);
  
  // Current step
  const currentStep = currentScenario?.steps.find(s => s.id === simulationState.currentStep);

  // Add log entry
  const addLogEntry = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    setExecutionLog(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  }, []);

  // Start simulation
  const handleStartSimulation = useCallback(async () => {
    if (!selectedScenarioId) {
      addLogEntry('请先选择一个场景', 'warning');
      return;
    }

    try {
      setExecutionLog([]);
      addLogEntry('开始场景模拟', 'info');
      
      await startSimulation(selectedScenarioId);
      
      const scenario = availableScenarios.find(s => s.id === selectedScenarioId);
      if (scenario) {
        addLogEntry(`启动场景: ${scenario.displayName || scenario.name}`, 'success');
        addLogEntry(`参与者: ${scenario.actors.map(a => a.name).join(', ')}`, 'info');
        // Auto-execute first step after brief delay
        setTimeout(() => {
          handleExecuteNextStep();
        }, 500);
      }
    } catch (error) {
      addLogEntry(`启动失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
    }
  }, [selectedScenarioId, startSimulation, availableScenarios, addLogEntry]);

  // Pause simulation
  const handlePauseSimulation = useCallback(() => {
    pauseSimulation();
    addLogEntry('暂停模拟', 'info');
  }, [pauseSimulation, addLogEntry]);

  // Stop simulation
  const handleStopSimulation = useCallback(() => {
    stopSimulation();
    setCurrentStepResult(null);
    addLogEntry('停止模拟', 'info');
  }, [stopSimulation, addLogEntry]);

  // Execute next step
  const handleExecuteNextStep = useCallback(async () => {
    if (!currentStep) {
      addLogEntry('没有可执行的步骤', 'warning');
      return;
    }

    setIsExecuting(true);
    addLogEntry(`执行步骤: ${currentStep.name}`, 'info');

    try {
      // Simulate step execution with delay based on speed
      const delay = {
        slow: 2000,
        normal: 1000,
        fast: 500
      }[simulationSpeed];

      await new Promise(resolve => setTimeout(resolve, delay));

      // Mock execution result
      const mockResult: StepExecutionResult = {
        success: Math.random() > 0.2, // 80% success rate
        stepId: currentStep.id,
        executionTime: delay,
        newContext: { stepCompleted: currentStep.id },
        stateChanges: {},
        ruleValidations: [],
        nextSteps: Array.isArray(currentStep.next) ? currentStep.next : currentStep.next ? [currentStep.next] : [],
        duration: delay
      };

      // Add some mock rule validations
      if (currentBlueprint?.rules) {
        mockResult.ruleValidations = currentBlueprint.rules.slice(0, 2).map(rule => ({
          ruleId: rule.id,
          passed: Math.random() > 0.1, // 90% pass rate
          message: `规则 ${rule.displayName || rule.name} 验证`,
          executionTime: 50
        }));
      }

      setCurrentStepResult(mockResult);

      if (mockResult.success) {
        addLogEntry(`步骤执行成功`, 'success');
        if (mockResult.ruleValidations) {
          mockResult.ruleValidations.forEach(rv => {
            addLogEntry(
              `规则验证: ${rv.ruleId} - ${rv.passed ? '通过' : '失败'}`,
              rv.passed ? 'success' : 'error'
            );
          });
        }
      } else {
        addLogEntry(`步骤执行失败: ${mockResult.error || '未知错误'}`, 'error');
      }

      // Auto-advance to next step
      if (mockResult.success) {
        const delay2 = { slow: 1500, normal: 800, fast: 300 }[simulationSpeed];
        setTimeout(async () => {
          await executeNextStep();
          // Check if simulation ended
          const state = useOBRStore.getState().simulationState;
          if (!state.isRunning) {
            addLogEntry('场景执行完成 ✅', 'success');
          }
        }, delay2);
      }

    } catch (error) {
      addLogEntry(`执行错误: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
      setCurrentStepResult({
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        executionTime: 0
      });
    }

    setIsExecuting(false);
  }, [currentStep, simulationSpeed, currentBlueprint, addLogEntry]);

  // Reset simulation
  const handleResetSimulation = useCallback(() => {
    resetSimulation();
    setExecutionLog([]);
    setCurrentStepResult(null);
    addLogEntry('重置模拟', 'info');
  }, [resetSimulation, addLogEntry]);

  // Calculate progress
  const calculateProgress = useCallback(() => {
    if (!currentScenario || !simulationState.executionHistory) return 0;
    const totalSteps = currentScenario.steps.length;
    const completedSteps = simulationState.executionHistory.length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  }, [currentScenario, simulationState.executionHistory]);

  const progress = calculateProgress();

  // No blueprint available
  if (!currentBlueprint) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">请选择一个业务领域以使用模拟功能</p>
          <Select 
            value={selectedDomainId} 
            onValueChange={(value) => setSelectedDomainId(value as DomainId)}
          >
            <SelectTrigger className="max-w-xs mx-auto">
              <SelectValue placeholder="选择业务领域" />
            </SelectTrigger>
            <SelectContent>
              {getDomainIds().map(domainId => {
                const domain = getDomain(domainId);
                return (
                  <SelectItem key={domainId} value={domainId}>
                    <div className="flex items-center gap-2">
                      <span>{domain.metadata.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {domain.scenarios.length} 场景
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="simulation-panel space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              场景模拟器
            </CardTitle>
            <div className="flex items-center gap-2">
              {simulationState.isRunning && (
                <Badge variant="secondary" className="animate-pulse">
                  运行中
                </Badge>
              )}
              {currentScenario && (
                <Badge variant="outline">
                  {currentScenario.displayName || currentScenario.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Domain and Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">选择领域</label>
              <Select 
                value={selectedDomainId} 
                onValueChange={(value) => setSelectedDomainId(value as DomainId)}
                disabled={simulationState.isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择业务领域" />
                </SelectTrigger>
                <SelectContent>
                  {getDomainIds().map(domainId => {
                    const domain = getDomain(domainId);
                    return (
                      <SelectItem key={domainId} value={domainId}>
                        <div className="flex items-center gap-2">
                          <span>{domain.metadata.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {domain.scenarios.length} 场景
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">选择场景</label>
              <Select 
                value={selectedScenarioId} 
                onValueChange={setSelectedScenarioId}
                disabled={simulationState.isRunning || !currentBlueprint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择要模拟的场景" />
                </SelectTrigger>
                <SelectContent>
                  {availableScenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center gap-2">
                        <span>{scenario.displayName || scenario.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {scenario.steps.length} 步骤
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">执行速度</label>
              <Select 
                value={simulationSpeed} 
                onValueChange={(value) => setSimulationSpeed(value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">慢速 (2秒/步)</SelectItem>
                  <SelectItem value="normal">正常 (1秒/步)</SelectItem>
                  <SelectItem value="fast">快速 (0.5秒/步)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">进度</label>
              <div className="space-y-1">
                <Progress value={progress} />
                <div className="text-xs text-muted-foreground text-center">
                  {Math.round(progress)}% 完成
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {!simulationState.isRunning ? (
              <Button 
                onClick={handleStartSimulation}
                disabled={!selectedScenarioId || readonly}
              >
                <Play className="h-4 w-4 mr-2" />
                开始模拟
              </Button>
            ) : (
              <Button onClick={handlePauseSimulation} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                暂停
              </Button>
            )}

            <Button 
              onClick={handleExecuteNextStep}
              disabled={!simulationState.isRunning || isExecuting || readonly}
              variant="outline"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              {isExecuting ? '执行中...' : '单步执行'}
            </Button>

            <Button 
              onClick={handleStopSimulation}
              disabled={!simulationState.isRunning}
              variant="outline"
            >
              <Square className="h-4 w-4 mr-2" />
              停止
            </Button>

            <Button 
              onClick={handleResetSimulation}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>

            <div className="flex-1" />

            <Button 
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
            >
              {showDetails ? '隐藏详情' : '显示详情'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Info */}
      {currentStep && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              当前步骤
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{currentStep.name}</h3>
                <p className="text-sm text-muted-foreground">
                  类型: {currentStep.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  步骤 {currentScenario?.steps.findIndex(s => s.id === currentStep.id)! + 1} / {currentScenario?.steps.length}
                </Badge>
              </div>
            </div>

            {/* Step Details */}
            {showDetails && (
              <div className="space-y-3">
                {currentStep.task && (
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-medium text-sm mb-2">任务配置</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="text-muted-foreground">行为:</span> {currentStep.task.behaviorId}</div>
                      {currentStep.task.actorId && (
                        <div><span className="text-muted-foreground">执行者:</span> {currentStep.task.actorId}</div>
                      )}
                      {currentStep.task.timeout && (
                        <div><span className="text-muted-foreground">超时:</span> {currentStep.task.timeout}ms</div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep.decision && (
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-medium text-sm mb-2">决策配置</h4>
                    <div className="text-sm">
                      <div><span className="text-muted-foreground">条件:</span> {currentStep.decision.condition}</div>
                      <div><span className="text-muted-foreground">分支:</span> {currentStep.decision.branches.length} 个</div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {currentStep.next && currentStep.next.length > 0 && (
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-medium text-sm mb-2">下一步</h4>
                    <div className="flex gap-1">
                      {(Array.isArray(currentStep.next) ? currentStep.next : [currentStep.next]).map(nextId => {
                        const nextStep = currentScenario?.steps.find(s => s.id === nextId);
                        return (
                          <Badge key={nextId} variant="outline" className="text-xs">
                            {nextStep?.name || nextId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Current Step Result */}
            {currentStepResult && (
              <div className="space-y-3 border-t pt-3">
                <h4 className="font-medium text-sm">执行结果</h4>
                <Alert variant={currentStepResult.success ? 'success' : 'destructive'}>
                  {currentStepResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {currentStepResult.success ? '执行成功' : `执行失败: ${currentStepResult.error}`}
                    {currentStepResult.executionTime && (
                      <span className="ml-2 text-muted-foreground">
                        (耗时: {currentStepResult.executionTime}ms)
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                {/* Rule Validations */}
                {currentStepResult.ruleValidations && currentStepResult.ruleValidations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-xs">规则验证结果</h5>
                    {currentStepResult.ruleValidations.map((rv, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 rounded bg-muted">
                        <span>{rv.ruleId}</span>
                        <Badge variant={rv.passed ? 'success' : 'destructive'} className="text-xs">
                          {rv.passed ? '通过' : '失败'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {currentScenario && (
        <SimulationTimeline
          scenario={currentScenario}
          currentStepId={simulationState.currentStep}
          executionHistory={simulationState.executionHistory}
          onStepSelect={(stepId) => {
            // This could allow jumping to specific steps in the future
            console.log('Step selected:', stepId);
          }}
        />
      )}

      {/* Execution Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              执行日志
            </CardTitle>
            <Button 
              onClick={() => setExecutionLog([])} 
              size="sm" 
              variant="outline"
            >
              清空
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {executionLog.length > 0 ? (
                executionLog.map((entry, index) => (
                  <div key={index} className="text-sm font-mono p-2 rounded bg-muted">
                    {entry}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  暂无执行日志
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Scenario Info */}
      {currentScenario && showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              场景信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">场景名称:</span> {currentScenario.displayName || currentScenario.name}
              </div>
              <div>
                <span className="text-muted-foreground">场景类型:</span> {currentScenario.category}
              </div>
              <div>
                <span className="text-muted-foreground">步骤数量:</span> {currentScenario.steps.length}
              </div>
              <div>
                <span className="text-muted-foreground">参与者:</span> {currentScenario.actors.length}
              </div>
            </div>

            {currentScenario.description && (
              <div>
                <span className="text-muted-foreground text-sm">描述:</span>
                <p className="text-sm mt-1">{currentScenario.description}</p>
              </div>
            )}

            {currentScenario.actors.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">参与者列表:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentScenario.actors.map(actor => (
                    <Badge key={actor.id} variant="outline">
                      {actor.name} ({actor.role})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {currentScenario.constraints && (
              <div>
                <span className="text-muted-foreground text-sm">约束条件:</span>
                <div className="mt-1 text-sm space-y-1">
                  {currentScenario.constraints.timeLimit && (
                    <div>时间限制: {(currentScenario.constraints.timeLimit / 1000).toFixed(0)} 秒</div>
                  )}
                  {currentScenario.constraints.businessRules.length > 0 && (
                    <div>业务规则: {currentScenario.constraints.businessRules.length} 项</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SimulationPanel;