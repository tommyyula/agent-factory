import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw, GitBranch, ArrowLeft, Cpu, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runtimeDB, agentDB } from '@/shared/services/database';
import { useRuntimeStore } from '@/stores/runtimeStore';
import { AgentDeployment } from '@/shared/types/runtime.types';
import { AgentPipeline } from '@/shared/types/pipeline.types';
import { DeploymentList } from './components/DeploymentList';
import { JobLog } from './components/JobLog';
import { MessageBoard } from './components/MessageBoard';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export function RuntimeOverview() {
  return (
    <Routes>
      <Route index element={<RuntimeHome />} />
      <Route path="agents" element={<DeploymentList />} />
      <Route path="agent/:deploymentId" element={<DeploymentDetail />} />
      <Route path="jobs" element={<JobLog />} />
      <Route path="messages" element={<MessageBoard />} />
    </Routes>
  );
}

function DeploymentDetail() {
  const { t } = useTranslation();
  const { deploymentId } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState<AgentDeployment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeployment = async () => {
      if (!deploymentId) {
        navigate('/runtime');
        return;
      }

      try {
        const deploymentData = await runtimeDB.deployments.get(deploymentId);
        if (deploymentData) {
          setDeployment(deploymentData);
        } else {
          // Create mock deployment data for demonstration
          const mockDeployment: AgentDeployment = {
            id: deploymentId,
            agentId: 'agent-001',
            instanceName: 'DataAnalyzer Pro Instance',
            status: 'running',
            environment: 'production',
            version: '2.1.0',
            configuration: {
              instanceName: 'DataAnalyzer Pro Instance',
              parameters: {},
              resources: { cpu: '2 vCPU', memory: '4GB', storage: '10GB' },
              environment: 'production'
            },
            resources: {
              cpu: {
                usage: 45,
                limit: 2000,
                requests: 500
              },
              memory: {
                usage: 2147483648, // 2GB in bytes
                limit: 4294967296, // 4GB in bytes
                requests: 1073741824 // 1GB in bytes
              },
              storage: {
                usage: 21474836480, // 20GB in bytes
                limit: 53687091200 // 50GB in bytes
              },
              network: {
                inbound: 1048576, // 1MB/s
                outbound: 524288 // 0.5MB/s
              }
            },
            health: {
              status: 'healthy',
              checks: [
                {
                  name: 'API Health',
                  status: 'pass',
                  message: 'All endpoints responding',
                  duration: 120
                }
              ],
              lastChecked: new Date()
            },
            metrics: {
              requestCount: 15420,
              averageResponseTime: 245,
              errorRate: 0.02,
              throughput: 12.5,
              uptime: 99.98,
              timestamps: [],
              values: []
            },
            lastActivity: new Date(),
            createdAt: new Date('2026-03-10'),
            updatedAt: new Date()
          };
          setDeployment(mockDeployment);
        }
      } catch (error) {
        console.error('Failed to load deployment:', error);
        navigate('/runtime');
      } finally {
        setLoading(false);
      }
    };

    loadDeployment();
  }, [deploymentId, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!deployment) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'stopped': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  // Mock logs data
  const mockLogs = [
    { timestamp: '2026-03-15 10:35:42', level: 'INFO', message: 'Agent deployment started successfully' },
    { timestamp: '2026-03-15 10:35:45', level: 'INFO', message: 'Loading skill configurations...' },
    { timestamp: '2026-03-15 10:35:48', level: 'INFO', message: 'All skills loaded successfully' },
    { timestamp: '2026-03-15 10:35:50', level: 'INFO', message: 'Agent ready to accept requests' },
    { timestamp: '2026-03-15 10:36:12', level: 'DEBUG', message: 'Processing data analysis request...' },
    { timestamp: '2026-03-15 10:36:15', level: 'INFO', message: 'Data analysis completed in 245ms' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/runtime')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{deployment.instanceName}</h1>
          <p className="text-muted-foreground flex items-center space-x-2">
            <Badge variant={getStatusVariant(deployment.status)}>
              {deployment.status}
            </Badge>
            <span>•</span>
            <span>{deployment.environment}</span>
            <span>•</span>
            <span>v{deployment.version}</span>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployment.metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployment.metrics.requestCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployment.metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(deployment.metrics.errorRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(deployment.metrics.errorRate * deployment.metrics.requestCount)} total errors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockLogs.map((log, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm font-mono">
                    <span className="text-muted-foreground">{log.timestamp}</span>
                    <Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'outline'}>
                      {log.level}
                    </Badge>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resource Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-4 w-4" />
                <span>Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">CPU</span>
                <span className="font-medium">{deployment.resources.cpu.usage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Memory</span>
                <span className="font-medium">{(deployment.resources.memory.usage / 1073741824).toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Storage</span>
                <span className="font-medium">{(deployment.resources.storage.usage / 1073741824).toFixed(1)} GB</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Stop Deployment
              </Button>
              <Button className="w-full" variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>
              <Button className="w-full" variant="outline">
                <Square className="mr-2 h-4 w-4" />
                View Config
              </Button>
            </CardContent>
          </Card>

          {/* Deployment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{deployment.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{deployment.updatedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agent ID</span>
                <span className="font-mono">{deployment.agentId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RuntimeHome() {
  const { t } = useTranslation();
  const { deployments, tasks, setDeployments, setTasks, loading, setLoading } = useRuntimeStore();

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
          <h1 className="text-3xl font-bold tracking-tight">{t('runtime.title')}</h1>
          <p className="text-muted-foreground">{t('runtime.subtitle')}</p>
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
        <h1 className="text-3xl font-bold tracking-tight">{t('runtime.title')}</h1>
        <p className="text-muted-foreground">
          {t('runtime.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deployments">{t('runtime.tabs.deployments')}</TabsTrigger>
          <TabsTrigger value="jobs">{t('runtime.tabs.jobs')}</TabsTrigger>
          <TabsTrigger value="messages">{t('runtime.tabs.messages')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('runtime.tabs.metrics')}</TabsTrigger>
          <TabsTrigger value="pipelines">
            <GitBranch className="mr-2 h-4 w-4" />
            {t('runtime.tabs.pipelines', 'Pipelines')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          <DeploymentList />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <JobLog />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <MessageBoard />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <PipelinesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const mockPipelines: AgentPipeline[] = [
  {
    id: 'pipeline-001',
    name: 'WMS Order Fulfillment Pipeline',
    description: 'End-to-end order processing from receipt to dispatch with QA gates',
    phases: [
      { id: 'phase-1', name: 'Order Intake', agentId: 'agent-001', order: 1, inputs: [{ name: 'order_data', type: 'object', required: true }], outputs: [{ name: 'parsed_order', type: 'object' }] },
      { id: 'phase-2', name: 'Inventory Check', agentId: 'agent-006', order: 2, inputs: [{ name: 'parsed_order', type: 'object', required: true }], outputs: [{ name: 'availability_report', type: 'object' }] },
      { id: 'phase-3', name: 'Pick Optimization', agentId: 'agent-006', order: 3, inputs: [{ name: 'availability_report', type: 'object', required: true }], outputs: [{ name: 'pick_list', type: 'array' }] },
      { id: 'phase-4', name: 'QA Verification', agentId: 'agent-005', order: 4, inputs: [{ name: 'pick_list', type: 'array', required: true }], outputs: [{ name: 'verified_order', type: 'object' }], qualityCheck: { agentId: 'agent-005', requireEvidence: true, passThreshold: 95 } },
      { id: 'phase-5', name: 'Dispatch', agentId: 'agent-020', order: 5, inputs: [{ name: 'verified_order', type: 'object', required: true }], outputs: [{ name: 'shipment_id', type: 'string' }] },
    ],
    qualityGates: [
      { afterPhase: 'phase-2', agentId: 'agent-005', criteria: ['All SKUs available or substituted', 'No stockout risk'], blocking: true },
      { afterPhase: 'phase-4', agentId: 'agent-005', criteria: ['Pick accuracy >= 99.5%', 'Packing weight within tolerance'], blocking: true },
    ],
    retryPolicy: { maxAttempts: 3, escalationAgent: 'agent-008' },
    memoryConfig: { enabled: true, tagStrategy: 'phase', persistence: 'project' },
  },
  {
    id: 'pipeline-002',
    name: 'Security Incident Response Pipeline',
    description: 'Automated threat detection, triage, and remediation orchestration',
    phases: [
      { id: 'phase-1', name: 'Threat Detection', agentId: 'agent-005', order: 1, inputs: [{ name: 'telemetry_stream', type: 'stream', required: true }], outputs: [{ name: 'threat_signal', type: 'object' }] },
      { id: 'phase-2', name: 'Triage & Classification', agentId: 'agent-009', order: 2, inputs: [{ name: 'threat_signal', type: 'object', required: true }], outputs: [{ name: 'incident_report', type: 'object' }] },
      { id: 'phase-3', name: 'Impact Analysis', agentId: 'agent-009', order: 3, inputs: [{ name: 'incident_report', type: 'object', required: true }], outputs: [{ name: 'impact_assessment', type: 'object' }] },
      { id: 'phase-4', name: 'Remediation', agentId: 'agent-009', order: 4, inputs: [{ name: 'impact_assessment', type: 'object', required: true }], outputs: [{ name: 'remediation_log', type: 'object' }], qualityCheck: { agentId: 'agent-005', requireEvidence: true, passThreshold: 100 } },
    ],
    qualityGates: [
      { afterPhase: 'phase-2', agentId: 'agent-009', criteria: ['Threat classified with confidence >= 90%', 'Severity level assigned'], blocking: false },
      { afterPhase: 'phase-4', agentId: 'agent-005', criteria: ['Threat fully contained', 'No lateral movement detected', 'Evidence preserved'], blocking: true },
    ],
    retryPolicy: { maxAttempts: 2, escalationAgent: 'agent-008' },
    memoryConfig: { enabled: true, tagStrategy: 'project', persistence: 'permanent' },
  },
  {
    id: 'pipeline-003',
    name: 'Content Marketing Pipeline',
    description: 'AI-driven content creation from ideation to social publishing',
    phases: [
      { id: 'phase-1', name: 'Trend Research', agentId: 'agent-021', order: 1, inputs: [{ name: 'topic_brief', type: 'string', required: true }], outputs: [{ name: 'trend_report', type: 'object' }] },
      { id: 'phase-2', name: 'Content Generation', agentId: 'agent-018', order: 2, inputs: [{ name: 'trend_report', type: 'object', required: true }], outputs: [{ name: 'content_draft', type: 'string' }] },
      { id: 'phase-3', name: 'Image Creation', agentId: 'agent-018', order: 3, inputs: [{ name: 'content_draft', type: 'string', required: true }], outputs: [{ name: 'visual_assets', type: 'array' }] },
      { id: 'phase-4', name: 'Publishing', agentId: 'agent-021', order: 4, inputs: [{ name: 'content_draft', type: 'string', required: true }, { name: 'visual_assets', type: 'array', required: true }], outputs: [{ name: 'published_urls', type: 'array' }] },
    ],
    qualityGates: [
      { afterPhase: 'phase-2', agentId: 'agent-014', criteria: ['Content passes brand guidelines', 'SEO score >= 70', 'No factual errors detected'], blocking: true },
    ],
    retryPolicy: { maxAttempts: 3 },
    memoryConfig: { enabled: true, tagStrategy: 'agent', persistence: 'session' },
  },
];

function PipelinesPanel() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('runtime.pipelines.title', 'Agent Pipelines')}</h3>
          <p className="text-sm text-muted-foreground">{t('runtime.pipelines.subtitle', 'Multi-agent orchestration workflows with quality gates')}</p>
        </div>
        <Badge variant="secondary">{mockPipelines.length} {t('runtime.pipelines.active', 'active')}</Badge>
      </div>

      <div className="grid gap-4">
        {mockPipelines.map((pipeline) => (
          <Card key={pipeline.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary" />
                    {pipeline.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{pipeline.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={pipeline.memoryConfig.enabled ? 'default' : 'secondary'}>
                    {pipeline.memoryConfig.persistence} memory
                  </Badge>
                  <Badge variant="outline">
                    retry x{pipeline.retryPolicy.maxAttempts}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('runtime.pipelines.phases', 'PHASES')}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {pipeline.phases.map((phase, idx) => (
                    <React.Fragment key={phase.id}>
                      <div className="flex h-8 items-center rounded-full bg-primary/10 border border-primary/30 px-3 text-xs font-medium gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                          {phase.order}
                        </span>
                        {phase.name}
                      </div>
                      {idx < pipeline.phases.length - 1 && (
                        pipeline.qualityGates.find(g => g.afterPhase === phase.id) ? (
                          <div className="flex items-center gap-0.5 text-yellow-600">
                            <div className="h-px w-3 bg-yellow-400" />
                            <CheckCircle className="h-3.5 w-3.5" />
                            <div className="h-px w-3 bg-yellow-400" />
                          </div>
                        ) : (
                          <div className="h-px w-8 bg-border" />
                        )
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {pipeline.qualityGates.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{t('runtime.pipelines.qualityGates', 'QUALITY GATES')}</p>
                  <div className="space-y-1">
                    {pipeline.qualityGates.map((gate, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Badge variant={gate.blocking ? 'destructive' : 'secondary'} className="text-[10px] px-1.5">
                          {gate.blocking ? 'BLOCKING' : 'ADVISORY'}
                        </Badge>
                        <span className="text-muted-foreground">after {pipeline.phases.find(p => p.id === gate.afterPhase)?.name}:</span>
                        <span>{gate.criteria[0]}{gate.criteria.length > 1 ? ` +${gate.criteria.length - 1} more` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
