# Agent Factory Platform — 实现任务计划

## Phase 1: 项目基础设施（基础搭建）

### Task 1.1: 项目初始化
- **复杂度**: 低
- **依赖**: 无
- **完成标准**:
  - [x] `npm create vite@latest . -- --template react-ts`
  - [x] 安装核心依赖: react-router-dom, zustand, dexie, recharts, @xyflow/react, lucide-react
  - [x] 安装 UI 依赖: tailwindcss v4, @shadcn/ui, class-variance-authority, clsx, tailwind-merge
  - [x] 配置 tsconfig.json (strict mode, path aliases)
  - [x] 配置 vite.config.ts (base path: /agent-factory/, path aliases)
  - [x] 配置 tailwind (oklch 色彩, ITEM theme)

### Task 1.2: 目录结构创建
- **复杂度**: 低
- **依赖**: 1.1
- **完成标准**:
  - [x] 创建 src/components/ui/ (shadcn 组件)
  - [x] 创建 src/components/layout/
  - [x] 创建 src/features/{dashboard,ontology,ide,marketplace,runtime}/
  - [x] 创建 src/shared/{types,constants,utils,hooks,services}/
  - [x] 创建 src/stores/
  - [x] 创建 src/data/ (mock data)
  - [x] 创建 src/styles/

### Task 1.3: 布局和路由搭建
- **复杂度**: 中
- **依赖**: 1.2
- **完成标准**:
  - [x] MainLayout.tsx (sidebar + header + content area)
  - [x] Sidebar.tsx (5 模块导航: Dashboard/Ontology/IDE/MarketPlace/Runtime + 折叠功能)
  - [x] Header.tsx (breadcrumb + 主题切换 + 用户头像)
  - [x] router.tsx (完整路由配置, 嵌套路由)
  - [x] 主题 store (themeStore.ts, dark/light 切换)
  - [x] globals.css (ITEM oklch theme 变量)
  - [x] 所有路由页面占位组件

### Task 1.4: 基础 UI 组件
- **复杂度**: 中
- **依赖**: 1.3
- **完成标准**:
  - [x] shadcn/ui 组件初始化: Button, Card, Badge, Input, Select, Tabs, Dialog, Table, Tooltip, DropdownMenu, Sheet, ScrollArea, Separator
  - [x] StatusBadge.tsx (状态徽章, 不同颜色)
  - [x] SearchBox.tsx (搜索框 + debounce)
  - [x] LoadingSpinner.tsx
  - [x] EmptyState.tsx
  - [x] 验证深色/浅色主题均正常

**里程碑 M1**: 应用可启动, 导航工作, 布局完整, 空白页面就位

---

## Phase 2: 数据层和类型定义

### Task 2.1: TypeScript 类型定义
- **复杂度**: 中
- **依赖**: Phase 1
- **完成标准**:
  - [x] src/shared/types/ontology.types.ts (OntologyDomain, Concept, Relation, IngestionStatus, OntologyVersion, OntologyBlueprint)
  - [x] src/shared/types/agent.types.ts (AgentDefinition, SkillConfiguration, PromptConfiguration, SDDFiles, BuildConfiguration, TestConfiguration)
  - [x] src/shared/types/marketplace.types.ts (MarketplaceAgent, HiringTransaction, AgentConfiguration, PaymentDetails)
  - [x] src/shared/types/runtime.types.ts (AgentDeployment, ResourceUsage, HealthStatus, PerformanceMetrics, JobAgencyTask, MessageBoardChannel, ChannelMessage)
  - [x] src/shared/types/common.types.ts (User, Role, Permission, AuditEvent, APIToken)

### Task 2.2: Dexie 数据库配置
- **复杂度**: 中
- **依赖**: 2.1
- **完成标准**:
  - [x] src/shared/services/database.ts — Dexie 实例, 4 个分区数据库:
    - ontologyDB: ontologies, concepts, relations, versions
    - agentDB: agents, skills, prompts, builds, tests
    - runtimeDB: deployments, jobs, logs, metrics, messages
    - userDB: preferences, sessions, bookmarks
  - [x] 索引配置 (id, timestamp, status, ontologyId, agentId)
  - [x] 数据库初始化/迁移逻辑

