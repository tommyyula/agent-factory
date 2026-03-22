// OBR (Object-Behavior-Rule) Data Model Types
// Based on Agent Factory Platform OBR System Design v1.0

// Core OBR Blueprint Interface
export interface OntologyBlueprint {
  $schema: 'https://schemas.agent-factory.com/obr/v1.0.0';
  metadata: OBRMetadata;
  objects: OBRObject[];
  behaviors: OBRBehavior[];
  rules: OBRRule[];
  scenarios: OBRScenario[];
  links: OBRLink[];
  validation?: ValidationResult;
}

// Metadata for OBR Blueprint
export interface OBRMetadata {
  id: string;
  name: string;
  version: string;
  domain: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  checksum: string;
  dependencies?: string[];
}

// Business Object Definition
export interface OBRObject {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'entity' | 'value_object' | 'aggregate' | 'service';
  
  // Attributes definition
  attributes: {
    [key: string]: OBRAttribute;
  };
  
  // State machine definition
  stateMachine?: OBRStateMachine;
  
  // Business constraints
  constraints: OBRConstraint[];
  
  // Visual properties for graph display
  visual: OBRVisualProperties;
}

// Object Attribute Definition
export interface OBRAttribute {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'reference';
  required: boolean;
  defaultValue?: any;
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
    references?: string; // Referenced object ID
  };
  description?: string;
  references?: string; // For backward compatibility, moved to top level
}

// State Machine Definition
export interface OBRStateMachine {
  initialState: string;
  states: {
    [stateName: string]: {
      displayName: string;
      description?: string;
      isTerminal?: boolean;
    };
  };
  transitions: OBRStateTransition[];
}

export interface OBRStateTransition {
  from: string;
  to: string;
  trigger: string; // Behavior ID that triggers this transition
  condition?: string; // Condition expression
}

// Business Constraint Definition
export interface OBRConstraint {
  id: string;
  type: 'invariant' | 'precondition' | 'postcondition';
  expression: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

// Behavior Operation Definition
export interface OBRBehavior {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'command' | 'query' | 'event' | 'workflow';
  
  // Preconditions for execution
  preconditions: OBRPreconditions;
  
  // Input parameters
  inputs: {
    [paramName: string]: OBRParameter;
  };
  
  // Output results
  outputs: {
    [paramName: string]: OBRParameter;
  };
  
  // State changes this behavior causes
  stateChanges: OBRStateChange[];
  
  // Associated rules
  linkedRules: OBRRuleLink[];
  
  // Side effects
  sideEffects: OBRSideEffect[];
  
  // Visual properties
  visual: OBRVisualProperties;
}

// Behavior Preconditions
export interface OBRPreconditions {
  objectStates: { objectId: string; requiredState: string }[];
  ruleChecks: string[]; // Rule IDs that must pass
  customConditions: string[]; // Custom condition expressions
}

// Parameter Definition
export interface OBRParameter {
  type: string;
  required?: boolean;
  validation?: string;
  description?: string;
}

// State Change Definition
export interface OBRStateChange {
  objectId: string;
  newState: string;
  condition?: string;
}

// Rule Link Definition
export interface OBRRuleLink {
  ruleId: string;
  phase: 'before' | 'during' | 'after';
  required: boolean;
}

// Side Effect Definition
export interface OBRSideEffect {
  type: 'create' | 'update' | 'delete' | 'notify';
  target: string;
  data?: any;
}

// Business Rule Definition
export interface OBRRule {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'invariant' | 'trigger' | 'validation' | 'constraint';
  priority: number; // 1-10, higher number = higher priority
  
  // Rule condition
  condition: OBRRuleCondition;
  
  // Rule actions
  actions: OBRRuleAction[];
  
  // Application scope
  scope: OBRRuleScope;
  
  // Conflict handling
  conflicts?: OBRRuleConflict[];
  
  // Test cases for validation
  testCases?: OBRTestCase[];
}

// Rule Condition Definition
export interface OBRRuleCondition {
  expression: string; // Formal expression
  naturalLanguage: string; // Natural language description
  variables: { [name: string]: string }; // Variable definitions
}

// Rule Action Definition
export interface OBRRuleAction {
  type: 'validate' | 'block' | 'warn' | 'execute' | 'notify';
  target?: string;
  message?: string;
  severity: 'error' | 'warning' | 'info';
  data?: any;
}

// Rule Scope Definition
export interface OBRRuleScope {
  objects: string[]; // Applicable object IDs
  behaviors: string[]; // Applicable behavior IDs
  scenarios: string[]; // Applicable scenario IDs
}

// Rule Conflict Resolution
export interface OBRRuleConflict {
  ruleId: string;
  resolution: 'override' | 'merge' | 'error';
  description: string;
}

// Test Case Definition
export interface OBRTestCase {
  id: string;
  description: string;
  input: any;
  expectedResult: 'pass' | 'fail';
  actualResult?: 'pass' | 'fail';
}

// Scenario Definition for workflow orchestration
export interface OBRScenario {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'process' | 'workflow' | 'event_handling' | 'decision_flow';
  
  // Scenario actors/participants
  actors: OBRActor[];
  
  // Scenario steps
  steps: OBRScenarioStep[];
  
  // Trigger conditions
  triggers: OBRTrigger[];
  
  // Scenario constraints
  constraints: OBRScenarioConstraints;
  
  // Performance metrics
  metrics?: OBRScenarioMetrics;
}

// Actor Definition
export interface OBRActor {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

// Scenario Step Definition
export interface OBRScenarioStep {
  id: string;
  name: string;
  type: 'start' | 'end' | 'task' | 'decision' | 'parallel' | 'merge';
  
