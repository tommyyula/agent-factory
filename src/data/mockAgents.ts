import { AgentDefinition } from '../shared/types/agent.types';

export const mockAgents: AgentDefinition[] = [
  {
    id: 'agent-001',
    name: 'email-triage',
    displayName: 'Email Triage Agent',
    description: '自动分类和优先级排序邮件，提高邮件处理效率',
    version: '1.2.0',
    status: 'published',
    category: {
      industry: 'general',
      function: 'automation'
    },
    pricing: {
      model: 'subscription',
      price: 5,
      currency: 'USD'
    },
    capabilities: ['邮件分类', '优先级排序', '自动回复建议', 'VIP 识别'],
    skills: [
      {
        id: 'skill-email-001',
        name: '邮件分析',
        type: 'function',
        parameters: [
          {
            name: 'email_content',
            type: 'string',
            required: true,
            description: '邮件内容'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个邮件分拣助手，负责分析邮件内容并确定优先级。',
      user: '请分析以下邮件：{email_content}',
      variables: [
        {
          name: 'email_content',
          type: 'string',
          description: '邮件内容',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['oms-001'],
    sdd: {
      requirements: '# Email Triage Agent 需求\n\n处理邮件分类和优先级排序...',
      design: '# 技术设计\n\n使用 NLP 技术分析邮件内容...',
      domainAnalysis: '# 领域分析\n\n邮件处理是办公自动化的重要环节...',
      tasks: '# 实现任务\n\n1. 邮件内容解析\n2. 分类算法实现...'
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
      coverage: 95
    },
    metadata: {
      author: 'ITEM Tech Team',
      tags: ['邮件', '自动化', 'NLP'],
      rating: 4.8,
      downloads: 1250,
      reviews: []
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'agent-002',
    name: 'calendar-brief',
    displayName: 'Calendar Brief Agent',
    description: '智能日程摘要生成，提供每日会议和任务概览',
    version: '1.1.3',
    status: 'published',
    category: {
      industry: 'general',
      function: 'data-analysis'
    },
    pricing: {
      model: 'subscription',
      price: 3,
      currency: 'USD'
    },
    capabilities: ['日程分析', '冲突检测', '会议摘要', '时间优化建议'],
    skills: [
      {
        id: 'skill-calendar-001',
        name: '日程解析',
        type: 'function',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个日程管理助手，负责分析和优化用户的日程安排。',
      user: '请分析今日日程并生成摘要',
      variables: []
    },
    ontologySubset: ['hrm-001'],
    sdd: {
      requirements: '# Calendar Brief Agent 需求\n\n生成智能日程摘要...',
      design: '# 技术设计\n\n集成日历 API...',
      domainAnalysis: '# 领域分析\n\n时间管理是提高工作效率的关键...',
      tasks: '# 实现任务\n\n1. 日历数据获取\n2. 冲突检测算法...'
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
      coverage: 88
    },
    metadata: {
      author: 'ITEM Tech Team',
      tags: ['日历', '日程', '时间管理'],
      rating: 4.6,
      downloads: 890,
      reviews: []
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'agent-003',
    name: 'knowledge-base',
    displayName: 'Knowledge Base Agent',
    description: '智能知识库查询和维护，快速检索相关信息',
    version: '2.0.1',
    status: 'published',
    category: {
      industry: 'general',
      function: 'data-analysis'
    },
    pricing: {
      model: 'subscription',
      price: 8,
      currency: 'USD'
    },
    capabilities: ['知识检索', '相关性排序', '知识图谱构建', '自动更新'],
    skills: [
      {
        id: 'skill-kb-001',
        name: '知识检索',
        type: 'knowledge',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个知识库管理专家，帮助用户查找和管理知识。',
      user: '请帮我查找关于 {query} 的信息',
      variables: [
        {
          name: 'query',
          type: 'string',
          description: '查询内容',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['wms-001', 'tms-001', 'oms-001'],
    sdd: {
      requirements: '# Knowledge Base Agent 需求\n\n构建智能知识检索系统...',
      design: '# 技术设计\n\n使用向量数据库存储知识...',
      domainAnalysis: '# 领域分析\n\n知识管理是企业数字化的核心...',
      tasks: '# 实现任务\n\n1. 知识向量化\n2. 相似度计算...'
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
      coverage: 92
    },
    metadata: {
      author: 'ITEM Tech Team',
      tags: ['知识库', '检索', 'RAG'],
      rating: 4.9,
      downloads: 2100,
      reviews: []
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'agent-004',
    name: 'backup-agent',
    displayName: 'Backup Agent',
    description: '自动数据备份和恢复管理，确保数据安全',
    version: '1.5.2',
    status: 'published',
    category: {
      industry: 'general',
      function: 'automation'
    },
    pricing: {
      model: 'subscription',
      price: 6,
      currency: 'USD'
    },
    capabilities: ['自动备份', '增量备份', '数据验证', '恢复测试'],
    skills: [],
    prompts: {
      system: '你是一个数据备份专家，负责管理系统数据备份。',
      user: '请执行数据备份任务',
      variables: []
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Backup Agent 需求\n\n实现自动化数据备份...',
      design: '# 技术设计\n\n分布式备份架构...',
      domainAnalysis: '# 领域分析\n\n数据备份是企业风险管理的重要环节...',
      tasks: '# 实现任务\n\n1. 备份策略制定\n2. 存储管理...'
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
      coverage: 85
    },
    metadata: {
      author: 'ITEM Tech Team',
      tags: ['备份', '数据安全', '恢复'],
      rating: 4.5,
      downloads: 650,
      reviews: []
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: 'agent-005',
    name: 'security-layer',
    displayName: 'Security Layer Agent',
    description: '智能安全监控和威胁检测，保护系统安全',
    version: '1.8.0',
    status: 'published',
    category: {
      industry: 'general',
      function: 'monitoring'
    },
    pricing: {
      model: 'subscription',
      price: 10,
      currency: 'USD'
    },
    capabilities: ['威胁检测', '异常分析', '访问控制', '安全审计'],
    skills: [],
    prompts: {
      system: '你是一个安全专家，负责监控和分析系统安全状态。',
      user: '请分析当前安全状态',
      variables: []
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Security Layer Agent 需求\n\n构建智能安全防护系统...',
      design: '# 技术设计\n\n多层安全防护架构...',
      domainAnalysis: '# 领域分析\n\n网络安全是数字化转型的基础...',
      tasks: '# 实现任务\n\n1. 威胁模型建立\n2. 检测算法开发...'
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
      coverage: 94
    },
    metadata: {
      author: 'ITEM Security Team',
      tags: ['安全', '监控', '威胁检测'],
      rating: 4.7,
      downloads: 1850,
      reviews: []
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: 'agent-006',
    name: 'warehouse-optimizer',
    displayName: 'Warehouse Optimizer',
    description: 'WMS 仓库布局和流程优化，提高仓储效率',
    version: '2.1.1',
    status: 'published',
    category: {
      industry: 'WMS',
      function: 'automation'
    },
    pricing: {
      model: 'subscription',
      price: 12,
      currency: 'USD'
    },
    capabilities: ['布局优化', '路径规划', '库存配置', '效率分析'],
    skills: [],
    prompts: {
      system: '你是仓库优化专家，帮助改善仓储运营效率。',
      user: '请分析仓库布局并提供优化建议',
      variables: []
    },
    ontologySubset: ['wms-001'],
    sdd: {
      requirements: '# Warehouse Optimizer 需求\n\n优化仓库运营流程...',
      design: '# 技术设计\n\n基于算法的布局优化...',
      domainAnalysis: '# 领域分析\n\n仓储优化直接影响物流成本...',
      tasks: '# 实现任务\n\n1. 数据采集\n2. 优化算法实现...'
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
      coverage: 90
    },
    metadata: {
      author: 'ITEM WMS Team',
      tags: ['仓储', '优化', 'WMS'],
      rating: 4.8,
      downloads: 980,
      reviews: []
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-14')
  }
  // ... 更多 Agent 定义将在后续实现中添加
];

// 计划中的其余 15 个 Agent（简化版本）
export const remainingAgents: string[] = [
  'crm-agent',
  'business-council',
  'security-council', 
  'platform-council',
  'jira-tracker',
  'meeting-notes',
  'diet-journal',
  'prompt-optimizer',
  'usage-tracker',
  'self-updater',
  'code-reviewer',
  'image-gen',
  'wiki-sync',
  'atlas-bridge',
  'social-monitor',
  'memory-curator'
];