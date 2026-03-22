// OBR Validation Service
// Provides comprehensive validation for OBR models including schema, semantic, and consistency checks

import { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from '@/shared/types/obr.types';

export class OBRValidationService {
  
  // Main validation entry point
  async validateBlueprint(blueprint: OntologyBlueprint): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    try {
      // Schema validation
      const schemaErrors = await this.validateSchema(blueprint);
      errors.push(...schemaErrors);
      
      // Semantic validation
      const semanticErrors = await this.validateSemantics(blueprint);
      errors.push(...semanticErrors);
      
      // Consistency validation
      const consistencyErrors = await this.validateConsistency(blueprint);
      errors.push(...consistencyErrors);
      
      // Best practices validation
      const practiceWarnings = await this.validateBestPractices(blueprint);
      warnings.push(...practiceWarnings);
      
      // Performance validation
      const performanceWarnings = await this.validatePerformance(blueprint);
      warnings.push(...performanceWarnings);
      
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
          completenessScore: this.calculateCompleteness(blueprint),
          consistencyScore: this.calculateConsistency(blueprint)
        }
      };
    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        type: 'schema',
        path: 'root',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
      
      return {
        isValid: false,
        timestamp: new Date().toISOString(),
        errors,
        warnings,
        metrics: {
          objectCount: blueprint.objects?.length || 0,
          behaviorCount: blueprint.behaviors?.length || 0,
          ruleCount: blueprint.rules?.length || 0,
          scenarioCount: blueprint.scenarios?.length || 0,
          linkCount: blueprint.links?.length || 0,
          completenessScore: 0,
          consistencyScore: 0
        }
      };
    }
  }
  
  // Schema validation - validates against JSON schema and required fields
  private async validateSchema(blueprint: OntologyBlueprint): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    
    // Validate required metadata fields
    if (!blueprint.metadata?.id) {
      errors.push({
        code: 'MISSING_ID',
        type: 'schema',
        path: 'metadata.id',
        message: 'Blueprint ID is required',
        severity: 'error',
        suggestions: ['Add a unique ID for the blueprint']
      });
    }
    
    if (!blueprint.metadata?.name) {
      errors.push({
        code: 'MISSING_NAME',
        type: 'schema',
        path: 'metadata.name',
        message: 'Blueprint name is required',
        severity: 'error',
        suggestions: ['Add a descriptive name for the blueprint']
      });
    }
    
    if (!blueprint.metadata?.version) {
      errors.push({
        code: 'MISSING_VERSION',
        type: 'schema',
        path: 'metadata.version',
        message: 'Blueprint version is required',
        severity: 'error',
        suggestions: ['Add version information (e.g., "1.0.0")']
      });
    }
    
    if (!blueprint.$schema) {
      errors.push({
        code: 'MISSING_SCHEMA',
        type: 'schema',
        path: '$schema',
        message: 'Schema reference is required',
        severity: 'error',
        suggestions: ['Add $schema: "https://schemas.agent-factory.com/obr/v1.0.0"']
      });
    }
    
    // Validate arrays exist
    if (!Array.isArray(blueprint.objects)) {
      errors.push({
        code: 'INVALID_OBJECTS_ARRAY',
        type: 'schema',
        path: 'objects',
        message: 'Objects must be an array',
        severity: 'error'
      });
    }
    
    if (!Array.isArray(blueprint.behaviors)) {
      errors.push({
        code: 'INVALID_BEHAVIORS_ARRAY',
        type: 'schema',
        path: 'behaviors',
        message: 'Behaviors must be an array',
        severity: 'error'
      });
    }
    
    if (!Array.isArray(blueprint.rules)) {
      errors.push({
        code: 'INVALID_RULES_ARRAY',
        type: 'schema',
        path: 'rules',
        message: 'Rules must be an array',
        severity: 'error'
      });
    }
    
    if (!Array.isArray(blueprint.scenarios)) {
      errors.push({
        code: 'INVALID_SCENARIOS_ARRAY',
        type: 'schema',
        path: 'scenarios',
        message: 'Scenarios must be an array',
        severity: 'error'
      });
    }
    
    if (!Array.isArray(blueprint.links)) {
      errors.push({
        code: 'INVALID_LINKS_ARRAY',
        type: 'schema',
        path: 'links',
        message: 'Links must be an array',
        severity: 'error'
      });
    }
    
    // Validate individual objects
    blueprint.objects?.forEach((obj, index) => {
      const objErrors = this.validateObjectSchema(obj, `objects[${index}]`);
      errors.push(...objErrors);
    });
    
    blueprint.behaviors?.forEach((behavior, index) => {
      const behaviorErrors = this.validateBehaviorSchema(behavior, `behaviors[${index}]`);
      errors.push(...behaviorErrors);
    });
    
    blueprint.rules?.forEach((rule, index) => {
      const ruleErrors = this.validateRuleSchema(rule, `rules[${index}]`);
      errors.push(...ruleErrors);
    });
    
    blueprint.scenarios?.forEach((scenario, index) => {
      const scenarioErrors = this.validateScenarioSchema(scenario, `scenarios[${index}]`);
      errors.push(...scenarioErrors);
    });
    
    blueprint.links?.forEach((link, index) => {
      const linkErrors = this.validateLinkSchema(link, `links[${index}]`);
      errors.push(...linkErrors);
    });
    
    return errors;
  }
  
  // Semantic validation - validates logical relationships and references
  private async validateSemantics(blueprint: OntologyBlueprint): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    
    // Check for duplicate IDs across all entities
    const allIds: { id: string; type: string; path: string }[] = [];
    
    blueprint.objects?.forEach((obj, index) => {
      allIds.push({ id: obj.id, type: 'object', path: `objects[${index}]` });
    });
    
    blueprint.behaviors?.forEach((behavior, index) => {
      allIds.push({ id: behavior.id, type: 'behavior', path: `behaviors[${index}]` });
    });
    
    blueprint.rules?.forEach((rule, index) => {
      allIds.push({ id: rule.id, type: 'rule', path: `rules[${index}]` });
    });
    
    blueprint.scenarios?.forEach((scenario, index) => {
      allIds.push({ id: scenario.id, type: 'scenario', path: `scenarios[${index}]` });
    });
    
    // Find duplicates
    const idCounts = new Map<string, typeof allIds>();
    allIds.forEach(item => {
      const existing = idCounts.get(item.id);
      if (existing) {
        existing.push(item);
      } else {
        idCounts.set(item.id, [item]);
      }
    });
    
    idCounts.forEach((items, id) => {
      if (items.length > 1) {
        errors.push({
          code: 'DUPLICATE_ID',
          type: 'semantic',
          path: items.map(item => item.path).join(', '),
          message: `Duplicate ID '${id}' found in: ${items.map(item => `${item.type} at ${item.path}`).join(', ')}`,
          severity: 'error',
          suggestions: ['Ensure all IDs are unique across all entities']
        });
      }
    });
    
    // Validate reference integrity
    const validIds = new Set(allIds.map(item => item.id));
    
    // Check object attribute references
    blueprint.objects?.forEach((obj, objIndex) => {
      Object.entries(obj.attributes || {}).forEach(([attrName, attr]) => {
        if (attr.type === 'reference' && attr.constraints?.references) {
          if (!validIds.has(attr.constraints.references)) {
            errors.push({
              code: 'BROKEN_REFERENCE',
              type: 'semantic',
              path: `objects[${objIndex}].attributes.${attrName}`,
              message: `Referenced object '${attr.constraints.references}' does not exist`,
              severity: 'error',
              suggestions: ['Check that the referenced object ID is correct', 'Create the referenced object']
            });
          }
        }
      });
      
      // Check state machine trigger references
      obj.stateMachine?.transitions?.forEach((transition, transIndex) => {
        if (!blueprint.behaviors?.some(b => b.id === transition.trigger)) {
          errors.push({
            code: 'MISSING_TRIGGER_BEHAVIOR',
            type: 'semantic',
            path: `objects[${objIndex}].stateMachine.transitions[${transIndex}]`,
            message: `Trigger behavior '${transition.trigger}' does not exist`,
            severity: 'error',
            suggestions: ['Create the referenced behavior', 'Fix the trigger reference']
          });
        }
      });
    });
    
    // Check behavior rule references
    blueprint.behaviors?.forEach((behavior, behaviorIndex) => {
      behavior.linkedRules?.forEach((ruleLink, linkIndex) => {
        if (!blueprint.rules?.some(r => r.id === ruleLink.ruleId)) {
          errors.push({
            code: 'MISSING_LINKED_RULE',
            type: 'semantic',
            path: `behaviors[${behaviorIndex}].linkedRules[${linkIndex}]`,
            message: `Linked rule '${ruleLink.ruleId}' does not exist`,
            severity: 'error',
            suggestions: ['Create the referenced rule', 'Remove the invalid rule link']
          });
        }
      });
      
      // Check precondition object state references
      behavior.preconditions?.objectStates?.forEach((objState, stateIndex) => {
        if (!validIds.has(objState.objectId)) {
          errors.push({
            code: 'MISSING_PRECONDITION_OBJECT',
            type: 'semantic',
            path: `behaviors[${behaviorIndex}].preconditions.objectStates[${stateIndex}]`,
            message: `Precondition object '${objState.objectId}' does not exist`,
            severity: 'error'
          });
        }
      });
    });
    
    // Check scenario step behavior references
    blueprint.scenarios?.forEach((scenario, scenarioIndex) => {
      scenario.steps?.forEach((step, stepIndex) => {
        if (step.task?.behaviorId && !blueprint.behaviors?.some(b => b.id === step.task?.behaviorId)) {
          errors.push({
            code: 'MISSING_STEP_BEHAVIOR',
            type: 'semantic',
            path: `scenarios[${scenarioIndex}].steps[${stepIndex}]`,
            message: `Step behavior '${step.task.behaviorId}' does not exist`,
            severity: 'error'
          });
        }
        
        // Check step flow references
        const nextSteps = Array.isArray(step.next) ? step.next : [step.next];
        nextSteps.forEach((nextId, nextIndex) => {
          if (nextId && !scenario.steps.some(s => s.id === nextId)) {
            errors.push({
              code: 'MISSING_NEXT_STEP',
              type: 'semantic',
              path: `scenarios[${scenarioIndex}].steps[${stepIndex}].next[${nextIndex}]`,
              message: `Next step '${nextId}' does not exist in scenario`,
              severity: 'error'
            });
          }
        });
      });
    });
    
    // Check link references
    blueprint.links?.forEach((link, linkIndex) => {
      if (!validIds.has(link.sourceId)) {
        errors.push({
          code: 'MISSING_LINK_SOURCE',
          type: 'semantic',
          path: `links[${linkIndex}]`,
          message: `Link source '${link.sourceId}' does not exist`,
          severity: 'error'
        });
      }
      
      if (!validIds.has(link.targetId)) {
        errors.push({
          code: 'MISSING_LINK_TARGET',
          type: 'semantic',
          path: `links[${linkIndex}]`,
          message: `Link target '${link.targetId}' does not exist`,
          severity: 'error'
        });
      }
    });
    
    return errors;
  }
  
  // Consistency validation - validates logical consistency
  private async validateConsistency(blueprint: OntologyBlueprint): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    
    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(blueprint);
    if (circularDeps.length > 0) {
      errors.push({
        code: 'CIRCULAR_DEPENDENCY',
        type: 'consistency',
        path: 'links',
        message: `Circular dependencies detected: ${circularDeps.join(', ')}`,
        severity: 'error',
        suggestions: ['Review dependency relationships to remove cycles']
      });
    }
    
    // Check state machine consistency
    blueprint.objects?.forEach((obj, objIndex) => {
      if (obj.stateMachine) {
        const stateErrors = this.validateStateMachine(obj.stateMachine, `objects[${objIndex}].stateMachine`);
        errors.push(...stateErrors);
      }
    });
    
    // Check rule conflicts
    const ruleConflicts = this.detectRuleConflicts(blueprint.rules || []);
    ruleConflicts.forEach(conflict => {
      errors.push({
        code: 'RULE_CONFLICT',
        type: 'consistency',
        path: `rules[${conflict.ruleIndexes.join(',')}]`,
        message: `Rule conflict detected: ${conflict.description}`,
        severity: 'warning', // Conflicts might be intentional
        suggestions: ['Review rule priorities', 'Add conflict resolution']
      });
    });
    
    // Check scenario flow consistency
    blueprint.scenarios?.forEach((scenario, scenarioIndex) => {
      const flowErrors = this.validateScenarioFlow(scenario, `scenarios[${scenarioIndex}]`);
      errors.push(...flowErrors);
    });
    
    return errors;
  }
  
  // Best practices validation
  private async validateBestPractices(blueprint: OntologyBlueprint): Promise<ValidationWarning[]> {
    const warnings: ValidationWarning[] = [];
    
    // Check for empty collections
    if (blueprint.objects?.length === 0) {
      warnings.push({
        code: 'EMPTY_OBJECTS',
        type: 'best_practice',
        path: 'objects',
        message: 'No objects defined. Consider adding business entities.',
        suggestions: ['Define at least one business object']
      });
    }
    
    if (blueprint.behaviors?.length === 0) {
      warnings.push({
        code: 'EMPTY_BEHAVIORS',
        type: 'best_practice',
        path: 'behaviors',
        message: 'No behaviors defined. Consider adding business operations.',
        suggestions: ['Define at least one business behavior']
      });
    }
    
    // Check naming conventions
    blueprint.objects?.forEach((obj, index) => {
      if (!/^[A-Z]/.test(obj.name)) {
        warnings.push({
          code: 'NAMING_CONVENTION',
          type: 'best_practice',
          path: `objects[${index}].name`,
          message: 'Object names should start with uppercase letter',
          suggestions: ['Use PascalCase for object names']
        });
      }
    });
    
    blueprint.behaviors?.forEach((behavior, index) => {
      if (!/^[a-z]/.test(behavior.name)) {
        warnings.push({
          code: 'NAMING_CONVENTION',
          type: 'best_practice',
          path: `behaviors[${index}].name`,
          message: 'Behavior names should start with lowercase letter',
          suggestions: ['Use camelCase for behavior names']
        });
      }
    });
    
    // Check for missing descriptions
    blueprint.objects?.forEach((obj, index) => {
      if (!obj.description || obj.description.trim().length === 0) {
        warnings.push({
          code: 'MISSING_DESCRIPTION',
          type: 'maintainability',
          path: `objects[${index}].description`,
          message: 'Object missing description',
          suggestions: ['Add a clear description for better documentation']
        });
      }
    });
    
    // Check for overly complex objects (too many attributes)
    blueprint.objects?.forEach((obj, index) => {
      const attrCount = Object.keys(obj.attributes || {}).length;
      if (attrCount > 15) {
        warnings.push({
          code: 'COMPLEX_OBJECT',
          type: 'maintainability',
          path: `objects[${index}]`,
          message: `Object has ${attrCount} attributes, consider breaking it down`,
          suggestions: ['Split into smaller, focused objects', 'Use composition relationships']
        });
      }
    });
    
    return warnings;
  }
  
  // Performance validation
  private async validatePerformance(blueprint: OntologyBlueprint): Promise<ValidationWarning[]> {
    const warnings: ValidationWarning[] = [];
    
    const totalEntities = (blueprint.objects?.length || 0) + 
                         (blueprint.behaviors?.length || 0) + 
                         (blueprint.rules?.length || 0) + 
                         (blueprint.scenarios?.length || 0);
    
    if (totalEntities > 100) {
      warnings.push({
        code: 'LARGE_BLUEPRINT',
        type: 'performance',
        path: 'root',
        message: `Blueprint contains ${totalEntities} entities, which may impact performance`,
        suggestions: ['Consider splitting into multiple blueprints', 'Use lazy loading patterns']
      });
    }
    
    if (blueprint.links && blueprint.links.length > 200) {
      warnings.push({
        code: 'MANY_LINKS',
        type: 'performance',
        path: 'links',
        message: `${blueprint.links.length} links may impact graph rendering performance`,
        suggestions: ['Consider reducing relationship complexity', 'Use link filtering']
      });
    }
    
    // Check for deeply nested scenarios
    blueprint.scenarios?.forEach((scenario, index) => {
      const maxDepth = this.calculateScenarioDepth(scenario);
      if (maxDepth > 10) {
        warnings.push({
          code: 'DEEP_SCENARIO',
          type: 'performance',
          path: `scenarios[${index}]`,
          message: `Scenario has depth ${maxDepth}, may impact execution performance`,
          suggestions: ['Break into sub-scenarios', 'Flatten the execution flow']
        });
      }
    });
    
    return warnings;
  }
  
  // Helper methods for individual entity validation
  private validateObjectSchema(obj: OBRObject, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!obj.id) {
      errors.push({
        code: 'MISSING_OBJECT_ID',
        type: 'schema',
        path: `${path}.id`,
        message: 'Object ID is required',
        severity: 'error'
      });
    }
    
    if (!obj.name) {
      errors.push({
        code: 'MISSING_OBJECT_NAME',
        type: 'schema',
        path: `${path}.name`,
        message: 'Object name is required',
        severity: 'error'
      });
    }
    
    if (!obj.category || !['entity', 'value_object', 'aggregate', 'service'].includes(obj.category)) {
      errors.push({
        code: 'INVALID_OBJECT_CATEGORY',
        type: 'schema',
        path: `${path}.category`,
        message: 'Object category must be one of: entity, value_object, aggregate, service',
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  private validateBehaviorSchema(behavior: OBRBehavior, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!behavior.id) {
      errors.push({
        code: 'MISSING_BEHAVIOR_ID',
        type: 'schema',
        path: `${path}.id`,
        message: 'Behavior ID is required',
        severity: 'error'
      });
    }
    
    if (!behavior.category || !['command', 'query', 'event', 'workflow'].includes(behavior.category)) {
      errors.push({
        code: 'INVALID_BEHAVIOR_CATEGORY',
        type: 'schema',
        path: `${path}.category`,
        message: 'Behavior category must be one of: command, query, event, workflow',
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  private validateRuleSchema(rule: OBRRule, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!rule.id) {
      errors.push({
        code: 'MISSING_RULE_ID',
        type: 'schema',
        path: `${path}.id`,
        message: 'Rule ID is required',
        severity: 'error'
      });
    }
    
    if (!rule.category || !['invariant', 'trigger', 'validation', 'constraint'].includes(rule.category)) {
      errors.push({
        code: 'INVALID_RULE_CATEGORY',
        type: 'schema',
        path: `${path}.category`,
        message: 'Rule category must be one of: invariant, trigger, validation, constraint',
        severity: 'error'
      });
    }
    
    if (rule.priority < 1 || rule.priority > 10) {
      errors.push({
        code: 'INVALID_RULE_PRIORITY',
        type: 'schema',
        path: `${path}.priority`,
        message: 'Rule priority must be between 1 and 10',
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  private validateScenarioSchema(scenario: OBRScenario, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!scenario.id) {
      errors.push({
        code: 'MISSING_SCENARIO_ID',
        type: 'schema',
        path: `${path}.id`,
        message: 'Scenario ID is required',
        severity: 'error'
      });
    }
    
    if (!scenario.category || !['process', 'workflow', 'event_handling', 'decision_flow'].includes(scenario.category)) {
      errors.push({
        code: 'INVALID_SCENARIO_CATEGORY',
        type: 'schema',
        path: `${path}.category`,
        message: 'Scenario category must be one of: process, workflow, event_handling, decision_flow',
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  private validateLinkSchema(link: OBRLink, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!link.id) {
      errors.push({
        code: 'MISSING_LINK_ID',
        type: 'schema',
        path: `${path}.id`,
        message: 'Link ID is required',
        severity: 'error'
      });
    }
    
    const validRelationships = [
      'is_a', 'part_of', 'depends_on', 'triggers', 'precedes', 
      'conflicts_with', 'implements', 'validates', 'aggregates', 
      'uses', 'produces', 'consumes'
    ];
    
    if (!validRelationships.includes(link.relationshipType)) {
      errors.push({
        code: 'INVALID_RELATIONSHIP_TYPE',
        type: 'schema',
        path: `${path}.relationshipType`,
        message: `Invalid relationship type '${link.relationshipType}'`,
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  // Helper methods for consistency validation
  private detectCircularDependencies(blueprint: OntologyBlueprint): string[] {
    const cycles: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const dfs = (nodeId: string, path: string[]): boolean => {
      if (recursionStack.has(nodeId)) {
        cycles.push([...path, nodeId].join(' -> '));
        return true;
      }
      
      if (visited.has(nodeId)) {
        return false;
      }
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      // Find dependencies through 'depends_on' links
      const dependencies = blueprint.links
        ?.filter(link => link.sourceId === nodeId && link.relationshipType === 'depends_on')
        .map(link => link.targetId) || [];
      
      for (const dep of dependencies) {
        if (dfs(dep, [...path, nodeId])) {
          return true;
        }
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    // Check all entities for cycles
    const allIds = [
      ...blueprint.objects?.map(o => o.id) || [],
      ...blueprint.behaviors?.map(b => b.id) || [],
      ...blueprint.rules?.map(r => r.id) || [],
      ...blueprint.scenarios?.map(s => s.id) || []
    ];
    
    for (const id of allIds) {
      if (!visited.has(id)) {
        dfs(id, []);
      }
    }
    
    return cycles;
  }
  
  private validateStateMachine(stateMachine: any, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!stateMachine.initialState) {
      errors.push({
        code: 'MISSING_INITIAL_STATE',
        type: 'consistency',
        path: `${path}.initialState`,
        message: 'State machine must have an initial state',
        severity: 'error'
      });
    }
    
    if (!stateMachine.states || Object.keys(stateMachine.states).length === 0) {
      errors.push({
        code: 'NO_STATES_DEFINED',
        type: 'consistency',
        path: `${path}.states`,
        message: 'State machine must have at least one state',
        severity: 'error'
      });
    }
    
    // Check if initial state exists in states
    if (stateMachine.initialState && !stateMachine.states?.[stateMachine.initialState]) {
      errors.push({
        code: 'INVALID_INITIAL_STATE',
        type: 'consistency',
        path: `${path}.initialState`,
        message: `Initial state '${stateMachine.initialState}' is not defined in states`,
        severity: 'error'
      });
    }
    
    // Check if all transitions reference valid states
    stateMachine.transitions?.forEach((transition: any, index: number) => {
      if (!stateMachine.states?.[transition.from]) {
        errors.push({
          code: 'INVALID_TRANSITION_FROM',
          type: 'consistency',
          path: `${path}.transitions[${index}].from`,
          message: `Transition 'from' state '${transition.from}' does not exist`,
          severity: 'error'
        });
      }
      
      if (!stateMachine.states?.[transition.to]) {
        errors.push({
          code: 'INVALID_TRANSITION_TO',
          type: 'consistency',
          path: `${path}.transitions[${index}].to`,
          message: `Transition 'to' state '${transition.to}' does not exist`,
          severity: 'error'
        });
      }
    });
    
    return errors;
  }
  
  private detectRuleConflicts(rules: OBRRule[]): Array<{ ruleIndexes: number[], description: string }> {
    const conflicts: Array<{ ruleIndexes: number[], description: string }> = [];
    
    // Check for priority conflicts (rules with same priority in same scope)
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const rule1 = rules[i];
        const rule2 = rules[j];
        
        if (rule1.priority === rule2.priority) {
          // Check if they have overlapping scope
          const hasOverlappingScope = 
            rule1.scope.objects.some(obj => rule2.scope.objects.includes(obj)) ||
            rule1.scope.behaviors.some(beh => rule2.scope.behaviors.includes(beh)) ||
            rule1.scope.scenarios.some(scen => rule2.scope.scenarios.includes(scen));
          
          if (hasOverlappingScope) {
            conflicts.push({
              ruleIndexes: [i, j],
              description: `Rules '${rule1.name}' and '${rule2.name}' have the same priority (${rule1.priority}) and overlapping scope`
            });
          }
        }
      }
    }
    
    return conflicts;
  }
  
  private validateScenarioFlow(scenario: OBRScenario, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Check for unreachable steps
    const reachableSteps = new Set<string>();
    const startSteps = scenario.steps?.filter(step => step.type === 'start') || [];
    
    if (startSteps.length === 0) {
      errors.push({
        code: 'NO_START_STEP',
        type: 'consistency',
        path: `${path}.steps`,
        message: 'Scenario must have at least one start step',
        severity: 'error'
      });
    }
    
    if (startSteps.length > 1) {
      errors.push({
        code: 'MULTIPLE_START_STEPS',
        type: 'consistency',
        path: `${path}.steps`,
        message: 'Scenario should have only one start step',
        severity: 'warning'
      });
    }
    
    // Trace reachable steps from start
    const traceReachable = (stepId: string) => {
      if (reachableSteps.has(stepId)) return;
      
      reachableSteps.add(stepId);
      const step = scenario.steps?.find(s => s.id === stepId);
      if (step) {
        const nextSteps = Array.isArray(step.next) ? step.next : [step.next];
        nextSteps.filter(Boolean).forEach(nextId => traceReachable(nextId));
      }
    };
    
    startSteps.forEach(step => traceReachable(step.id));
    
    // Find unreachable steps
    const allStepIds = scenario.steps?.map(s => s.id) || [];
    const unreachableSteps = allStepIds.filter(id => !reachableSteps.has(id));
    
    unreachableSteps.forEach(stepId => {
      const stepIndex = scenario.steps?.findIndex(s => s.id === stepId) || -1;
      errors.push({
        code: 'UNREACHABLE_STEP',
        type: 'consistency',
        path: `${path}.steps[${stepIndex}]`,
        message: `Step '${stepId}' is not reachable from start`,
        severity: 'warning'
      });
    });
    
    return errors;
  }
  
  private calculateScenarioDepth(scenario: OBRScenario): number {
    const visited = new Set<string>();
    
    const dfs = (stepId: string): number => {
      if (visited.has(stepId)) return 0;
      visited.add(stepId);
      
      const step = scenario.steps?.find(s => s.id === stepId);
      if (!step) return 0;
      
      const nextSteps = Array.isArray(step.next) ? step.next : [step.next];
      const depths = nextSteps.filter(Boolean).map(nextId => dfs(nextId));
      
      return 1 + Math.max(0, ...depths);
    };
    
    const startSteps = scenario.steps?.filter(step => step.type === 'start') || [];
    return Math.max(...startSteps.map(step => dfs(step.id)), 0);
  }
  
  // Calculate completion score based on various factors
  private calculateCompleteness(blueprint: OntologyBlueprint): number {
    let score = 0;
    const maxScore = 100;
    
    // Basic structure (40 points)
    if (blueprint.objects && blueprint.objects.length > 0) score += 10;
    if (blueprint.behaviors && blueprint.behaviors.length > 0) score += 10;
    if (blueprint.rules && blueprint.rules.length > 0) score += 10;
    if (blueprint.scenarios && blueprint.scenarios.length > 0) score += 10;
    
    // Relationships (20 points)
    if (blueprint.links && blueprint.links.length > 0) score += 20;
    
    // Documentation (20 points)
    const hasGoodDocs = blueprint.metadata?.description && 
                       blueprint.objects?.every(obj => obj.description) &&
                       blueprint.behaviors?.every(beh => beh.description) &&
                       blueprint.rules?.every(rule => rule.description) &&
                       blueprint.scenarios?.every(scen => scen.description);
    
    if (hasGoodDocs) score += 20;
    else {
      // Partial credit for some documentation
      let docCount = 0;
      if (blueprint.metadata?.description) docCount++;
      if (blueprint.objects?.some(obj => obj.description)) docCount++;
      if (blueprint.behaviors?.some(beh => beh.description)) docCount++;
      if (blueprint.rules?.some(rule => rule.description)) docCount++;
      if (blueprint.scenarios?.some(scen => scen.description)) docCount++;
      score += Math.floor(docCount * 4); // 4 points per documented category
    }
    
    // Advanced features (20 points)
    const hasStateMachines = blueprint.objects?.some(obj => obj.stateMachine);
    const hasConstraints = blueprint.objects?.some(obj => obj.constraints?.length > 0);
    const hasTestCases = blueprint.rules?.some(rule => rule.testCases && rule.testCases.length > 0);
    const hasComplexScenarios = blueprint.scenarios?.some(scen => scen.steps?.length > 5);
    
    if (hasStateMachines) score += 5;
    if (hasConstraints) score += 5;
    if (hasTestCases) score += 5;
    if (hasComplexScenarios) score += 5;
    
    return Math.min(score, maxScore);
  }
  
  private calculateConsistency(blueprint: OntologyBlueprint): number {
    let score = 100;
    
    // Check for broken references (major deduction)
    const validIds = new Set([
      ...blueprint.objects?.map(o => o.id) || [],
      ...blueprint.behaviors?.map(b => b.id) || [],
      ...blueprint.rules?.map(r => r.id) || [],
      ...blueprint.scenarios?.map(s => s.id) || []
    ]);
    
    const brokenLinks = blueprint.links?.filter(
      link => !validIds.has(link.sourceId) || !validIds.has(link.targetId)
    ) || [];
    
    score -= brokenLinks.length * 10; // 10 points per broken link
    
    // Check for duplicate IDs (major deduction)
    const allIds = [
      ...blueprint.objects?.map(o => o.id) || [],
      ...blueprint.behaviors?.map(b => b.id) || [],
      ...blueprint.rules?.map(r => r.id) || [],
      ...blueprint.scenarios?.map(s => s.id) || []
    ];
    
    const uniqueIds = new Set(allIds);
    const duplicateCount = allIds.length - uniqueIds.size;
    score -= duplicateCount * 15; // 15 points per duplicate
    
    // Check for circular dependencies (moderate deduction)
    const circularDeps = this.detectCircularDependencies(blueprint);
    score -= circularDeps.length * 5; // 5 points per circular dependency
    
    return Math.max(0, score);
  }
}

// Export singleton instance
export const obrValidationService = new OBRValidationService();