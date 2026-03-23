/**
 * Workflow Simulator Service
 * Simulates multi-agent workflow execution for team testing
 */

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  domain: string;
  steps: WorkflowStep[];
  orchestratorId: string;
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  inputFrom?: string;
  outputTo?: string;
  rules: string[];
  estimatedDuration: number;
}

export interface WorkflowExecutionState {
  workflowId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  currentStepIndex: number;
  steps: StepExecutionState[];
  startTime: Date | null;
  endTime: Date | null;
  totalDuration: number;
}

export interface StepExecutionState {
  stepId: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  rulesChecked: RuleCheckResult[];
  startTime: Date | null;
  endTime: Date | null;
  logs: string[];
}

export interface RuleCheckResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  message: string;
}

export interface TeamExecutionEvent {
  id: string;
  type: 'workflow_started' | 'step_started' | 'step_completed' | 'step_failed' | 'workflow_completed' | 'workflow_failed' | 'handoff' | 'rule_check';
  timestamp: Date;
  data: Record<string, unknown>;
}

// Predefined workflow templates based on orchestrator definitions
export const workflowTemplates: WorkflowDefinition[] = [
  {
    id: 'wms-inbound',
    name: '入库流程',
    description: '标准入库流程：收货 → 月台签到 → 扫描收货 → 上架',
    domain: 'WMS',
    orchestratorId: 'wms-orchestrator',
    steps: [
      { id: 's1', agentId: 'wms-inbound-receipt-clerk', agentName: '收货员', action: '创建收货单', description: '录入收货信息，创建收货单据', rules: ['客户存在校验', '单据格式校验'], estimatedDuration: 30 },
      { id: 's2', agentId: 'wms-inbound-dock-coordinator', agentName: '月台协调员', action: '月台签到', description: '分配月台，记录车辆到达', inputFrom: 's1', rules: ['月台可用性', '时间窗口校验'], estimatedDuration: 15 },
      { id: 's3', agentId: 'wms-inbound-receiving-operator', agentName: '收货操作员', action: '扫描收货', description: '扫描货物条码，核对数量', inputFrom: 's2', outputTo: 's4', rules: ['数量匹配校验', 'SKU有效性'], estimatedDuration: 60 },
      { id: 's4', agentId: 'wms-inbound-putaway-operator', agentName: '上架操作员', action: '执行上架', description: '按系统建议库位上架', inputFrom: 's3', rules: ['库位容量校验', '存储条件匹配'], estimatedDuration: 45 },
    ]
  },
  {
    id: 'wms-outbound',
    name: '出库流程',
    description: '标准出库流程：订单处理 → 波次释放 → 拣货 → 打包 → 发运',
    domain: 'WMS',
    orchestratorId: 'wms-orchestrator',
    steps: [
      { id: 's1', agentId: 'wms-outbound-order-processor', agentName: '订单处理员', action: '订单处理', description: '接收订单，校验库存，创建出库任务', rules: ['库存充足校验', '订单有效性'], estimatedDuration: 20 },
      { id: 's2', agentId: 'wms-outbound-wave-planner', agentName: '波次计划员', action: '波次释放', description: '合并订单到波次，生成拣选任务', inputFrom: 's1', rules: ['波次容量限制', '优先级排序'], estimatedDuration: 15 },
      { id: 's3', agentId: 'wms-outbound-pick-operator', agentName: '拣货员', action: '执行拣货', description: '按路线拣货，扫描确认', inputFrom: 's2', outputTo: 's4', rules: ['FIFO/FEFO', '数量准确性'], estimatedDuration: 90 },
      { id: 's4', agentId: 'wms-outbound-pack-operator', agentName: '打包员', action: '执行打包', description: '包装货物，贴运单', inputFrom: 's3', outputTo: 's5', rules: ['包装规格', '重量校验'], estimatedDuration: 30 },
      { id: 's5', agentId: 'wms-outbound-shipping-clerk', agentName: '发运员', action: '发运确认', description: '装车发运，更新状态', inputFrom: 's4', rules: ['承运商分配', '运单生成'], estimatedDuration: 20 },
    ]
  },
  {
    id: 'wms-cycle-count',
    name: '盘点流程',
    description: '周期盘点：创建工单 → 盘点 → 差异审核 → 调整',
    domain: 'WMS',
    orchestratorId: 'wms-orchestrator',
    steps: [
      { id: 's1', agentId: 'wms-inventory-cycle-count-operator', agentName: '盘点员', action: '创建盘点工单', description: '选择盘点区域和SKU范围', rules: ['盘点周期校验'], estimatedDuration: 15 },
      { id: 's2', agentId: 'wms-inventory-cycle-count-operator', agentName: '盘点员', action: '执行盘点', description: '实物盘点并录入结果', inputFrom: 's1', outputTo: 's3', rules: ['盲盘规则'], estimatedDuration: 120 },
      { id: 's3', agentId: 'wms-inventory-adjustment-clerk', agentName: '库存调整员', action: '差异审核', description: '审核差异原因，决定调整', inputFrom: 's2', rules: ['差异阈值', '审批权限'], estimatedDuration: 30 },
    ]
  },
  {
    id: 'fms-dispatch',
    name: '运输调度流程',
    description: 'FMS调度流程：订单接收 → 路线规划 → 司机分配 → 执行运输',
    domain: 'FMS',
    orchestratorId: 'fms-orchestrator',
    steps: [
      { id: 's1', agentId: 'fms-order-order-clerk', agentName: '订单文员', action: '接收运输订单', description: '录入运输需求，确认客户信息', rules: ['客户信用校验'], estimatedDuration: 15 },
      { id: 's2', agentId: 'fms-dispatch-route-planner', agentName: '路线规划师', action: '规划路线', description: '计算最优路线，考虑时间窗口', inputFrom: 's1', outputTo: 's3', rules: ['距离优化', '时间窗口'], estimatedDuration: 20 },
      { id: 's3', agentId: 'fms-dispatch-dispatcher', agentName: '调度员', action: '分配司机', description: '根据可用性和技能匹配司机', inputFrom: 's2', outputTo: 's4', rules: ['驾驶时间限制', '资质匹配'], estimatedDuration: 10 },
      { id: 's4', agentId: 'fms-dispatch-driver-coordinator', agentName: '司机协调员', action: '执行运输', description: '跟踪运输状态，处理异常', inputFrom: 's3', rules: ['实时位置更新', '延误通知'], estimatedDuration: 240 },
    ]
  },
  {
    id: 'bnp-invoice',
    name: '开票结算流程',
    description: 'BNP开票：费用计算 → 生成发票 → 发送 → 收款',
    domain: 'BNP',
    orchestratorId: 'bnp-orchestrator',
    steps: [
      { id: 's1', agentId: 'bnp-billing-billing-calculator', agentName: '计费员', action: '费用计算', description: '根据合同费率计算仓储/运输费用', rules: ['费率表匹配', '最低收费'], estimatedDuration: 30 },
      { id: 's2', agentId: 'bnp-invoice-invoice-generator', agentName: '发票生成员', action: '生成发票', description: '汇总费用生成发票', inputFrom: 's1', outputTo: 's3', rules: ['发票格式', '税务计算'], estimatedDuration: 15 },
      { id: 's3', agentId: 'bnp-invoice-invoice-sender', agentName: '发票发送员', action: '发送发票', description: '通过邮件/EDI发送发票', inputFrom: 's2', outputTo: 's4', rules: ['发送确认', '重试机制'], estimatedDuration: 5 },
      { id: 's4', agentId: 'bnp-payment-payment-collector', agentName: '收款员', action: '收款跟踪', description: '跟踪付款状态，催收逾期', inputFrom: 's3', rules: ['账期校验', '逾期提醒'], estimatedDuration: 60 },
    ]
  }
];

