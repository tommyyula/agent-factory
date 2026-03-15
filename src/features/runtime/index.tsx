import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw,
  GitBranch, ArrowLeft, Cpu, BarChart3, Coins, Users, ScrollText, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runtimeDB, agentDB } from '@/shared/services/database';
import { useRuntimeStore } from '@/stores/runtimeStore';
import { AgentDeployment, TokenUsageSnapshot, CollaboratingAgent } from '@/shared/types/runtime.types';
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

interface APLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

const AP_LOG_MESSAGES: Array<{ level: 'INFO' | 'WARN' | 'ERROR'; message: string }> = [
  { level: 'INFO', message: 'Processing invoice #INV-2026-0342 from Vendor: Acme Corp' },
  { level: 'INFO', message: 'Vendor payment approved: $4,500 → General Ledger' },
  { level: 'WARN', message: 'Duplicate invoice detected: INV-2026-0300, flagging for review' },
  { level: 'INFO', message: 'Currency conversion: EUR 3,200 → USD 3,456.00' },
  { level: 'INFO', message: 'Payment batch #BATCH-0089 submitted for approval' },
  { level: 'INFO', message: 'Invoice #INV-2026-0351 matched to PO-8821, 3-way match passed' },
  { level: 'WARN', message: 'Invoice amount exceeds PO tolerance by 2.1% — escalating' },
  { level: 'INFO', message: 'Vendor Global Supplies payment terms verified: Net-30' },
  { level: 'ERROR', message: 'Payment gateway timeout for BATCH-0088 — retrying (1/3)' },
  { level: 'INFO', message: 'Early payment discount captured: $180 on INV-2026-0340' },
  { level: 'INFO', message: 'Audit trail entry recorded for transaction TXN-2026-7712' },
  { level: 'INFO', message: 'GL posting completed: Debit AP $12,340 / Credit Cash $12,340' }
];

