import Dexie, { Table } from 'dexie';
import { OntologyDomain, Concept, Relation, OntologyVersion } from '../types/ontology.types';
import { AgentDefinition, SkillConfiguration, BuildLog, TestCase } from '../types/agent.types';
import { AgentDeployment, JobAgencyTask, ChannelMessage, TaskLog } from '../types/runtime.types';
import { User, AuditEvent, APIToken, Notification } from '../types/common.types';
import { 
  OntologyBlueprint, 
  OBRObject, 
  OBRBehavior, 
  OBRRule, 
  OBRScenario, 
  OBRLink, 
  ValidationResult, 
  SimulationStep,
  SimulationResult
} from '../types/obr.types';

// Ontology Database (Extended for OBR)
export class OntologyDatabase extends Dexie {
  ontologies!: Table<OntologyDomain>;
  concepts!: Table<Concept>;
  relations!: Table<Relation>;
  versions!: Table<OntologyVersion>;
  // OBR tables
  blueprints!: Table<OntologyBlueprint>;
  obrObjects!: Table<OBRObject>;
  obrBehaviors!: Table<OBRBehavior>;
  obrRules!: Table<OBRRule>;
  obrScenarios!: Table<OBRScenario>;
  obrLinks!: Table<OBRLink>;
  validations!: Table<ValidationResult>;
  simulations!: Table<SimulationResult>;

  constructor() {
    super('AgentFactoryOntology');
    this.version(2).stores({
      // Legacy tables
      ontologies: 'id, name, industry, status, createdAt, updatedAt',
      concepts: 'id, ontologyId, name, type, createdAt, updatedAt',
      relations: 'id, sourceId, targetId, type',
      versions: 'id, ontologyId, version, createdAt',
      // OBR tables with optimized indexes
      blueprints: 'metadata.id, metadata.name, metadata.domain, metadata.version, metadata.createdAt, metadata.updatedAt',
      obrObjects: 'id, name, category, [metadata.id+name], [metadata.id+category]',
      obrBehaviors: 'id, name, category, [metadata.id+name], [metadata.id+category]', 
      obrRules: 'id, name, category, priority, [metadata.id+name], [metadata.id+category+priority]',
      obrScenarios: 'id, name, category, [metadata.id+name], [metadata.id+category]',
      obrLinks: 'id, sourceId, targetId, relationshipType, [sourceId+targetId], [sourceType+targetType+relationshipType]',
      validations: 'timestamp, isValid, [metadata.id+timestamp]',
      simulations: 'scenario, [scenario+timestamp]'
    });

    // Handle database version upgrade
    this.version(2).upgrade(trans => {
      console.log('Upgrading to OBR schema v2...');
      // Migration logic would go here if needed
    });
  }
}

// Agent Database
export class AgentDatabase extends Dexie {
  agents!: Table<AgentDefinition>;
  skills!: Table<SkillConfiguration>;
  buildLogs!: Table<BuildLog>;
  testCases!: Table<TestCase>;

  constructor() {
    super('AgentFactoryAgents');
    this.version(1).stores({
      agents: 'id, name, status, category.industry, category.function, createdAt, updatedAt',
      skills: 'id, name, type, enabled',
      buildLogs: 'id, timestamp, level, step',
      testCases: 'id, name, status, duration'
    });
  }
}

// Runtime Database
export class RuntimeDatabase extends Dexie {
  deployments!: Table<AgentDeployment>;
  jobs!: Table<JobAgencyTask>;
  logs!: Table<TaskLog>;
  messages!: Table<ChannelMessage>;

  constructor() {
    super('AgentFactoryRuntime');
    this.version(1).stores({
      deployments: 'id, agentId, status, environment, createdAt, updatedAt',
      jobs: 'id, name, type, priority, status, assignedAgent, createdAt',
      logs: 'id, timestamp, level, source',
      messages: 'id, channelId, sender, timestamp, type, priority'
    });
  }
}

// User Database
export class UserDatabase extends Dexie {
  users!: Table<User>;
  auditEvents!: Table<AuditEvent>;
  tokens!: Table<APIToken>;
  notifications!: Table<Notification>;

  constructor() {
    super('AgentFactoryUser');
    this.version(1).stores({
      users: 'id, username, email, createdAt, lastLogin',
      auditEvents: 'id, timestamp, userId, action, resource, outcome',
      tokens: 'id, name, type, status, createdAt, expiresAt',
      notifications: 'id, read, type, createdAt, expiresAt'
    });
  }
}

// Database instances
export const ontologyDB = new OntologyDatabase();
export const agentDB = new AgentDatabase();
export const runtimeDB = new RuntimeDatabase();
export const userDB = new UserDatabase();

// Initialize all databases
export async function initializeDatabases() {
  try {
    await Promise.all([
      ontologyDB.open(),
      agentDB.open(),
      runtimeDB.open(),
      userDB.open()
    ]);
    console.log('All databases initialized successfully');
    
    // Initialize default HRM domain if not exists
    await initializeHRMDomain();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize databases:', error);
    return false;
  }
}

// Initialize default HRM domain with sample data
async function initializeHRMDomain() {
  try {
    const existingBlueprints = await ontologyDB.blueprints.count();
    if (existingBlueprints === 0) {
      console.log('Initializing default HRM domain...');
      const hrmBlueprint = await createHRMDomainBlueprint();
      await ontologyDB.blueprints.add(hrmBlueprint);
      console.log('HRM domain initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize HRM domain:', error);
  }
}

// Create sample HRM domain blueprint
async function createHRMDomainBlueprint(): Promise<OntologyBlueprint> {
  // Import HRM domain blueprint from data
  const { HRM_DOMAIN_BLUEPRINT } = await import('../../data/hrm-domain');
  
  // Update timestamps
  const now = new Date().toISOString();
  return {
    ...HRM_DOMAIN_BLUEPRINT,
    metadata: {
      ...HRM_DOMAIN_BLUEPRINT.metadata,
      createdAt: now,
      updatedAt: now
    },
    validation: {
      ...HRM_DOMAIN_BLUEPRINT.validation!,
      timestamp: now
    }
  };
}

// Clear all databases (for development/testing)
export async function clearAllDatabases() {
  try {
    await Promise.all([
      ontologyDB.delete(),
      agentDB.delete(),
      runtimeDB.delete(),
      userDB.delete()
    ]);
    console.log('All databases cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear databases:', error);
    return false;
  }
}