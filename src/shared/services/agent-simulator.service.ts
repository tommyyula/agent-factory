/**
 * Agent Simulator Service
 * Simulates agent behavior for Agent Factory runtime environment
 * Generates realistic mock responses based on agent capabilities and OBR behaviors
 */

import { SimpleAgencyAgent } from '@/data/agency-agents-simple';
import { SchemaTable, getTablesByDomain } from '@/data/agency-schemas';

// Types for agent execution simulation
export interface AgentContext {
  domain: string;
  availableTables: string[];
  mockData?: Map<string, any[]>;
  rules?: BusinessRule[];
  currentSession: string;
}

export interface ExecutionEvent {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: 'command' | 'thinking' | 'tool_call' | 'tool_result' | 'response' | 'error';
  data: any;
  metadata?: {
    tokenCount?: number;
    executionTime?: number;
    tablesAccessed?: string[];
  };
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  domain: string;
  condition: string;
  action: string;
}

export interface AgentSimulatorResponse {
  message: string;
  toolCalls: ToolCall[];
  tablesAccessed: string[];
  rulesChecked: string[];
  estimatedTokens: number;
  executionSteps: ExecutionStep[];
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  result?: any;
}

export interface ExecutionStep {
  step: number;
  description: string;
  action: string;
  duration: number;
}

/**
 * Mock Agent Simulator
 * Provides realistic simulation of agent behavior without actual LLM calls
 */
export class AgentSimulator {
  private rules: Map<string, BusinessRule[]> = new Map();

  constructor() {
    this.initializeBusinessRules();
  }

