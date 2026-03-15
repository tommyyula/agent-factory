# Agency-Agents 研究分析 → Agent Factory 借鉴方案

> 来源: [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)
> 分析日期: 2026-03-14
> 目的: 借鉴其 Agent 定义模式和多 Agent 协同机制，改进 Agent Factory Platform

---

## 一、Agency-Agents 项目概览

- **183 个 AI Agent 人格模板**，按 13 个 Division 分类
- 每个 Agent 用一个 Markdown 文件定义（YAML frontmatter + 结构化正文）
- 支持 8 种工具格式导出（Claude Code, Cursor, Copilot, Aider, Windsurf, OpenClaw, Gemini CLI, OpenCode）
- MIT 开源，社区活跃

### Division 分类

| Division | Agent 数量 | 说明 |
|----------|-----------|------|
| engineering | 23 | 前端/后端/AI/DevOps/安全/嵌入式 |
| marketing | 26 | 增长/内容/社媒/SEO |
| specialized | 24 | MCP Builder/Orchestrator/合规/供应链 |
| design | 8 | UX/UI/品牌/视觉叙事 |
| testing | 8 | QA/性能/API/Reality Checker |
| sales | 8 | 发现/教练/提案/管线 |
| product | 6 | PM/趋势/反馈/Sprint |
| project-management | 6 | 高级PM/Jira/实验跟踪 |
| support | 6 | 客服/分析/财务/基础设施 |
| spatial-computing | 6 | VisionOS/WebXR/Metal |
| paid-media | 7 | PPC/程序化/创意/追踪 |
| strategy | 6 | 商业/定价/竞争 |
| game-development | 10 | 游戏设计/叙事/音频 |

---

## 二、Agent 定义模式（核心借鉴点）

### 统一的 YAML Frontmatter Schema

```yaml
---
name: Frontend Developer
description: Expert in React...
color: cyan
emoji: 🖥️
vibe: Builds responsive web apps
---
```

### 统一的正文 6 大板块

```markdown
## 🧠 Identity & Memory    → 角色 + 性格 + 记忆模式
## 🎯 Core Mission          → 核心职责（3-4个方向）
## 🚨 Critical Rules        → 红线/约束
## 🔄 Workflow Process      → 工作流步骤（带代码示例）
## 💭 Communication Style   → 沟通风格（4条简短规则）
## 🎯 Success Metrics       → 量化成功指标
```

---

## 三、多 Agent 协同模式

### 模式 1: Manual Handoff（手动串联）
人工复制粘贴 Agent 输出作为下一个 Agent 输入

### 模式 2: MCP Memory 持久化协同（推荐）
- Tag 系统: 每个记忆打项目标签 + 接收者标签
- Recall: Agent 启动时自动搜索相关记忆
- Rollback: QA 失败时回滚到 checkpoint
- 跨会话持久化

### 模式 3: Orchestrator 自动化流水线
```
Orchestrator
├── Phase 1: PM → 创建任务清单
├── Phase 2: Architect → 技术架构
├── Phase 3: Dev-QA Loop
│   ├── Dev Agent → 实现任务
│   ├── QA Agent → 验证（要截图证据）
│   ├── PASS → 下一任务
│   └── FAIL → 重试（最多 3 次）
└── Phase 4: Integration Testing → GO/NO-GO
```

---

## 四、对 Agent Factory Platform 的改进建议

### 4.1 Agent Soul Schema

```typescript
interface AgentSoul {
  identity: {
    role: string;
    personality: string;
    memory: string;
    experience: string;
  };
  mission: MissionBlock[];
  criticalRules: string[];
  workflow: WorkflowStep[];
  communicationStyle: string[];
  successMetrics: SuccessMetric[];
  vibe: string;
  emoji: string;
  color: string;
}
```

### 4.2 Agent Pipeline Schema

```typescript
interface AgentPipeline {
  id: string;
  name: string;
  phases: PipelinePhase[];
  qualityGates: QualityGate[];
  retryPolicy: { maxAttempts: number; escalationAgent?: string };
  memoryConfig: {
    enabled: boolean;
    tagStrategy: 'project' | 'phase' | 'agent';
    persistence: 'session' | 'project' | 'permanent';
  };
}

interface PipelinePhase {
  id: string;
  name: string;
  agentId: string;
  order: number;
  inputs: PipelineInput[];
  outputs: PipelineOutput[];
  qualityCheck?: { agentId: string; requireEvidence: boolean; passThreshold: number };
  parallelWith?: string[];
}
```

### 4.3 物流行业预置模板

| Agent | Division | 职责 |
|-------|----------|------|
| 仓库优化师 | warehouse-ops | 库位优化、拣货路径、劳动力分配 |
| 库存预测师 | inventory | 需求预测、安全库存、补货建议 |
| 运输调度师 | transport-mgmt | 路线优化、车辆调度、成本控制 |
| 订单分析师 | order-mgmt | 订单模式分析、异常检测、SLA 监控 |
| 合规审计师 | customs-compliance | 海关法规、文档检查、风险预警 |
| 数据集成师 | integration | EDI/API 映射、数据清洗、格式转换 |
| QA 验证师 | quality-assurance | 操作验证、异常报告、根因分析 |

---

## 五、实施优先级

1. **P0**: AgentSoul Schema + Soul Editor UI
2. **P0**: AgentPipeline Schema + 多 Agent 编排
3. **P1**: Pipeline Visualizer (Runtime 页面流程图)
4. **P1**: 7 个物流行业 Agent 模板
5. **P2**: Export 格式 (OpenClaw + Claude Code)
6. **P2**: MCP Memory 集成

---

*分析完成 by iTom | 2026-03-14*
