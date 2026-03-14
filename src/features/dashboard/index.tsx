import React, { useEffect, useState } from 'react';
import { BarChart3, Bot, Activity, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ontologyDB, agentDB, runtimeDB } from '@/shared/services/database';

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  systemHealth: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalTasks: 0,
    systemHealth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get agent statistics
        const totalAgents = await agentDB.agents.count();
        const publishedAgents = await agentDB.agents.where('status').equals('published').count();
        
        // Get runtime statistics
        const runningDeployments = await runtimeDB.deployments.where('status').equals('running').count();
        const totalTasks = await runtimeDB.jobs.count();
        
        // Calculate system health (mock calculation)
        const healthyDeployments = await runtimeDB.deployments.where('health.status').equals('healthy').count();
        const totalDeployments = await runtimeDB.deployments.count();
        const systemHealth = totalDeployments > 0 ? Math.round((healthyDeployments / totalDeployments) * 100) : 100;

        setStats({
          totalAgents,
          activeAgents: runningDeployments,
          totalTasks,
          systemHealth
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Agent Factory Platform 全局概览
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Agent Factory Platform 全局概览
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agent 总数
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> 本月新增
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              活跃实例
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              正在运行中
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              任务执行
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              系统健康度
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}%</div>
            <p className="text-xs">
              <Badge variant={stats.systemHealth > 90 ? "success" : stats.systemHealth > 70 ? "warning" : "destructive"}>
                {stats.systemHealth > 90 ? "优秀" : stats.systemHealth > 70 ? "良好" : "需要关注"}
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>5层架构概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">AaaS 服务层</span>
                <Badge variant="success">运行中</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">Runtime 运行层</span>
                <Badge variant="success">健康</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">Factory 工厂层</span>
                <Badge variant="success">活跃</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">Ontology 知识层</span>
                <Badge variant="warning">同步中</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="font-medium">Data Sources 数据源</span>
                <Badge variant="success">连接正常</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Email Triage Agent 部署成功</p>
                  <p className="text-xs text-muted-foreground">2 分钟前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">WMS 知识域更新完成</p>
                  <p className="text-xs text-muted-foreground">15 分钟前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Knowledge Base Agent 检测到性能问题</p>
                  <p className="text-xs text-muted-foreground">1 小时前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Calendar Brief Agent 创建完成</p>
                  <p className="text-xs text-muted-foreground">3 小时前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}