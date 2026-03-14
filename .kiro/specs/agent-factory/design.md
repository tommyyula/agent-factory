# Agent Factory Platform - 系统设计文档

## 1. 系统架构概览

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                     Agent Factory Platform                      │
│                        (Single Page App)                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │     Frontend Layer      │
                    │   React 19 + TypeScript │
                    │   Tailwind CSS v4 + UI  │
                    └─────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    State Management     │
                    │   Zustand + TanStack    │
                    │   Query (for mock APIs) │
                    └─────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    Visualization        │
                    │   React Flow + Recharts │
                    │   Canvas API + D3       │
                    └─────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │   Data Storage Layer    │
                    │   IndexedDB (Dexie.js)  │
                    │   Partitioned Databases │
                    └─────────────────────────┘
                                 │
                ┌─────────────────────────────────────┐
                │           Mock Data Layer            │
                │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
                │  │Ontology │ │ Agents  │ │ Runtime ││
                │  │   KB    │ │ Factory │ │Monitor  ││
                │  └─────────┘ └─────────┘ └─────────┘│
                └─────────────────────────────────────┘
```

### 1.2 模块架构

```
Agent Factory Platform
├── Dashboard Module (仪表盘)
│   ├── Global Overview Component
│   ├── Architecture Visualization
│   ├── Activity Stream
│   └── Quick Actions Panel
├── Ontology KB Module (知识图谱)
│   ├── Ontology List & Search
│   ├── Knowledge Graph Viewer (React Flow)
│   ├── Ingestion Status Tracker
│   └── Version History (Git DAG)
├── IDE Module (开发环境)
│   ├── Agent Creation Wizard
│   ├── Skills Configuration
│   ├── Prompt Editor
│   ├── SDD Viewer
│   └── Test & Preview
├── MarketPlace Module (市场)
│   ├── Agent Catalog
│   ├── Search & Filter
│   ├── Agent Details
│   └── Hiring Workflow
└── Runtime Module (运行时)
    ├── Agent Management
    ├── Job Agency Dashboard
    ├── Message Board
    ├── Performance Monitor
    └── Security Governance
```

## 2. 技术栈详细设计

### 2.1 前端技术栈

**核心框架**:
- React 19 (最新特性: Actions, use, useOptimistic, Transitions)
- TypeScript 5.9+ (严格模式, satisfies operator)
- Vite 6.x (构建工具, ESM 支持)

**UI 组件库**:
- Tailwind CSS v4 (oklch 色彩系统)
- shadcn/ui (组件基础库)
- Radix UI (无障碍组件原语)
- Lucide React (图标库)

**状态管理**:
- Zustand (全局状态)
- TanStack Query (服务器状态模拟)
- React Context (主题、国际化)

**可视化库**:
- React Flow (知识图谱)
- Recharts (统计图表)
- D3.js (自定义可视化)

**路由和导航**:
- React Router v7 (嵌套路由)
- 左侧 Sidebar 导航
- Breadcrumb 面包屑

### 2.2 数据存储设计

**IndexedDB 数据库分区策略**:

```typescript
// 数据库分区设计
interface DatabasePartitions {
  // 知识图谱数据库
  ontologyDB: {
    name: 'agent-factory-ontology';
    version: 1;
    stores: ['ontologies', 'concepts', 'relations', 'versions'];
  };
  
  // Agent 工厂数据库
  agentDB: {
    name: 'agent-factory-agents';
    version: 1;
    stores: ['agents', 'skills', 'prompts', 'builds', 'tests'];
  };
  
  // 运行时数据库
  runtimeDB: {
    name: 'agent-factory-runtime';
    version: 1;
    stores: ['deployments', 'jobs', 'logs', 'metrics', 'messages'];
  };
  