function formatNow(): string {
  return new Date().toLocaleString('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).replace(',', '');
}

function DeploymentDetail() {
  const { t } = useTranslation();
  const { deploymentId } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState<AgentDeployment | null>(null);
  const [loading, setLoading] = useState(true);

  // Token usage state
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenHistory, setTokenHistory] = useState<TokenUsageSnapshot[]>([]);
  const tokenBudget = 1000000;

  // AP logs state
  const [apLogs, setApLogs] = useState<APLogEntry[]>([]);
  const logIndexRef = useRef(0);

  const tokenIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          if (deploymentData.tokenUsage) {
            setTokensUsed(deploymentData.tokenUsage.tokensUsed);
            setTokenHistory(deploymentData.tokenUsage.history);
          }
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
              cpu: { usage: 45, limit: 2000, requests: 500 },
              memory: {
                usage: 2147483648,
                limit: 4294967296,
                requests: 1073741824
              },
              storage: { usage: 21474836480, limit: 53687091200 },
              network: { inbound: 1048576, outbound: 524288 }
            },
            health: {
              status: 'healthy',
              checks: [
                { name: 'API Health', status: 'pass', message: 'All endpoints responding', duration: 120 }
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
            updatedAt: new Date(),
            tokenUsage: {
              tokensUsed: 234500,
              tokenBudget: 1000000,
              tokensRemaining: 765500,
              costEstimate: 0.47,
              lastUpdated: new Date(),
              history: []
            },
            collaboration: {
              upstreamAgents: [
                {
                  id: 'collab-invoice-ocr',
                  name: 'Invoice OCR Agent',
                  role: 'upstream',
                  status: 'running',
                  description: 'Extracts structured data from invoice PDFs and images',
                  dataFlow: 'Invoice documents → parsed invoice data'
                },
                {
                  id: 'collab-vendor-mgmt',
                  name: 'Vendor Management Agent',
                  role: 'upstream',
                  status: 'running',
                  description: 'Maintains vendor master data and payment terms',
                  dataFlow: 'Vendor profiles → payment approval rules'
                }
              ],
              downstreamAgents: [
                {
                  id: 'collab-gl',
                  name: 'General Ledger Agent',
                  role: 'downstream',
                  status: 'running',
                  description: 'Posts approved payments to the general ledger',
                  dataFlow: 'Approved payment entries → GL postings'
                },
                {
                  id: 'collab-audit',
                  name: 'Audit Trail Agent',
                  role: 'downstream',
                  status: 'idle',
                  description: 'Records all AP transactions for compliance and audit',
                  dataFlow: 'Transaction events → immutable audit log'
                }
              ]
            }
          };
          setDeployment(mockDeployment);
          setTokensUsed(234500);
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

  // Start intervals after deployment is loaded
  useEffect(() => {
    if (!deployment) return;

    // Token usage simulation every 2.5s
    tokenIntervalRef.current = setInterval(() => {
      const increment = Math.floor(Math.random() * 800) + 200;
      setTokensUsed(prev => {
        const next = Math.min(prev + increment, tokenBudget);
        return next;
      });
      setTokenHistory(prev => {
        const snapshot: TokenUsageSnapshot = {
          timestamp: new Date(),
          tokensUsed: increment,
          requestCount: Math.floor(Math.random() * 5) + 1
        };
        return [...prev.slice(-9), snapshot];
      });
    }, 2500);

    // AP log simulation every 3s
    const initialLogs: APLogEntry[] = [
      {
        id: 'log-init-1',
        timestamp: formatNow(),
        level: 'INFO',
        message: 'Accounts Payable Agent initialized and ready'
      },
      {
        id: 'log-init-2',
        timestamp: formatNow(),
        level: 'INFO',
        message: 'Connected to upstream: Invoice OCR Agent, Vendor Management Agent'
      }
    ];
    setApLogs(initialLogs);

    logIntervalRef.current = setInterval(() => {
      const entry = AP_LOG_MESSAGES[logIndexRef.current % AP_LOG_MESSAGES.length];
      logIndexRef.current += 1;
      const newLog: APLogEntry = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: formatNow(),
        level: entry.level,
        message: entry.message
      };
      setApLogs(prev => [...prev.slice(-49), newLog]);
    }, 3000);

    return () => {
      if (tokenIntervalRef.current) clearInterval(tokenIntervalRef.current);
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, [deployment]);

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

  const getStatusVariant = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
      case 'running': return 'default';
      case 'stopped': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getAgentStatusDot = (status: CollaboratingAgent['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
    }
  };

  const getAgentStatusLabel = (status: CollaboratingAgent['status']) => {
    switch (status) {
      case 'running': return t('runtime.collaboration.status.running', 'Running');
      case 'idle': return t('runtime.collaboration.status.idle', 'Idle');
      case 'error': return t('runtime.collaboration.status.error', 'Error');
    }
  };

  const tokensRemaining = tokenBudget - tokensUsed;
  const budgetPercent = Math.min((tokensUsed / tokenBudget) * 100, 100);
  const costEstimate = (tokensUsed / 1000000) * 2.0; // $2 per 1M tokens

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
            <p className="text-xs text-muted-foreground">
              {Math.round(deployment.metrics.errorRate * deployment.metrics.requestCount)} total errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="mr-2 h-4 w-4" />
            {t('runtime.detail.tabs.overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="tokens">
            <Coins className="mr-2 h-4 w-4" />
            {t('runtime.tokenUsage.title', 'Token Usage')}
          </TabsTrigger>
          <TabsTrigger value="collaboration">
            <Users className="mr-2 h-4 w-4" />
            {t('runtime.collaboration.title', 'Collaboration')}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ScrollText className="mr-2 h-4 w-4" />
            {t('runtime.apLogs.title', 'AP Logs')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - logs placeholder */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { timestamp: '2026-03-15 10:35:42', level: 'INFO', message: 'Agent deployment started successfully' },
                      { timestamp: '2026-03-15 10:35:45', level: 'INFO', message: 'Loading skill configurations...' },
                      { timestamp: '2026-03-15 10:35:48', level: 'INFO', message: 'All skills loaded successfully' },
                      { timestamp: '2026-03-15 10:35:50', level: 'INFO', message: 'Agent ready to accept requests' },
                      { timestamp: '2026-03-15 10:36:12', level: 'DEBUG', message: 'Processing data analysis request...' },
                      { timestamp: '2026-03-15 10:36:15', level: 'INFO', message: 'Data analysis completed in 245ms' }
                    ].map((log, index) => (
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
        </TabsContent>

        {/* Token Usage Tab */}
        <TabsContent value="tokens">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('runtime.tokenUsage.tokensUsed', 'Tokens Used')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokensUsed.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('runtime.tokenUsage.tokenBudget', 'Token Budget')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokenBudget.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('runtime.tokenUsage.tokensRemaining', 'Tokens Remaining')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${tokensRemaining < tokenBudget * 0.1 ? 'text-red-500' : tokensRemaining < tokenBudget * 0.3 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {tokensRemaining.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('runtime.tokenUsage.costEstimate', 'Cost Estimate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${costEstimate.toFixed(4)}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('runtime.tokenUsage.budgetConsumed', 'Budget Consumed')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{tokensUsed.toLocaleString()} / {tokenBudget.toLocaleString()} tokens</span>
                <span className="font-medium">{budgetPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    budgetPercent > 90 ? 'bg-red-500' : budgetPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('runtime.tokenUsage.recentActivity', 'Recent Activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              {tokenHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity recorded yet. Updates every 2.5s.</p>
              ) : (
                <div className="space-y-2">
                  {[...tokenHistory].reverse().slice(0, 8).map((snapshot, index) => (
                    <div key={index} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                      <span className="text-muted-foreground font-mono text-xs">
                        {new Date(snapshot.timestamp).toLocaleTimeString()}
                      </span>
                      <span>+{snapshot.tokensUsed.toLocaleString()} tokens</span>
                      <span className="text-muted-foreground">{snapshot.requestCount} req</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration">
          {deployment.collaboration ? (
            <div className="space-y-6">
              {/* Pipeline Diagram */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('runtime.collaboration.pipeline', 'Data Flow Pipeline')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 flex-wrap py-4">
                    {/* Upstream agents */}
                    <div className="flex flex-col gap-2">
                      {deployment.collaboration.upstreamAgents.map(agent => (
                        <div key={agent.id} className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm font-medium text-center min-w-[140px]">
                          <div className="flex items-center gap-2 justify-center">
                            <span className={`w-2 h-2 rounded-full ${getAgentStatusDot(agent.status)}`} />
                            {agent.name}
                          </div>
                        </div>
                      ))}
                    </div>

                    <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />

                    {/* Current AP agent */}
                    <div className="px-4 py-3 rounded-xl bg-primary/10 border-2 border-primary text-sm font-bold text-center min-w-[160px]">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {deployment.instanceName}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">AP Agent</div>
                    </div>

                    <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />

                    {/* Downstream agents */}
                    <div className="flex flex-col gap-2">
                      {deployment.collaboration.downstreamAgents.map(agent => (
                        <div key={agent.id} className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm font-medium text-center min-w-[140px]">
                          <div className="flex items-center gap-2 justify-center">
                            <span className={`w-2 h-2 rounded-full ${getAgentStatusDot(agent.status)}`} />
                            {agent.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upstream Agents */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      {t('runtime.collaboration.upstream', 'Upstream Agents')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {deployment.collaboration.upstreamAgents.map(agent => (
                      <div key={agent.id} className="p-3 rounded-lg border space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{agent.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${getAgentStatusDot(agent.status)}`} />
                            <span className="text-xs text-muted-foreground">{getAgentStatusLabel(agent.status)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">{agent.dataFlow}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Downstream Agents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                      {t('runtime.collaboration.downstream', 'Downstream Agents')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {deployment.collaboration.downstreamAgents.map(agent => (
                      <div key={agent.id} className="p-3 rounded-lg border space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{agent.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${getAgentStatusDot(agent.status)}`} />
                            <span className="text-xs text-muted-foreground">{getAgentStatusLabel(agent.status)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-mono">{agent.dataFlow}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No collaboration configuration for this deployment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AP Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('runtime.apLogs.title', 'Accounts Payable Job Log')}</CardTitle>
                <Badge variant="secondary">{apLogs.length} entries</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {[...apLogs].reverse().map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 text-sm font-mono py-1 border-b last:border-0">
                    <span className="text-muted-foreground text-xs whitespace-nowrap">{log.timestamp}</span>
                    <Badge
                      variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'outline'}
                      className="text-[10px] px-1.5 shrink-0"
                    >
                      {log.level}
                    </Badge>
                    <span className={`text-xs ${log.level === 'ERROR' ? 'text-red-600 dark:text-red-400' : log.level === 'WARN' ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function needed inside the component
function getAgentStatusDot(status: CollaboratingAgent['status']): string {
  switch (status) {
    case 'running': return 'bg-green-500';
    case 'idle': return 'bg-yellow-500';
    case 'error': return 'bg-red-500';
  }
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

      {/* AP Showcase banner if any AP deployments exist */}
      {deployments.filter(d => d.collaboration?.upstreamAgents?.length).length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">AP Showcase Deployments</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {deployments.filter(d => d.collaboration?.upstreamAgents?.length).length} deployment(s) with collaboration config
                </p>
              </div>
              <div className="flex gap-2">
                {deployments.filter(d => d.collaboration?.upstreamAgents?.length).slice(0, 3).map(d => (
                  <Button key={d.id} size="sm" variant="outline" onClick={() => window.location.href = `/runtime/agent/${d.id}`}>
                    {d.instanceName}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
