export interface PipelineInput {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

export interface PipelineOutput {
  name: string;
  type: string;
  description?: string;
}

export interface PipelinePhase {
  id: string;
  name: string;
  agentId: string;
  order: number;
  inputs: PipelineInput[];
  outputs: PipelineOutput[];
  qualityCheck?: {
    agentId: string;
    requireEvidence: boolean;
    passThreshold: number;
  };
  parallelWith?: string[];
}

export interface QualityGate {
  afterPhase: string;
  agentId: string;
  criteria: string[];
  blocking: boolean;
}

export interface AgentPipeline {
  id: string;
  name: string;
  description: string;
  phases: PipelinePhase[];
  qualityGates: QualityGate[];
  retryPolicy: {
    maxAttempts: number;
    escalationAgent?: string;
  };
  memoryConfig: {
    enabled: boolean;
    tagStrategy: 'project' | 'phase' | 'agent';
    persistence: 'session' | 'project' | 'permanent';
  };
}
