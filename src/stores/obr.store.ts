import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SimulationStep,
  SimulationResult
} from '@/shared/types/obr.types';
import { ontologyDB } from '@/shared/services/database';

// OBR Store State Interface
interface OBRState {
  // Current editing blueprint
  currentBlueprint: OntologyBlueprint | null;
  
  // Edit mode and selection
  editMode: 'view' | 'edit' | 'simulation';
  selectedNodeId: string | null;
  selectedNodeType: 'object' | 'behavior' | 'rule' | 'scenario' | null;
  
  // Graph view state
  graphViewState: {
    zoom: number;
    center: { x: number; y: number };
    filters: {
      nodeTypes: ('object' | 'behavior' | 'rule' | 'scenario')[];
      linkTypes: OBRLink['relationshipType'][];
      showLabels: boolean;
      showMiniMap: boolean;
    };
    layout: 'force' | 'hierarchical' | 'circular' | 'grid';
  };
  
  // Simulation state
  simulationState: {
    activeScenario: string | null;
    currentStep: string | null;
    executionHistory: SimulationStep[];
    isRunning: boolean;
    objectStates: { [objectId: string]: any };
  };
  
  // Validation state
  validation: {
    isValidating: boolean;
    lastValidation: ValidationResult | null;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
  
  // UI state
  ui: {
    activePanel: 'graph' | 'editor' | 'simulator' | 'timeline';
    sidebarWidth: number;
    panelSizes: { [panel: string]: number };
  };
  
  // History for undo/redo
  history: {
    past: OntologyBlueprint[];
    future: OntologyBlueprint[];
    canUndo: boolean;
    canRedo: boolean;
  };
}

// OBR Store Actions Interface
interface OBRActions {
  // Blueprint management
  loadBlueprint: (blueprintId: string) => Promise<void>;
  saveBlueprint: () => Promise<void>;
  importBlueprint: (file: File) => Promise<void>;
  exportBlueprint: (format: 'json' | 'yaml' | 'rdf') => Promise<string>;
  
  // OBR component management
  addObject: (object: OBRObject) => void;
  updateObject: (id: string, updates: Partial<OBRObject>) => void;
  removeObject: (id: string) => void;
  
  addBehavior: (behavior: OBRBehavior) => void;
  updateBehavior: (id: string, updates: Partial<OBRBehavior>) => void;
  removeBehavior: (id: string) => void;
  
  addRule: (rule: OBRRule) => void;
  updateRule: (id: string, updates: Partial<OBRRule>) => void;
  removeRule: (id: string) => void;
  
  addScenario: (scenario: OBRScenario) => void;
  updateScenario: (id: string, updates: Partial<OBRScenario>) => void;
  removeScenario: (id: string) => void;
  
  addLink: (link: OBRLink) => void;
  updateLink: (id: string, updates: Partial<OBRLink>) => void;
  removeLink: (id: string) => void;
  
  // Graph operations
  selectNode: (nodeId: string, nodeType: 'object' | 'behavior' | 'rule' | 'scenario') => void;
  updateGraphView: (updates: Partial<OBRState['graphViewState']>) => void;
  
  // Simulation control
  startSimulation: (scenarioId: string) => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  executeNextStep: () => Promise<void>;
  resetSimulation: () => void;
  
  // Validation operations
  validateBlueprint: () => Promise<ValidationResult>;
  
  // UI operations
  setActivePanel: (panel: OBRState['ui']['activePanel']) => void;
  updatePanelSizes: (sizes: { [panel: string]: number }) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  pushHistory: (blueprint: OntologyBlueprint) => void;
  clearHistory: () => void;
}

// Create OBR Store with Zustand
export const useOBRStore = create<OBRState & OBRActions>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      currentBlueprint: null,
      editMode: 'view',
      selectedNodeId: null,
      selectedNodeType: null,
      
      graphViewState: {
        zoom: 1,
        center: { x: 0, y: 0 },
        filters: {
          nodeTypes: ['object', 'behavior', 'rule', 'scenario'],
          linkTypes: [
            'is_a', 'part_of', 'depends_on', 'triggers', 'precedes', 
            'conflicts_with', 'implements', 'validates', 'aggregates', 
            'uses', 'produces', 'consumes'
          ],
          showLabels: true,
          showMiniMap: true
        },
        layout: 'force'
      },
      