  // 用户偏好数据库
  userDB: {
    name: 'agent-factory-user';
    version: 1;
    stores: ['preferences', 'sessions', 'bookmarks', 'history'];
  };
}
```

**性能优化策略**:
- 批量事务操作
- 索引优化 (id, timestamp, status 字段)
- 数据分页加载 (500 条/页)
- LRU 缓存机制
- 后台数据预加载

## 3. 完整项目目录结构

```
agent-factory/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/              # 通用组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── layout/             # 布局组件
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── common/             # 通用组件
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── visualizations/     # 可视化组件
│   │       ├── KnowledgeGraph.tsx
│   │       ├── ArchDiagram.tsx
│   │       ├── MetricsChart.tsx
│   │       └── ActivityStream.tsx
│   ├── features/               # 功能模块 (Feature-First)
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── GlobalOverview.tsx
│   │   │   │   ├── SystemHealth.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardData.ts
│   │   │   ├── services/
│   │   │   │   └── dashboardService.ts
│   │   │   └── index.tsx
│   │   ├── ontology/
│   │   │   ├── components/
│   │   │   │   ├── OntologyList.tsx
│   │   │   │   ├── KnowledgeGraphViewer.tsx
│   │   │   │   ├── IngestionStatus.tsx
│   │   │   │   ├── VersionHistory.tsx
│   │   │   │   └── ConceptDetails.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOntologyData.ts
│   │   │   │   └── useGraphLayout.ts
│   │   │   ├── services/
│   │   │   │   └── ontologyService.ts
│   │   │   ├── types/
│   │   │   │   └── ontology.types.ts
│   │   │   └── index.tsx
│   │   ├── ide/
│   │   │   ├── components/
│   │   │   │   ├── AgentWizard.tsx
│   │   │   │   ├── SkillsConfig.tsx
│   │   │   │   ├── PromptEditor.tsx
│   │   │   │   ├── SDDViewer.tsx
│   │   │   │   ├── BuildStatus.tsx
│   │   │   │   └── TestRunner.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAgentBuilder.ts
│   │   │   │   └── useCodeGeneration.ts
│   │   │   ├── services/
│   │   │   │   └── ideService.ts
│   │   │   ├── types/
│   │   │   │   └── agent.types.ts
│   │   │   └── index.tsx
│   │   ├── marketplace/
│   │   │   ├── components/
│   │   │   │   ├── AgentCatalog.tsx
│   │   │   │   ├── AgentCard.tsx
│   │   │   │   ├── AgentDetails.tsx
│   │   │   │   ├── SearchFilter.tsx
│   │   │   │   ├── CategoryNav.tsx
│   │   │   │   └── HiringWorkflow.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAgentSearch.ts
│   │   │   │   └── useHiringProcess.ts
│   │   │   ├── services/
│   │   │   │   └── marketplaceService.ts
│   │   │   ├── types/
│   │   │   │   └── marketplace.types.ts
│   │   │   └── index.tsx
│   │   └── runtime/
│   │       ├── components/
│   │       │   ├── AgentList.tsx
│   │       │   ├── AgentMonitor.tsx
│   │       │   ├── JobAgency.tsx
│   │       │   ├── MessageBoard.tsx
│   │       │   ├── PerformanceCharts.tsx
│   │       │   ├── SecurityPanel.tsx
│   │       │   └── AuditLogs.tsx
│   │       ├── hooks/
│   │       │   ├── useRuntimeData.ts
│   │       │   └── useRealTimeUpdates.ts
│   │       ├── services/
│   │       │   └── runtimeService.ts
│   │       ├── types/
│   │       │   └── runtime.types.ts
│   │       └── index.tsx
│   ├── shared/                 # 共享资源
│   │   ├── types/              # 全局类型定义
│   │   │   ├── common.types.ts
│   │   │   ├── api.types.ts
│   │   │   └── database.types.ts
│   │   ├── constants/          # 常量定义
│   │   │   ├── routes.ts
│   │   │   ├── config.ts
│   │   │   └── mockData.ts
│   │   ├── utils/              # 工具函数
│   │   │   ├── dateUtils.ts
│   │   │   ├── formatUtils.ts
│   │   │   ├── validationUtils.ts
│   │   │   └── performanceUtils.ts
│   │   ├── hooks/              # 全局 Hooks
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useIntersection.ts
│   │   │   └── useKeyboardShortcuts.ts
│   │   └── services/           # 全局服务
│   │       ├── databaseService.ts
│   │       ├── mockApiService.ts
│   │       └── notificationService.ts
│   ├── stores/                 # Zustand 状态存储
│   │   ├── themeStore.ts
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── styles/                 # 样式文件
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── data/                   # Mock 数据
│   │   ├── mockOntologies.ts
│   │   ├── mockAgents.ts
│   │   ├── mockRuntimeData.ts
│   │   └── index.ts
│   ├── App.tsx                 # 应用根组件
│   ├── main.tsx                # 应用入口
│   ├── router.tsx              # 路由配置
│   └── vite-env.d.ts          # Vite 类型定义
├── docs/                       # 项目文档
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CHANGELOG.md
├── .kiro/                      # Kiro SDD 规格
│   └── specs/
│       └── agent-factory/
├── tests/                      # 测试文件
│   ├── __mocks__/
│   ├── components/
│   ├── features/
│   └── utils/
├── .env.example               # 环境变量模板
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── prettier.config.js
└── README.md
```

## 4. 完整数据模型设计

### 4.1 Ontology 相关类型

```typescript
// 基础类型定义
export interface OntologyDomain {
  id: string;
  name: string;
  displayName: string;
  description: string;
  industry: 'WMS' | 'TMS' | 'FMS' | 'HRM' | 'YMS' | 'OMS';
  status: 'active' | 'inactive' | 'development';
  version: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    conceptCount: number;
    relationCount: number;
    cqCoverage: number; // 0-100
    completeness: number; // 0-100
  };
}

