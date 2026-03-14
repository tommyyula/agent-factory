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