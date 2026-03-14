import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Brain,
  Wrench,
  MessageSquare,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useOntologyStore } from '@/stores/ontologyStore';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition, PromptVariable } from '@/shared/types/agent.types';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Skill {
  name: string;
  type: 'api' | 'tool' | 'workflow' | 'integration';
  parameters: Record<string, string>;
}

interface AgentFormData {
  name: string;
  displayName: string;
  description: string;
  category: {
    industry: string;
    function: string;
  };
  ontologyDomains: string[];
  skills: Skill[];
  systemPrompt: string;
  userPromptTemplate: string;
  promptVariables: PromptVariable[];
}

const STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Basic Info',
    description: 'Name, description, and category',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 2,
    title: 'Knowledge Domains',
    description: 'Select ontology domains',
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: 3,
    title: 'Skills',
    description: 'Configure agent capabilities',
    icon: <Wrench className="h-4 w-4" />
  },
  {
    id: 4,
    title: 'Prompts',
    description: 'System and user prompts',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: 5,
    title: 'Review',
    description: 'Review and create',
    icon: <CheckCircle className="h-4 w-4" />
  }
];

const INDUSTRIES = [
  { value: 'WMS', label: 'Warehouse Management' },
  { value: 'TMS', label: 'Transport Management' },
  { value: 'FMS', label: 'Fleet Management' },
  { value: 'HRM', label: 'Human Resources' },
  { value: 'YMS', label: 'Yard Management' },
  { value: 'OMS', label: 'Order Management' },
  { value: 'general', label: 'General Purpose' }
];

const FUNCTIONS = [
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'automation', label: 'Process Automation' },
  { value: 'customer-service', label: 'Customer Service' },
  { value: 'monitoring', label: 'System Monitoring' },
  { value: 'optimization', label: 'Optimization' },
  { value: 'reporting', label: 'Reporting' }
];

const SKILL_TYPES = [
  { value: 'api', label: 'API Integration' },
  { value: 'tool', label: 'Tool Usage' },
  { value: 'workflow', label: 'Workflow Execution' },
  { value: 'integration', label: 'System Integration' }
];