export interface Concept {
  id: string;
  ontologyId: string;
  name: string;
  displayName: string;
  description: string;
  type: 'entity' | 'attribute' | 'relation' | 'event';
  properties: Record<string, unknown>;
  relations: Relation[];
  position?: { x: number; y: number }; // for React Flow
  createdAt: Date;
  updatedAt: Date;
}

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'is_a' | 'has_part' | 'related_to' | 'depends_on';
  name: string;
  description?: string;
  properties: Record<string, unknown>;
  weight: number; // 0-1
}

export interface IngestionStatus {
  id: string;
  ontologyId: string;
  stage: 'ingestion' | 'modeling' | 'labeling' | 'reflection';
  progress: number; // 0-100
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  logs: IngestionLog[];
}

export interface IngestionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export interface OntologyVersion {
  id: string;
  ontologyId: string;
  version: string;
  description: string;
  changes: VersionChange[];
  author: string;
  createdAt: Date;
  blueprintData: OntologyBlueprint;
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  entityType: 'concept' | 'relation';
  entityId: string;
  entityName: string;
  description: string;
}

export interface OntologyBlueprint {
  version: string;
  ontology: OntologyDomain;
  concepts: Concept[];
  relations: Relation[];
  metadata: {
    generatedAt: Date;
    tools: string[];
    checksum: string;
  };
}
```

### 4.2 Agent 相关类型

```typescript
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
```

### 4.3 MarketPlace 相关类型

```typescript
export interface MarketplaceAgent {
  id: string;
  agentId: string;
  status: 'available' | 'unavailable' | 'deprecated';
  featured: boolean;
  publishedAt: Date;
  statistics: {
    views: number;
    downloads: number;
    activeDeployments: number;
    averageRating: number;
    totalReviews: number;
  };
  compatibility: {
    platforms: string[];
    dependencies: string[];
    requirements: Record<string, string>;
  };
  license: {
    type: 'MIT' | 'Apache' | 'GPL' | 'Commercial' | 'Custom';
    details: string;
  };
  support: {
    documentation: string;
    community: string;
    email?: string;
    issues: string;
  };
}

export interface HiringTransaction {
  id: string;
  agentId: string;
  userId: string;
  status: 'pending' | 'configuring' | 'paying' | 'deploying' | 'completed' | 'failed' | 'cancelled';
  configuration: AgentConfiguration;
  payment: PaymentDetails;
  deployment: DeploymentConfig;
  createdAt: Date;
  completedAt?: Date;
}

