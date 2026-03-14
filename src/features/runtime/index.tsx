import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runtimeDB, agentDB } from '@/shared/services/database';
import { useRuntimeStore } from '@/stores/runtimeStore';
import { AgentDeployment, JobAgencyTask } from '@/shared/types/runtime.types';

export function RuntimeOverview() {
  return (
    <Routes>
      <Route index element={<RuntimeHome />} />
      <Route path="agents" element={<DeploymentList />} />
      <Route path="agent/:deploymentId" element={<div>Agent Monitor (Coming Soon)</div>} />
      <Route path="jobs" element={<JobAgency />} />
      <Route path="messages" element={<div>Message Board (Coming Soon)</div>} />
    </Routes>
  );
}

function RuntimeHome() {
  const { deployments, tasks, setDeployments, setTasks, loading, setLoading } = useRuntimeStore();
  const [stats, setStats] = useState({
    totalDeployments: 0,
    runningDeployments: 0,
    healthyDeployments: 0,
    totalTasks: 0,
    runningTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    const loadRuntimeData = async () => {
      setLoading(true);
      try {
        const [deploymentsData, tasksData] = await Promise.all([
          runtimeDB.deployments.toArray(),
          runtimeDB.jobs.toArray()
        ]);
        
        setDeployments(deploymentsData);
        setTasks(tasksData);
        
        // Calculate stats
        const runningDeployments = deploymentsData.filter(d => d.status === 'running').length;
        const healthyDeployments = deploymentsData.filter(d => d.health.status === 'healthy').length;
        const runningTasks = tasksData.filter(t => t.status === 'running').length;
        const completedTasks = tasksData.filter(t => t.status === 'completed').length;
        
        setStats({
          totalDeployments: deploymentsData.length,
          runningDeployments,
          healthyDeployments,
          totalTasks: tasksData.length,
          runningTasks,
          completedTasks
        });
      } catch (error) {
        console.error('Failed to load runtime data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRuntimeData();
  }, [setDeployments, setTasks, setLoading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Runtime</h1>
          <p className="text-muted-foreground">运行时监控和管理</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Runtime</h1>
        <p className="text-muted-foreground">
          运行时监控和管理 - {stats.totalDeployments} 个部署实例
        </p>
      </div>

      {/* Runtime Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部署总数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeployments}</div>
            <p className="text-xs text-muted-foreground">
              Agent 实例
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运行中</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.runningDeployments}</div>
            <p className="text-xs text-muted-foreground">
              正常服务
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">健康状态</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalDeployments > 0 
                ? Math.round((stats.healthyDeployments / stats.totalDeployments) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              系统健康度
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务执行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.runningTasks} 个执行中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>部署概览</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deployments.slice(0, 3).map((deployment) => (
              <DeploymentSummary key={deployment.id} deployment={deployment} />
            ))}
            <Button variant="outline" className="w-full">
              查看所有部署
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>任务调度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <TaskSummary key={task.id} task={task} />
            ))}
            <Button variant="outline" className="w-full">
              查看任务队列
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeploymentList() {
  const { deployments, loading, startAgent, stopAgent, pauseAgent, restartAgent } = useRuntimeStore();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'stopped': return <Square className="h-4 w-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '运行中';
      case 'paused': return '已暂停';
      case 'stopped': return '已停止';
      case 'error': return '错误';
      case 'deploying': return '部署中';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">部署管理</h2>
        <p className="text-muted-foreground">
          管理和监控所有 Agent 部署实例
        </p>
      </div>

      <div className="space-y-4">
        {deployments.map((deployment) => (
          <Card key={deployment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <h3 className="font-semibold">{deployment.instanceName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {deployment.environment} • v{deployment.version}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant={getStatusVariant(deployment.status)}>
                    {getStatusText(deployment.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm">
                    <div>CPU: {deployment.resources.cpu.usage}%</div>
                    <div>内存: {Math.round(deployment.resources.memory.usage / 1024 / 1024)}MB</div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {deployment.status === 'stopped' && (
                      <Button size="icon" variant="outline" onClick={() => startAgent(deployment.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {deployment.status === 'running' && (
                      <Button size="icon" variant="outline" onClick={() => pauseAgent(deployment.id)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {deployment.status !== 'stopped' && (
                      <Button size="icon" variant="outline" onClick={() => stopAgent(deployment.id)}>
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="outline" onClick={() => restartAgent(deployment.id)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function JobAgency() {
  const { tasks } = useRuntimeStore();
  
  const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'default';
      case 'failed': return 'destructive';
      case 'queued': return 'secondary';
      default: return 'outline';
    }
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'queued': return '排队中';
      case 'assigned': return '已分配';
      case 'running': return '执行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">任务调度</h2>
        <p className="text-muted-foreground">
          Job Agency 任务队列和调度管理
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{task.name}</h3>
                    <Badge variant={getTaskStatusVariant(task.status)}>
                      {getTaskStatusText(task.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>优先级: {task.priority}</span>
                    <span>类型: {task.type}</span>
                    {task.assignedAgent && <span>执行者: {task.assignedAgent}</span>}
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  {task.completedAt ? (
                    <div>完成: {new Date(task.completedAt).toLocaleString('zh-CN')}</div>
                  ) : task.startedAt ? (
                    <div>开始: {new Date(task.startedAt).toLocaleString('zh-CN')}</div>
                  ) : (
                    <div>创建: {new Date(task.metadata.creator).toLocaleString('zh-CN')}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface DeploymentSummaryProps {
  deployment: AgentDeployment;
}

function DeploymentSummary({ deployment }: DeploymentSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(deployment.status).replace('text-', 'bg-')}`} />
        <div>
          <p className="font-medium text-sm">{deployment.instanceName}</p>
          <p className="text-xs text-muted-foreground">
            {deployment.environment}
          </p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {deployment.resources.cpu.usage}% CPU
      </div>
    </div>
  );
}

interface TaskSummaryProps {
  task: JobAgencyTask;
}

function TaskSummary({ task }: TaskSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'running': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status).replace('text-', 'bg-')}`} />
        <div>
          <p className="font-medium text-sm">{task.name}</p>
          <p className="text-xs text-muted-foreground">
            {task.priority} 优先级
          </p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {task.status}
      </div>
    </div>
  );
}