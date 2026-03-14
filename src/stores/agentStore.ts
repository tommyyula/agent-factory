import { create } from 'zustand';
import { AgentDefinition } from '../shared/types/agent.types';

interface AgentStore {
  // State
  selectedAgent: AgentDefinition | null;
  agents: AgentDefinition[];
  loading: boolean;
  error: string | null;

  // IDE state
  isCreating: boolean;
  editingAgent: AgentDefinition | null;
  wizardStep: number;
  wizardData: Partial<AgentDefinition>;

  // Filter and search
  searchQuery: string;
  statusFilter: string | null;
  categoryFilter: string | null;
  sortBy: 'name' | 'created' | 'updated' | 'rating';
  sortOrder: 'asc' | 'desc';

  // Actions
  setSelectedAgent: (agent: AgentDefinition | null) => void;
  setAgents: (agents: AgentDefinition[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // IDE actions
  startCreating: () => void;
  stopCreating: () => void;
  setEditingAgent: (agent: AgentDefinition | null) => void;
  setWizardStep: (step: number) => void;
  updateWizardData: (data: Partial<AgentDefinition>) => void;
  resetWizard: () => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  setCategoryFilter: (category: string | null) => void;
  setSorting: (sortBy: 'name' | 'created' | 'updated' | 'rating', order: 'asc' | 'desc') => void;
  clearFilters: () => void;

  // CRUD actions
  addAgent: (agent: AgentDefinition) => void;
  updateAgent: (id: string, updates: Partial<AgentDefinition>) => void;
  removeAgent: (id: string) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  // Initial state
  selectedAgent: null,
  agents: [],
  loading: false,
  error: null,

  // IDE initial state
  isCreating: false,
  editingAgent: null,
  wizardStep: 0,
  wizardData: {},

  // Filter initial state
  searchQuery: '',
  statusFilter: null,
  categoryFilter: null,
  sortBy: 'name',
  sortOrder: 'asc',

  // Basic actions
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setAgents: (agents) => set({ agents }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // IDE actions
  startCreating: () => set({ 
    isCreating: true, 
    editingAgent: null, 
    wizardStep: 0, 
    wizardData: {} 
  }),
  stopCreating: () => set({ 
    isCreating: false, 
    wizardStep: 0, 
    wizardData: {} 
  }),
  setEditingAgent: (agent) => set({ 
    editingAgent: agent, 
    isCreating: false 
  }),
  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardData: (data) => set((state) => ({ 
    wizardData: { ...state.wizardData, ...data } 
  })),
  resetWizard: () => set({ 
    wizardStep: 0, 
    wizardData: {}, 
    isCreating: false 
  }),

  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSorting: (sortBy, order) => set({ sortBy, sortOrder: order }),
  clearFilters: () => set({ 
    searchQuery: '', 
    statusFilter: null, 
    categoryFilter: null,
    sortBy: 'name',
    sortOrder: 'asc'
  }),

  // CRUD actions
  addAgent: (agent) => set((state) => ({ 
    agents: [...state.agents, agent] 
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    ),
    selectedAgent: state.selectedAgent?.id === id 
      ? { ...state.selectedAgent, ...updates } 
      : state.selectedAgent
  })),
  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter(agent => agent.id !== id),
    selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent
  }))
}));