/**
 * Simulate workflow execution step by step
 */
export function simulateWorkflowStep(
  workflow: WorkflowDefinition,
  stepIndex: number,
  context: Record<string, unknown> = {}
): StepExecutionState {
  const step = workflow.steps[stepIndex];
  if (!step) {
    throw new Error(`Step index ${stepIndex} out of range`);
  }

  // Generate mock execution result
  const success = Math.random() > 0.1; // 90% success rate
  const duration = step.estimatedDuration * (0.8 + Math.random() * 0.4); // ±20% variance

  return {
    stepId: step.id,
    agentId: step.agentId,
    status: success ? 'completed' : 'failed',
    input: context,
    output: success ? {
      message: `${step.agentName} 完成: ${step.action}`,
      processedItems: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date().toISOString()
    } : {},
    rulesChecked: step.rules.map(rule => ({
      ruleId: `rule-${rule.replace(/\s/g, '-')}`,
      ruleName: rule,
      passed: Math.random() > 0.05,
      message: `规则 "${rule}" ${Math.random() > 0.05 ? '通过' : '未通过'}`
    })),
    startTime: new Date(),
    endTime: new Date(Date.now() + duration * 1000),
    logs: [
      `[${new Date().toISOString()}] ${step.agentName} 开始执行: ${step.action}`,
      `[${new Date().toISOString()}] 检查规则: ${step.rules.join(', ')}`,
      `[${new Date().toISOString()}] ${success ? '执行成功' : '执行失败'}`,
    ]
  };
}

export function createInitialExecutionState(workflow: WorkflowDefinition): WorkflowExecutionState {
  return {
    workflowId: workflow.id,
    status: 'idle',
    currentStepIndex: 0,
    steps: workflow.steps.map(step => ({
      stepId: step.id,
      agentId: step.agentId,
      status: 'pending' as const,
      input: {},
      output: {},
      rulesChecked: [],
      startTime: null,
      endTime: null,
      logs: []
    })),
    startTime: null,
    endTime: null,
    totalDuration: 0
  };
}
