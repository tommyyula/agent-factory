import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Square, RotateCcw, GitBranch } from 'lucide-react';
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
      <Route path="agent/:deploymentId" element={<div>Agent Monitor (Coming Soon)</div>} />
      <Route path="jobs" element={<JobLog />} />
      <Route path="messages" element={<div>Message Board (Coming Soon)</div>} />
    </Routes>
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