      simulationState: {
        activeScenario: null,
        currentStep: null,
        executionHistory: [],
        isRunning: false,
        objectStates: {}
      },
      
      validation: {
        isValidating: false,
        lastValidation: null,
        errors: [],
        warnings: []
      },
      
      ui: {
        activePanel: 'graph',
        sidebarWidth: 300,
        panelSizes: {}
      },
      
      history: {
        past: [],
        future: [],
        canUndo: false,
        canRedo: false
      },
      
      // Actions implementation
      loadBlueprint: async (blueprintId: string) => {
        try {
          const blueprint = await ontologyDB.blueprints
            .where('metadata.id')
            .equals(blueprintId)
            .first();
          
          if (blueprint) {
            set(state => {
              state.currentBlueprint = blueprint;
              state.editMode = 'view';
              state.selectedNodeId = null;
              state.selectedNodeType = null;
            });
          }
        } catch (error) {
          console.error('Failed to load blueprint:', error);
        }
      },
      
      saveBlueprint: async () => {
        const { currentBlueprint } = get();
        if (!currentBlueprint) return;
        
        try {
          // Update timestamp and checksum
          const updated = {
            ...currentBlueprint,
            metadata: {
              ...currentBlueprint.metadata,
              updatedAt: new Date().toISOString()
            }
          };
          
          // Calculate checksum
          updated.metadata.checksum = await calculateChecksum(updated);
          
          // Save to IndexedDB
          await ontologyDB.blueprints.put(updated);
          
          set(state => {
            state.currentBlueprint = updated;
          });
        } catch (error) {
          console.error('Failed to save blueprint:', error);
        }
      },
      
