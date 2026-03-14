import { create } from 'zustand';
import { OntologyDomain, Concept } from '../shared/types/ontology.types';

interface OntologyStore {
  // State
  selectedDomain: OntologyDomain | null;
  selectedConcept: Concept | null;
  domains: OntologyDomain[];
  concepts: Concept[];
  loading: boolean;
  error: string | null;

  // Graph state
  graphNodes: any[];
  graphEdges: any[];
  graphLayout: 'dagre' | 'elk' | 'manual';
  showNodeLabels: boolean;
  filterByType: string | null;

  // Actions
  setSelectedDomain: (domain: OntologyDomain | null) => void;
  setSelectedConcept: (concept: Concept | null) => void;
  setDomains: (domains: OntologyDomain[]) => void;
  setConcepts: (concepts: Concept[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Graph actions
  setGraphData: (nodes: any[], edges: any[]) => void;
  setGraphLayout: (layout: 'dagre' | 'elk' | 'manual') => void;
  toggleNodeLabels: () => void;
  setTypeFilter: (type: string | null) => void;
  clearSelection: () => void;
}

export const useOntologyStore = create<OntologyStore>((set) => ({
  // Initial state
  selectedDomain: null,
  selectedConcept: null,
  domains: [],
  concepts: [],
  loading: false,
  error: null,

  // Graph initial state
  graphNodes: [],
  graphEdges: [],
  graphLayout: 'dagre',
  showNodeLabels: true,
  filterByType: null,

  // Basic actions
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSelectedConcept: (concept) => set({ selectedConcept: concept }),
  setDomains: (domains) => set({ domains }),
  setConcepts: (concepts) => set({ concepts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Graph actions
  setGraphData: (nodes, edges) => set({ graphNodes: nodes, graphEdges: edges }),
  setGraphLayout: (layout) => set({ graphLayout: layout }),
  toggleNodeLabels: () => set((state) => ({ showNodeLabels: !state.showNodeLabels })),
  setTypeFilter: (type) => set({ filterByType: type }),
  clearSelection: () => set({ 
    selectedDomain: null, 
    selectedConcept: null,
    filterByType: null
  })
}));