### Task 2.3: Mock 数据生成
- **复杂度**: 高
- **依赖**: 2.2
- **完成标准**:
  - [x] src/data/mockOntologies.ts — 6 个知识域 (WMS/TMS/FMS/HRM/YMS/OMS), 每域 30-50 概念, 100+ 关系
  - [x] src/data/mockAgents.ts — 21 个 Agent 完整定义 (来自 21 AI Agents Plan), 包含 skills/prompts/pricing/reviews
  - [x] src/data/mockRuntimeData.ts — 部署实例、任务日志、性能指标 (含时间序列)、消息
  - [x] src/data/mockUsers.ts — 模拟用户和权限数据
  - [x] src/data/seedDatabase.ts — 首次加载时种子数据到 IndexedDB
  - [x] 所有 mock 数据基于真实物流场景

### Task 2.4: Zustand 状态管理
- **复杂度**: 中
- **依赖**: 2.2
- **完成标准**:
  - [x] src/stores/themeStore.ts (主题切换)
  - [x] src/stores/ontologyStore.ts (当前选中域/概念, 图谱状态)
  - [x] src/stores/agentStore.ts (Agent 列表/选中/创建状态)
  - [x] src/stores/runtimeStore.ts (部署列表/监控状态)
  - [x] src/stores/uiStore.ts (sidebar 折叠, modal 状态, 通知)

**里程碑 M2**: 类型系统完整, 数据库可用, Mock 数据就绪, 状态管理就位

---

## Phase 3: Dashboard 模块

### Task 3.1: 全局概览卡片
- **复杂度**: 中
- **依赖**: Phase 2
- **完成标准**:
  - [x] GlobalOverview.tsx — 4 个统计卡片: Agent 总数, 活跃数, 任务执行次数, 系统健康度
  - [x] 每个卡片含图标, 数值, 趋势指示器 (↑↓)
  - [x] 从 IndexedDB 读取真实统计

### Task 3.2: 5 层架构可视化
- **复杂度**: 高
- **依赖**: 3.1
- **完成标准**:
  - [x] ArchDiagram.tsx — 基于 React Flow 的 5 层架构图
  - [x] 5 层: Data Sources → Ontology KB → Factory → Runtime → AaaS
  - [x] 每层可点击, 跳转到对应模块
  - [x] 动画连线, 数据流方向指示
  - [x] 响应式布局

### Task 3.3: 活动流和快捷操作
- **复杂度**: 中
- **依赖**: 3.1
- **完成标准**:
  - [x] RecentActivity.tsx — 最近 24h 活动列表 (创建/部署/雇佣/异常)
  - [x] 每条活动含图标、描述、时间戳、状态颜色
  - [x] QuickActions.tsx — 4 个快捷按钮 (创建 Agent, 查看 Ontology, 浏览市场, 监控)
  - [x] SystemHealth.tsx — 系统健康仪表盘 (CPU/内存/存储饼图)

**里程碑 M3**: Dashboard 功能完整, 可视化架构图可交互

---

## Phase 4: Ontology KB 模块

### Task 4.1: Ontology 列表和概览
- **复杂度**: 中
- **依赖**: Phase 2
- **完成标准**:
  - [x] OntologyOverview.tsx — 6 个知识域卡片, 每个显示: 名称/描述/概念数/关系数/完整度/状态
  - [x] 搜索和过滤功能
  - [x] 知识采集状态总览 (Ingestion/Modeling/Labeling/Reflection 进度条)

### Task 4.2: 知识图谱查看器
- **复杂度**: 高
- **依赖**: 4.1
- **完成标准**:
  - [x] KnowledgeGraphViewer.tsx — React Flow 图谱
  - [x] 节点类型: entity(蓝)/attribute(绿)/relation(橙)/event(红)
  - [x] 支持缩放、拖拽、框选
  - [x] 点击节点显示概念详情面板
  - [x] 图谱布局算法 (dagre/elk)
  - [x] 按知识域过滤
  - [x] 节点数 < 200 时自动布局

