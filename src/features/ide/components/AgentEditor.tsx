import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  FileText,
  Wrench,
  MessageSquare,
  Hammer,
  TestTube,
  Play,
  Save,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition, AgentSoul, BuildLog, TestCase } from '@/shared/types/agent.types';

interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  logs: string[];
}

interface RecommendedSkill {
  id: string;
  name: string;
  description: string;
  type: 'analytics' | 'integration' | 'optimization' | 'api';
  compatibility: number;
}

interface SkillTestState {
  skillId: string;
  input: string;
  running: boolean;
  result: { passed: boolean; executionTime: number; tokenUsage: number } | null;
}

const RECOMMENDED_AP_SKILLS: RecommendedSkill[] = [
  {
    id: 'rec-invoice-parser',
    name: 'Invoice Parser',
    description: 'Automatically extract and validate invoice data from PDFs and images',
    type: 'analytics',
    compatibility: 98
  },
  {
    id: 'rec-payment-gateway',
    name: 'Payment Gateway Connector',
    description: 'Connect to major payment processors (Stripe, PayPal, SWIFT)',
    type: 'integration',
    compatibility: 92
  },
  {
    id: 'rec-fraud-detection',
    name: 'Fraud Detection',
    description: 'ML-based anomaly detection for suspicious payment patterns',
    type: 'optimization',
    compatibility: 87
  },
  {
    id: 'rec-currency-converter',
    name: 'Currency Converter',
    description: 'Real-time FX rates with multi-currency support',
    type: 'api',
    compatibility: 95
  }
];

function MarkdownSectionBlock({ content, emptyMessage }: { content?: string; emptyMessage: string }) {
  if (!content || !content.trim()) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <pre className="whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-4 text-sm leading-6">
      {content}
    </pre>
  );
}

