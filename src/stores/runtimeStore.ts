import { create } from 'zustand';
import { AgentDeployment, JobAgencyTask, ChannelMessage } from '../shared/types/runtime.types';

interface RuntimeStore {
  // State
  deployments: AgentDeployment[];
  selectedDeployment: AgentDeployment | null;
  tasks: JobAgencyTask[];
  selectedTask: JobAgencyTask | null;
  messages: ChannelMessage[];
  selectedChannel: string | null;
  
  loading: boolean;
  error: string | null;

  // Monitoring state
  refreshInterval: number;
  autoRefresh: boolean;
  lastRefresh: Date | null;

  // Filter state
  statusFilter: string | null;
  environmentFilter: string | null;
  agentFilter: string | null;

  // Actions
  setDeployments: (deployments: AgentDeployment[]) => void;
  setSelectedDeployment: (deployment: AgentDeployment | null) => void;
  setTasks: (tasks: JobAgencyTask[]) => void;
  setSelectedTask: (task: JobAgencyTask | null) => void;
  setMessages: (messages: ChannelMessage[]) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Monitoring actions
  setRefreshInterval: (interval: number) => void;
  toggleAutoRefresh: () => void;
  updateLastRefresh: () => void;

  // Filter actions
  setStatusFilter: (status: string | null) => void;
  setEnvironmentFilter: (environment: string | null) => void;
  setAgentFilter: (agentId: string | null) => void;
  clearFilters: () => void;

  // CRUD actions
  updateDeployment: (id: string, updates: Partial<AgentDeployment>) => void;
  addTask: (task: JobAgencyTask) => void;
  updateTask: (id: string, updates: Partial<JobAgencyTask>) => void;
  addMessage: (message: ChannelMessage) => void;
  
  // Control actions
  startAgent: (deploymentId: string) => Promise<void>;
  stopAgent: (deploymentId: string) => Promise<void>;
  restartAgent: (deploymentId: string) => Promise<void>;
  pauseAgent: (deploymentId: string) => Promise<void>;
}

export const useRuntimeStore = create<RuntimeStore>((set, get) => ({
  // Initial state
  deployments: [],
  selectedDeployment: null,
  tasks: [],
  selectedTask: null,
  messages: [],
  selectedChannel: null,
  loading: false,
  error: null,

  // Monitoring initial state
  refreshInterval: 30000, // 30 seconds
  autoRefresh: true,
  lastRefresh: null,

  // Filter initial state
  statusFilter: null,
  environmentFilter: null,
  agentFilter: null,

  // Basic actions
  setDeployments: (deployments) => set({ deployments }),
  setSelectedDeployment: (deployment) => set({ selectedDeployment: deployment }),
  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setMessages: (messages) => set({ messages }),
  setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Monitoring actions
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
  updateLastRefresh: () => set({ lastRefresh: new Date() }),

  // Filter actions
  setStatusFilter: (status) => set({ statusFilter: status }),
  setEnvironmentFilter: (environment) => set({ environmentFilter: environment }),
  setAgentFilter: (agentId) => set({ agentFilter: agentId }),
  clearFilters: () => set({ 
    statusFilter: null, 
    environmentFilter: null, 
    agentFilter: null 
  }),

  // CRUD actions
  updateDeployment: (id, updates) => set((state) => ({
    deployments: state.deployments.map(deployment =>
      deployment.id === id ? { ...deployment, ...updates } : deployment
    ),
    selectedDeployment: state.selectedDeployment?.id === id
      ? { ...state.selectedDeployment, ...updates }
      : state.selectedDeployment
  })),

  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ),
    selectedTask: state.selectedTask?.id === id
      ? { ...state.selectedTask, ...updates }
      : state.selectedTask
  })),

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  // Control actions (mock implementations)
  startAgent: async (deploymentId) => {
    const { updateDeployment } = get();
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateDeployment(deploymentId, { 
        status: 'running',
        updatedAt: new Date()
      });
    } catch (error) {
      set({ error: `Failed to start agent: ${error}` });
    }
  },

  stopAgent: async (deploymentId) => {
    const { updateDeployment } = get();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateDeployment(deploymentId, { 
        status: 'stopped',
        updatedAt: new Date()
      });
    } catch (error) {
      set({ error: `Failed to stop agent: ${error}` });
    }
  },

  restartAgent: async (deploymentId) => {
    const { updateDeployment } = get();
    try {
      updateDeployment(deploymentId, { 
        status: 'deploying',
        updatedAt: new Date()
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateDeployment(deploymentId, { 
        status: 'running',
        updatedAt: new Date()
      });
    } catch (error) {
      set({ error: `Failed to restart agent: ${error}` });
    }
  },

  pauseAgent: async (deploymentId) => {
    const { updateDeployment } = get();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateDeployment(deploymentId, { 
        status: 'paused',
        updatedAt: new Date()
      });
    } catch (error) {
      set({ error: `Failed to pause agent: ${error}` });
    }
  }
}));