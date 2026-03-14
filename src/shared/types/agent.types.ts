export interface AgentDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: 'draft' | 'building' | 'testing' | 'published' | 'archived';
  category: {
    industry: 'WMS' | 'TMS' | 'HRM' | 'general';
    function: 'data-analysis' | 'automation' | 'customer-service' | 'monitoring';
  };
  pricing: {
    model: 'subscription' | 'usage' | 'free';
    price: number; // monthly price in USD
    currency: 'USD';
  };
  capabilities: string[];
  skills: SkillConfiguration[];
  prompts: PromptConfiguration;
  ontologySubset: string[]; // ontology IDs
  sdd: SDDFiles;
  build: BuildConfiguration;
  test: TestConfiguration;
  metadata: {
    author: string;
    tags: string[];
    rating: number;
    downloads: number;
    reviews: AgentReview[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillConfiguration {
  id: string;
  name: string;
  type: 'api' | 'function' | 'workflow' | 'knowledge';
  parameters: SkillParameter[];
  enabled: boolean;
  configuration: Record<string, unknown>;
}

export interface SkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  defaultValue?: unknown;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface PromptConfiguration {
  system: string;
  user: string;
  assistant?: string;
  functions?: PromptFunction[];
  variables: PromptVariable[];
}

export interface PromptFunction {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface PromptVariable {
  name: string;
  type: string;
  description: string;
  source: 'user' | 'ontology' | 'runtime' | 'system';
}

export interface SDDFiles {
  requirements: string; // markdown content
  design: string;
  domainAnalysis: string;
  tasks: string;
}

export interface BuildConfiguration {
  status: 'pending' | 'running' | 'success' | 'failed';
  steps: BuildStep[];
  artifacts: BuildArtifact[];
  startedAt?: Date;
  completedAt?: Date;
  logs: BuildLog[];
}

export interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration?: number; // milliseconds
  output?: string;
}

export interface BuildArtifact {
  id: string;
  name: string;
  type: 'executable' | 'config' | 'documentation';
  size: number;
  checksum: string;
  url?: string; // for mock, this could be blob URL
}

export interface BuildLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  step?: string;
}

export interface TestConfiguration {
  status: 'pending' | 'running' | 'passed' | 'failed';
  suites: TestSuite[];
  coverage: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  passedCount: number;
  failedCount: number;
  duration: number;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  input: unknown;
  expectedOutput: unknown;
  actualOutput?: unknown;
  duration: number;
  errorMessage?: string;
}

export interface AgentReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}