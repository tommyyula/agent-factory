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