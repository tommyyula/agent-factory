import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Star, Download, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition } from '@/shared/types/agent.types';
import { AgentDetail } from './components/AgentDetail';

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

function HiringWorkflow() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);

  const steps = [
    { id: 1, name: 'Configure', description: 'Set up deployment parameters' },
    { id: 2, name: 'Confirm', description: 'Review and confirm hiring' },
    { id: 3, name: 'Deploy', description: 'Deploy agent to runtime' }
  ];

  const handleNext = () => {
    if (step === 3) {
      setIsDeploying(true);
      // Simulate deployment process
      setTimeout(() => {
        setIsDeploying(false);
        setStep(4); // Success state
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/marketplace')}>
        ← Back to Marketplace
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Hire Agent</CardTitle>
          <div className="flex items-center space-x-4 mt-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s.id}
                </div>
                <div className="ml-2 text-sm">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-muted-foreground">{s.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Deployment Configuration</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Environment</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Resource Allocation</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Standard (2 CPU, 4GB RAM)</option>
                    <option>Enhanced (4 CPU, 8GB RAM)</option>
                    <option>Premium (8 CPU, 16GB RAM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Confirm Deployment</h3>
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span>Agent ID:</span>
                  <span className="font-mono">{agentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <span>Production</span>
                </div>
                <div className="flex justify-between">
                  <span>Resources:</span>
                  <span>Standard (2 CPU, 4GB RAM)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Cost:</span>
                  <span>$29.99/month</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Deploy Agent</h3>
              {isDeploying ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Deploying agent to runtime environment...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>Ready to deploy agent to production environment.</p>
                  <p className="text-sm text-muted-foreground">
                    This will create a new runtime deployment that you can monitor from the Runtime dashboard.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold text-green-600">Agent Deployed Successfully!</h3>
              <p className="text-muted-foreground">
                Your agent is now running in the production environment and ready to handle requests.
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => navigate('/runtime')}>
                  Monitor Runtime
                </Button>
                <Button variant="outline" onClick={() => navigate('/marketplace')}>
                  Back to Marketplace
                </Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              <Button onClick={handleNext} disabled={isDeploying}>
                {step === 3 ? 'Deploy' : 'Next'}
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

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        // 只显示已发布的 Agent
        const publishedAgents = await agentDB.agents.where('status').equals('published').toArray();
        setAgents(publishedAgents);
      } catch (error) {
        console.error('Failed to load marketplace agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

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
      if (selectedIndustry !== 'all' && agent.category.industry !== selectedIndustry) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
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
  onSelect: () => void;
}

function AgentMarketCard({ agent, viewMode, onSelect }: AgentMarketCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleHire = () => {
    navigate(`/marketplace/hire/${agent.id}`);
  };

  const getCategoryText = (category: { industry: string; function: string }) => {
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

    return `${industryMap[category.industry as keyof typeof industryMap] || category.industry} • ${functionMap[category.function as keyof typeof functionMap] || category.function}`;
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
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{agent.displayName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryText(agent.category)}
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{agent.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getCategoryText(agent.category)}
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