/**
 * Agent Runtime Store
 * State management for Agent Sandbox, Team Testing, and Mock Data Generation
 */

import { create } from 'zustand';
import { SimpleAgencyAgent } from '@/data/agency-agents-simple';
import { SchemaTable } from '@/data/agency-schemas';
import { ExecutionEvent, AgentSimulatorResponse } from '@/shared/services/agent-simulator.service';
import { 
  WorkflowDefinition, 
  WorkflowExecutionState, 
  TeamExecutionEvent 
} from '@/shared/services/workflow-simulator.service';
import { 
  DataGenerationConfig, 
  GeneratedDataSet,
  TableGenerationConfig 
} from '@/shared/services/mockdata-generator.service';

// Agent Sandbox State
export interface AgentSession {
  id: string;
  agentId: string;
  agentName: string;
  domain: string;
  status: 'idle' | 'running' | 'error';
  messages: ChatMessage[];
  context: SessionContext;
  metrics: SessionMetrics;
  createdAt: Date;
  lastActivity: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'thinking' | 'tool_call' | 'tool_result';
  content: string;
  data?: any;
  timestamp: Date;
  metadata?: {
    tokenCount?: number;
    executionTime?: number;
    tablesAccessed?: string[];
  };
}

export interface SessionContext {
  domain: string;
  availableTables: string[];
  mockData?: Map<string, any[]>;
  parameters: Record<string, any>;
}

export interface SessionMetrics {
  totalMessages: number;
  totalTokens: number;
  executionTime: number;
  tablesAccessed: Set<string>;
  toolCallCount: number;
}

// Team Testing State
export interface AgentTeam {
  id: string;
  name: string;
  agents: string[];
  workflow?: WorkflowDefinition;
  status: 'draft' | 'ready' | 'running' | 'completed' | 'failed';
  createdAt: Date;
}

export interface TeamExecution {
  id: string;
  teamId: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  events: TeamExecutionEvent[];
  results?: any;
  startTime: Date;
  endTime?: Date;
}

// Mock Data Generation State
export interface MockDataSession {
  id: string;
  domain: string;
  config: DataGenerationConfig;
  status: 'draft' | 'generating' | 'completed' | 'error';
  progress: number;
  generatedData?: Map<string, any[]>;
  error?: string;
  createdAt: Date;
}

// Store Interface
interface AgentRuntimeStore {
  // Agent Sandbox
  selectedAgent: SimpleAgencyAgent | null;
  activeSessions: AgentSession[];
  currentSession: AgentSession | null;
  
  // Team Testing
  availableAgents: SimpleAgencyAgent[];
  currentTeam: AgentTeam | null;
  teamExecutions: TeamExecution[];
  currentExecution: TeamExecution | null;
  
  // Mock Data Generation
  selectedDomain: string;
  availableTables: SchemaTable[];
  mockDataSessions: MockDataSession[];
  currentMockSession: MockDataSession | null;
  
  // Loading states
  loading: {
    agents: boolean;
    sessions: boolean;
    execution: boolean;
    generation: boolean;
  };
  
  // Error states
  errors: {
    agentLoad: string | null;
    execution: string | null;
    generation: string | null;
  };

  // Agent Sandbox Actions
  selectAgent: (agent: SimpleAgencyAgent) => void;
  createSession: (agent: SimpleAgencyAgent, context: SessionContext) => string;
  setCurrentSession: (sessionId: string | null) => void;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
  addSessionMessage: (sessionId: string, message: ChatMessage) => void;
  updateSessionMetrics: (sessionId: string, metrics: Partial<SessionMetrics>) => void;
  closeSession: (sessionId: string) => void;
  clearSessions: () => void;

  // Team Testing Actions
  setAvailableAgents: (agents: SimpleAgencyAgent[]) => void;
  createTeam: (name: string, agentIds: string[]) => string;
  setCurrentTeam: (teamId: string | null) => void;
  updateTeamWorkflow: (teamId: string, workflow: WorkflowDefinition) => void;
  startTeamExecution: (teamId: string) => Promise<string>;
  addExecutionEvent: (executionId: string, event: TeamExecutionEvent) => void;
  updateExecutionProgress: (executionId: string, progress: number) => void;
  completeExecution: (executionId: string, results: any) => void;
  pauseExecution: (executionId: string) => void;
  resumeExecution: (executionId: string) => void;
  stopExecution: (executionId: string) => void;

