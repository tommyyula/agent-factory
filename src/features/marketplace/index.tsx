import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Star, Download, Filter, Grid, List, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentDB, runtimeDB } from '@/shared/services/database';
import { AgentDefinition } from '@/shared/types/agent.types';
import { AgentDeployment, TokenUsage, CollaborationConfig } from '@/shared/types/runtime.types';
import { AgentDetail } from './components/AgentDetail';
import { simpleAgencyAgents, SimpleAgencyAgent } from '@/data/agency-agents-simple';

export function AgentCatalog() {
  return (
    <Routes>
      <Route index element={<MarketplaceHome />} />
      <Route path="agent/:agentId" element={<AgentDetailWrapper />} />
      <Route path="hire/:agentId" element={<HiringWorkflow />} />
    </Routes>
  );
}

function AgentDetailWrapper() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) {
        navigate('/marketplace');
        return;
      }

      try {
        const agentData = await agentDB.agents.get(agentId);
        if (agentData) {
          setAgent(agentData);
        } else {
          navigate('/marketplace');
        }
      } catch (error) {
        console.error('Failed to load agent:', error);
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [agentId, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <AgentDetail
      agent={agent}
      onBack={() => navigate('/marketplace')}
    />
  );
}

type ResourceTier = 'standard' | 'enhanced' | 'premium';
type ScheduleType = 'continuous' | 'scheduled' | 'event-driven';
type Environment = 'development' | 'staging' | 'production';

interface WizardFormData {
  instanceName: string;
  environment: Environment;
  scheduleType: ScheduleType;
  resourceTier: ResourceTier;
  autoscaling: boolean;
  minReplicas: number;
  maxReplicas: number;
}

const TIER_PRICES: Record<ResourceTier, number> = {
  standard: 10,
  enhanced: 20,
  premium: 30
};

const TIER_SPECS: Record<ResourceTier, { cpu: string; memory: string; storage: string }> = {
  standard: { cpu: '2 vCPU', memory: '4GB', storage: '20GB' },
  enhanced: { cpu: '4 vCPU', memory: '8GB', storage: '40GB' },
  premium: { cpu: '8 vCPU', memory: '16GB', storage: '80GB' }
};