export interface AgentConfiguration {
  instanceName: string;
  parameters: Record<string, unknown>;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  environment: 'development' | 'staging' | 'production';
  schedule?: {
    type: 'continuous' | 'scheduled' | 'event-driven';
    cron?: string;
    events?: string[];
  };
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: 'token' | 'credit-card' | 'invoice';
  tokenAddress?: string;
  transactionHash?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface DeploymentConfig {
  targetEnvironment: string;
  replicas: number;
  autoscaling: {
    enabled: boolean;
    minReplicas: number;
    maxReplicas: number;
    metrics: string[];
  };
  networking: {
    expose: boolean;
    endpoints: string[];
  };
}
```

### 4.4 Runtime 相关类型

```typescript
export interface AgentDeployment {
  id: string;
  agentId: string;
  instanceName: string;
  status: 'deploying' | 'running' | 'paused' | 'stopped' | 'error';
  environment: 'development' | 'staging' | 'production';
  version: string;
  configuration: AgentConfiguration;
  resources: ResourceUsage;
  health: HealthStatus;
  metrics: PerformanceMetrics;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceUsage {
  cpu: {
    usage: number; // percentage
    limit: number;
    requests: number;
  };
  memory: {
    usage: number; // bytes
    limit: number;
    requests: number;
  };
  storage: {
    usage: number; // bytes
    limit: number;
  };
  network: {
    inbound: number; // bytes/sec
    outbound: number; // bytes/sec
  };
}

export interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  checks: HealthCheck[];
  lastChecked: Date;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  duration: number; // milliseconds
}

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number; // milliseconds
  errorRate: number; // percentage
  throughput: number; // requests/second
  uptime: number; // percentage
  timestamps: Date[];
  values: number[];
}

export interface JobAgencyTask {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'event-driven' | 'manual';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'queued' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';
  assignedAgent?: string;
  assignedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  input: unknown;
  output?: unknown;
  logs: TaskLog[];
  metadata: {
    creator: string;
    tags: string[];
    dependencies: string[];
    timeout: number; // seconds
    retryCount: number;
    maxRetries: number;
  };
}

export interface TaskLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source: 'system' | 'agent' | 'user';
  context?: Record<string, unknown>;
}

