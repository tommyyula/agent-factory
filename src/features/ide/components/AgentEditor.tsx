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
  AlertTriangle
} from 'lucide-react';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition, BuildLog, TestCase } from '@/shared/types/agent.types';

interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  logs: string[];
}

export function AgentEditor() {
  const { t } = useTranslation();
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [testResults, setTestResults] = useState<TestCase[]>([]);

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
              <Button size="sm">
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
                <Button size="sm">
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
      </Tabs>
    </div>
  );
}