export function AgentEditor() {
  const { t } = useTranslation();
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [installedSkills, setInstalledSkills] = useState<Set<string>>(new Set());
  const [skillTest, setSkillTest] = useState<SkillTestState | null>(null);

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;

      try {
        const agentData = await agentDB.agents.get(agentId);
        if (agentData) {
          setAgent(agentData);
          // Initialize mock build steps
          setBuildSteps([
            {
              id: 'validation',
              name: 'Schema Validation',
              status: agentData.status === 'draft' ? 'pending' : 'completed',
              duration: 1200,
              logs: ['Validating agent configuration...', 'Schema validation passed']
            },
            {
              id: 'compilation',
              name: 'Prompt Compilation',
              status: agentData.status === 'draft' ? 'pending' : 'completed',
              duration: 3400,
              logs: ['Compiling system prompts...', 'Processing user templates...']
            },
            {
              id: 'dependencies',
              name: 'Dependency Resolution',
              status: agentData.status === 'draft' ? 'pending' : agentData.status === 'building' ? 'running' : 'completed',
              duration: 2100,
              logs: ['Installing skill dependencies...', 'Resolving API connections...']
            },
            {
              id: 'packaging',
              name: 'Agent Packaging',
              status: agentData.status === 'testing' || agentData.status === 'published' ? 'completed' : 'pending',
              duration: 1800,
              logs: ['Creating deployment package...', 'Generating manifest...']
            }
          ]);

          // Initialize mock test results
          setTestResults([
            {
              id: 'test-1',
              name: 'Basic Response Test',
              description: 'Agent should respond to basic queries',
              status: agentData.status === 'published' ? 'passed' : agentData.status === 'testing' ? 'running' : 'pending',
              input: 'Test query',
              expectedOutput: 'Valid response',
              duration: 450,
              errorMessage: undefined
            },
            {
              id: 'test-2',
              name: 'Skill Integration Test',
              description: 'All skills should be accessible',
              status: agentData.status === 'published' ? 'passed' : 'pending',
              input: 'Test skill',
              expectedOutput: 'Skill executed',
              duration: 1200,
              errorMessage: undefined
            },
            {
              id: 'test-3',
              name: 'Error Handling Test',
              description: 'Agent should handle invalid inputs gracefully',
              status: agentData.status === 'published' ? 'failed' : 'pending',
              input: 'Invalid input',
              expectedOutput: 'Graceful error',
              duration: 800,
              errorMessage: 'Expected graceful error message, got uncaught exception'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load agent:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [agentId]);

  const handleSave = async () => {
    if (!agent) return;

    try {
      await agentDB.agents.update(agent.id, {
        ...agent,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to save agent:', error);
    }
  };

  const handleBuild = async () => {
    if (!agent) return;

    try {
      await agentDB.agents.update(agent.id, {
        status: 'building',
        updatedAt: new Date()
      });
      setAgent(prev => prev ? { ...prev, status: 'building' } : null);
    } catch (error) {
      console.error('Failed to start build:', error);
    }
  };

  const handleTest = async () => {
    if (!agent) return;

    try {
      await agentDB.agents.update(agent.id, {
        status: 'testing',
        updatedAt: new Date()
      });
      setAgent(prev => prev ? { ...prev, status: 'testing' } : null);
    } catch (error) {
      console.error('Failed to start tests:', error);
    }
  };

  const handleAddSkill = () => {
    if (!agent) return;

    const newSkill = {
      id: `skill-${Date.now()}`,
      name: 'New Skill',
      type: 'function' as const,
      enabled: true,
      configuration: {},
      parameters: [],
      description: 'A new skill configuration'
    };

    setAgent(prev => prev ? {
      ...prev,
      skills: [...prev.skills, newSkill]
    } : null);
  };

  const handleRunTests = async () => {
    if (!agent) return;

    // Set agent status to testing
    setAgent(prev => prev ? { ...prev, status: 'testing' } : null);

    // Update test results to show running state
    setTestResults(prev => prev.map(test => ({
      ...test,
      status: 'running' as const
    })));

    try {
      await agentDB.agents.update(agent.id, {
        status: 'testing',
        updatedAt: new Date()
      });

      // Simulate test execution with setTimeout
      setTimeout(() => {
        setTestResults([
          {
            id: 'test-1',
            name: 'Basic Response Test',
            description: 'Agent should respond to basic queries',
            status: 'passed',
            input: 'Test query',
            expectedOutput: 'Valid response',
            duration: 450,
            errorMessage: undefined
          },
          {
            id: 'test-2',
            name: 'Skill Integration Test',
            description: 'All skills should be accessible',
            status: 'passed',
            input: 'Test skill',
            expectedOutput: 'Skill executed',
            duration: 1200,
            errorMessage: undefined
          },
          {
            id: 'test-3',
            name: 'Error Handling Test',
            description: 'Agent should handle invalid inputs gracefully',
            status: 'failed',
            input: 'Invalid input',
            expectedOutput: 'Graceful error',
            duration: 800,
            errorMessage: 'Expected graceful error message, got uncaught exception'
          }
        ]);

        // Update agent status to tested
        setAgent(prev => prev ? { ...prev, status: 'published' } : null);
      }, 3000);

    } catch (error) {
      console.error('Failed to run tests:', error);
    }
  };

  const handleInstallRecommendedSkill = (skill: RecommendedSkill) => {
    if (!agent || installedSkills.has(skill.id)) return;

    const newSkill = {
      id: skill.id,
      name: skill.name,
      type: 'function' as const,
      enabled: true,
      configuration: { source: 'recommended', type: skill.type },
      parameters: [],
      description: skill.description
    };

    setAgent(prev => prev ? { ...prev, skills: [...prev.skills, newSkill] } : null);
    setInstalledSkills(prev => new Set([...prev, skill.id]));
  };

  const handleRunSkillTest = (skillId: string) => {
    setSkillTest(prev => prev ? { ...prev, running: true, result: null } : null);
    const execTime = Math.floor(Math.random() * 600) + 200;
    const tokenCount = Math.floor(Math.random() * 250) + 150;
    setTimeout(() => {
      setSkillTest(prev => prev ? {
        ...prev,
        running: false,
        result: {
          passed: Math.random() > 0.2,
          executionTime: execTime,
          tokenUsage: tokenCount
        }
      } : null);
    }, execTime);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('ide.agentNotFound', 'Agent not found')}</p>
        <Button onClick={() => navigate('/ide')} className="mt-4">
          {t('common.goBack', 'Go Back')}
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/ide')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{agent.displayName}</h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <Badge variant="outline">{agent.category.industry}</Badge>
              <span>•</span>
              <Badge variant="outline">{agent.category.function}</Badge>
              <span>•</span>
              <Badge variant={agent.status === 'published' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('common.save', '保存')}
          </Button>
          {agent.status === 'draft' && (
            <Button onClick={handleBuild}>
              <Hammer className="mr-2 h-4 w-4" />
              {t('ide.build', '构建')}
            </Button>
          )}
          {agent.status === 'building' && (
            <Button onClick={handleTest}>
              <TestTube className="mr-2 h-4 w-4" />
              {t('ide.test', '测试')}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sdd" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sdd">
            <FileText className="mr-2 h-4 w-4" />
            SDD
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Wrench className="mr-2 h-4 w-4" />
            {t('ide.skills', 'Skills')}
          </TabsTrigger>
          <TabsTrigger value="recommended">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('ide.recommendedSkills', 'Recommended Skills')}
          </TabsTrigger>
          <TabsTrigger value="prompts">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('ide.prompts', 'Prompts')}
          </TabsTrigger>
          <TabsTrigger value="build">
            <Hammer className="mr-2 h-4 w-4" />
            {t('ide.build', 'Build')}
          </TabsTrigger>
          <TabsTrigger value="tests">
            <TestTube className="mr-2 h-4 w-4" />
            {t('ide.tests', 'Tests')}
          </TabsTrigger>
          <TabsTrigger value="soul">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('ide.soul', 'Soul')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sdd" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('ide.sdd.requirements', 'Requirements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Define functional and non-functional requirements..."
                  rows={8}
                  defaultValue={`# Functional Requirements
- Agent must process user queries in natural language
- Support for ${agent.skills.length} configured skills
- Response time < 2 seconds for simple queries

# Non-functional Requirements
- 99.9% uptime SLA
- Support for concurrent users
- Secure API communication`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ide.sdd.design', 'System Design')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Document the system architecture..."
                  rows={8}
                  defaultValue={`# Architecture Overview
- Microservice-based design
- Event-driven communication
- Stateless agent instances

# Key Components
1. Query Processor
2. Skill Router
3. Response Generator
4. Context Manager`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ide.sdd.domainAnalysis', 'Domain Analysis')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Analyze the problem domain..."
                  rows={8}
                  defaultValue={`# Domain Context
Industry: ${agent.category.industry}
Function: ${agent.category.function}

# Key Entities
- Users and their roles
- Business processes
- Data models
- Integration points`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ide.sdd.tasks', 'Task Breakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Core Logic Implementation</span>
                    <Badge variant="outline">8h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Skill Integration</span>
                    <Badge variant="outline">12h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Testing & QA</span>
                    <Badge variant="outline">6h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentation</span>
                    <Badge variant="outline">4h</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('ide.configuredSkills', 'Configured Skills')}</h3>
              <Button size="sm" onClick={handleAddSkill}>
                <Settings className="mr-2 h-4 w-4" />
                {t('ide.addSkill', 'Add Skill')}
              </Button>
            </div>
            <div className="grid gap-4">
              {agent.skills.map((skill, index) => (
                <Card key={skill.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{skill.type}</Badge>
                        <Badge variant={skill.enabled ? 'default' : 'secondary'}>
                          {skill.enabled ? t('common.enabled', 'Enabled') : t('common.disabled', 'Disabled')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">{t('ide.configuration', 'Configuration')}</Label>
                        <Textarea
                          value={JSON.stringify(skill.configuration, null, 2)}
                          rows={4}
                          className="mt-2 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          {/* Recommended Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {t('ide.recommendedSkills', 'Recommended Skills')}
                <Badge variant="secondary">{RECOMMENDED_AP_SKILLS.length}</Badge>
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {RECOMMENDED_AP_SKILLS.map((skill) => {
                const isInstalled = installedSkills.has(skill.id);
                const compatColor =
                  skill.compatibility >= 95 ? 'bg-green-500' :
                  skill.compatibility >= 88 ? 'bg-blue-500' : 'bg-yellow-500';
                const typeVariant: 'default' | 'secondary' | 'outline' =
                  skill.type === 'analytics' ? 'default' :
                  skill.type === 'integration' ? 'secondary' : 'outline';
                return (
                  <Card key={skill.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{skill.name}</CardTitle>
                        <Badge variant={typeVariant} className="text-xs capitalize">{skill.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t('ide.skillCompatibility', 'Compatibility')}</span>
                          <span className="font-medium">{skill.compatibility}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${compatColor}`}
                            style={{ width: `${skill.compatibility}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isInstalled ? 'secondary' : 'default'}
                        disabled={isInstalled}
                        onClick={() => handleInstallRecommendedSkill(skill)}
                        className="w-full"
                      >
                        {isInstalled
                          ? `${t('ide.installed', 'Installed')} ✓`
                          : t('ide.install', 'Install')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Skill Testing Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('ide.testSkill', 'Test Skills')}</h3>
            {agent.skills.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No skills installed yet. Install a skill above to test it.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {agent.skills.map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{skill.type}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSkillTest({
                            skillId: skill.id,
                            input: '',
                            running: false,
                            result: null
                          })}
                        >
                          <Play className="mr-2 h-3 w-3" />
                          {t('ide.testSkill', 'Test')}
                        </Button>
                      </div>

                      {skillTest?.skillId === skill.id && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          <h4 className="text-sm font-medium">{t('ide.skillTest.title', 'Skill Test')}</h4>
                          <div className="space-y-2">
                            <Label className="text-xs">{t('ide.skillTest.input', 'Test Input')}</Label>
                            <Input
                              value={skillTest.input}
                              onChange={(e) => setSkillTest(prev => prev ? { ...prev, input: e.target.value } : null)}
                              placeholder={`Test input for ${skill.name}...`}
                              className="text-sm"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRunSkillTest(skill.id)}
                            disabled={skillTest.running}
                          >
                            {skillTest.running ? (
                              <>
                                <Clock className="mr-2 h-3 w-3 animate-spin" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-3 w-3" />
                                {t('ide.skillTest.runTest', 'Run Test')}
                              </>
                            )}
                          </Button>

                          {skillTest.result && (
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                              <h5 className="text-xs font-medium">{t('ide.skillTest.results', 'Test Results')}</h5>
                              <div className="flex items-center gap-2">
                                {skillTest.result.passed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${skillTest.result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                  {skillTest.result.passed
                                    ? t('ide.skillTest.passed', 'Passed')
                                    : t('ide.skillTest.failed', 'Failed')}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>
                                  <span>{t('ide.skillTest.executionTime', 'Execution Time')}: </span>
                                  <span className="font-medium text-foreground">{skillTest.result.executionTime}ms</span>
                                </div>
                                <div>
                                  <span>{t('ide.skillTest.tokenUsage', 'Token Usage')}: </span>
                                  <span className="font-medium text-foreground">{skillTest.result.tokenUsage}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('ide.systemPrompt', 'System Prompt')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={agent.prompts.system}
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    prompts: { ...prev.prompts, system: e.target.value }
                  } : null)}
                  rows={8}
                  placeholder="You are an AI assistant specialized in..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ide.userTemplate', 'User Prompt Template')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={agent.prompts.user}
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    prompts: { ...prev.prompts, user: e.target.value }
                  } : null)}
                  rows={6}
                  placeholder="Please help me with {{task}}..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('ide.promptVariables', 'Prompt Variables')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.prompts.variables.map((variable) => (
                    <Badge key={variable.name} variant="secondary">
                      {variable.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="build" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.buildStatus', 'Build Status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Build Status</span>
                  <span className="text-sm">{agent.build.status}</span>
                </div>
                <Progress value={agent.build.status === 'success' ? 100 : agent.build.status === 'running' ? 50 : 0} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('ide.buildSteps', 'Build Steps')}</h3>
            {buildSteps.map((step) => (
              <Card key={step.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <h4 className="font-medium">{step.name}</h4>
                        {step.duration && (
                          <p className="text-sm text-muted-foreground">
                            {Math.round(step.duration / 1000)}s
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{step.status}</Badge>
                  </div>
                  {step.logs.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="text-xs font-mono space-y-1">
                        {step.logs.map((log, index) => (
                          <div key={index} className="text-muted-foreground">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('ide.testResults', 'Test Results')}</CardTitle>
                <Button size="sm" onClick={handleRunTests}>
                  <Play className="mr-2 h-4 w-4" />
                  {t('ide.runTests', 'Run Tests')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {agent.test.suites.reduce((acc, suite) => acc + suite.passedCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('ide.passed', 'Passed')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {agent.test.suites.reduce((acc, suite) => acc + suite.failedCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('ide.failed', 'Failed')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{agent.test.coverage}%</div>
                    <div className="text-sm text-muted-foreground">{t('ide.coverage', 'Coverage')}</div>
                  </div>
                </div>
                <Progress value={agent.test.coverage} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('ide.testCases', 'Test Cases')}</h3>
            {testResults.map((test) => (
              <Card key={test.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {test.description}
                        </p>
                        {test.errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <AlertTriangle className="inline mr-2 h-4 w-4" />
                            {test.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.duration && (
                        <span className="text-sm text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                      <Badge variant="outline">{test.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="soul" className="space-y-6">
          {/* Identity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>{agent.soul?.emoji || '🤖'}</span>
                  {t('ide.soul.identity', 'Identity & Memory')}
                </CardTitle>
                {agent.soul && (
                  <Badge style={{ backgroundColor: agent.soul.color }} className="text-white">
                    {agent.soul.vibe}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('ide.soul.role', 'Role')}</Label>
                <Input
                  defaultValue={agent.soul?.identity.role || ''}
                  placeholder="e.g. Senior Frontend Developer"
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    soul: { ...(prev.soul || defaultSoul), identity: { ...(prev.soul?.identity || defaultSoul.identity), role: e.target.value } }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ide.soul.personality', 'Personality')}</Label>
                <Input
                  defaultValue={agent.soul?.identity.personality || ''}
                  placeholder="e.g. Meticulous, performance-obsessed"
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    soul: { ...(prev.soul || defaultSoul), identity: { ...(prev.soul?.identity || defaultSoul.identity), personality: e.target.value } }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ide.soul.memory', 'Memory Style')}</Label>
                <Input
                  defaultValue={agent.soul?.identity.memory || ''}
                  placeholder="e.g. Tracks decisions and context"
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    soul: { ...(prev.soul || defaultSoul), identity: { ...(prev.soul?.identity || defaultSoul.identity), memory: e.target.value } }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ide.soul.experience', 'Experience')}</Label>
                <Input
                  defaultValue={agent.soul?.identity.experience || ''}
                  placeholder="e.g. 10+ years in production systems"
                  onChange={(e) => setAgent(prev => prev ? {
                    ...prev,
                    soul: { ...(prev.soul || defaultSoul), identity: { ...(prev.soul?.identity || defaultSoul.identity), experience: e.target.value } }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ide.soul.vibe', 'Vibe')}</Label>
                <Input
                  defaultValue={agent.soul?.vibe || ''}
                  placeholder="e.g. Builds fast, ships clean code"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('ide.soul.emoji', 'Emoji')} / {t('ide.soul.color', 'Color')}</Label>
                <div className="flex gap-2">
                  <Input
                    defaultValue={agent.soul?.emoji || ''}
                    placeholder="🤖"
                    className="w-20"
                  />
                  <Input
                    defaultValue={agent.soul?.color || ''}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Rules */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.soul.criticalRules', 'Critical Rules')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownSectionBlock
                content={agent.soul?.rawSections?.criticalRules}
                emptyMessage={t('ide.soul.noRules', 'No critical rules defined yet.')}
              />
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.soul.mission', 'Core Mission')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MarkdownSectionBlock
                content={agent.soul?.rawSections?.mission}
                emptyMessage={t('ide.soul.noMission', 'No mission blocks defined yet.')}
              />
            </CardContent>
          </Card>

          {/* Workflow */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.soul.workflow', 'Workflow Process')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownSectionBlock
                content={agent.soul?.rawSections?.workflow}
                emptyMessage={t('ide.soul.noWorkflow', 'No workflow steps defined yet.')}
              />
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.soul.communicationStyle', 'Communication Style')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownSectionBlock
                content={agent.soul?.rawSections?.communicationStyle}
                emptyMessage={t('ide.soul.noCommStyle', 'No communication style defined yet.')}
              />
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ide.soul.successMetrics', 'Success Metrics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownSectionBlock
                content={agent.soul?.rawSections?.successMetrics}
                emptyMessage={t('ide.soul.noMetrics', 'No success metrics defined yet.')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const defaultSoul: AgentSoul = {
  identity: { role: '', personality: '', memory: '', experience: '' },
  mission: [],
  criticalRules: [],
  workflow: [],
  communicationStyle: [],
  successMetrics: [],
  vibe: '',
  emoji: '🤖',
  color: '#6366f1',
};