### Task 4.3: 版本历史
- **复杂度**: 中
- **依赖**: 4.1
- **完成标准**:
  - [x] VersionHistory.tsx — Git DAG 风格版本列表
  - [x] 每个版本: 版本号、描述、变更摘要、作者、时间
  - [x] 版本比较 (Added/Modified/Removed 高亮)
  - [x] 可视化 DAG 线条

**里程碑 M4**: Ontology 模块完整, 知识图谱可交互可视化

---

## Phase 5: IDE 模块

### Task 5.1: IDE 概览和 Agent 列表
- **复杂度**: 中
- **依赖**: Phase 2
- **完成标准**:
  - [x] IDEOverview.tsx — Agent 开发状态一览 (draft/building/testing/published)
  - [x] Agent 卡片列表 (名称/状态/版本/最后修改)
  - [x] 新建 Agent 入口按钮

### Task 5.2: Agent 创建向导
- **复杂度**: 高
- **依赖**: 5.1
- **完成标准**:
  - [x] AgentWizard.tsx — 4 步向导:
    1. 基本信息 (名称/描述/分类)
    2. 知识域选择 (从 Ontology 选择子集)
    3. Skills 配置 (选择/配置可用技能)
    4. 确认并创建
  - [x] 每步有验证
  - [x] 可前进/后退/保存草稿

### Task 5.3: Agent 编辑器
- **复杂度**: 高
- **依赖**: 5.2
- **完成标准**:
  - [x] AgentEditor.tsx — 标签页式编辑器:
    - Overview: Agent 基本信息
    - Skills: 技能配置列表 (启用/禁用, 参数编辑)
    - Prompts: System/User prompt 文本编辑器 (monaco-editor 或简单 textarea)
    - SDD: 4 个 spec 文件查看器 (markdown 渲染)
    - Build: 构建状态和日志
    - Test: 测试运行器和结果
  - [x] 顶部显示 Agent 名称/状态/版本

**里程碑 M5**: IDE 模块完整, Agent 可创建/编辑/查看

---

## Phase 6: MarketPlace 模块

### Task 6.1: Agent 目录
- **复杂度**: 中
- **依赖**: Phase 2
- **完成标准**:
  - [x] AgentCatalog.tsx — 卡片网格展示 21 个 Agent
  - [x] AgentCard.tsx — 每张卡片: 名称/图标/描述/评分/价格/标签
  - [x] 搜索框 + 分类筛选器 (按行业/按功能)
  - [x] 排序: 评分/价格/下载量/最新
  - [x] 分页或无限滚动

### Task 6.2: Agent 详情页
- **复杂度**: 高
- **依赖**: 6.1
- **完成标准**:
  - [x] AgentDetails.tsx — 完整 Agent 信息:
    - 头部: 名称/图标/评分/价格
    - 描述和能力清单
    - Skills 列表
    - 版本历史 (DAG 可视化)
    - 评价和评分
    - 相关 Agent 推荐
  - [x] "雇佣" CTA 按钮

### Task 6.3: 雇佣流程
- **复杂度**: 高
- **依赖**: 6.2
- **完成标准**:
  - [x] HiringWorkflow.tsx — 4 步流程:
    1. 配置参数 (实例名/资源/环境)
    2. 定价确认 ($1-$10/月)
    3. Token 交换 (模拟支付)
    4. 部署确认
  - [x] 部署后跳转到 Runtime 监控

**里程碑 M6**: MarketPlace 完整, 21 个 Agent 可浏览/搜索/雇佣

---

## Phase 7: Runtime 模块

### Task 7.1: 部署列表和监控
- **复杂度**: 中
- **依赖**: Phase 2
- **完成标准**:
  - [x] RuntimeOverview.tsx — 运行时概览: 总部署数/运行中/异常数
  - [x] DeployedAgents.tsx — Agent 实例列表 (表格): 名称/状态/资源/活动时间
  - [x] 状态颜色: 运行(绿)/暂停(黄)/异常(红)/停止(灰)

### Task 7.2: Agent 详细监控
- **复杂度**: 高
- **依赖**: 7.1
- **完成标准**:
  - [x] AgentMonitor.tsx — 标签页:
    - Dashboard: 关键指标卡片 (请求数/响应时间/错误率/可用性)
    - Logs: 任务日志 (可搜索/过滤)
    - Metrics: 性能图表 (Recharts 时间序列: CPU/内存/请求量/响应时间)
    - Config: 当前配置查看/编辑
  - [x] 右上角操作: 暂停/重启/停止