  /**
   * Simulate agent command execution
   */
  async *simulateExecution(
    agent: SimpleAgencyAgent,
    command: string,
    context: AgentContext
  ): AsyncGenerator<ExecutionEvent> {
    const sessionId = context.currentSession;
    const startTime = Date.now();

    try {
      // 1. Thinking phase
      yield this.createEvent(sessionId, 'thinking', {
        message: '分析用户指令和可用数据...',
        agent: agent.name
      });

      await this.delay(800);

      // 2. Parse command and determine actions
      const analyzedCommand = this.analyzeCommand(command, agent, context);
      
      yield this.createEvent(sessionId, 'thinking', {
        message: `识别关键词: ${analyzedCommand.keywords.join(', ')}`,
        capabilities: analyzedCommand.matchedCapabilities
      });

      await this.delay(600);

      // 3. Generate tool calls
      const toolCalls = this.generateToolCalls(analyzedCommand, context);
      
      for (const toolCall of toolCalls) {
        yield this.createEvent(sessionId, 'tool_call', toolCall, {
          tablesAccessed: toolCall.parameters.tables || []
        });

        await this.delay(400);

        const result = this.simulateToolResult(toolCall, context);
        yield this.createEvent(sessionId, 'tool_result', {
          toolCallId: toolCall.id,
          ...result
        });

        await this.delay(300);
      }

      // 4. Check business rules
      const rulesChecked = this.checkBusinessRules(analyzedCommand, context);
      
      if (rulesChecked.length > 0) {
        yield this.createEvent(sessionId, 'thinking', {
          message: `检查业务规则: ${rulesChecked.map(r => r.name).join(', ')}`
        });
        await this.delay(500);
      }

      // 5. Generate final response
      const response = this.generateResponse(agent, analyzedCommand, toolCalls, rulesChecked, context);
      
      yield this.createEvent(sessionId, 'response', response, {
        tokenCount: response.estimatedTokens,
        executionTime: Date.now() - startTime,
        tablesAccessed: response.tablesAccessed
      });

    } catch (error: unknown) {
      yield this.createEvent(sessionId, 'error', {
        message: (error instanceof Error ? error.message : 'Unknown error'),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  /**
   * Analyze user command and match to agent capabilities
   */
  private analyzeCommand(command: string, agent: SimpleAgencyAgent, context: AgentContext): AnalyzedCommand {
    const keywords = this.extractKeywords(command);
    const intent = this.determineIntent(command, keywords);
    const matchedCapabilities = agent.capabilities.filter(cap => 
      keywords.some(kw => cap.toLowerCase().includes(kw.toLowerCase()))
    );

    return {
      original: command,
      keywords,
      intent,
      matchedCapabilities,
      domain: agent.domain,
      complexity: this.estimateComplexity(command, matchedCapabilities)
    };
  }

  /**
   * Extract keywords from command (supports Chinese and English)
   */
  private extractKeywords(command: string): string[] {
    // Common domain keywords mapping
    const keywordMap = {
      // WMS keywords
      '入库': ['inbound', 'receiving'],
      '出库': ['outbound', 'shipping'],
      '盘点': ['cycle count', 'inventory count'],
      '补货': ['replenishment'],
      '库存': ['inventory', 'stock'],
      '订单': ['order'],
      '拣货': ['picking', 'pick'],
      '包装': ['packing', 'package'],
      
      // FMS keywords  
      '运输': ['transport', 'shipping'],
      '派车': ['dispatch'],
      '路线': ['route', 'routing'],
      '承运商': ['carrier'],
      '运费': ['freight', 'rate'],
      
      // OMS keywords
      '订单处理': ['order processing'],
      '履约': ['fulfillment'],
      '客户': ['customer'],
      
      // BNP keywords
      '计费': ['billing', 'invoice'],
      '发票': ['invoice'],
      '付款': ['payment'],
      '对账': ['reconciliation'],
      '账款': ['accounts payable', 'accounts receivable'],
      
      // YMS keywords
      '预约': ['appointment'],
      '进门': ['check-in', 'gate'],
      '出门': ['check-out'],
      '排队': ['queue'],
      '停车': ['parking']
    };

    const keywords = new Set<string>();
    
    // Extract Chinese keywords
    for (const [chinese, english] of Object.entries(keywordMap)) {
      if (command.includes(chinese)) {
        keywords.add(chinese);
        english.forEach(en => keywords.add(en));
      }
    }
    
    // Extract English words
    const englishWords = command.match(/\b[a-zA-Z]+\b/g) || [];
    englishWords.forEach(word => {
      if (word.length > 3) { // Skip short words
        keywords.add(word.toLowerCase());
      }
    });

    return Array.from(keywords);
  }

  /**
   * Determine user intent from command
   */
  private determineIntent(command: string, keywords: string[]): string {
    const intentPatterns = {
      'query': ['查询', '查看', '显示', 'show', 'display', 'list', 'get'],
      'create': ['创建', '新建', '添加', 'create', 'add', 'new'],
      'update': ['更新', '修改', '编辑', 'update', 'modify', 'edit', 'change'],
      'delete': ['删除', '移除', 'delete', 'remove'],
      'process': ['处理', '执行', '运行', 'process', 'execute', 'run'],
      'analyze': ['分析', '统计', '报告', 'analyze', 'report', 'statistics'],
      'approve': ['审批', '确认', 'approve', 'confirm'],
      'reject': ['拒绝', '驳回', 'reject', 'decline']
    };

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => command.includes(pattern))) {
        return intent;
      }
    }

    return 'query'; // default intent
  }

  /**
   * Estimate command complexity
   */
  private estimateComplexity(command: string, capabilities: string[]): 'low' | 'medium' | 'high' {
    const factors = [
      command.length > 50,
      capabilities.length > 2,
      command.includes('分析') || command.includes('analyze'),
      command.includes('批量') || command.includes('batch'),
      /\d+/.test(command) // contains numbers
    ];

    const score = factors.filter(Boolean).length;
    
    if (score <= 1) return 'low';
    if (score <= 3) return 'medium';
    return 'high';
  }

  /**
   * Generate realistic tool calls based on analyzed command
   */
  private generateToolCalls(analyzed: AnalyzedCommand, context: AgentContext): ToolCall[] {
    const toolCalls: ToolCall[] = [];
    const tables = getTablesByDomain(analyzed.domain);
    
    // Determine which tools to use based on intent and capabilities
    switch (analyzed.intent) {
      case 'query':
        toolCalls.push({
          id: `tool_${Date.now()}_1`,
          name: 'database_query',
          parameters: {
            query: this.generateSQLQuery(analyzed, tables),
            tables: this.selectRelevantTables(analyzed, tables, 3),
            filters: this.generateFilters(analyzed)
          }
        });
        break;
        
      case 'create':
        toolCalls.push({
          id: `tool_${Date.now()}_2`,
          name: 'validate_input',
          parameters: {
            data: this.generateMockInput(analyzed),
            rules: this.getValidationRules(analyzed.domain)
          }
        });
        toolCalls.push({
          id: `tool_${Date.now()}_3`,
          name: 'database_insert',
          parameters: {
            table: this.selectPrimaryTable(analyzed, tables),
            data: this.generateMockInput(analyzed)
          }
        });
        break;
        
      case 'update':
        toolCalls.push({
          id: `tool_${Date.now()}_4`,
          name: 'database_query',
          parameters: {
            query: `查找需要更新的记录`,
            tables: this.selectRelevantTables(analyzed, tables, 2)
          }
        });
        toolCalls.push({
          id: `tool_${Date.now()}_5`,
          name: 'database_update',
          parameters: {
            table: this.selectPrimaryTable(analyzed, tables),
            updates: this.generateMockUpdates(analyzed)
          }
        });
        break;
        
      case 'process':
        toolCalls.push({
          id: `tool_${Date.now()}_6`,
          name: 'business_process',
          parameters: {
            process: this.mapToBusinessProcess(analyzed),
            input: this.generateMockInput(analyzed)
          }
        });
        break;
        
      case 'analyze':
        toolCalls.push({
          id: `tool_${Date.now()}_7`,
          name: 'data_aggregation',
          parameters: {
            metrics: this.generateAnalyticsMetrics(analyzed),
            timeframe: '最近30天',
            groupBy: this.getAnalyticsGroupBy(analyzed)
          }
        });
        break;
    }

    return toolCalls;
  }

  /**
   * Simulate tool execution results
   */
  private simulateToolResult(toolCall: ToolCall, context: AgentContext): any {
    const { name, parameters } = toolCall;
    
    switch (name) {
      case 'database_query':
        return {
          success: true,
          rowCount: Math.floor(Math.random() * 100) + 1,
          data: this.generateMockQueryResults(parameters, context),
          executionTime: Math.floor(Math.random() * 200) + 50
        };
        
      case 'database_insert':
        return {
          success: true,
          insertedId: this.generateId(),
          rowsAffected: 1,
          executionTime: Math.floor(Math.random() * 100) + 30
        };
        
      case 'database_update':
        return {
          success: true,
          rowsAffected: Math.floor(Math.random() * 10) + 1,
          executionTime: Math.floor(Math.random() * 150) + 40
        };
        
      case 'validate_input':
        return {
          valid: Math.random() > 0.1, // 90% success rate
          errors: Math.random() > 0.9 ? ['字段验证失败'] : [],
          warnings: Math.random() > 0.7 ? ['建议检查数据格式'] : []
        };
        
      case 'business_process':
        return {
          success: true,
          processId: this.generateId(),
          status: 'completed',
          output: this.generateProcessOutput(parameters)
        };
        
      case 'data_aggregation':
        return {
          success: true,
          metrics: this.generateAnalyticsResults(parameters),
          chartData: this.generateChartData(parameters)
        };
        
      default:
        return {
          success: true,
          message: `${name} 执行成功`,
          data: {}
        };
    }
  }

  /**
   * Check relevant business rules
   */
  private checkBusinessRules(analyzed: AnalyzedCommand, context: AgentContext): BusinessRule[] {
    const domainRules = this.rules.get(analyzed.domain) || [];
    
    return domainRules.filter(rule => {
      // Simple keyword matching for rule relevance
      return analyzed.keywords.some(keyword => 
        rule.description.toLowerCase().includes(keyword.toLowerCase()) ||
        rule.condition.toLowerCase().includes(keyword.toLowerCase())
      );
    }).slice(0, 3); // Limit to 3 most relevant rules
  }

  /**
   * Generate final response
   */
  private generateResponse(
    agent: SimpleAgencyAgent,
    analyzed: AnalyzedCommand,
    toolCalls: ToolCall[],
    rulesChecked: BusinessRule[],
    context: AgentContext
  ): AgentSimulatorResponse {
    
    const executionSteps = this.generateExecutionSteps(analyzed, toolCalls);
    const tablesAccessed = this.extractTablesFromToolCalls(toolCalls);
    
    let message = this.generateResponseMessage(agent, analyzed, toolCalls, rulesChecked);
    
    return {
      message,
      toolCalls,
      tablesAccessed,
      rulesChecked: rulesChecked.map(r => r.name),
      estimatedTokens: this.estimateTokenUsage(message, toolCalls),
      executionSteps
    };
  }

  // Helper methods
  
  private createEvent(sessionId: string, type: ExecutionEvent['type'], data: any, metadata?: any): ExecutionEvent {
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      timestamp: new Date(),
      type,
      data,
      metadata
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private selectRelevantTables(analyzed: AnalyzedCommand, tables: SchemaTable[], limit: number): string[] {
    // Simple relevance scoring based on keywords and domain
    const scored = tables.map(table => ({
      name: table.name,
      score: analyzed.keywords.reduce((score, keyword) => {
        return score + (table.name.toLowerCase().includes(keyword.toLowerCase()) ? 10 : 0);
      }, 0)
    }));
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(t => t.name);
  }

  private selectPrimaryTable(analyzed: AnalyzedCommand, tables: SchemaTable[]): string {
    return this.selectRelevantTables(analyzed, tables, 1)[0] || tables[0]?.name || 'default_table';
  }

  private generateMockQueryResults(parameters: any, context: AgentContext): any[] {
    const rowCount = Math.min(parameters.rowCount || Math.floor(Math.random() * 20) + 1, 50);
    const results = [];
    
    for (let i = 0; i < rowCount; i++) {
      results.push({
        id: this.generateId(),
        name: `示例记录 ${i + 1}`,
        status: this.randomChoice(['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED']),
        created_date: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        amount: Math.floor(Math.random() * 10000) + 100
      });
    }
    
    return results;
  }

  private generateResponseMessage(
    agent: SimpleAgencyAgent,
    analyzed: AnalyzedCommand,
    toolCalls: ToolCall[],
    rulesChecked: BusinessRule[]
  ): string {
    const templates = {
      query: `已完成查询任务。通过访问 ${toolCalls.length} 个数据表，找到了相关信息。${rulesChecked.length > 0 ? `检查了 ${rulesChecked.length} 个业务规则，均符合要求。` : ''}`,
      create: `成功创建新记录。已验证输入数据并完成数据库插入操作。${rulesChecked.length > 0 ? `所有业务规则验证通过。` : ''}`,
      update: `更新操作已完成。修改了相关记录，数据已同步更新。`,
      process: `业务流程处理完成。已按照 ${agent.domain.toUpperCase()} 域的标准流程执行操作。`,
      analyze: `数据分析完成。生成了详细的统计报告和可视化图表。`
    };

    return templates[analyzed.intent as keyof typeof templates] || '任务执行完成。';
  }

  // Mock data generation helpers
  
  private generateSQLQuery(analyzed: AnalyzedCommand, tables: SchemaTable[]): string {
    const table = this.selectPrimaryTable(analyzed, tables);
    const conditions = analyzed.keywords.slice(0, 2).map(kw => `${kw} LIKE '%${kw}%'`).join(' AND ');
    return `SELECT * FROM ${table}${conditions ? ` WHERE ${conditions}` : ''} LIMIT 100`;
  }

  private generateFilters(analyzed: AnalyzedCommand): Record<string, any> {
    return {
      status: this.randomChoice(['ACTIVE', 'ALL']),
      dateRange: '最近30天',
      sortBy: 'created_date DESC'
    };
  }

  private generateMockInput(analyzed: AnalyzedCommand): Record<string, any> {
    return {
      name: `${analyzed.intent}_${Date.now()}`,
      description: analyzed.original,
      status: 'PENDING',
      created_by: 'system',
      created_date: new Date().toISOString()
    };
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private initializeBusinessRules(): void {
    // Initialize with domain-specific business rules
    const wmsRules: BusinessRule[] = [
      {
        id: 'wms_001',
        name: '库存安全阈值检查',
        description: '检查库存是否低于安全阈值',
        domain: 'wms',
        condition: 'inventory_quantity < safety_stock_level',
        action: '触发补货流程'
      },
      {
        id: 'wms_002', 
        name: '入库数量验证',
        description: '验证入库数量与预期数量是否一致',
        domain: 'wms',
        condition: 'received_quantity = expected_quantity',
        action: '继续入库流程'
      }
    ];

    this.rules.set('wms', wmsRules);
    // Add other domain rules...
  }

  // Additional helper methods for mock data generation
  private generateExecutionSteps(analyzed: AnalyzedCommand, toolCalls: ToolCall[]): ExecutionStep[] {
    const steps: ExecutionStep[] = [
      { step: 1, description: '解析用户指令', action: 'command_parsing', duration: 50 },
      { step: 2, description: '验证权限和参数', action: 'validation', duration: 30 }
    ];

    toolCalls.forEach((call, index) => {
      steps.push({
        step: steps.length + 1,
        description: `执行 ${call.name}`,
        action: call.name,
        duration: Math.floor(Math.random() * 200) + 50
      });
    });

    steps.push({
      step: steps.length + 1,
      description: '生成响应',
      action: 'response_generation',
      duration: 80
    });

    return steps;
  }

  private extractTablesFromToolCalls(toolCalls: ToolCall[]): string[] {
    const tables = new Set<string>();
    
    toolCalls.forEach(call => {
      if (call.parameters.tables) {
        call.parameters.tables.forEach((table: string) => tables.add(table));
      }
      if (call.parameters.table) {
        tables.add(call.parameters.table);
      }
    });
    
    return Array.from(tables);
  }

  private estimateTokenUsage(message: string, toolCalls: ToolCall[]): number {
    // Rough estimation: 1 token = 4 characters for mixed Chinese/English
    const messageTokens = Math.ceil(message.length / 4);
    const toolTokens = toolCalls.length * 50; // Average per tool call
    return messageTokens + toolTokens + Math.floor(Math.random() * 100);
  }

  private generateAnalyticsMetrics(analyzed: AnalyzedCommand): string[] {
    const metricSets = {
      wms: ['库存周转率', '入库效率', '出库准确率', '空间利用率'],
      fms: ['准时交付率', '运输成本', '路线优化度', '车辆利用率'], 
      oms: ['订单处理时间', '履约成功率', '客户满意度', '退货率'],
      bnp: ['账期天数', '应收账款周转率', '计费准确率', '收款效率'],
      yms: ['停留时间', '吞吐量', '预约准确率', '排队效率']
    };
    
    const domainMetrics = metricSets[analyzed.domain as keyof typeof metricSets] || metricSets.wms;
    return domainMetrics.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private generateAnalyticsResults(parameters: any): Record<string, number> {
    const results: Record<string, number> = {};
    
    if (parameters.metrics) {
      parameters.metrics.forEach((metric: string) => {
        results[metric] = Math.round((Math.random() * 100) * 100) / 100;
      });
    }
    
    return results;
  }

  private generateChartData(parameters: any): any {
    return {
      type: 'line',
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '性能指标',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
      }]
    };
  }

  private generateMockUpdates(analyzed: AnalyzedCommand): Record<string, any> {
    return {
      updated_date: new Date().toISOString(),
      updated_by: 'agent_system',
      status: this.randomChoice(['UPDATED', 'PROCESSED', 'COMPLETED']),
      notes: `由${analyzed.domain.toUpperCase()}智能体自动更新`
    };
  }

  private mapToBusinessProcess(analyzed: AnalyzedCommand): string {
    const processMap = {
      wms: this.randomChoice(['入库流程', '出库流程', '盘点流程', '补货流程']),
      fms: this.randomChoice(['运输计划', '派车流程', '路线优化', '计费流程']),
      oms: this.randomChoice(['订单处理', '履约流程', '客户服务', '退货处理']),
      bnp: this.randomChoice(['计费流程', '开票流程', '付款流程', '对账流程']),
      yms: this.randomChoice(['预约流程', '进门流程', '出门流程', '排队管理'])
    };
    
    return processMap[analyzed.domain as keyof typeof processMap] || '标准业务流程';
  }

  private generateProcessOutput(parameters: any): any {
    return {
      processName: parameters.process,
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 100,
      result: '流程执行成功',
      nextSteps: ['更新状态', '发送通知', '记录日志']
    };
  }

  private getValidationRules(domain: string): string[] {
    const ruleMap = {
      wms: ['库存数量必须为正数', 'SKU格式验证', '存储位置有效性'],
      fms: ['承运商信息完整性', '运费计算准确性', '路线可达性'],
      oms: ['客户信息有效性', '订单金额合理性', '商品可用性'],
      bnp: ['账户余额充足性', '付款方式有效性', '税率计算准确性'],
      yms: ['预约时间有效性', '车辆信息完整性', '停车位可用性']
    };
    
    return ruleMap[domain as keyof typeof ruleMap] || ['基础数据验证'];
  }

  private getAnalyticsGroupBy(analyzed: AnalyzedCommand): string {
    return this.randomChoice(['日期', '类别', '状态', '部门', '客户']);
  }
}

interface AnalyzedCommand {
  original: string;
  keywords: string[];
  intent: string;
  matchedCapabilities: string[];
  domain: string;
  complexity: 'low' | 'medium' | 'high';
}

// Export singleton instance
export const agentSimulator = new AgentSimulator();