export interface MessageBoardChannel {
  id: string;
  name: string;
  type: 'results' | 'coordination' | 'anomalies' | 'learnings';
  description: string;
  messages: ChannelMessage[];
  subscribers: string[];
  settings: ChannelSettings;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  sender: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  type: 'text' | 'alert' | 'report' | 'file' | 'metric';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  attachments: MessageAttachment[];
  timestamp: Date;
  reactions: MessageReaction[];
  thread?: string; // parent message ID for threaded replies
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface ChannelSettings {
  retention: number; // days
  allowFiles: boolean;
  maxFileSize: number; // bytes
  autoModeration: boolean;
  notifications: {
    enabled: boolean;
    keywords: string[];
    priority: 'all' | 'high-only' | 'mentions-only';
  };
}

export interface SecurityConfig {
  rbac: RBACConfiguration;
  tokens: TokenManagement;
  audit: AuditConfiguration;
}

export interface RBACConfiguration {
  roles: Role[];
  permissions: Permission[];
  assignments: RoleAssignment[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'execute' | 'admin';
}

export interface RoleAssignment {
  userId: string;
  roleId: string;
  scope?: string; // optional resource scope
  assignedAt: Date;
  assignedBy: string;
}

export interface TokenManagement {
  tokens: APIToken[];
  policies: TokenPolicy[];
}

export interface APIToken {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'service' | 'application';
  secret: string; // hashed
  scopes: string[];
  status: 'active' | 'revoked' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface TokenPolicy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  enabled: boolean;
}

export interface PolicyRule {
  condition: string;
  action: 'allow' | 'deny' | 'log' | 'rate-limit';
  parameters?: Record<string, unknown>;
}

export interface AuditConfiguration {
  enabled: boolean;
  events: AuditEvent[];
  retention: number; // days
  storage: 'local' | 'remote';
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure';
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
```

## 5. 前端页面列表和路由设计

### 5.1 路由结构

```typescript
// 路由配置
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Dashboard 路由
      {
        path: '',
        element: <Dashboard />,
        index: true
      },
      // Ontology KB 路由
      {
        path: 'ontology',
        children: [
          {
            path: '',
            element: <OntologyOverview />
          },
          {
            path: 'domains',
            element: <OntologyDomains />
          },
          {
            path: 'graph/:ontologyId?',
            element: <KnowledgeGraphViewer />
          },
          {
            path: 'ingestion',
            element: <IngestionStatus />
          },
          {
            path: 'versions/:ontologyId',
            element: <VersionHistory />
          }
        ]
      },
      // IDE 路由
      {
        path: 'ide',
        children: [
          {
            path: '',
            element: <IDEOverview />
          },
          {
            path: 'create',
            element: <AgentWizard />
          },
          {
            path: 'agent/:agentId',
            element: <AgentEditor />,
            children: [
              {
                path: '',
                element: <AgentOverview />
              },
              {
                path: 'skills',
                element: <SkillsConfiguration />
              },
              {
                path: 'prompts',
                element: <PromptEditor />
              },
              {
                path: 'sdd',
                element: <SDDViewer />
              },
              {
                path: 'build',
                element: <BuildStatus />
              },
              {
                path: 'test',
                element: <TestRunner />
              }
            ]
          }
        ]
      },
      // MarketPlace 路由
      {
        path: 'marketplace',
        children: [
          {
            path: '',
            element: <AgentCatalog />
          },
          {
            path: 'categories/:category',
            element: <CategoryView />
          },
          {
            path: 'agent/:agentId',
            element: <AgentDetails />
          },
          {
            path: 'hire/:agentId',
            element: <HiringWorkflow />
          },
          {
            path: 'my-agents',
            element: <MyAgents />
          }
        ]
      },
      // Runtime 路由
      {
        path: 'runtime',
        children: [
          {
            path: '',
            element: <RuntimeOverview />
          },
          {
            path: 'agents',
            element: <DeployedAgents />
          },
          {
            path: 'agent/:deploymentId',
            element: <AgentMonitor />,
            children: [
              {
                path: '',
                element: <AgentDashboard />
              },
              {
                path: 'logs',
                element: <AgentLogs />
              },
              {
                path: 'metrics',
                element: <AgentMetrics />
              },
              {
                path: 'config',
                element: <AgentConfiguration />
              }
            ]
          },
          {
            path: 'jobs',
            element: <JobAgency />
          },
          {
            path: 'messages',
            element: <MessageBoard />,
            children: [
              {
                path: ':channelId',
                element: <ChannelView />
              }
            ]
          },
          {
            path: 'security',
            element: <SecurityGovernance />,
            children: [
              {
                path: '',
                element: <SecurityOverview />
              },
              {
                path: 'rbac',
                element: <RBACManagement />
              },
              {
                path: 'tokens',
                element: <TokenManagement />
              },
              {
                path: 'audit',
                element: <AuditLogs />
              }
            ]
          }
        ]
      },
      // 设置路由
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            path: '',
            element: <GeneralSettings />
          },
          {
            path: 'theme',
            element: <ThemeSettings />
          },
          {
            path: 'profile',
            element: <ProfileSettings />
          }
        ]
      },
      // 404 页面
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];
```

### 5.2 页面组件清单

**Layout 组件:**
- `MainLayout.tsx` - 主布局（Sidebar + Header + Content）
- `Sidebar.tsx` - 左侧导航栏
- `Header.tsx` - 顶部导航栏
- `Breadcrumb.tsx` - 面包屑导航

**Dashboard 页面:**
- `Dashboard.tsx` - 主仪表盘
- `GlobalOverview.tsx` - 全局概览组件
- `SystemHealth.tsx` - 系统健康状态
- `QuickActions.tsx` - 快捷操作面板
- `RecentActivity.tsx` - 最近活动流

**Ontology 页面:**
- `OntologyOverview.tsx` - Ontology 总览
- `OntologyDomains.tsx` - 知识域列表
- `KnowledgeGraphViewer.tsx` - 知识图谱查看器
- `IngestionStatus.tsx` - 数据采集状态
- `VersionHistory.tsx` - 版本历史

**IDE 页面:**
- `IDEOverview.tsx` - IDE 主页
- `AgentWizard.tsx` - Agent 创建向导
- `AgentEditor.tsx` - Agent 编辑器
- `SkillsConfiguration.tsx` - 技能配置
- `PromptEditor.tsx` - Prompt 编辑器
- `SDDViewer.tsx` - SDD 文档查看器
- `BuildStatus.tsx` - 构建状态
- `TestRunner.tsx` - 测试运行器

**MarketPlace 页面:**
- `AgentCatalog.tsx` - Agent 目录
- `CategoryView.tsx` - 分类视图
- `AgentDetails.tsx` - Agent 详情页
- `HiringWorkflow.tsx` - 雇佣流程
- `MyAgents.tsx` - 我的 Agent

**Runtime 页面:**
- `RuntimeOverview.tsx` - 运行时总览
- `DeployedAgents.tsx` - 已部署 Agent 列表
- `AgentMonitor.tsx` - Agent 监控
- `JobAgency.tsx` - 任务调度
- `MessageBoard.tsx` - 消息面板
- `SecurityGovernance.tsx` - 安全治理

## 6. Mock 数据规格

### 6.1 数据生成策略

**数据量规划:**
- **Ontology 数据**: 6 个知识域，每个 100-200 概念，500-1000 关系
- **Agent 数据**: 21 个预置 Agent，涵盖各个业务场景
- **Runtime 数据**: 50+ 部署实例，历史任务 1000+，消息 500+
- **用户数据**: 模拟多用户场景，10+ 用户配置

**数据真实性要求:**
- 基于真实物流业务场景设计
- 符合 ITEM 公司实际业务流程
- 包含完整的演示路径
- 数据间关系逻辑一致

### 6.2 Mock 数据结构

```typescript
// Mock 数据生成接口
export interface MockDataGenerator {
  // 生成 Ontology 数据
  generateOntologies(): Promise<OntologyDomain[]>;
  generateConcepts(ontologyId: string, count: number): Promise<Concept[]>;
  generateRelations(concepts: Concept[]): Promise<Relation[]>;
  