### Task 7.3: Job Agency 和 Message Board
- **复杂度**: 高
- **依赖**: 7.1
- **完成标准**:
  - [x] JobAgency.tsx — 任务调度面板:
    - 任务队列 (queued/running/completed/failed)
    - Agent-Task 匹配可视化
    - 任务详情 (日志/输入/输出)
  - [x] MessageBoard.tsx — 4 个频道:
    - #results (执行结果)
    - #coordination (任务协调)
    - #anomalies (异常上报)
    - #learnings (经验分享)
  - [x] 消息列表 + 消息详情 (类 Slack 布局)

### Task 7.4: 安全治理面板
- **复杂度**: 中
- **依赖**: 7.1
- **完成标准**:
  - [x] SecurityGovernance.tsx — 标签页:
    - Overview: 安全概览 (Token 数/角色数/最近审计)
    - RBAC: 角色和权限管理
    - Tokens: API Token 列表 (创建/撤销/查看用量)
    - Audit: 审计日志 (可搜索/过滤/导出)

**里程碑 M7**: Runtime 完整, 监控/调度/消息/安全治理均可用

---

## Phase 8: 集成优化和部署

### Task 8.1: 跨模块集成
- **复杂度**: 中
- **依赖**: Phase 3-7
- **完成标准**:
  - [x] Dashboard 统计数据从各模块数据库实时聚合
  - [x] IDE → MarketPlace 发布流程 (状态从 published 切换)
  - [x] MarketPlace → Runtime 部署流程 (雇佣后创建 deployment)
  - [x] Ontology → IDE 知识引用 (Agent 关联的知识域)
  - [x] 全局搜索 (⌘K): 跨 Agent/Ontology/Tasks 搜索
  - [x] 面包屑导航所有层级正确

### Task 8.2: 视觉打磨
- **复杂度**: 中
- **依赖**: 8.1
- **完成标准**:
  - [x] 所有组件深色/浅色主题一致
  - [x] 动画和过渡效果 (页面切换/卡片 hover/图谱交互)
  - [x] 空状态设计
  - [x] 加载状态骨架屏
  - [x] 响应式适配 (≥1024px)
  - [x] 图标体系统一 (Lucide)

### Task 8.3: 构建和部署
- **复杂度**: 低
- **依赖**: 8.2
- **完成标准**:
  - [x] `npm run build` 无错误无警告
  - [x] vite.config.ts base: '/agent-factory/'
  - [x] GitHub Pages 部署 (gh-pages)
  - [x] README.md 完整 (项目描述/技术栈/架构/截图占位)
  - [x] 所有代码提交并推送到 main 分支

**里程碑 M8**: 项目完成, 构建通过, 部署成功, 可在线访问

---

## 依赖关系图

```
Phase 1 (基础)
    ↓
Phase 2 (数据层)
    ↓
    ├── Phase 3 (Dashboard)
    ├── Phase 4 (Ontology)
    ├── Phase 5 (IDE)
    ├── Phase 6 (MarketPlace)
    └── Phase 7 (Runtime)
         ↓ (全部完成后)
    Phase 8 (集成优化)
```

Phase 3-7 可并行开发, 但推荐顺序: Dashboard → Ontology → IDE → MarketPlace → Runtime (因为数据依赖)

## 技术风险和缓解

| 风险 | 影响 | 缓解方案 |
|------|------|---------|
| React Flow 大图渲染慢 | Ontology 图谱卡顿 | 限制可见节点数 < 200, 虚拟化, LOD |
| 21 个 Agent mock 数据量大 | 首次加载慢 | 懒加载, 按需种子数据 |
| shadcn/ui + Tailwind v4 兼容性 | 组件样式异常 | 锁定版本, 回退到 v3 如必要 |
| IndexedDB 跨 tab 同步 | 数据不一致 | Dexie.js liveQuery, BroadcastChannel |
| 组件文件过大 | 可维护性差 | 严格 < 300 行, 拆分子组件 |