export function AgentCreationWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { domains } = useOntologyStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    displayName: '',
    description: '',
    category: {
      industry: '',
      function: ''
    },
    ontologyDomains: [],
    skills: [],
    systemPrompt: '',
    userPromptTemplate: '',
    promptVariables: []
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDomainToggle = (domainId: string) => {
    setFormData(prev => ({
      ...prev,
      ontologyDomains: prev.ontologyDomains.includes(domainId)
        ? prev.ontologyDomains.filter(id => id !== domainId)
        : [...prev.ontologyDomains, domainId]
    }));
  };

  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: '',
          type: 'api',
          parameters: {}
        }
      ]
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const handleAddVariable = (variable: string) => {
    if (variable && !formData.promptVariables.some(v => v.name === variable)) {
      setFormData(prev => ({
        ...prev,
        promptVariables: [...prev.promptVariables, {
          name: variable,
          type: 'string',
          description: `Variable: ${variable}`,
          source: 'user' as const
        }]
      }));
    }
  };

  const handleRemoveVariable = (variableName: string) => {
    setFormData(prev => ({
      ...prev,
      promptVariables: prev.promptVariables.filter(v => v.name !== variableName)
    }));
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const agentDefinition: Partial<AgentDefinition> = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        category: formData.category as any,
        status: 'draft',
        version: '0.1.0',
        prompts: {
          system: formData.systemPrompt,
          user: formData.userPromptTemplate,
          variables: formData.promptVariables
        },
        skills: formData.skills.map((skill, index) => ({
          id: `skill-${index}`,
          name: skill.name,
          type: skill.type as any,
          parameters: [],
          enabled: true,
          configuration: skill.parameters
        })),
        ontologySubset: formData.ontologyDomains,
        capabilities: [],
        pricing: {
          model: 'free',
          price: 0,
          currency: 'USD'
        },
        sdd: {
          requirements: '',
          design: '',
          domainAnalysis: '',
          tasks: ''
        },
        test: {
          status: 'pending',
          suites: [],
          coverage: 0
        },
        build: {
          status: 'pending',
          steps: [],
          artifacts: [],
          logs: []
        },
        metadata: {
          author: 'System',
          tags: [],
          rating: 0,
          downloads: 0,
          reviews: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await agentDB.agents.add(agentDefinition as AgentDefinition);
      navigate('/ide');
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('ide.wizard.name', 'Agent Name')}</Label>
                <Input
                  id="name"
                  placeholder="logistics-optimizer"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('ide.wizard.displayName', 'Display Name')}</Label>
                <Input
                  id="displayName"
                  placeholder="Logistics Optimizer"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('ide.wizard.description', 'Description')}</Label>
              <Textarea
                id="description"
                placeholder="Describe what your agent does..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('ide.wizard.industry', 'Industry')}</Label>
                <Select
                  value={formData.category.industry}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    category: { ...prev.category, industry: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('ide.wizard.function', 'Function')}</Label>
                <Select
                  value={formData.category.function}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    category: { ...prev.category, function: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNCTIONS.map((func) => (
                      <SelectItem key={func.value} value={func.value}>
                        {func.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">{t('ide.wizard.selectDomains', 'Select Knowledge Domains')}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={domain.id}
                      checked={formData.ontologyDomains.includes(domain.id)}
                      onCheckedChange={() => handleDomainToggle(domain.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={domain.id} className="font-medium">
                        {domain.displayName}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {domain.description}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {domain.industry}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('ide.wizard.skills', 'Agent Skills')}</h3>
              <Button onClick={handleAddSkill} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t('ide.wizard.addSkill', 'Add Skill')}
              </Button>
            </div>
            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Skill #{index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Skill Name</Label>
                        <Input
                          placeholder="e.g., Database Query"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={skill.type}
                          onValueChange={(value) => handleSkillChange(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Parameters (JSON)</Label>
                      <Textarea
                        placeholder='{"endpoint": "https://api.example.com", "timeout": 30}'
                        value={JSON.stringify(skill.parameters, null, 2)}
                        onChange={(e) => {
                          try {
                            const params = JSON.parse(e.target.value || '{}');
                            handleSkillChange(index, 'parameters', params);
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <Tabs defaultValue="system" className="space-y-6">
            <TabsList>
              <TabsTrigger value="system">System Prompt</TabsTrigger>
              <TabsTrigger value="user">User Template</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            <TabsContent value="system" className="space-y-4">
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  placeholder="You are an AI assistant specialized in..."
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  rows={8}
                />
              </div>
            </TabsContent>
            <TabsContent value="user" className="space-y-4">
              <div className="space-y-2">
                <Label>User Prompt Template</Label>
                <Textarea
                  placeholder="Please help me with {{task}} using {{context}}..."
                  value={formData.userPromptTemplate}
                  onChange={(e) => setFormData(prev => ({ ...prev, userPromptTemplate: e.target.value }))}
                  rows={8}
                />
              </div>
            </TabsContent>
            <TabsContent value="variables" className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt Variables</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.promptVariables.map((variable) => (
                    <Badge key={variable.name} variant="secondary" className="flex items-center gap-1">
                      {variable.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveVariable(variable.name)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add variable name (e.g., task, context)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddVariable((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">{t('ide.wizard.review', 'Review Your Agent')}</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{formData.displayName || 'Unnamed Agent'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{formData.category.industry}</Badge>
                      <Badge variant="outline">{formData.category.function}</Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Knowledge Domains:</span> {formData.ontologyDomains.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Skills:</span> {formData.skills.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Prompt Variables:</span> {formData.promptVariables.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('ide.wizard.title', 'Create New Agent')}</h1>
        <p className="text-muted-foreground">
          {t('ide.wizard.subtitle', 'Follow the steps to create your AI agent')}
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-between items-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center space-y-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
              ${currentStep === step.id
                ? 'bg-primary text-primary-foreground border-primary'
                : currentStep > step.id
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'bg-background text-muted-foreground border-border'
              }
            `}>
              {step.icon}
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('common.previous', 'Previous')}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/ide')}>
            {t('common.cancel', 'Cancel')}
          </Button>
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              {t('common.next', 'Next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? t('ide.wizard.creating', 'Creating...') : t('ide.wizard.create', 'Create Agent')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}