  // 生成 Agent 数据
  generateAgents(): Promise<AgentDefinition[]>;
  generateSkills(): Promise<SkillConfiguration[]>;
  
  // 生成 Runtime 数据
  generateDeployments(): Promise<AgentDeployment[]>;
  generateTasks(): Promise<JobAgencyTask[]>;
  generateMessages(): Promise<ChannelMessage[]>;
  
  // 生成关联数据
  generateStatistics(): Promise<Record<string, unknown>>;
  generateTimeSeries(days: number): Promise<TimeSeriesData[]>;
}

// 预置演示场景
export interface DemoScenarios {
  // 完整的 Agent 开发流程
  agentDevelopment: {
    ontologySelection: string[];
    agentConfiguration: AgentDefinition;
    buildProcess: BuildConfiguration;
    testResults: TestConfiguration;
  };
  
  // MarketPlace 交易流程
  agentHiring: {
    selectedAgent: string;
    configuration: AgentConfiguration;
    paymentFlow: PaymentDetails;
    deployment: DeploymentConfig;
  };
  
  // 运行时监控场景
  runtimeMonitoring: {
    healthyAgents: AgentDeployment[];
    problemAgents: AgentDeployment[];
    taskQueue: JobAgencyTask[];
    alertMessages: ChannelMessage[];
  };
}
```

### 6.3 性能优化策略

**数据分区:**
- 按模块分离数据库
- 懒加载非关键数据
- 实施数据缓存策略

**渲染优化:**
- 虚拟列表/表格
- 图谱节点按需渲染
- 图片懒加载

**内存管理:**
- 定期清理过期数据
- 实施 LRU 缓存
- 监控内存使用

---

*本设计文档为 Agent Factory Platform 的技术实现蓝图，包含完整的架构、数据模型和实现规范。*