function HiringWorkflow() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentId, setDeploymentId] = useState<string>('');
  const [agent, setAgent] = useState<AgentDefinition | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(true);

  const [formData, setFormData] = useState<WizardFormData>({
    instanceName: '',
    environment: 'production',
    scheduleType: 'continuous',
    resourceTier: 'standard',
    autoscaling: false,
    minReplicas: 1,
    maxReplicas: 3
  });

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;
      try {
        const agentData = await agentDB.agents.get(agentId);
        if (agentData) {
          setAgent(agentData);
          setFormData(prev => ({
            ...prev,
            instanceName: `${agentData.displayName}-Instance`
          }));
        }
      } catch (error) {
        console.error('Failed to load agent for hiring:', error);
      } finally {
        setLoadingAgent(false);
      }
    };
    loadAgent();
  }, [agentId]);

  const stepLabels = [
    t('marketplace.hiring.steps.configure', 'Configure'),
    t('marketplace.hiring.steps.resources', 'Resources'),
    t('marketplace.hiring.steps.payment', 'Payment')
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 -> Deploy
      setIsDeploying(true);
      try {
        const newDeployId = `deploy-${Date.now()}`;
        const tierSpecs = TIER_SPECS[formData.resourceTier];
        const price = TIER_PRICES[formData.resourceTier];

        const tokenUsage: TokenUsage = {
          tokensUsed: 0,
          tokenBudget: 1000000,
          tokensRemaining: 1000000,
          costEstimate: 0,
          lastUpdated: new Date(),
          history: []
        };

        const isAPAgent = agent && (
          agent.displayName.toLowerCase().includes('accounts payable') ||
          agent.displayName.toLowerCase().includes('ap agent') ||
          agent.category.industry === 'FMS'
        );

        const collaboration: CollaborationConfig | undefined = isAPAgent ? {
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
        } : undefined;

        const newDeployment: AgentDeployment = {
          id: newDeployId,
          agentId: agentId || 'unknown',
          instanceName: formData.instanceName,
          status: 'running',
          environment: formData.environment,
          version: agent?.version || '1.0.0',
          configuration: {
            instanceName: formData.instanceName,
            parameters: {},
            resources: tierSpecs,
            environment: formData.environment,
            schedule: {
              type: formData.scheduleType
            }
          },
          resources: {
            cpu: { usage: 32, limit: formData.resourceTier === 'premium' ? 8000 : formData.resourceTier === 'enhanced' ? 4000 : 2000, requests: 500 },
            memory: {
              usage: formData.resourceTier === 'premium' ? 8589934592 : formData.resourceTier === 'enhanced' ? 4294967296 : 2147483648,
              limit: formData.resourceTier === 'premium' ? 17179869184 : formData.resourceTier === 'enhanced' ? 8589934592 : 4294967296,
              requests: 1073741824
            },
            storage: { usage: 1073741824, limit: formData.resourceTier === 'premium' ? 85899345920 : formData.resourceTier === 'enhanced' ? 42949672960 : 21474836480 },
            network: { inbound: 1048576, outbound: 524288 }
          },
          health: {
            status: 'healthy',
            checks: [{ name: 'API Health', status: 'pass', message: 'All endpoints responding', duration: 120 }],
            lastChecked: new Date()
          },
          metrics: {
            requestCount: 0,
            averageResponseTime: 0,
            errorRate: 0,
            throughput: 0,
            uptime: 100,
            timestamps: [],
            values: []
          },
          lastActivity: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          tokenUsage,
          collaboration
        };

        await runtimeDB.deployments.add(newDeployment);
        setDeploymentId(newDeployId);
        setStep(4);
      } catch (error) {
        console.error('Deployment failed:', error);
      } finally {
        setIsDeploying(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/marketplace');
    }
  };

  const selectedPrice = TIER_PRICES[formData.resourceTier];
  const selectedSpecs = TIER_SPECS[formData.resourceTier];

  if (loadingAgent) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/marketplace')}>
        ← {t('marketplace.hiring.success.backToMarketplace', 'Back to Marketplace')}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {t('marketplace.hiring.title', 'Hire Agent')}
            {agent && <span className="text-muted-foreground font-normal ml-2">— {agent.displayName}</span>}
          </CardTitle>

          {step < 4 && (
            <div className="flex items-center space-x-2 mt-4">
              {stepLabels.map((label, index) => {
                const stepNum = index + 1;
                const isCompleted = step > stepNum;
                const isCurrent = step === stepNum;
                return (
                  <React.Fragment key={stepNum}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                      </div>
                      <span className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                      </span>
                    </div>
                    {index < stepLabels.length - 1 && (
                      <div className={`flex-1 h-px ${step > stepNum ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Configuration */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base">
                {t('marketplace.hiring.step1.title', 'Basic Configuration')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {t('marketplace.hiring.step1.instanceName', 'Instance Name')}
                  </label>
                  <input
                    type="text"
                    value={formData.instanceName}
                    onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))}
                    placeholder={t('marketplace.hiring.step1.instanceNamePlaceholder', 'e.g. AP-Agent-Production')}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {t('marketplace.hiring.step1.environment', 'Environment')}
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value as Environment }))}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="development">{t('marketplace.hiring.step1.environments.development', 'Development')}</option>
                    <option value="staging">{t('marketplace.hiring.step1.environments.staging', 'Staging')}</option>
                    <option value="production">{t('marketplace.hiring.step1.environments.production', 'Production')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {t('marketplace.hiring.step1.scheduleType', 'Schedule Type')}
                  </label>
                  <select
                    value={formData.scheduleType}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleType: e.target.value as ScheduleType }))}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="continuous">{t('marketplace.hiring.step1.scheduleTypes.continuous', 'Continuous')}</option>
                    <option value="scheduled">{t('marketplace.hiring.step1.scheduleTypes.scheduled', 'Scheduled')}</option>
                    <option value="event-driven">{t('marketplace.hiring.step1.scheduleTypes.eventDriven', 'Event-Driven')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Resource Configuration */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base">
                {t('marketplace.hiring.step2.title', 'Resource Configuration')}
              </h3>
              <div className="space-y-3">
                <label className="text-sm font-medium block">
                  {t('marketplace.hiring.step2.resourceTier', 'Resource Tier')}
                </label>
                {(['standard', 'enhanced', 'premium'] as ResourceTier[]).map((tier) => (
                  <div
                    key={tier}
                    onClick={() => setFormData(prev => ({ ...prev, resourceTier: tier }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.resourceTier === tier
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.resourceTier === tier ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {formData.resourceTier === tier && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{tier}</div>
                          <div className="text-xs text-muted-foreground">
                            {TIER_SPECS[tier].cpu} / {TIER_SPECS[tier].memory} RAM / {TIER_SPECS[tier].storage} Storage
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">${TIER_PRICES[tier]}/mo</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('marketplace.hiring.step2.autoscaling', 'Autoscaling')}
                  </label>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, autoscaling: !prev.autoscaling }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.autoscaling ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.autoscaling ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {formData.autoscaling && (
                  <div className="grid grid-cols-2 gap-4 pl-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t('marketplace.hiring.step2.minReplicas', 'Min Replicas')}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={formData.maxReplicas}
                        value={formData.minReplicas}
                        onChange={(e) => setFormData(prev => ({ ...prev, minReplicas: parseInt(e.target.value) || 1 }))}
                        className="w-full p-2 border border-input rounded-md bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t('marketplace.hiring.step2.maxReplicas', 'Max Replicas')}
                      </label>
                      <input
                        type="number"
                        min={formData.minReplicas}
                        max={20}
                        value={formData.maxReplicas}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxReplicas: parseInt(e.target.value) || 3 }))}
                        className="w-full p-2 border border-input rounded-md bg-background text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base">
                {t('marketplace.hiring.step3.title', 'Payment Confirmation')}
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">
                  {t('marketplace.hiring.step3.summary', 'Deployment Summary')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent</span>
                    <span className="font-medium">{agent?.displayName || agentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('marketplace.hiring.step1.instanceName', 'Instance Name')}</span>
                    <span className="font-medium font-mono">{formData.instanceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('marketplace.hiring.step1.environment', 'Environment')}</span>
                    <Badge variant="outline" className="capitalize">{formData.environment}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('marketplace.hiring.step1.scheduleType', 'Schedule')}</span>
                    <span className="capitalize">{formData.scheduleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource Tier</span>
                    <span className="capitalize font-medium">{formData.resourceTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Specs</span>
                    <span>{selectedSpecs.cpu} / {selectedSpecs.memory} / {selectedSpecs.storage}</span>
                  </div>
                  {formData.autoscaling && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Replicas</span>
                      <span>{formData.minReplicas} – {formData.maxReplicas} (auto)</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold">
                      {t('marketplace.hiring.step3.monthlyPrice', 'Monthly Price')}
                    </span>
<span className="text-xl font-bold text-primary">${selectedPrice}{t('marketplace.hiring.success.monthlyPrice', '/月')}</span>
                  </div>
                </div>
              </div>
              {isDeploying && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Deploying agent to runtime environment...</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {t('marketplace.hiring.success.title', 'Deployment Successful!')}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t('marketplace.hiring.success.message', 'Agent has been deployed to the runtime environment')}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">
                  {t('marketplace.hiring.success.deploymentId', 'Deployment ID')}:
                </span>
                <span className="ml-2 font-mono font-medium">{deploymentId}</span>
              </div>
              <div className="flex space-x-3 justify-center pt-2">
                <Button onClick={() => navigate(`/runtime/agent/${deploymentId}`)}>
                  {t('marketplace.hiring.success.monitorRuntime', 'Monitor Runtime')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/marketplace')}>
                  {t('marketplace.hiring.success.backToMarketplace', 'Back to Marketplace')}
                </Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack} disabled={isDeploying}>
                {step === 1
                  ? t('common.cancel', 'Cancel')
                  : t('common.back', 'Back')}
              </Button>
              <Button
                onClick={handleNext}
                disabled={isDeploying || (step === 1 && !formData.instanceName.trim())}
              >
                {isDeploying
                  ? 'Deploying...'
                  : step === 3
                  ? t('marketplace.hiring.step3.confirmDeploy', 'Confirm & Deploy')
                  : t('common.next', 'Next')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MarketplaceHome() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  // Convert agency agents to AgentDefinition format
  const convertAgencyAgent = (agencyAgent: SimpleAgencyAgent): AgentDefinition => {
    const industryMap: Record<string, AgentDefinition['category']['industry']> = {
      'wms': 'WMS',
      'oms': 'OMS', 
      'fms': 'FMS',
      'bnp': 'general', // BNP maps to general since it's not in the AgentDefinition type
      'yms': 'YMS',
      'enterprise': 'general'
    };

    const functionMap: Record<string, AgentDefinition['category']['function']> = {
      'reconciler': 'automation',
      'calculator': 'analytics',
      'accountant': 'data-analysis',
      'handler': 'customer-service',
      'operator': 'automation',
      'agent': 'automation',
      'warning': 'monitoring',
      'sync': 'integration',
      'generator': 'generation',
      'merger': 'automation',
      'sender': 'automation',
      'converter': 'generation',
      'planner': 'optimization',
      'manager': 'productivity',
      'coordinator': 'automation',
      'dispatcher': 'optimization',
      'tracker': 'monitoring',
      'collector': 'data-analysis',
      'shipper': 'automation',
      'optimizer': 'optimization',
      'scheduler': 'optimization',
      'validator': 'analytics',
      'monitor': 'monitoring',
      'picker': 'automation',
      'allocator': 'optimization',
      'controller': 'monitoring',
      'analyzer': 'data-analysis',
      'executor': 'automation'
    };

    return {
      id: agencyAgent.id,
      name: agencyAgent.id,
      displayName: agencyAgent.name,
      description: agencyAgent.description,
      version: '1.0.0',
      status: 'published',
      category: {
        industry: industryMap[agencyAgent.domain] || 'general',
        function: functionMap[agencyAgent.role] || 'automation'
      },
      pricing: {
        model: 'subscription',
        price: 15, // Default price for agency agents
        currency: 'USD'
      },
      capabilities: agencyAgent.capabilities,
      skills: [],
      prompts: {
        system: `You are a ${agencyAgent.name} specialized in ${agencyAgent.description}`,
        user: 'Please help me with my request.',
        variables: []
      },
      ontologySubset: [],
      sdd: {
        requirements: `# Requirements\n\n${agencyAgent.description}\n`,
        design: `# Design\n\nAgency agent for ${agencyAgent.domain} domain.\n`,
        domainAnalysis: `# Domain Analysis\n\nDomain: ${agencyAgent.domain}\nDepartment: ${agencyAgent.department}\n`,
        tasks: `# Tasks\n\n${agencyAgent.capabilities.join('\n- ')}\n`
      },
      build: {
        status: 'success',
        steps: [],
        artifacts: [],
        logs: []
      },
      test: {
        status: 'passed',
        suites: [],
        coverage: 100
      },
      metadata: {
        author: 'Unis Agency',
        tags: [agencyAgent.domain.toUpperCase(), agencyAgent.department, agencyAgent.role],
        rating: 4.2 + Math.random() * 0.6, // Random rating between 4.2-4.8
        downloads: Math.floor(Math.random() * 1000) + 100, // Random downloads
        reviews: [],
        source: 'agency-agents-simple',
        // Store original domain for filtering
        division: agencyAgent.domain.toUpperCase()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        // Load database agents (published only)
        const publishedAgents = await agentDB.agents.where('status').equals('published').toArray();
        
        // Convert agency agents to AgentDefinition format
        const agencyAgentsFormatted = simpleAgencyAgents
          .filter(agent => agent.status === 'active')
          .map(convertAgencyAgent);
        
        // Merge both sources
        const allAgents = [...publishedAgents, ...agencyAgentsFormatted];
        setAgents(allAgents);
      } catch (error) {
        console.error('Failed to load marketplace agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const isAPAgent = (agent: AgentDefinition) =>
    agent.displayName.toLowerCase().includes('accounts payable') ||
    agent.displayName.toLowerCase().includes('ap agent') ||
    agent.category.industry === 'FMS';

  // Filter and sort logic
  const filteredAndSortedAgents = agents
    .filter(agent => {
      if (searchQuery && !agent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !agent.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && agent.category.function !== selectedCategory) {
        return false;
      }
      if (selectedIndustry !== 'all') {
        // Handle BNP domain filtering
        if (selectedIndustry === 'BNP') {
          if (agent.metadata.division !== 'BNP') {
            return false;
          }
        } else if (agent.category.industry !== selectedIndustry) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // AP Agent always sorts to top
      const aIsAP = isAPAgent(a);
      const bIsAP = isAPAgent(b);
      if (aIsAP && !bIsAP) return -1;
      if (!aIsAP && bIsAP) return 1;

      switch (sortBy) {
        case 'rating':
          return b.metadata.rating - a.metadata.rating;
        case 'downloads':
          return b.metadata.downloads - a.metadata.downloads;
        case 'price':
          return a.pricing.price - b.pricing.price;
        case 'name':
          return a.displayName.localeCompare(b.displayName, 'zh-CN');
        default:
          return 0;
      }
    });

  const categories = [
    { value: 'all', label: t('marketplace.categories.all') },
    { value: 'data-analysis', label: t('marketplace.categories.dataAnalysis') },
    { value: 'automation', label: t('marketplace.categories.automation') },
    { value: 'customer-service', label: t('marketplace.categories.customerService') },
    { value: 'monitoring', label: t('marketplace.categories.monitoring') },
    { value: 'productivity', label: t('marketplace.categories.productivity') },
    { value: 'optimization', label: t('marketplace.categories.optimization') },
    { value: 'analytics', label: t('marketplace.categories.analytics') },
    { value: 'self-improvement', label: t('marketplace.categories.selfImprovement') },
    { value: 'code-analysis', label: t('marketplace.categories.codeAnalysis') },
    { value: 'generation', label: t('marketplace.categories.generation') },
    { value: 'integration', label: t('marketplace.categories.integration') },
    { value: 'visualization', label: t('marketplace.categories.visualization') },
    { value: 'memory-management', label: t('marketplace.categories.memoryManagement') },
    { value: 'lifestyle', label: t('marketplace.categories.lifestyle') }
  ];

  const industries = [
    { value: 'all', label: t('marketplace.industries.all') },
    { value: 'WMS', label: t('marketplace.industries.wms') },
    { value: 'TMS', label: t('marketplace.industries.tms') },
    { value: 'HRM', label: t('marketplace.industries.hrm') },
    { value: 'FMS', label: t('marketplace.industries.fms') },
    { value: 'YMS', label: t('marketplace.industries.yms') },
    { value: 'OMS', label: t('marketplace.industries.oms') },
    { value: 'BNP', label: 'BNP' },
    { value: 'general', label: t('marketplace.industries.general') },
    { value: 'healthcare', label: t('marketplace.industries.healthcare') },
    { value: 'ai-tools', label: t('marketplace.industries.aiTools') },
    { value: 'development', label: t('marketplace.industries.development') },
    { value: 'creative', label: t('marketplace.industries.creative') },
    { value: 'knowledge', label: t('marketplace.industries.knowledge') },
    { value: 'marketing', label: t('marketplace.industries.marketing') }
  ];

  // Show agent detail view if an agent is selected
  if (selectedAgent) {
    return <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('marketplace.title')}</h1>
          <p className="text-muted-foreground">{t('marketplace.subtitle')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                  <div className="h-8 bg-muted animate-pulse rounded" />
                </div>
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
        <h1 className="text-3xl font-bold tracking-tight">MarketPlace</h1>
        <p className="text-muted-foreground">
          {t('marketplace.subtitle')} - {filteredAndSortedAgents.length} {t('marketplace.agentsAvailable')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('marketplace.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {t('marketplace.search.filter')}
          </Button>
        </div>

        {showAdvancedFilters && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {industries.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="rating">{t('marketplace.sorting.byRating')}</option>
                <option value="downloads">{t('marketplace.sorting.byDownloads')}</option>
                <option value="price">{t('marketplace.sorting.byPrice')}</option>
                <option value="name">{t('marketplace.sorting.byName')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Grid/List */}
      <div className={viewMode === 'grid'
        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        : "space-y-4"
      }>
        {filteredAndSortedAgents.map((agent) => (
          <AgentMarketCard
            key={agent.id}
            agent={agent}
            viewMode={viewMode}
            featured={isAPAgent(agent)}
            onSelect={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {filteredAndSortedAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t('marketplace.noResults')}
          </p>
          <p className="text-muted-foreground mt-2">
            {t('marketplace.tryAdjusting')}
          </p>
        </div>
      )}
    </div>
  );
}

interface AgentMarketCardProps {
  agent: AgentDefinition;
  viewMode: 'grid' | 'list';
  featured?: boolean;
  onSelect: () => void;
}

function AgentMarketCard({ agent, viewMode, featured, onSelect }: AgentMarketCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleHire = () => {
    navigate(`/marketplace/hire/${agent.id}`);
  };

  const getCategoryText = (agent: AgentDefinition) => {
    const category = agent.category;
    const industryMap = {
      'WMS': t('marketplace.industries.wms'),
      'TMS': t('marketplace.industries.tms'),
      'HRM': t('marketplace.industries.hrm'),
      'FMS': t('marketplace.industries.fms'),
      'YMS': t('marketplace.industries.yms'),
      'OMS': t('marketplace.industries.oms'),
      'general': t('marketplace.industries.general'),
      'healthcare': t('marketplace.industries.healthcare'),
      'ai-tools': t('marketplace.industries.aiTools'),
      'development': t('marketplace.industries.development'),
      'creative': t('marketplace.industries.creative'),
      'knowledge': t('marketplace.industries.knowledge'),
      'marketing': t('marketplace.industries.marketing')
    };

    // Handle BNP domain display
    const industryDisplay = agent.metadata.division === 'BNP' ? 'BNP' : 
      (industryMap[category.industry as keyof typeof industryMap] || category.industry);

    const functionMap = {
      'data-analysis': t('marketplace.categories.dataAnalysis'),
      'automation': t('marketplace.categories.automation'),
      'customer-service': t('marketplace.categories.customerService'),
      'monitoring': t('marketplace.categories.monitoring'),
      'productivity': t('marketplace.categories.productivity'),
      'optimization': t('marketplace.categories.optimization'),
      'analytics': t('marketplace.categories.analytics'),
      'self-improvement': t('marketplace.categories.selfImprovement'),
      'code-analysis': t('marketplace.categories.codeAnalysis'),
      'generation': t('marketplace.categories.generation'),
      'integration': t('marketplace.categories.integration'),
      'visualization': t('marketplace.categories.visualization'),
      'memory-management': t('marketplace.categories.memoryManagement'),
      'lifestyle': t('marketplace.categories.lifestyle')
    };

    return `${industryDisplay} • ${functionMap[category.function as keyof typeof functionMap] || category.function}`;
  };

  const formatPrice = (agent: AgentDefinition) => {
    if (agent.pricing.price === 0) {
      return t('marketplace.agent.free');
    }

    switch (agent.pricing.model) {
      case 'subscription':
        return `$${agent.pricing.price}${t('marketplace.agent.perMonth')}`;
      case 'usage':
        return `$${agent.pricing.price}${t('marketplace.agent.perUse')}`;
      case 'pay-per-use':
        return `$${agent.pricing.price}${t('marketplace.agent.perUse')}`;
      case 'free':
        return t('marketplace.agent.free');
      default:
        return `$${agent.pricing.price}`;
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className={`hover:shadow-lg transition-shadow${featured ? ' ring-2 ring-primary' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{agent.displayName}</h3>
                    {featured && <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryText(agent)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatPrice(agent)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                    {agent.metadata.rating.toFixed(1)}
                    <span className="mx-1">•</span>
                    <Download className="h-3 w-3 mr-1" />
                    {agent.metadata.downloads}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description}
              </p>

              <div className="flex items-center space-x-2">
                {agent.metadata.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button className="w-32" onClick={handleHire}>{t('marketplace.agent.hire')}</Button>
              <Button variant="outline" className="w-32" onClick={onSelect}>
                {t('marketplace.agent.details')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow${featured ? ' ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg leading-tight">{agent.displayName}</CardTitle>
              {featured && <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {getCategoryText(agent)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{formatPrice(agent)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {agent.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
            {agent.metadata.rating.toFixed(1)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Download className="h-3 w-3 mr-1" />
            {agent.metadata.downloads} {t('marketplace.agent.downloads')}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {agent.metadata.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1" onClick={handleHire}>
            {t('marketplace.agent.hire')}
          </Button>
          <Button size="sm" variant="outline" onClick={onSelect}>
            {t('marketplace.agent.details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
