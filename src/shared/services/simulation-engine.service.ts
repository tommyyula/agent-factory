import {
  OntologyBlueprint,
  OBRScenario,
  OBRScenarioStep,
  OBRBehavior,
  OBRRule,
  OBRObject,
  SimulationStep,
  SimulationResult,
  StepExecutionResult,
  RuleExecutionResult,
  OBRTask,
  OBRDecision,
  OBRParallel
} from '@/shared/types/obr.types';

/**
 * Simulation Engine for executing OBR scenarios
 * Provides step-by-step execution with rule validation and state tracking
 */
export class SimulationEngine {
  private blueprint: OntologyBlueprint;
  private scenario: OBRScenario;
  private objectStates: { [objectId: string]: any } = {};
  private executionHistory: SimulationStep[] = [];
  private currentStepId: string | null = null;
  private isRunning: boolean = false;
  private eventHandlers: { [event: string]: Function[] } = {};

  constructor(blueprint: OntologyBlueprint, scenario: OBRScenario) {
    this.blueprint = blueprint;
    this.scenario = scenario;
    this.initializeObjectStates();
  }

  /**
   * Initialize object states based on their state machines
   */
  private initializeObjectStates(): void {
    this.objectStates = {};
    
    this.blueprint.objects.forEach(obj => {
      if (obj.stateMachine) {
        this.objectStates[obj.id] = {
          currentState: obj.stateMachine.initialState,
          attributes: this.getDefaultAttributes(obj),
          metadata: {
            lastStateChange: new Date().toISOString(),
            stateHistory: [obj.stateMachine.initialState]
          }
        };
      } else {
        this.objectStates[obj.id] = {
          attributes: this.getDefaultAttributes(obj),
          metadata: {
            createdAt: new Date().toISOString()
          }
        };
      }
    });
  }

  /**
   * Get default attribute values for an object
   */
  private getDefaultAttributes(obj: OBRObject): any {
    const attributes: any = {};
    
    Object.entries(obj.attributes).forEach(([attrName, attrDef]) => {
      if (attrDef.defaultValue !== undefined) {
        attributes[attrName] = attrDef.defaultValue;
      } else {
        // Set sensible defaults based on type
        switch (attrDef.type) {
          case 'string':
            attributes[attrName] = '';
            break;
          case 'number':
            attributes[attrName] = 0;
            break;
          case 'boolean':
            attributes[attrName] = false;
            break;
          case 'date':
            attributes[attrName] = new Date().toISOString();
            break;
          default:
            attributes[attrName] = null;
        }
      }
    });

    return attributes;
  }

  /**
   * Start scenario execution
   */
  public async start(): Promise<void> {
    this.isRunning = true;
    this.executionHistory = [];
    
    // Find the start step
    const startStep = this.scenario.steps.find(step => step.type === 'start');
    if (!startStep) {
      throw new Error('Scenario must have a start step');
    }

    this.currentStepId = startStep.id;
    this.emit('started', { scenario: this.scenario, startStep });
  }

  /**
   * Pause execution
   */
  public pause(): void {
    this.isRunning = false;
    this.emit('paused', { currentStep: this.currentStepId });
  }

  /**
   * Resume execution
   */
  public resume(): void {
    this.isRunning = true;
    this.emit('resumed', { currentStep: this.currentStepId });
  }

  /**
   * Stop execution
   */
  public stop(): void {
    this.isRunning = false;
    this.currentStepId = null;
    this.emit('stopped', { 
      history: this.executionHistory,
      finalStates: this.objectStates 
    });
  }

  /**
   * Reset simulation to initial state
   */
  public reset(): void {
    this.isRunning = false;
    this.currentStepId = null;
    this.executionHistory = [];
    this.initializeObjectStates();
    this.emit('reset');
  }

