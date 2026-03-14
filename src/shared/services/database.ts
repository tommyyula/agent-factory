import Dexie, { Table } from 'dexie';
import { OntologyDomain, Concept, Relation, OntologyVersion } from '../types/ontology.types';
import { AgentDefinition, SkillConfiguration, BuildLog, TestCase } from '../types/agent.types';
import { AgentDeployment, JobAgencyTask, ChannelMessage, TaskLog } from '../types/runtime.types';
import { User, AuditEvent, APIToken, Notification } from '../types/common.types';

// Ontology Database
export class OntologyDatabase extends Dexie {
  ontologies!: Table<OntologyDomain>;
  concepts!: Table<Concept>;
  relations!: Table<Relation>;
  versions!: Table<OntologyVersion>;

  constructor() {
    super('AgentFactoryOntology');
    this.version(1).stores({
      ontologies: 'id, name, industry, status, createdAt, updatedAt',
      concepts: 'id, ontologyId, name, type, createdAt, updatedAt',
      relations: 'id, sourceId, targetId, type',
      versions: 'id, ontologyId, version, createdAt'
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
    return true;
  } catch (error) {
    console.error('Failed to initialize databases:', error);
    return false;
  }
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