      importBlueprint: async (file: File) => {
        try {
          const content = await file.text();
          const blueprint = JSON.parse(content) as OntologyBlueprint;
          
          // Validate schema
          const validation = await validateBlueprintSchema(blueprint);
          if (!validation.isValid) {
            throw new Error(`Schema validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
          }
          
          set(state => {
            state.currentBlueprint = blueprint;
            state.validation.lastValidation = validation;
          });
        } catch (error) {
          console.error('Failed to import blueprint:', error);
          throw error;
        }
      },
      
      exportBlueprint: async (format: 'json' | 'yaml' | 'rdf'): Promise<string> => {
        const { currentBlueprint } = get();
        if (!currentBlueprint) throw new Error('No blueprint to export');
        
        switch (format) {
          case 'json':
            return JSON.stringify(currentBlueprint, null, 2);
          case 'yaml':
            // Would need yaml library
            return JSON.stringify(currentBlueprint, null, 2);
          case 'rdf':
            // Would need RDF converter
            return JSON.stringify(currentBlueprint, null, 2);
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      },
      
      addObject: (object: OBRObject) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          // Add to history
          if (state.currentBlueprint) {
            get().pushHistory(state.currentBlueprint);
          }
          
          state.currentBlueprint.objects.push(object);
          state.editMode = 'edit';
          state.selectedNodeId = object.id;
          state.selectedNodeType = 'object';
        });
      },
      
      updateObject: (id: string, updates: Partial<OBRObject>) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          // Add to history
          if (state.currentBlueprint) {
            get().pushHistory(state.currentBlueprint);
          }
          
          const index = state.currentBlueprint.objects.findIndex((o: OBRObject) => o.id === id);
          if (index !== -1) {
            state.currentBlueprint.objects[index] = {
              ...state.currentBlueprint.objects[index],
              ...updates
            };
          }
        });
      },
      
      removeObject: (id: string) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          // Add to history
          if (state.currentBlueprint) {
            get().pushHistory(state.currentBlueprint);
          }
          
          // Remove object
          state.currentBlueprint.objects = state.currentBlueprint.objects.filter((o: OBRObject) => o.id !== id);
          
          // Clean up related links
          state.currentBlueprint.links = state.currentBlueprint.links.filter(
            (l: OBRLink) => l.sourceId !== id && l.targetId !== id
          );
          
          // Clear selection if deleted object was selected
          if (state.selectedNodeId === id && state.selectedNodeType === 'object') {
            state.selectedNodeId = null;
            state.selectedNodeType = null;
          }
        });
      },
      
      addBehavior: (behavior: OBRBehavior) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.behaviors.push(behavior);
          state.editMode = 'edit';
          state.selectedNodeId = behavior.id;
          state.selectedNodeType = 'behavior';
        });
      },
      
      updateBehavior: (id: string, updates: Partial<OBRBehavior>) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          const index = state.currentBlueprint.behaviors.findIndex((b: OBRBehavior) => b.id === id);
          if (index !== -1) {
            state.currentBlueprint.behaviors[index] = {
              ...state.currentBlueprint.behaviors[index],
              ...updates
            };
          }
        });
      },
      
      removeBehavior: (id: string) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.behaviors = state.currentBlueprint.behaviors.filter((b: OBRBehavior) => b.id !== id);
          state.currentBlueprint.links = state.currentBlueprint.links.filter(
            (l: OBRLink) => l.sourceId !== id && l.targetId !== id
          );
          
          if (state.selectedNodeId === id && state.selectedNodeType === 'behavior') {
            state.selectedNodeId = null;
            state.selectedNodeType = null;
          }
        });
      },
      
      addRule: (rule: OBRRule) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.rules.push(rule);
          state.editMode = 'edit';
          state.selectedNodeId = rule.id;
          state.selectedNodeType = 'rule';
        });
      },
      
      updateRule: (id: string, updates: Partial<OBRRule>) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          const index = state.currentBlueprint.rules.findIndex((r: OBRRule) => r.id === id);
          if (index !== -1) {
            state.currentBlueprint.rules[index] = {
              ...state.currentBlueprint.rules[index],
              ...updates
            };
          }
        });
      },
      
      removeRule: (id: string) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.rules = state.currentBlueprint.rules.filter((r: OBRRule) => r.id !== id);
          state.currentBlueprint.links = state.currentBlueprint.links.filter(
            (l: OBRLink) => l.sourceId !== id && l.targetId !== id
          );
          
          if (state.selectedNodeId === id && state.selectedNodeType === 'rule') {
            state.selectedNodeId = null;
            state.selectedNodeType = null;
          }
        });
      },
      
      addScenario: (scenario: OBRScenario) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.scenarios.push(scenario);
          state.editMode = 'edit';
          state.selectedNodeId = scenario.id;
          state.selectedNodeType = 'scenario';
        });
      },
      
      updateScenario: (id: string, updates: Partial<OBRScenario>) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          const index = state.currentBlueprint.scenarios.findIndex((s: OBRScenario) => s.id === id);
          if (index !== -1) {
            state.currentBlueprint.scenarios[index] = {
              ...state.currentBlueprint.scenarios[index],
              ...updates
            };
          }
        });
      },
      
      removeScenario: (id: string) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.scenarios = state.currentBlueprint.scenarios.filter((s: OBRScenario) => s.id !== id);
          state.currentBlueprint.links = state.currentBlueprint.links.filter(
            (l: OBRLink) => l.sourceId !== id && l.targetId !== id
          );
          
          if (state.selectedNodeId === id && state.selectedNodeType === 'scenario') {
            state.selectedNodeId = null;
            state.selectedNodeType = null;
          }
        });
      },
      
      addLink: (link: OBRLink) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.links.push(link);
        });
      },
      
      updateLink: (id: string, updates: Partial<OBRLink>) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          const index = state.currentBlueprint.links.findIndex((l: OBRLink) => l.id === id);
          if (index !== -1) {
            state.currentBlueprint.links[index] = {
              ...state.currentBlueprint.links[index],
              ...updates
            };
          }
        });
      },
      
      removeLink: (id: string) => {
        set(state => {
          if (!state.currentBlueprint) return;
          
          get().pushHistory(state.currentBlueprint);
          state.currentBlueprint.links = state.currentBlueprint.links.filter((l: OBRLink) => l.id !== id);
        });
      },
      
      selectNode: (nodeId: string, nodeType: 'object' | 'behavior' | 'rule' | 'scenario') => {
        set(state => {
          state.selectedNodeId = nodeId;
          state.selectedNodeType = nodeType;
          state.editMode = 'edit';
        });
      },
      
      updateGraphView: (updates: Partial<OBRState['graphViewState']>) => {
        set(state => {
          Object.assign(state.graphViewState, updates);
        });
      },
      
      startSimulation: (scenarioId: string) => {
        const { currentBlueprint } = get();
        if (!currentBlueprint) return;
        
        const scenario = currentBlueprint.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;
        
        const startStep = scenario.steps.find(s => s.type === 'start');
        
        set(state => {
          state.simulationState = {
            activeScenario: scenarioId,
            currentStep: startStep?.id || null,
            executionHistory: [],
            isRunning: true,
            objectStates: {}
          };
        });
      },
      
      pauseSimulation: () => {
        set(state => {
          state.simulationState.isRunning = false;
        });
      },
      
      stopSimulation: () => {
        set(state => {
          state.simulationState = {
            activeScenario: null,
            currentStep: null,
            executionHistory: [],
            isRunning: false,
            objectStates: {}
          };
        });
      },
      
      executeNextStep: async () => {
        const { currentBlueprint, simulationState } = get();
        if (!currentBlueprint || !simulationState.activeScenario) return;
        
        const scenario = currentBlueprint.scenarios.find(
          s => s.id === simulationState.activeScenario
        );
        if (!scenario) return;
        
        const currentStepId = simulationState.currentStep;
        const steps = scenario.steps;
        
        // Find current step index
        const currentIndex = currentStepId 
          ? steps.findIndex(s => s.id === currentStepId)
          : -1;
        
        // Find next step
        let nextStep = null;
        if (currentIndex >= 0 && currentIndex < steps.length - 1) {
          // Try to follow the 'next' pointer first
          const current = steps[currentIndex];
          if (current.next) {
            const nextIds = Array.isArray(current.next) ? current.next : [current.next];
            nextStep = steps.find(s => nextIds.includes(s.id));
          }
          // Fallback to sequential
          if (!nextStep) {
            nextStep = steps[currentIndex + 1];
          }
        } else if (currentIndex === -1 && steps.length > 0) {
          // Start from beginning
          nextStep = steps[0];
        }
        
        if (nextStep) {
          set(state => {
            state.simulationState.currentStep = nextStep!.id;
            state.simulationState.executionHistory.push({
              stepId: nextStep!.id,
              timestamp: new Date(),
              result: { success: true, stepId: nextStep!.id, executionTime: 0, duration: 0, newContext: {}, stateChanges: {}, ruleValidations: [], nextSteps: [] },
              duration: 0
            });
          });
        } else {
          // No more steps - simulation complete
          set(state => {
            state.simulationState.isRunning = false;
          });
        }
      },
      
      resetSimulation: () => {
        const { simulationState } = get();
        set(state => {
          state.simulationState = {
            ...simulationState,
            currentStep: null,
            executionHistory: [],
            isRunning: false,
            objectStates: {}
          };
        });
      },
      
      validateBlueprint: async (): Promise<ValidationResult> => {
        const { currentBlueprint } = get();
        if (!currentBlueprint) {
          throw new Error('No blueprint to validate');
        }
        
        set(state => {
          state.validation.isValidating = true;
        });
        
        try {
          const result = await validateBlueprintSchema(currentBlueprint);
          
          set(state => {
            state.validation = {
              isValidating: false,
              lastValidation: result,
              errors: result.errors,
              warnings: result.warnings
            };
          });
          
          return result;
        } catch (error) {
          set(state => {
            state.validation.isValidating = false;
          });
          throw error;
        }
      },
      
      setActivePanel: (panel: OBRState['ui']['activePanel']) => {
        set(state => {
          state.ui.activePanel = panel;
        });
      },
      
      updatePanelSizes: (sizes: { [panel: string]: number }) => {
        set(state => {
          Object.assign(state.ui.panelSizes, sizes);
        });
      },
      
      undo: () => {
        set(state => {
          if (state.history.past.length === 0) return;
          
          const previous = state.history.past[state.history.past.length - 1];
          const newPast = state.history.past.slice(0, -1);
          
          if (state.currentBlueprint) {
            state.history.future.unshift(state.currentBlueprint);
          }
          state.history.past = newPast;
          state.currentBlueprint = previous;
          state.history.canUndo = newPast.length > 0;
          state.history.canRedo = true;
        });
      },
      
      redo: () => {
        set(state => {
          if (state.history.future.length === 0) return;
          
          const next = state.history.future[0];
          const newFuture = state.history.future.slice(1);
          
          if (state.currentBlueprint) {
            state.history.past.push(state.currentBlueprint);
          }
          state.history.future = newFuture;
          state.currentBlueprint = next;
          state.history.canRedo = newFuture.length > 0;
          state.history.canUndo = true;
        });
      },
      
      pushHistory: (blueprint: OntologyBlueprint) => {
        set(state => {
          // Deep clone the blueprint for history
          const cloned = JSON.parse(JSON.stringify(blueprint));
          state.history.past.push(cloned);
          state.history.future = []; // Clear redo history
          
          // Limit history size to 50 items
          if (state.history.past.length > 50) {
            state.history.past = state.history.past.slice(-50);
          }
          
          state.history.canUndo = true;
          state.history.canRedo = false;
        });
      },
      
      clearHistory: () => {
        set(state => {
          state.history = {
            past: [],
            future: [],
            canUndo: false,
            canRedo: false
          };
        });
      }
    }))
  )
);

// Helper functions
async function calculateChecksum(blueprint: OntologyBlueprint): Promise<string> {
  const content = JSON.stringify(blueprint, null, 0);
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validateBlueprintSchema(blueprint: OntologyBlueprint): Promise<ValidationResult> {
  // Basic validation - would be expanded with proper schema validation
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Check required fields
  if (!blueprint.metadata?.id) {
    errors.push({
      code: 'MISSING_ID',
      type: 'schema',
      path: 'metadata.id',
      message: 'Blueprint ID is required',
      severity: 'error'
    });
  }
  
  if (!blueprint.metadata?.name) {
    errors.push({
      code: 'MISSING_NAME',
      type: 'schema',
      path: 'metadata.name', 
      message: 'Blueprint name is required',
      severity: 'error'
    });
  }
  
  // Check for duplicate IDs
  const allIds = [
    ...blueprint.objects.map(o => o.id),
    ...blueprint.behaviors.map(b => b.id),
    ...blueprint.rules.map(r => r.id),
    ...blueprint.scenarios.map(s => s.id)
  ];
  
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push({
      code: 'DUPLICATE_IDS',
      type: 'consistency',
      path: 'ids',
      message: `Duplicate IDs found: ${duplicates.join(', ')}`,
      severity: 'error'
    });
  }
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    timestamp: new Date().toISOString(),
    errors,
    warnings,
    metrics: {
      objectCount: blueprint.objects.length,
      behaviorCount: blueprint.behaviors.length,
      ruleCount: blueprint.rules.length,
      scenarioCount: blueprint.scenarios.length,
      linkCount: blueprint.links.length,
      completenessScore: calculateCompletenessScore(blueprint),
      consistencyScore: calculateConsistencyScore(blueprint)
    }
  };
}

function calculateCompletenessScore(blueprint: OntologyBlueprint): number {
  // Simple completeness calculation
  let score = 0;
  const totalElements = blueprint.objects.length + blueprint.behaviors.length + 
                       blueprint.rules.length + blueprint.scenarios.length;
  
  if (totalElements > 0) score += 25;
  if (blueprint.objects.length > 0) score += 25;
  if (blueprint.behaviors.length > 0) score += 25;
  if (blueprint.rules.length > 0) score += 25;
  
  return score;
}

function calculateConsistencyScore(blueprint: OntologyBlueprint): number {
  // Simple consistency calculation - would be more sophisticated in real implementation
  let score = 100;
  
  // Check for broken links
  const allIds = new Set([
    ...blueprint.objects.map(o => o.id),
    ...blueprint.behaviors.map(b => b.id),
    ...blueprint.rules.map(r => r.id),
    ...blueprint.scenarios.map(s => s.id)
  ]);
  
  const brokenLinks = blueprint.links.filter(
    link => !allIds.has(link.sourceId) || !allIds.has(link.targetId)
  );
  
  score -= brokenLinks.length * 5; // Deduct 5 points per broken link
  
  return Math.max(0, score);
}