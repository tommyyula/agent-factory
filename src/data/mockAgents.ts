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
  },
  // Phase 2 (P1) Agents
  {
    id: 'agent-007',
    name: 'crm-agent',
    displayName: 'CRM Agent',
    description: '智能客户关系管理，自动化客户数据分析和跟进',
    version: '1.4.2',
    status: 'published',
    category: {
      industry: 'general',
      function: 'data-analysis'
    },
    pricing: {
      model: 'subscription',
      price: 15,
      currency: 'USD'
    },
    capabilities: ['客户画像分析', '销售机会识别', '自动跟进提醒', '客户满意度预测'],
    skills: [
      {
        id: 'skill-crm-001',
        name: '客户分析',
        type: 'function',
        parameters: [
          {
            name: 'customer_data',
            type: 'object',
            required: true,
            description: '客户数据对象'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个CRM专家，帮助分析客户数据并提供业务洞察。',
      user: '请分析客户 {customer_id} 的数据并提供建议',
      variables: [
        {
          name: 'customer_id',
          type: 'string',
          description: '客户ID',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['oms-001'],
    sdd: {
      requirements: '# CRM Agent 需求\n\n构建智能客户关系管理系统...',
      design: '# 技术设计\n\n集成CRM API和ML模型...',
      domainAnalysis: '# 领域分析\n\n客户关系管理是销售流程的核心...',
      tasks: '# 实现任务\n\n1. 客户数据集成\n2. 机器学习模型训练...'
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
      coverage: 87
    },
    metadata: {
      author: 'ITEM Sales Team',
      tags: ['CRM', '销售', '客户分析'],
      rating: 4.6,
      downloads: 1420,
      reviews: []
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'agent-008',
    name: 'business-council',
    displayName: 'Business Council Agent',
    description: '商业决策支持委员会，提供战略建议和风险评估',
    version: '2.0.0',
    status: 'published',
    category: {
      industry: 'general',
      function: 'data-analysis'
    },
    pricing: {
      model: 'subscription',
      price: 25,
      currency: 'USD'
    },
    capabilities: ['战略分析', '风险评估', '市场趋势预测', '投资决策支持'],
    skills: [
      {
        id: 'skill-bc-001',
        name: '战略分析',
        type: 'function',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个商业战略专家，提供专业的商业决策建议。',
      user: '请分析 {business_scenario} 并提供决策建议',
      variables: [
        {
          name: 'business_scenario',
          type: 'string',
          description: '商业场景描述',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['oms-001'],
    sdd: {
      requirements: '# Business Council Agent 需求\n\n建立智能商业决策支持系统...',
      design: '# 技术设计\n\n多Agent协作决策架构...',
      domainAnalysis: '# 领域分析\n\n商业决策需要多维度分析...',
      tasks: '# 实现任务\n\n1. 决策模型设计\n2. 协作机制实现...'
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
      coverage: 91
    },
    metadata: {
      author: 'ITEM Strategy Team',
      tags: ['战略', '决策支持', '商业分析'],
      rating: 4.8,
      downloads: 756,
      reviews: []
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'agent-009',
    name: 'security-council',
    displayName: 'Security Council Agent',
    description: '安全委员会Agent，多层安全威胁检测和响应',
    version: '1.6.1',
    status: 'published',
    category: {
      industry: 'general',
      function: 'monitoring'
    },
    pricing: {
      model: 'subscription',
      price: 20,
      currency: 'USD'
    },
    capabilities: ['威胁情报分析', '安全事件响应', '合规性检查', '安全策略制定'],
    skills: [
      {
        id: 'skill-sc-001',
        name: '威胁分析',
        type: 'function',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个网络安全专家，负责威胁检测和安全策略制定。',
      user: '请分析安全事件 {incident_data} 并提供响应建议',
      variables: [
        {
          name: 'incident_data',
          type: 'object',
          description: '安全事件数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Security Council Agent 需求\n\n构建企业级安全管理系统...',
      design: '# 技术设计\n\n分布式安全检测架构...',
      domainAnalysis: '# 领域分析\n\n网络安全需要主动防御...',
      tasks: '# 实现任务\n\n1. 威胁建模\n2. 检测规则开发...'
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
      coverage: 93
    },
    metadata: {
      author: 'ITEM Security Team',
      tags: ['安全', '威胁检测', '事件响应'],
      rating: 4.9,
      downloads: 1189,
      reviews: []
    },
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: 'agent-010',
    name: 'platform-council',
    displayName: 'Platform Council Agent',
    description: '平台治理委员会，管理平台资源和服务质量',
    version: '1.3.5',
    status: 'published',
    category: {
      industry: 'general',
      function: 'monitoring'
    },
    pricing: {
      model: 'subscription',
      price: 18,
      currency: 'USD'
    },
    capabilities: ['资源调度', '服务监控', '性能优化', '平台治理'],
    skills: [
      {
        id: 'skill-pc-001',
        name: '平台监控',
        type: 'function',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个平台管理专家，负责平台资源优化和服务质量保障。',
      user: '请分析平台状态 {platform_metrics} 并提供优化建议',
      variables: [
        {
          name: 'platform_metrics',
          type: 'object',
          description: '平台指标数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Platform Council Agent 需求\n\n建立智能平台治理系统...',
      design: '# 技术设计\n\n微服务架构监控体系...',
      domainAnalysis: '# 领域分析\n\n平台治理是数字化基础...',
      tasks: '# 实现任务\n\n1. 监控体系设计\n2. 自动化运维...'
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
      coverage: 89
    },
    metadata: {
      author: 'ITEM Platform Team',
      tags: ['平台管理', '监控', '治理'],
      rating: 4.7,
      downloads: 892,
      reviews: []
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'agent-011',
    name: 'jira-tracker',
    displayName: 'Jira Tracker Agent',
    description: 'Jira项目管理集成，自动任务跟踪和进度同步',
    version: '1.7.3',
    status: 'published',
    category: {
      industry: 'general',
      function: 'automation'
    },
    pricing: {
      model: 'subscription',
      price: 8,
      currency: 'USD'
    },
    capabilities: ['任务自动创建', '状态同步', '工时统计', '进度报告'],
    skills: [
      {
        id: 'skill-jira-001',
        name: 'Jira集成',
        type: 'integration',
        parameters: [
          {
            name: 'jira_config',
            type: 'object',
            required: true,
            description: 'Jira配置信息'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个项目管理专家，负责Jira任务的智能管理。',
      user: '请处理Jira任务 {task_data}',
      variables: [
        {
          name: 'task_data',
          type: 'object',
          description: '任务数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Jira Tracker Agent 需求\n\n实现Jira智能集成...',
      design: '# 技术设计\n\nRESTful API集成架构...',
      domainAnalysis: '# 领域分析\n\n项目管理自动化提高效率...',
      tasks: '# 实现任务\n\n1. API集成开发\n2. 数据同步机制...'
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
      author: 'ITEM DevOps Team',
      tags: ['Jira', '项目管理', '自动化'],
      rating: 4.5,
      downloads: 2156,
      reviews: []
    },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-03-14')
  },
  // Phase 3 (P2) Agents
  {
    id: 'agent-012',
    name: 'meeting-notes',
    displayName: 'Meeting Notes Agent',
    description: '智能会议记录和总结，自动生成会议纪要',
    version: '1.5.1',
    status: 'published',
    category: {
      industry: 'general',
      function: 'productivity'
    },
    pricing: {
      model: 'subscription',
      price: 6,
      currency: 'USD'
    },
    capabilities: ['语音转文字', '关键信息提取', '待办事项识别', '会议总结'],
    skills: [
      {
        id: 'skill-meeting-001',
        name: '会议分析',
        type: 'nlp',
        parameters: [
          {
            name: 'meeting_transcript',
            type: 'string',
            required: true,
            description: '会议转录文本'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个会议助手，负责分析会议内容并生成结构化总结。',
      user: '请分析会议记录 {meeting_content} 并生成总结',
      variables: [
        {
          name: 'meeting_content',
          type: 'string',
          description: '会议内容',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['hrm-001'],
    sdd: {
      requirements: '# Meeting Notes Agent 需求\n\n实现智能会议记录...',
      design: '# 技术设计\n\n基于NLP的信息提取...',
      domainAnalysis: '# 领域分析\n\n会议效率是团队协作关键...',
      tasks: '# 实现任务\n\n1. 语音识别集成\n2. 信息提取算法...'
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
      author: 'ITEM Productivity Team',
      tags: ['会议', '记录', 'NLP'],
      rating: 4.6,
      downloads: 1678,
      reviews: []
    },
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-03-06')
  },
  {
    id: 'agent-013',
    name: 'diet-journal',
    displayName: 'Diet Journal Agent',
    description: '智能饮食记录和营养分析，健康生活助手',
    version: '1.2.4',
    status: 'published',
    category: {
      industry: 'healthcare',
      function: 'lifestyle'
    },
    pricing: {
      model: 'subscription',
      price: 4,
      currency: 'USD'
    },
    capabilities: ['营养成分分析', '热量计算', '饮食建议', '健康趋势跟踪'],
    skills: [
      {
        id: 'skill-diet-001',
        name: '营养分析',
        type: 'function',
        parameters: [
          {
            name: 'food_items',
            type: 'array',
            required: true,
            description: '食物列表'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个营养专家，帮助用户分析饮食和制定健康计划。',
      user: '请分析今日饮食 {diet_data} 并提供建议',
      variables: [
        {
          name: 'diet_data',
          type: 'object',
          description: '饮食数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Diet Journal Agent 需求\n\n构建智能饮食管理系统...',
      design: '# 技术设计\n\n营养数据库和分析算法...',
      domainAnalysis: '# 领域分析\n\n健康管理是现代生活需求...',
      tasks: '# 实现任务\n\n1. 营养数据集成\n2. 分析模型开发...'
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
      coverage: 82
    },
    metadata: {
      author: 'ITEM Health Team',
      tags: ['健康', '营养', '生活方式'],
      rating: 4.4,
      downloads: 1234,
      reviews: []
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'agent-014',
    name: 'prompt-optimizer',
    displayName: 'Prompt Optimizer Agent',
    description: 'AI提示词优化器，提升模型交互效果',
    version: '2.1.2',
    status: 'published',
    category: {
      industry: 'ai-tools',
      function: 'optimization'
    },
    pricing: {
      model: 'subscription',
      price: 12,
      currency: 'USD'
    },
    capabilities: ['提示词分析', '效果预测', '自动优化', 'A/B测试'],
    skills: [
      {
        id: 'skill-prompt-001',
        name: '提示词优化',
        type: 'optimization',
        parameters: [
          {
            name: 'original_prompt',
            type: 'string',
            required: true,
            description: '原始提示词'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个提示词工程专家，帮助优化AI模型的交互提示。',
      user: '请优化提示词 {prompt_text}',
      variables: [
        {
          name: 'prompt_text',
          type: 'string',
          description: '待优化的提示词',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Prompt Optimizer Agent 需求\n\n建立提示词优化系统...',
      design: '# 技术设计\n\n基于强化学习的优化算法...',
      domainAnalysis: '# 领域分析\n\n提示词工程是AI应用关键...',
      tasks: '# 实现任务\n\n1. 优化算法设计\n2. 评估指标开发...'
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
      author: 'ITEM AI Team',
      tags: ['提示词', 'AI优化', '机器学习'],
      rating: 4.8,
      downloads: 987,
      reviews: []
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-03-13')
  },
  {
    id: 'agent-015',
    name: 'usage-tracker',
    displayName: 'Usage Tracker Agent',
    description: '系统使用情况跟踪和分析，优化资源配置',
    version: '1.4.7',
    status: 'published',
    category: {
      industry: 'general',
      function: 'analytics'
    },
    pricing: {
      model: 'subscription',
      price: 7,
      currency: 'USD'
    },
    capabilities: ['使用统计', '行为分析', '性能监控', '资源优化建议'],
    skills: [
      {
        id: 'skill-usage-001',
        name: '使用分析',
        type: 'analytics',
        parameters: [
          {
            name: 'usage_data',
            type: 'object',
            required: true,
            description: '使用数据'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个数据分析专家，负责系统使用情况的深度分析。',
      user: '请分析使用数据 {usage_metrics} 并提供优化建议',
      variables: [
        {
          name: 'usage_metrics',
          type: 'object',
          description: '使用指标数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Usage Tracker Agent 需求\n\n实现系统使用分析...',
      design: '# 技术设计\n\n实时数据处理架构...',
      domainAnalysis: '# 领域分析\n\n使用分析驱动产品优化...',
      tasks: '# 实现任务\n\n1. 数据采集机制\n2. 分析报表设计...'
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
      author: 'ITEM Analytics Team',
      tags: ['分析', '监控', '优化'],
      rating: 4.6,
      downloads: 1543,
      reviews: []
    },
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-03-09')
  },
  {
    id: 'agent-016',
    name: 'self-updater',
    displayName: 'Self Updater Agent',
    description: '自我更新和学习Agent，持续改进系统能力',
    version: '1.8.1',
    status: 'published',
    category: {
      industry: 'ai-tools',
      function: 'self-improvement'
    },
    pricing: {
      model: 'subscription',
      price: 16,
      currency: 'USD'
    },
    capabilities: ['自我学习', '模型更新', '性能优化', '能力扩展'],
    skills: [
      {
        id: 'skill-update-001',
        name: '自我更新',
        type: 'learning',
        parameters: [],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个自我进化的AI系统，负责持续学习和优化。',
      user: '请分析当前性能并制定改进计划',
      variables: []
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Self Updater Agent 需求\n\n构建自我进化AI系统...',
      design: '# 技术设计\n\n在线学习和模型更新架构...',
      domainAnalysis: '# 领域分析\n\n自我改进是AGI发展方向...',
      tasks: '# 实现任务\n\n1. 学习算法设计\n2. 安全更新机制...'
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
      coverage: 96
    },
    metadata: {
      author: 'ITEM Research Team',
      tags: ['自我学习', 'AI进化', '持续改进'],
      rating: 4.9,
      downloads: 678,
      reviews: []
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-03-11')
  },
  // Phase 4 (P3) Agents
  {
    id: 'agent-017',
    name: 'code-reviewer',
    displayName: 'Code Reviewer Agent',
    description: '智能代码审查，自动检测问题和优化建议',
    version: '2.2.1',
    status: 'published',
    category: {
      industry: 'development',
      function: 'code-analysis'
    },
    pricing: {
      model: 'subscription',
      price: 14,
      currency: 'USD'
    },
    capabilities: ['代码质量检测', '安全漏洞扫描', '性能分析', '最佳实践建议'],
    skills: [
      {
        id: 'skill-code-001',
        name: '代码分析',
        type: 'function',
        parameters: [
          {
            name: 'code_content',
            type: 'string',
            required: true,
            description: '代码内容'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个资深代码审查专家，提供专业的代码质量评估。',
      user: '请审查代码 {code_snippet} 并提供改进建议',
      variables: [
        {
          name: 'code_snippet',
          type: 'string',
          description: '代码片段',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Code Reviewer Agent 需求\n\n建立智能代码审查系统...',
      design: '# 技术设计\n\n静态分析和机器学习结合...',
      domainAnalysis: '# 领域分析\n\n代码质量是软件工程基础...',
      tasks: '# 实现任务\n\n1. 分析引擎开发\n2. 规则库建设...'
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
      author: 'ITEM Dev Team',
      tags: ['代码审查', '质量检测', '开发工具'],
      rating: 4.7,
      downloads: 2890,
      reviews: []
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'agent-018',
    name: 'image-gen',
    displayName: 'Image Generator Agent',
    description: '智能图像生成，支持多种风格和场景',
    version: '1.9.3',
    status: 'published',
    category: {
      industry: 'creative',
      function: 'generation'
    },
    pricing: {
      model: 'pay-per-use',
      price: 0.5,
      currency: 'USD'
    },
    capabilities: ['文本到图像', '风格转换', '图像编辑', '批量生成'],
    skills: [
      {
        id: 'skill-image-001',
        name: '图像生成',
        type: 'generation',
        parameters: [
          {
            name: 'prompt',
            type: 'string',
            required: true,
            description: '图像描述提示'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个创意图像生成专家，能够将文字描述转化为精美图像。',
      user: '请生成图像：{image_description}',
      variables: [
        {
          name: 'image_description',
          type: 'string',
          description: '图像描述',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Image Generator Agent 需求\n\n实现智能图像生成...',
      design: '# 技术设计\n\n基于扩散模型的生成架构...',
      domainAnalysis: '# 领域分析\n\n创意生成是AI应用热点...',
      tasks: '# 实现任务\n\n1. 模型集成\n2. 生成优化...'
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
      coverage: 86
    },
    metadata: {
      author: 'ITEM Creative Team',
      tags: ['图像生成', 'AI艺术', '创意工具'],
      rating: 4.8,
      downloads: 3456,
      reviews: []
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-03-07')
  },
  {
    id: 'agent-019',
    name: 'wiki-sync',
    displayName: 'Wiki Sync Agent',
    description: '知识库同步Agent，多平台知识统一管理',
    version: '1.3.8',
    status: 'published',
    category: {
      industry: 'knowledge',
      function: 'integration'
    },
    pricing: {
      model: 'subscription',
      price: 9,
      currency: 'USD'
    },
    capabilities: ['多平台同步', '版本控制', '冲突解决', '知识图谱更新'],
    skills: [
      {
        id: 'skill-wiki-001',
        name: 'Wiki同步',
        type: 'integration',
        parameters: [
          {
            name: 'wiki_platforms',
            type: 'array',
            required: true,
            description: 'Wiki平台列表'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个知识管理专家，负责多平台知识的统一管理和同步。',
      user: '请同步 {wiki_sources} 的知识内容',
      variables: [
        {
          name: 'wiki_sources',
          type: 'array',
          description: '知识源列表',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['wms-001', 'tms-001', 'oms-001'],
    sdd: {
      requirements: '# Wiki Sync Agent 需求\n\n实现知识库智能同步...',
      design: '# 技术设计\n\n分布式同步架构...',
      domainAnalysis: '# 领域分析\n\n知识统一管理提高效率...',
      tasks: '# 实现任务\n\n1. 同步机制设计\n2. 冲突解决算法...'
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
      author: 'ITEM Knowledge Team',
      tags: ['知识同步', 'Wiki管理', '知识图谱'],
      rating: 4.5,
      downloads: 1876,
      reviews: []
    },
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-03-04')
  },
  {
    id: 'agent-020',
    name: 'atlas-bridge',
    displayName: 'Atlas Bridge Agent',
    description: '物流地图集成Agent，全球物流网络可视化',
    version: '2.0.4',
    status: 'published',
    category: {
      industry: 'TMS',
      function: 'visualization'
    },
    pricing: {
      model: 'subscription',
      price: 22,
      currency: 'USD'
    },
    capabilities: ['地图集成', '路径优化', '实时跟踪', '网络分析'],
    skills: [
      {
        id: 'skill-atlas-001',
        name: '地图分析',
        type: 'geospatial',
        parameters: [
          {
            name: 'route_data',
            type: 'object',
            required: true,
            description: '路线数据'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个物流地理信息专家，负责路线规划和网络优化。',
      user: '请分析物流路线 {route_info} 并优化',
      variables: [
        {
          name: 'route_info',
          type: 'object',
          description: '路线信息',
          source: 'user'
        }
      ]
    },
    ontologySubset: ['tms-001'],
    sdd: {
      requirements: '# Atlas Bridge Agent 需求\n\n构建物流地图智能系统...',
      design: '# 技术设计\n\nGIS和AI结合的架构...',
      domainAnalysis: '# 领域分析\n\n地理信息是物流核心...',
      tasks: '# 实现任务\n\n1. 地图API集成\n2. 路径算法优化...'
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
      coverage: 91
    },
    metadata: {
      author: 'ITEM TMS Team',
      tags: ['地图', '物流', 'GIS'],
      rating: 4.8,
      downloads: 1345,
      reviews: []
    },
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-03-13')
  },
  {
    id: 'agent-021',
    name: 'social-monitor',
    displayName: 'Social Monitor Agent',
    description: '社交媒体监控Agent，品牌声誉和舆情分析',
    version: '1.6.2',
    status: 'published',
    category: {
      industry: 'marketing',
      function: 'monitoring'
    },
    pricing: {
      model: 'subscription',
      price: 13,
      currency: 'USD'
    },
    capabilities: ['舆情监控', '情感分析', '趋势预测', '危机预警'],
    skills: [
      {
        id: 'skill-social-001',
        name: '社交分析',
        type: 'nlp',
        parameters: [
          {
            name: 'social_content',
            type: 'string',
            required: true,
            description: '社交媒体内容'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个社交媒体分析专家，负责品牌舆情监控和分析。',
      user: '请分析社交媒体内容 {social_data} 的情感和趋势',
      variables: [
        {
          name: 'social_data',
          type: 'object',
          description: '社交媒体数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Social Monitor Agent 需求\n\n建立社交媒体监控系统...',
      design: '# 技术设计\n\n实时数据抓取和NLP分析...',
      domainAnalysis: '# 领域分析\n\n社交媒体是品牌传播重要渠道...',
      tasks: '# 实现任务\n\n1. 数据抓取机制\n2. 情感分析模型...'
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
      coverage: 87
    },
    metadata: {
      author: 'ITEM Marketing Team',
      tags: ['社交媒体', '舆情监控', '情感分析'],
      rating: 4.6,
      downloads: 2234,
      reviews: []
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-02')
  },
  {
    id: 'agent-022',
    name: 'memory-curator',
    displayName: 'Memory Curator Agent',
    description: '记忆管理Agent，智能信息存储和回忆',
    version: '1.7.5',
    status: 'published',
    category: {
      industry: 'ai-tools',
      function: 'memory-management'
    },
    pricing: {
      model: 'subscription',
      price: 11,
      currency: 'USD'
    },
    capabilities: ['记忆存储', '智能检索', '知识关联', '遗忘管理'],
    skills: [
      {
        id: 'skill-memory-001',
        name: '记忆管理',
        type: 'memory',
        parameters: [
          {
            name: 'memory_content',
            type: 'object',
            required: true,
            description: '记忆内容'
          }
        ],
        enabled: true,
        configuration: {}
      }
    ],
    prompts: {
      system: '你是一个记忆管理专家，负责智能化的信息存储和检索。',
      user: '请管理记忆内容 {memory_data}',
      variables: [
        {
          name: 'memory_data',
          type: 'object',
          description: '记忆数据',
          source: 'user'
        }
      ]
    },
    ontologySubset: [],
    sdd: {
      requirements: '# Memory Curator Agent 需求\n\n构建智能记忆管理系统...',
      design: '# 技术设计\n\n向量数据库和关联网络...',
      domainAnalysis: '# 领域分析\n\n记忆管理是认知智能核心...',
      tasks: '# 实现任务\n\n1. 记忆模型设计\n2. 检索优化...'
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
      coverage: 93
    },
    metadata: {
      author: 'ITEM Cognitive Team',
      tags: ['记忆管理', '认知智能', 'AI记忆'],
      rating: 4.7,
      downloads: 1567,
      reviews: []
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10')
  }
];