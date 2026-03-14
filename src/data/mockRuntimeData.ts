import { AgentDeployment, JobAgencyTask, ChannelMessage, MessageBoardChannel } from '../shared/types/runtime.types';

export const mockDeployments: AgentDeployment[] = [
  {
    id: 'deploy-001',
    agentId: 'agent-001',
    instanceName: 'email-triage-prod',
    status: 'running',
    environment: 'production',
    version: '1.2.0',
    configuration: {
      instanceName: 'email-triage-prod',
      parameters: {
        threshold: 0.8,
        autoReply: true
      },
      resources: {
        cpu: '500m',
        memory: '1Gi',
        storage: '2Gi'
      },
      environment: 'production'
    },
    resources: {
      cpu: {
        usage: 45,
        limit: 500,
        requests: 250
      },
      memory: {
        usage: 512 * 1024 * 1024, // 512MB in bytes
        limit: 1024 * 1024 * 1024, // 1GB
        requests: 512 * 1024 * 1024
      },
      storage: {
        usage: 800 * 1024 * 1024, // 800MB
        limit: 2 * 1024 * 1024 * 1024 // 2GB
      },
      network: {
        inbound: 1024, // bytes/sec
        outbound: 512
      }
    },
    health: {
      status: 'healthy',
      checks: [
        {
          name: 'API Health',
          status: 'pass',
          message: 'API responding normally',
          duration: 150
        },
        {
          name: 'Memory Usage',
          status: 'pass',
          message: 'Memory usage within limits',
          duration: 50
        }
      ],
      lastChecked: new Date()
    },
    metrics: {
      requestCount: 1250,
      averageResponseTime: 180,
      errorRate: 0.5,
      throughput: 15.2,
      uptime: 99.8,
      timestamps: [
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date(Date.now() - 12 * 60 * 60 * 1000),
        new Date()
      ],
      values: [120, 150, 180]
    },
    lastActivity: new Date(),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  },
  {
    id: 'deploy-002',
    agentId: 'agent-002',
    instanceName: 'calendar-brief-dev',
    status: 'running',
    environment: 'development',
    version: '1.1.3',
    configuration: {
      instanceName: 'calendar-brief-dev',
      parameters: {
        lookAhead: 7,
        includeWeekends: false
      },
      resources: {
        cpu: '200m',
        memory: '512Mi',
        storage: '1Gi'
      },
      environment: 'development'
    },
    resources: {
      cpu: {
        usage: 25,
        limit: 200,
        requests: 100
      },
      memory: {
        usage: 256 * 1024 * 1024,
        limit: 512 * 1024 * 1024,
        requests: 256 * 1024 * 1024
      },
      storage: {
        usage: 400 * 1024 * 1024,
        limit: 1024 * 1024 * 1024
      },
      network: {
        inbound: 512,
        outbound: 256
      }
    },
    health: {
      status: 'healthy',
      checks: [
        {
          name: 'Calendar Sync',
          status: 'pass',
          message: 'Calendar integration working',
          duration: 200
        }
      ],
      lastChecked: new Date()
    },
    metrics: {
      requestCount: 450,
      averageResponseTime: 120,
      errorRate: 1.2,
      throughput: 8.5,
      uptime: 98.5,
      timestamps: [
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date(Date.now() - 12 * 60 * 60 * 1000),
        new Date()
      ],
      values: [100, 110, 120]
    },
    lastActivity: new Date(),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date()
  },
  {
    id: 'deploy-003',
    agentId: 'agent-003',
    instanceName: 'knowledge-base-prod',
    status: 'paused',
    environment: 'production',
    version: '2.0.1',
    configuration: {
      instanceName: 'knowledge-base-prod',
      parameters: {
        indexSize: 10000,
        vectorDim: 768
      },
      resources: {
        cpu: '1000m',
        memory: '2Gi',
        storage: '5Gi'
      },
      environment: 'production'
    },
    resources: {
      cpu: {
        usage: 0,
        limit: 1000,
        requests: 500
      },
      memory: {
        usage: 0,
        limit: 2 * 1024 * 1024 * 1024,
        requests: 1024 * 1024 * 1024
      },
      storage: {
        usage: 3 * 1024 * 1024 * 1024,
        limit: 5 * 1024 * 1024 * 1024
      },
      network: {
        inbound: 0,
        outbound: 0
      }
    },
    health: {
      status: 'unknown',
      checks: [],
      lastChecked: new Date(Date.now() - 60 * 60 * 1000)
    },
    metrics: {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      throughput: 0,
      uptime: 85.2,
      timestamps: [],
      values: []
    },
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000)
  }
];