  /**
   * Execute the next step
   */
  public async executeNextStep(): Promise<StepExecutionResult> {
    if (!this.isRunning || !this.currentStepId) {
      throw new Error('Simulation not running or no current step');
    }

    const step = this.scenario.steps.find(s => s.id === this.currentStepId);
    if (!step) {
      throw new Error(`Step not found: ${this.currentStepId}`);
    }

    const startTime = Date.now();
    
    try {
      // Pre-execution validation
      const preValidation = await this.validateRules('before', step);
      
      // Execute the step based on its type
      let result: StepExecutionResult;
      
      switch (step.type) {
        case 'start':
          result = await this.executeStartStep(step);
          break;
        case 'end':
          result = await this.executeEndStep(step);
          break;
        case 'task':
          result = await this.executeTaskStep(step);
          break;
        case 'decision':
          result = await this.executeDecisionStep(step);
          break;
        case 'parallel':
          result = await this.executeParallelStep(step);
          break;
        case 'merge':
          result = await this.executeMergeStep(step);
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      const duration = Date.now() - startTime;
      result.duration = duration;

      // Post-execution validation
      const postValidation = await this.validateRules('after', step);

      // Create simulation step record
      const simulationStep: SimulationStep = {
        stepId: step.id,
        timestamp: new Date(),
        result,
        preValidation,
        postValidation,
        duration
      };

      this.executionHistory.push(simulationStep);

      // Update current step
      if (result.success && result.nextSteps && result.nextSteps.length > 0) {
        this.currentStepId = result.nextSteps[0]; // Take first next step for now
      } else {
        this.currentStepId = null; // End of execution
        this.isRunning = false;
      }

      this.emit('stepExecuted', simulationStep);
      
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorResult: StepExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };

      const simulationStep: SimulationStep = {
        stepId: step.id,
        timestamp: new Date(),
        result: errorResult,
        duration
      };

      this.executionHistory.push(simulationStep);
      this.emit('stepFailed', simulationStep);
      
      return errorResult;
    }
  }

  /**
   * Execute start step
   */
  private async executeStartStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    // Start steps just initialize and move to next
    await this.simulateDelay(100); // Small delay for realism
    