  // Task definition
  task?: OBRTask;
  
  // Decision definition
  decision?: OBRDecision;
  
  // Parallel execution definition
  parallel?: OBRParallel;
  
  // Flow control
  next: string | string[]; // Next step ID(s)
  
  // Visual properties
  visual: {
    position: { x: number; y: number };
    type: 'bpmn' | 'flowchart';
  };
}

// Task Definition within Scenario
export interface OBRTask {
  behaviorId: string;
  actorId?: string;
  inputs: { [key: string]: any };
  timeout?: number;
}

// Decision Branch Definition
export interface OBRDecision {
  condition: string;
  branches: { condition: string; nextStepId: string }[];
}

// Parallel Execution Definition
export interface OBRParallel {
  branches: string[][]; // Array of parallel branch step IDs
  syncType: 'all' | 'any' | 'first';
}

// Trigger Definition
export interface OBRTrigger {
  type: 'manual' | 'event' | 'schedule' | 'condition';
  condition?: string;
  event?: string;
  schedule?: string;
}

// Scenario Constraints
export interface OBRScenarioConstraints {
  timeLimit?: number;
  resourceLimits?: { [resource: string]: number };
  businessRules: string[]; // Rule IDs that must be satisfied
}

// Performance Metrics
export interface OBRScenarioMetrics {
  averageDuration?: number;
  successRate?: number;
  errorPatterns?: string[];
}

// Semantic Link Definition (12 relationship types)
export interface OBRLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourceType: 'object' | 'behavior' | 'rule' | 'scenario';
  targetType: 'object' | 'behavior' | 'rule' | 'scenario';
  
  // 12 semantic relationship types
  relationshipType: 
    | 'is_a'           // Inheritance relationship
    | 'part_of'        // Composition relationship
    | 'depends_on'     // Dependency relationship
    | 'triggers'       // Trigger relationship
    | 'precedes'       // Precedence relationship
    | 'conflicts_with' // Conflict relationship
    | 'implements'     // Implementation relationship
    | 'validates'      // Validation relationship
    | 'aggregates'     // Aggregation relationship
    | 'uses'           // Usage relationship
    | 'produces'       // Production relationship
    | 'consumes';      // Consumption relationship
  
  // Relationship properties
  properties: {
    weight?: number; // Relationship strength 0-1
    direction?: 'unidirectional' | 'bidirectional';
    multiplicity?: '1:1' | '1:N' | 'N:1' | 'N:N';
    constraints?: string[];
  };
  
  description?: string;
  
  // Visual properties for graph display
  visual: {
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    width?: number;
    label?: string;
  };
}

// Visual Properties for Graph Display
export interface OBRVisualProperties {
  position?: { x: number; y: number };
  color?: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
}

// Validation Result Interface
export interface ValidationResult {
  isValid: boolean;
  timestamp: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metrics: ValidationMetrics;
}

export interface ValidationError {
  code: string;
  type: 'schema' | 'semantic' | 'consistency';
  path: string;
  message: string;
  severity: 'error' | 'warning';
  suggestions?: string[];
}

export interface ValidationWarning {
  code: string;
  type: 'best_practice' | 'performance' | 'maintainability';
  path: string;
  message: string;
  suggestions?: string[];
}

export interface ValidationMetrics {
  objectCount: number;
  behaviorCount: number;
  ruleCount: number;
  scenarioCount: number;
  linkCount: number;
  completenessScore: number; // 0-100
  consistencyScore: number;  // 0-100
}

// Simulation Execution Types
export interface SimulationStep {
  stepId: string;
  timestamp: Date;
  result: StepExecutionResult;
  preValidation?: RuleExecutionResult;
  postValidation?: RuleExecutionResult;
  duration: number;
}

export interface StepExecutionResult {
  success: boolean;
  stepId?: string;
  executionTime?: number;
  newContext?: any;
  stateChanges?: { [objectId: string]: any };
  ruleValidations?: RuleExecutionResult[];
  nextSteps?: string[];
  error?: string;
  duration?: number;
}

export interface RuleExecutionResult {
  ruleId: string;
  passed: boolean;
  validations?: RuleExecutionResult[];
  message?: string;
  error?: string;
  executionTime?: number;
  isValid?: boolean;
  errors?: ValidationError[];
}

export interface SimulationResult {
  scenario: string;
  executionHistory: SimulationStep[];
  finalState: any;
  success: boolean;
}

// HRM Domain Constants
export const HRM_OBJECT_TYPES = [
  'Employee',
  'Shift', 
  'Schedule',
  'Attendance',
  'Organization',
  'Supervisor', 
  'Skill',
  'Agency'
] as const;

export const HRM_BEHAVIOR_TYPES = [
  'createShift',
  'assignEmployee', 
  'punchIn',
  'punchOut',
  'approveOvertime',
  'generateComplianceReport'
] as const;

export const HRM_RULE_TYPES = [
  'min_rest_8h',
  'max_consecutive_12h',
  'skill_match_80',
  'overtime_approval'
] as const;

export const HRM_SCENARIO_TYPES = [
  'normal_scheduling',
  'resignation_triggered_rescheduling', 
  'emergency_absence_substitution'
] as const;

export type HRMObjectType = typeof HRM_OBJECT_TYPES[number];
export type HRMBehaviorType = typeof HRM_BEHAVIOR_TYPES[number];
export type HRMRuleType = typeof HRM_RULE_TYPES[number];
export type HRMScenarioType = typeof HRM_SCENARIO_TYPES[number];