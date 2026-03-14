import { AgentConfiguration } from './marketplace.types';

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