    return {
      success: true,
      stepId: step.id,
      executionTime: 100,
      newContext: { stepType: 'start', stepId: step.id },
      nextSteps: Array.isArray(step.next) ? step.next : step.next ? [step.next] : [],
      stateChanges: {},
      ruleValidations: []
    };
  }

  /**
   * Execute end step
   */
  private async executeEndStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    await this.simulateDelay(100);
    
    this.isRunning = false;
    this.emit('completed', {
      scenario: this.scenario,
      history: this.executionHistory,
      finalStates: this.objectStates
    });
    
    return {
      success: true,
      stepId: step.id,
      executionTime: 100,
      newContext: { stepType: 'end', completed: true },
      nextSteps: [],
      stateChanges: {},
      ruleValidations: []
    };
  }

  /**
   * Execute task step
   */
  private async executeTaskStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    if (!step.task) {
      throw new Error('Task step missing task configuration');
    }

    const behavior = this.blueprint.behaviors.find(b => b.id === step.task!.behaviorId);
    if (!behavior) {
      throw new Error(`Behavior not found: ${step.task.behaviorId}`);
    }

    // Check preconditions
    const preconditionsResult = await this.checkBehaviorPreconditions(behavior);
    if (!preconditionsResult.success) {
      return {
        success: false,
        error: `Preconditions not met: ${preconditionsResult.message}`,
        stepId: step.id,
        stateChanges: {},
        ruleValidations: []
      };
    }

    // Simulate behavior execution
    const executionTime = step.task.timeout || 1000;
    await this.simulateDelay(Math.min(executionTime, 2000)); // Cap simulation delay

    // Apply state changes
    const stateChanges = await this.applyBehaviorStateChanges(behavior);

    // Validate linked rules
    const ruleValidations = await this.validateBehaviorRules(behavior);

    // Determine success based on rule validations
    const hasErrors = ruleValidations.some(rv => !rv.passed && rv.ruleId);
    const success = !hasErrors && Math.random() > 0.1; // 90% success rate for demo

    return {
      success,
      stepId: step.id,
      executionTime,
      newContext: {
        behaviorId: behavior.id,
        behaviorCategory: behavior.category,
        inputs: step.task.inputs || {}
      },
      nextSteps: success ? (Array.isArray(step.next) ? step.next : step.next ? [step.next] : []) : [],
      stateChanges,
      ruleValidations,
      ...(step.task.timeout && { duration: step.task.timeout })
    };
  }

  /**
   * Execute decision step
   */
  private async executeDecisionStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    if (!step.decision) {
      throw new Error('Decision step missing decision configuration');
    }

    await this.simulateDelay(200);

    // Evaluate decision condition (simplified)
    const conditionResult = await this.evaluateCondition(step.decision.condition);
    
    // Find matching branch
    const matchingBranch = step.decision.branches.find(branch => 
      this.evaluateSimpleCondition(branch.condition, conditionResult)
    );

    const nextStepId = matchingBranch?.nextStepId || null;

    return {
      success: true,
      stepId: step.id,
      executionTime: 200,
      newContext: {
        decisionCondition: step.decision.condition,
        decisionResult: conditionResult,
        selectedBranch: matchingBranch?.condition || null
      },
      nextSteps: nextStepId ? [nextStepId] : [],
      stateChanges: {},
      ruleValidations: []
    };
  }

  /**
   * Execute parallel step
   */
  private async executeParallelStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    if (!step.parallel) {
      throw new Error('Parallel step missing parallel configuration');
    }

    await this.simulateDelay(300);

    // For simulation, we'll just execute all branches conceptually
    const branchResults = step.parallel.branches.map((branch, index) => ({
      branchIndex: index,
      steps: branch,
      success: Math.random() > 0.2 // 80% success rate per branch
    }));

    const allSuccessful = branchResults.every(br => br.success);

    // Determine next steps based on sync type
    let nextSteps: string[] = [];
    if (allSuccessful || step.parallel.syncType === 'any') {
      nextSteps = Array.isArray(step.next) ? step.next : step.next ? [step.next] : [];
    }

    return {
      success: allSuccessful,
      stepId: step.id,
      executionTime: 300,
      newContext: {
        parallelBranches: branchResults,
        syncType: step.parallel.syncType
      },
      nextSteps,
      stateChanges: {},
      ruleValidations: []
    };
  }

  /**
   * Execute merge step
   */
  private async executeMergeStep(step: OBRScenarioStep): Promise<StepExecutionResult> {
    await this.simulateDelay(100);

    // Merge steps just synchronize parallel branches
    return {
      success: true,
      stepId: step.id,
      executionTime: 100,
      newContext: { stepType: 'merge', synchronized: true },
      nextSteps: Array.isArray(step.next) ? step.next : step.next ? [step.next] : [],
      stateChanges: {},
      ruleValidations: []
    };
  }

  /**
   * Check behavior preconditions
   */
  private async checkBehaviorPreconditions(behavior: OBRBehavior): Promise<{ success: boolean; message?: string }> {
    // Check object state requirements
    for (const objState of behavior.preconditions.objectStates) {
      const currentState = this.objectStates[objState.objectId];
      if (!currentState || currentState.currentState !== objState.requiredState) {
        return {
          success: false,
          message: `Object ${objState.objectId} not in required state ${objState.requiredState}`
        };
      }
    }

    // Check rule requirements (simplified)
    for (const ruleId of behavior.preconditions.ruleChecks) {
      const rule = this.blueprint.rules.find(r => r.id === ruleId);
      if (rule) {
        const ruleResult = await this.evaluateRule(rule);
        if (!ruleResult.passed) {
          return {
            success: false,
            message: `Rule ${ruleId} failed validation`
          };
        }
      }
    }

    return { success: true };
  }

  /**
   * Apply behavior state changes
   */
  private async applyBehaviorStateChanges(behavior: OBRBehavior): Promise<{ [objectId: string]: any }> {
    const stateChanges: { [objectId: string]: any } = {};

    for (const stateChange of behavior.stateChanges) {
      const objectState = this.objectStates[stateChange.objectId];
      if (objectState) {
        // Check condition if specified
        if (stateChange.condition) {
          const conditionMet = await this.evaluateCondition(stateChange.condition);
          if (!conditionMet) continue;
        }

        // Apply state change
        const oldState = objectState.currentState;
        objectState.currentState = stateChange.newState;
        objectState.metadata.lastStateChange = new Date().toISOString();
        objectState.metadata.stateHistory = [
          ...(objectState.metadata.stateHistory || []),
          stateChange.newState
        ];

        stateChanges[stateChange.objectId] = {
          from: oldState,
          to: stateChange.newState,
          condition: stateChange.condition
        };
      }
    }

    return stateChanges;
  }

  /**
   * Validate behavior-linked rules
   */
  private async validateBehaviorRules(behavior: OBRBehavior): Promise<RuleExecutionResult[]> {
    const results: RuleExecutionResult[] = [];

    for (const ruleLink of behavior.linkedRules) {
      const rule = this.blueprint.rules.find(r => r.id === ruleLink.ruleId);
      if (rule) {
        const result = await this.evaluateRule(rule);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Validate rules at a specific phase
   */
  private async validateRules(phase: 'before' | 'after', step: OBRScenarioStep): Promise<RuleExecutionResult | undefined> {
    // Find applicable rules for this scenario
    const applicableRules = this.blueprint.rules.filter(rule => 
      rule.scope.scenarios.includes(this.scenario.id)
    );

    if (applicableRules.length === 0) return undefined;

    // For simulation, just validate the first rule
    const rule = applicableRules[0];
    return await this.evaluateRule(rule);
  }

  /**
   * Evaluate a rule
   */
  private async evaluateRule(rule: OBRRule): Promise<RuleExecutionResult> {
    const startTime = Date.now();

    try {
      // Simplified rule evaluation
      const passed = Math.random() > 0.1; // 90% pass rate for demo
      
      return {
        ruleId: rule.id,
        passed,
        message: passed ? `Rule ${rule.displayName || rule.name} passed` : `Rule ${rule.displayName || rule.name} failed`,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        passed: false,
        error: error instanceof Error ? error.message : 'Rule evaluation error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Evaluate a condition expression
   */
  private async evaluateCondition(condition: string): Promise<any> {
    // Simplified condition evaluation for demo
    // In a real implementation, this would parse and evaluate the expression
    if (condition.includes('true')) return true;
    if (condition.includes('false')) return false;
    if (condition.includes('>')) return Math.random() > 0.5;
    if (condition.includes('<')) return Math.random() < 0.5;
    
    return Math.random() > 0.5; // Random result for unknown conditions
  }

  /**
   * Evaluate simple condition for decision branches
   */
  private evaluateSimpleCondition(branchCondition: string, contextValue: any): boolean {
    // Very simplified branch condition evaluation
    if (branchCondition === 'true' || branchCondition === 'default') return true;
    if (branchCondition === 'false') return false;
    
    // For demo, randomly select branches
    return Math.random() > 0.5;
  }

  /**
   * Simulate execution delay
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Event system
   */
  public on(event: string, handler: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  public off(event: string, handler: Function): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    }
  }

  private emit(event: string, data?: any): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }

  /**
   * Get current simulation state
   */
  public getState() {
    return {
      isRunning: this.isRunning,
      currentStep: this.currentStepId,
      executionHistory: this.executionHistory,
      objectStates: this.objectStates,
      scenario: this.scenario
    };
  }

  /**
   * Generate simulation result
   */
  public getResult(): SimulationResult {
    return {
      scenario: this.scenario.id,
      executionHistory: this.executionHistory,
      finalState: this.objectStates,
      success: this.executionHistory.every(step => step.result.success)
    };
  }
}

export const simulationEngineService = {
  createEngine: (blueprint: OntologyBlueprint, scenario: OBRScenario) => {
    return new SimulationEngine(blueprint, scenario);
  }
};