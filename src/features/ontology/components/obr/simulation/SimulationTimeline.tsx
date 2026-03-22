import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Square,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  Circle,
  Diamond,
  Split,
  Merge,
  ChevronRight
} from 'lucide-react';

import { 
  OBRScenario, 
  OBRScenarioStep,
  SimulationStep 
} from '@/shared/types/obr.types';

interface SimulationTimelineProps {
  scenario: OBRScenario;
  currentStepId: string | null;
  executionHistory: SimulationStep[];
  onStepSelect?: (stepId: string) => void;
}

export function SimulationTimeline({ 
  scenario, 
  currentStepId, 
  executionHistory,
  onStepSelect 
}: SimulationTimelineProps) {
  
  // Calculate step status
  const getStepStatus = (step: OBRScenarioStep): 'pending' | 'current' | 'completed' | 'failed' => {
    if (step.id === currentStepId) return 'current';
    
    const historyEntry = executionHistory.find(h => h.stepId === step.id);
    if (historyEntry) {
      return historyEntry.result.success ? 'completed' : 'failed';
    }
    
    return 'pending';
  };

  // Get step icon
  const getStepIcon = (step: OBRScenarioStep) => {
    const iconMap = {
      start: Play,
      end: Square,
      task: Zap,
      decision: Diamond,
      parallel: Split,
      merge: Merge
    };
    return iconMap[step.type] || Circle;
  };

  // Get step color based on status
  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: '#6b7280',    // gray
      current: '#3b82f6',    // blue
      completed: '#22c55e',  // green
      failed: '#ef4444'      // red
    };
    return colorMap[status as keyof typeof colorMap] || colorMap.pending;
  };

  // Get progress percentage
  const progress = useMemo(() => {
    const totalSteps = scenario.steps.length;
    const completedSteps = executionHistory.filter(h => h.result.success).length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  }, [scenario.steps.length, executionHistory]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            执行时间线
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              进度: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Overview */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between items-start">
              {scenario.steps.map((step, index) => {
                const status = getStepStatus(step);
                const IconComponent = getStepIcon(step);
                const color = getStatusColor(status);
                const isClickable = onStepSelect && status !== 'pending';

                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center relative ${
                      isClickable ? 'cursor-pointer hover:opacity-80' : ''
                    }`}
                    style={{ flex: 1, maxWidth: '150px' }}
                    onClick={() => isClickable && onStepSelect!(step.id)}
                  >
                    {/* Step Icon */}
                    <div 
                      className="w-12 h-12 rounded-full border-4 bg-white flex items-center justify-center transition-all duration-300 z-10 relative"
                      style={{ 
                        borderColor: color,
                        backgroundColor: status === 'current' ? color : 'white'
                      }}
                    >
                      <IconComponent 
                        className="h-5 w-5" 
                        style={{ 
                          color: status === 'current' ? 'white' : color 
                        }}
                      />
                      
                      {/* Status indicators */}
                      {status === 'completed' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {status === 'failed' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {status === 'current' && (
                        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="mt-3 text-center space-y-2">
                      <div className="text-sm font-medium">{step.name}</div>
                      
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: color, color }}
                      >
                        {step.type}
                      </Badge>

                      {/* Execution Details */}
                      {status !== 'pending' && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {status === 'current' && (
                            <div className="text-blue-600 font-medium">执行中...</div>
                          )}
                          
                          {status === 'completed' && (
                            <div className="text-green-600">✓ 已完成</div>
                          )}
                          
                          {status === 'failed' && (
                            <div className="text-red-600">✗ 失败</div>
                          )}
                          
                          {/* Execution time */}
                          {(() => {
                            const historyEntry = executionHistory.find(h => h.stepId === step.id);
                            if (historyEntry && historyEntry.duration) {
                              return (
                                <div>耗时: {historyEntry.duration}ms</div>
                              );
                            }
                          })()}
                        </div>
                      )}

                      {/* Step Details for current step */}
                      {status === 'current' && (
                        <div className="text-xs space-y-1 p-2 bg-blue-50 rounded">
                          {step.task && (
                            <div>行为: {step.task.behaviorId}</div>
                          )}
                          {step.decision && (
                            <div>决策: {step.decision.condition}</div>
                          )}
                          {step.parallel && (
                            <div>并行: {step.parallel.branches.length} 分支</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Connection Line to Next Step */}
                    {index < scenario.steps.length - 1 && (
                      <div className="absolute top-6 left-full w-full h-1 flex items-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mr-auto" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Step List */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">步骤详情</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {scenario.steps.map((step, index) => {
                const status = getStepStatus(step);
                const IconComponent = getStepIcon(step);
                const color = getStatusColor(status);
                const historyEntry = executionHistory.find(h => h.stepId === step.id);

                return (
                  <div 
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      status === 'current' ? 'border-blue-500 bg-blue-50' : 'border-muted'
                    }`}
                  >
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <IconComponent 
                        className="h-4 w-4 flex-shrink-0" 
                        style={{ color }}
                      />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">{step.name}</h5>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: color, color }}
                        >
                          {step.type}
                        </Badge>
                      </div>

                      {/* Step Configuration */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        {step.task && (
                          <div>
                            <span className="font-medium">任务:</span> {step.task.behaviorId}
                            {step.task.actorId && (
                              <span className="ml-2">执行者: {step.task.actorId}</span>
                            )}
                          </div>
                        )}
                        {step.decision && (
                          <div>
                            <span className="font-medium">决策条件:</span> {step.decision.condition}
                          </div>
                        )}
                        {step.parallel && (
                          <div>
                            <span className="font-medium">并行执行:</span> {step.parallel.branches.length} 个分支
                          </div>
                        )}

                        {/* Next Steps */}
                        {step.next && step.next.length > 0 && (
                          <div>
                            <span className="font-medium">下一步:</span> {
                              (Array.isArray(step.next) ? step.next : [step.next])
                                .map(nextId => {
                                  const nextStep = scenario.steps.find(s => s.id === nextId);
                                  return nextStep?.name || nextId;
                                })
                                .join(', ')
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Execution Info */}
                    <div className="flex flex-col items-end gap-1 min-w-0">
                      {status === 'completed' && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          完成
                        </Badge>
                      )}
                      {status === 'failed' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          失败
                        </Badge>
                      )}
                      {status === 'current' && (
                        <Badge className="text-xs animate-pulse">
                          <Circle className="h-3 w-3 mr-1 animate-spin" />
                          执行中
                        </Badge>
                      )}
                      {status === 'pending' && (
                        <Badge variant="outline" className="text-xs">
                          等待
                        </Badge>
                      )}

                      {/* Execution Time */}
                      {historyEntry && historyEntry.duration && (
                        <div className="text-xs text-muted-foreground">
                          {historyEntry.duration}ms
                        </div>
                      )}

                      {/* Rule Validation Results */}
                      {historyEntry?.result.ruleValidations && historyEntry.result.ruleValidations.length > 0 && (
                        <div className="text-xs space-y-1">
                          {historyEntry.result.ruleValidations.map((rv, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              {rv.passed ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                              )}
                              <span className="truncate max-w-20" title={rv.ruleId}>
                                {rv.ruleId}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">{scenario.steps.length}</div>
                <div className="text-muted-foreground">总步骤</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">
                  {executionHistory.filter(h => h.result.success).length}
                </div>
                <div className="text-muted-foreground">已完成</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">
                  {executionHistory.filter(h => !h.result.success).length}
                </div>
                <div className="text-muted-foreground">失败</div>
              </div>
              <div className="text-center">
                <div className="font-medium">
                  {executionHistory.length > 0 
                    ? Math.round(executionHistory.reduce((sum, h) => sum + h.duration, 0) / executionHistory.length)
                    : 0
                  }ms
                </div>
                <div className="text-muted-foreground">平均耗时</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SimulationTimeline;