  // Mock Data Generation Actions
  setSelectedDomain: (domain: string) => void;
  setAvailableTables: (tables: SchemaTable[]) => void;
  createMockSession: (domain: string, config: DataGenerationConfig) => string;
  setCurrentMockSession: (sessionId: string | null) => void;
  updateGenerationConfig: (sessionId: string, config: Partial<DataGenerationConfig>) => void;
  startDataGeneration: (sessionId: string) => Promise<void>;
  updateGenerationProgress: (sessionId: string, progress: number) => void;
  completeGeneration: (sessionId: string, data: Map<string, any[]>) => void;
  setGenerationError: (sessionId: string, error: string) => void;
  exportGeneratedData: (sessionId: string, format: 'json' | 'sql' | 'csv') => Promise<string>;

  // Utility Actions
  setLoading: (key: keyof AgentRuntimeStore['loading'], value: boolean) => void;
  setError: (key: keyof AgentRuntimeStore['errors'], value: string | null) => void;
  reset: () => void;
}

export const useAgentRuntimeStore = create<AgentRuntimeStore>((set, get) => ({
  // Initial state
  selectedAgent: null,
  activeSessions: [],
  currentSession: null,
  availableAgents: [],
  currentTeam: null,
  teamExecutions: [],
  currentExecution: null,
  selectedDomain: '',
  availableTables: [],
  mockDataSessions: [],
  currentMockSession: null,
  
  loading: {
    agents: false,
    sessions: false,
    execution: false,
    generation: false
  },
  
  errors: {
    agentLoad: null,
    execution: null,
    generation: null
  },

  // Agent Sandbox Actions
  selectAgent: (agent) => set({ selectedAgent: agent }),

  createSession: (agent, context) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: AgentSession = {
      id: sessionId,
      agentId: agent.id,
      agentName: agent.name,
      domain: agent.domain,
      status: 'idle',
      messages: [],
      context,
      metrics: {
        totalMessages: 0,
        totalTokens: 0,
        executionTime: 0,
        tablesAccessed: new Set(),
        toolCallCount: 0
      },
      createdAt: new Date(),
      lastActivity: new Date()
    };

    set((state) => ({
      activeSessions: [...state.activeSessions, session],
      currentSession: session
    }));

    return sessionId;
  },

  setCurrentSession: (sessionId) => {
    const { activeSessions } = get();
    const session = sessionId ? activeSessions.find(s => s.id === sessionId) : null;
    set({ currentSession: session });
  },

  sendMessage: async (sessionId, content) => {
    const { activeSessions, addSessionMessage } = get();
    const session = activeSessions.find(s => s.id === sessionId);
    
    if (!session) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    addSessionMessage(sessionId, userMessage);

    // Update session status
    set((state) => ({
      activeSessions: state.activeSessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'running' as const, lastActivity: new Date() }
          : s
      )
    }));

    // Simulate agent processing (this would be replaced by actual agent simulator)
    try {
      // This is a placeholder - in real implementation, this would use the agentSimulator
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const agentMessage: ChatMessage = {
        id: `msg_${Date.now()}_agent`,
        type: 'agent',
        content: `模拟响应：已处理您的请求 "${content}"`,
        timestamp: new Date(),
        metadata: {
          tokenCount: Math.floor(Math.random() * 100) + 50,
          executionTime: Math.floor(Math.random() * 1000) + 200
        }
      };

      addSessionMessage(sessionId, agentMessage);

      // Update session status and metrics
      set((state) => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === sessionId 
            ? { 
                ...s, 
                status: 'idle' as const,
                lastActivity: new Date(),
                metrics: {
                  ...s.metrics,
                  totalMessages: s.metrics.totalMessages + 2,
                  totalTokens: s.metrics.totalTokens + (agentMessage.metadata?.tokenCount || 0),
                  executionTime: s.metrics.executionTime + (agentMessage.metadata?.executionTime || 0)
                }
              }
            : s
        )
      }));

    } catch (error) {
      set((state) => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === sessionId 
            ? { ...s, status: 'error' as const }
            : s
        )
      }));
    }
  },

  addSessionMessage: (sessionId, message) => {
    set((state) => ({
      activeSessions: state.activeSessions.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, message] }
          : s
      ),
      currentSession: state.currentSession?.id === sessionId
        ? { ...state.currentSession, messages: [...state.currentSession.messages, message] }
        : state.currentSession
    }));
  },

  updateSessionMetrics: (sessionId, metrics) => {
    set((state) => ({
      activeSessions: state.activeSessions.map(s => 
        s.id === sessionId 
          ? { ...s, metrics: { ...s.metrics, ...metrics } }
          : s
      )
    }));
  },

  closeSession: (sessionId) => {
    set((state) => ({
      activeSessions: state.activeSessions.filter(s => s.id !== sessionId),
      currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
    }));
  },

  clearSessions: () => {
    set({ activeSessions: [], currentSession: null });
  },

  // Team Testing Actions
  setAvailableAgents: (agents) => set({ availableAgents: agents }),

  createTeam: (name, agentIds) => {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const team: AgentTeam = {
      id: teamId,
      name,
      agents: agentIds,
      status: 'draft',
      createdAt: new Date()
    };

    set((state) => ({
      currentTeam: team
    }));

    return teamId;
  },

  setCurrentTeam: (teamId) => {
    // In a real implementation, this would load the team from storage
    set({ currentTeam: null });
  },

  updateTeamWorkflow: (teamId, workflow) => {
    set((state) => ({
      currentTeam: state.currentTeam?.id === teamId
        ? { ...state.currentTeam, workflow, status: 'ready' as const }
        : state.currentTeam
    }));
  },

  startTeamExecution: async (teamId) => {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: TeamExecution = {
      id: executionId,
      teamId,
      workflowId: get().currentTeam?.workflow?.id || '',
      status: 'running',
      progress: 0,
      events: [],
      startTime: new Date()
    };

    set((state) => ({
      teamExecutions: [...state.teamExecutions, execution],
      currentExecution: execution
    }));

    return executionId;
  },

  addExecutionEvent: (executionId, event) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, events: [...e.events, event] }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, events: [...state.currentExecution.events, event] }
        : state.currentExecution
    }));
  },

  updateExecutionProgress: (executionId, progress) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, progress }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, progress }
        : state.currentExecution
    }));
  },

  completeExecution: (executionId, results) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, status: 'completed' as const, progress: 100, results, endTime: new Date() }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, status: 'completed' as const, progress: 100, results, endTime: new Date() }
        : state.currentExecution
    }));
  },

  pauseExecution: (executionId) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, status: 'paused' as const }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, status: 'paused' as const }
        : state.currentExecution
    }));
  },

  resumeExecution: (executionId) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, status: 'running' as const }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, status: 'running' as const }
        : state.currentExecution
    }));
  },

  stopExecution: (executionId) => {
    set((state) => ({
      teamExecutions: state.teamExecutions.map(e =>
        e.id === executionId
          ? { ...e, status: 'failed' as const, endTime: new Date() }
          : e
      ),
      currentExecution: state.currentExecution?.id === executionId
        ? { ...state.currentExecution, status: 'failed' as const, endTime: new Date() }
        : state.currentExecution
    }));
  },

  // Mock Data Generation Actions
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),

  setAvailableTables: (tables) => set({ availableTables: tables }),

  createMockSession: (domain, config) => {
    const sessionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: MockDataSession = {
      id: sessionId,
      domain,
      config,
      status: 'draft',
      progress: 0,
      createdAt: new Date()
    };

    set((state) => ({
      mockDataSessions: [...state.mockDataSessions, session],
      currentMockSession: session
    }));

    return sessionId;
  },

  setCurrentMockSession: (sessionId) => {
    const { mockDataSessions } = get();
    const session = sessionId ? mockDataSessions.find(s => s.id === sessionId) : null;
    set({ currentMockSession: session });
  },

  updateGenerationConfig: (sessionId, configUpdates) => {
    set((state) => ({
      mockDataSessions: state.mockDataSessions.map(s =>
        s.id === sessionId
          ? { ...s, config: { ...s.config, ...configUpdates } }
          : s
      ),
      currentMockSession: state.currentMockSession?.id === sessionId
        ? { ...state.currentMockSession, config: { ...state.currentMockSession.config, ...configUpdates } }
        : state.currentMockSession
    }));
  },

  startDataGeneration: async (sessionId) => {
    set((state) => ({
      mockDataSessions: state.mockDataSessions.map(s =>
        s.id === sessionId
          ? { ...s, status: 'generating' as const, progress: 0 }
          : s
      ),
      currentMockSession: state.currentMockSession?.id === sessionId
        ? { ...state.currentMockSession, status: 'generating' as const, progress: 0 }
        : state.currentMockSession
    }));

    // Simulate data generation progress
    const progressInterval = setInterval(() => {
      const { currentMockSession, updateGenerationProgress } = get();
      if (currentMockSession && currentMockSession.id === sessionId && currentMockSession.status === 'generating') {
        const newProgress = Math.min(currentMockSession.progress + Math.random() * 20, 95);
        updateGenerationProgress(sessionId, newProgress);
        
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          // Complete generation after a short delay
          setTimeout(() => {
            const mockData = new Map([
              ['sample_table', [{ id: 1, name: '示例数据', status: 'ACTIVE', created_at: new Date().toISOString() }]]
            ]);
            get().completeGeneration(sessionId, mockData);
          }, 1000);
        }
      } else {
        clearInterval(progressInterval);
      }
    }, 500);
  },

  updateGenerationProgress: (sessionId, progress) => {
    set((state) => ({
      mockDataSessions: state.mockDataSessions.map(s =>
        s.id === sessionId
          ? { ...s, progress }
          : s
      ),
      currentMockSession: state.currentMockSession?.id === sessionId
        ? { ...state.currentMockSession, progress }
        : state.currentMockSession
    }));
  },

  completeGeneration: (sessionId, data) => {
    set((state) => ({
      mockDataSessions: state.mockDataSessions.map(s =>
        s.id === sessionId
          ? { ...s, status: 'completed' as const, progress: 100, generatedData: data }
          : s
      ),
      currentMockSession: state.currentMockSession?.id === sessionId
        ? { ...state.currentMockSession, status: 'completed' as const, progress: 100, generatedData: data }
        : state.currentMockSession
    }));
  },

  setGenerationError: (sessionId, error) => {
    set((state) => ({
      mockDataSessions: state.mockDataSessions.map(s =>
        s.id === sessionId
          ? { ...s, status: 'error' as const, error }
          : s
      ),
      currentMockSession: state.currentMockSession?.id === sessionId
        ? { ...state.currentMockSession, status: 'error' as const, error }
        : state.currentMockSession
    }));
  },

  exportGeneratedData: async (sessionId, format) => {
    const { mockDataSessions } = get();
    const session = mockDataSessions.find(s => s.id === sessionId);
    
    if (!session || !session.generatedData) {
      throw new Error('No data to export');
    }

    // Mock export implementation
    switch (format) {
      case 'json':
        return JSON.stringify(Object.fromEntries(session.generatedData), null, 2);
      case 'sql':
        // Generate SQL INSERT statements
        let sql = '';
        for (const [tableName, rows] of session.generatedData) {
          if (rows.length > 0) {
            const columns = Object.keys(rows[0]);
            sql += `-- Table: ${tableName}\n`;
            rows.forEach(row => {
              const values = columns.map(col => 
                typeof row[col] === 'string' ? `'${row[col]}'` : row[col]
              ).join(', ');
              sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
            });
            sql += '\n';
          }
        }
        return sql;
      case 'csv':
        // Generate CSV for first table
        const firstTable = Array.from(session.generatedData.values())[0];
        if (firstTable && firstTable.length > 0) {
          const headers = Object.keys(firstTable[0]);
          const csv = [
            headers.join(','),
            ...firstTable.map(row => 
              headers.map(h => `"${row[h] || ''}"`).join(',')
            )
          ].join('\n');
          return csv;
        }
        return '';
      default:
        throw new Error('Unsupported export format');
    }
  },

  // Utility Actions
  setLoading: (key, value) => {
    set((state) => ({
      loading: { ...state.loading, [key]: value }
    }));
  },

  setError: (key, value) => {
    set((state) => ({
      errors: { ...state.errors, [key]: value }
    }));
  },

  reset: () => {
    set({
      selectedAgent: null,
      activeSessions: [],
      currentSession: null,
      availableAgents: [],
      currentTeam: null,
      teamExecutions: [],
      currentExecution: null,
      selectedDomain: '',
      availableTables: [],
      mockDataSessions: [],
      currentMockSession: null,
      loading: {
        agents: false,
        sessions: false,
        execution: false,
        generation: false
      },
      errors: {
        agentLoad: null,
        execution: null,
        generation: null
      }
    });
  }
}));