export const mockTasks: JobAgencyTask[] = [
  {
    id: 'task-001',
    name: 'Process Daily Email Batch',
    description: '处理每日邮件批次，进行分类和优先级排序',
    type: 'scheduled',
    priority: 'high',
    status: 'running',
    assignedAgent: 'deploy-001',
    assignedAt: new Date(Date.now() - 30 * 60 * 1000),
    startedAt: new Date(Date.now() - 25 * 60 * 1000),
    input: {
      emailBatch: 'batch-20240314-001',
      count: 127
    },
    logs: [
      {
        id: 'log-001',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        level: 'info',
        message: 'Task started, processing 127 emails',
        source: 'system'
      },
      {
        id: 'log-002',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        level: 'info',
        message: 'Processed 85 emails, 42 remaining',
        source: 'agent'
      }
    ],
    metadata: {
      creator: 'system',
      tags: ['email', 'daily', 'batch'],
      dependencies: [],
      timeout: 1800,
      retryCount: 0,
      maxRetries: 3
    }
  },
  {
    id: 'task-002',
    name: 'Generate Weekly Calendar Summary',
    description: '生成本周的日程摘要报告',
    type: 'manual',
    priority: 'medium',
    status: 'completed',
    assignedAgent: 'deploy-002',
    assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 90 * 60 * 1000),
    input: {
      dateRange: {
        start: '2024-03-11',
        end: '2024-03-17'
      }
    },
    output: {
      totalMeetings: 15,
      totalHours: 22.5,
      conflicts: 2
    },
    logs: [
      {
        id: 'log-003',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        level: 'info',
        message: 'Starting weekly summary generation',
        source: 'agent'
      },
      {
        id: 'log-004',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        level: 'info',
        message: 'Summary completed successfully',
        source: 'agent'
      }
    ],
    metadata: {
      creator: 'user-001',
      tags: ['calendar', 'weekly', 'summary'],
      dependencies: [],
      timeout: 600,
      retryCount: 0,
      maxRetries: 1
    }
  },
  {
    id: 'task-003',
    name: 'Knowledge Base Index Update',
    description: '更新知识库索引，添加新文档',
    type: 'event-driven',
    priority: 'low',
    status: 'queued',
    input: {
      newDocuments: ['doc-001', 'doc-002', 'doc-003'],
      indexVersion: '2.1.0'
    },
    logs: [],
    metadata: {
      creator: 'system',
      tags: ['knowledge', 'index', 'update'],
      dependencies: [],
      timeout: 3600,
      retryCount: 0,
      maxRetries: 2
    }
  }
];

export const mockChannels: MessageBoardChannel[] = [
  {
    id: 'channel-001',
    name: 'results',
    type: 'results',
    description: 'Agent 执行结果和成功消息',
    messages: [],
    subscribers: ['user-001', 'user-002'],
    settings: {
      retention: 30,
      allowFiles: true,
      maxFileSize: 10 * 1024 * 1024,
      autoModeration: false,
      notifications: {
        enabled: true,
        keywords: ['success', 'completed'],
        priority: 'all'
      }
    }
  },
  {
    id: 'channel-002',
    name: 'coordination',
    type: 'coordination',
    description: 'Agent 间协调和任务分配消息',
    messages: [],
    subscribers: ['user-001'],
    settings: {
      retention: 14,
      allowFiles: false,
      maxFileSize: 0,
      autoModeration: true,
      notifications: {
        enabled: true,
        keywords: ['urgent', 'conflict'],
        priority: 'high-only'
      }
    }
  },
  {
    id: 'channel-003',
    name: 'anomalies',
    type: 'anomalies',
    description: '异常和错误报告',
    messages: [],
    subscribers: ['user-001', 'user-002', 'user-003'],
    settings: {
      retention: 90,
      allowFiles: true,
      maxFileSize: 5 * 1024 * 1024,
      autoModeration: false,
      notifications: {
        enabled: true,
        keywords: ['error', 'failure', 'critical'],
        priority: 'all'
      }
    }
  },
  {
    id: 'channel-004',
    name: 'learnings',
    type: 'learnings',
    description: 'Agent 学习和改进建议',
    messages: [],
    subscribers: ['user-001'],
    settings: {
      retention: 60,
      allowFiles: true,
      maxFileSize: 20 * 1024 * 1024,
      autoModeration: false,
      notifications: {
        enabled: false,
        keywords: [],
        priority: 'mentions-only'
      }
    }
  }
];

export const mockMessages: ChannelMessage[] = [
  {
    id: 'msg-001',
    channelId: 'channel-001',
    sender: 'email-triage-prod',
    senderType: 'agent',
    content: '✅ 成功处理 127 封邮件，分类完成。高优先级邮件 15 封，中优先级 45 封，低优先级 67 封。',
    type: 'report',
    priority: 'medium',
    tags: ['success', 'email', 'batch'],
    attachments: [],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    reactions: [
      {
        emoji: '👍',
        users: ['user-001'],
        count: 1
      }
    ]
  },
  {
    id: 'msg-002',
    channelId: 'channel-003',
    sender: 'system',
    senderType: 'system',
    content: '⚠️ Knowledge Base Agent 检测到索引不一致，需要重建索引。预计修复时间 30 分钟。',
    type: 'alert',
    priority: 'high',
    tags: ['warning', 'knowledge-base', 'index'],
    attachments: [],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reactions: []
  },
  {
    id: 'msg-003',
    channelId: 'channel-002',
    sender: 'job-agency',
    senderType: 'system',
    content: '📋 任务 "Process Daily Email Batch" 已分配给 email-triage-prod，预计完成时间 15 分钟。',
    type: 'text',
    priority: 'medium',
    tags: ['coordination', 'task-assignment'],
    attachments: [],
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    reactions: []
  }
];