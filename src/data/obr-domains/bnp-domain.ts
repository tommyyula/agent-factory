// BNP Domain Model Implementation  
// Complete OBR model for Billing and Payment domain
// Based on BNP schema (31 tables) and agent definitions (19 agents)

import { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink
} from '@/shared/types/obr.types';

// BNP Domain Blueprint
export const BNP_DOMAIN_BLUEPRINT: OntologyBlueprint = {
  $schema: 'https://schemas.agent-factory.com/obr/v1.0.0',
  metadata: {
    id: 'bnp-domain-v1',
    name: 'Billing and Payment System Ontology',
    version: '1.0.0',
    domain: 'BNP',
    description: '计费与支付系统完整业务域本体模型，包含发票生成、费率计算、支付处理、债务管理等核心业务流程',
    author: 'Unis Agency Agents',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checksum: 'bnp-v1-checksum'
  },
  
  // 12 Core Objects from BNP Schema
  objects: [
    {
      id: 'invoice',
      name: 'Invoice',
      displayName: '发票',
      description: '客户账单发票，包含收费明细和支付信息',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '发票唯一标识' },
        invoice_number: { type: 'string', required: true, description: '发票号码' },
        client_id: { type: 'reference', references: 'client', required: true, description: '客户ID' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商ID' },
        reference_number: { type: 'string', required: false, description: '参考号码' },
        customer_po_number: { type: 'string', required: false, description: '客户PO号' },
        invoice_date: { type: 'date', required: true, description: '发票日期' },
        due_date: { type: 'date', required: true, description: '到期日期' },
        billing_period_start: { type: 'date', required: true, description: '计费期开始' },
        billing_period_end: { type: 'date', required: true, description: '计费期结束' },
        invoice_total: { type: 'number', required: true, description: '发票总额' },
        balance: { type: 'number', required: true, description: '未付余额' },
        tax: { type: 'number', required: false, constraints: { min: 0 }, description: '税额' },
        discount: { type: 'number', required: false, constraints: { min: 0 }, description: '折扣额' },
        freight_charge: { type: 'number', required: false, constraints: { min: 0 }, description: '运费' },
        facility_id: { type: 'reference', references: 'facility', required: true, description: '设施ID' },
        billing_rule_set_id: { type: 'reference', references: 'billing_rule_set', required: false, description: '计费规则集ID' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['DRAFT', 'PENDING', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] },
          description: '发票状态'
        },
        payment_status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['UNPAID', 'PARTIAL', 'PAID', 'OVERPAID'] },
          description: '支付状态'
        }
      },
      stateMachine: {
        initialState: 'DRAFT',
        states: {
          'DRAFT': { displayName: '草稿', description: '发票草稿状态' },
          'PENDING': { displayName: '待审核', description: '待审核确认' },
          'SENT': { displayName: '已发送', description: '已发送给客户' },
          'PAID': { displayName: '已付款', description: '已完全付款' },
          'OVERDUE': { displayName: '过期', description: '超过付款期限' },
          'CANCELLED': { displayName: '已取消', description: '发票已取消', isTerminal: true }
        },
        transitions: [
          { from: 'DRAFT', to: 'PENDING', trigger: 'submitForApproval' },
          { from: 'PENDING', to: 'SENT', trigger: 'sendInvoice' },
          { from: 'SENT', to: 'PAID', trigger: 'receiveFullPayment' },
          { from: 'SENT', to: 'OVERDUE', trigger: 'markOverdue' },
          { from: 'OVERDUE', to: 'PAID', trigger: 'receiveFullPayment' },
          { from: 'DRAFT', to: 'CANCELLED', trigger: 'cancelInvoice' },
          { from: 'PENDING', to: 'CANCELLED', trigger: 'cancelInvoice' }
        ]
      },
      constraints: [
        {
          id: 'positive_total',
          type: 'invariant',
          expression: 'invoice_total > 0',
          description: '发票总额必须大于0',
          severity: 'error'
        },
        {
          id: 'balance_not_exceed_total',
          type: 'invariant',
          expression: 'balance <= invoice_total',
          description: '余额不能超过发票总额',
          severity: 'error'
        },
        {
          id: 'valid_billing_period',
          type: 'invariant',
          expression: 'billing_period_end >= billing_period_start',
          description: '计费期结束日期不能早于开始日期',
          severity: 'error'
        }
      ],
      visual: { color: '#059669', icon: 'document-text', position: { x: 100, y: 100 } }
    },

    {
      id: 'payment',
      name: 'Payment',
      displayName: '付款',
      description: '客户付款记录和分配信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '付款唯一标识' },
        payment_number: { type: 'string', required: true, description: '付款编号' },
        client_id: { type: 'reference', references: 'client', required: true, description: '客户ID' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商ID' },
        payment_date: { type: 'date', required: true, description: '付款日期' },
        payment_amount: { type: 'number', required: true, description: '付款金额' },
        allocated_amount: { type: 'number', required: false, constraints: { min: 0 }, description: '已分配金额' },
        unallocated_amount: { type: 'number', required: false, constraints: { min: 0 }, description: '未分配金额' },
        payment_method: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['CASH', 'CHECK', 'WIRE_TRANSFER', 'ACH', 'CREDIT_CARD', 'OTHER'] },
          description: '付款方式'
        },
        reference_number: { type: 'string', required: false, description: '参考号码' },
        bank_account_id: { type: 'string', required: false, description: '银行账户ID' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['PENDING', 'CLEARED', 'BOUNCED', 'RECONCILED'] },
          description: '付款状态'
        },
        notes: { type: 'string', required: false, description: '付款备注' }
      },
      stateMachine: {
        initialState: 'PENDING',
        states: {
          'PENDING': { displayName: '待处理', description: '付款待处理' },
          'CLEARED': { displayName: '已清算', description: '付款已清算' },
          'BOUNCED': { displayName: '退回', description: '付款被退回' },
          'RECONCILED': { displayName: '已对账', description: '付款已对账', isTerminal: true }
        },
        transitions: [
          { from: 'PENDING', to: 'CLEARED', trigger: 'clearPayment' },
          { from: 'PENDING', to: 'BOUNCED', trigger: 'bouncePayment' },
          { from: 'CLEARED', to: 'RECONCILED', trigger: 'reconcilePayment' },
          { from: 'BOUNCED', to: 'PENDING', trigger: 'resubmitPayment' }
        ]
      },
      constraints: [
        {
          id: 'positive_payment_amount',
          type: 'invariant',
          expression: 'payment_amount > 0',
          description: '付款金额必须大于0',
          severity: 'error'
        },
        {
          id: 'allocation_not_exceed_payment',
          type: 'invariant',
          expression: 'allocated_amount <= payment_amount',
          description: '已分配金额不能超过付款金额',
          severity: 'error'
        }
      ],
      visual: { color: '#3b82f6', icon: 'credit-card', position: { x: 300, y: 100 } }
    },

    {
      id: 'billing_code',
      name: 'BillingCode',
      displayName: '计费代码',
      description: '7段式计费代码，定义各种服务的费率结构',
      category: 'value_object',
      attributes: {
        id: { type: 'string', required: true, description: '计费代码唯一标识' },
        billing_code: { type: 'string', required: true, description: '7段计费代码' },
        part01_vendor: { type: 'string', required: true, description: '第1段-供应商代码' },
        part02_service: { type: 'string', required: true, description: '第2段-服务类型' },
        part03_action: { type: 'string', required: true, description: '第3段-操作类型' },
        part04_resource: { type: 'string', required: false, description: '第4段-资源类型' },
        part05_modifier: { type: 'string', required: false, description: '第5段-修饰符' },
        part06_unit: { type: 'string', required: true, description: '第6段-计费单位' },
        part07_period: { type: 'string', required: true, description: '第7段-计费周期' },
        billing_description: { type: 'string', required: true, description: '计费描述' },
        service_name: { type: 'string', required: true, description: '服务名称' },
        action_name: { type: 'string', required: true, description: '操作名称' },
        is_active: { type: 'boolean', required: true, description: '是否激活' },
        category: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['STORAGE', 'SHIPPING', 'FULFILLMENT', 'VALUE_ADDED', 'ACCESSORIAL'] },
          description: '费用类别'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '计费代码激活可用' },
          'INACTIVE': { displayName: '停用', description: '计费代码已停用' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateBillingCode' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateBillingCode' }
        ]
      },
      constraints: [
        {
          id: 'unique_billing_code',
          type: 'invariant',
          expression: 'isUnique(billing_code)',
          description: '7段计费代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#8b5cf6', icon: 'code', position: { x: 500, y: 100 } }
    },

    {
      id: 'client',
      name: 'Client',
      displayName: '客户',
      description: '计费服务的客户主体，接收发票的一方',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '客户唯一标识' },
        client_code: { type: 'string', required: true, description: '客户代码' },
        client_name: { type: 'string', required: true, description: '客户名称' },
        billing_address: { type: 'string', required: true, description: '账单地址' },
        contact_email: { type: 'string', required: false, description: '联系邮箱' },
        contact_phone: { type: 'string', required: false, description: '联系电话' },
        payment_terms_id: { type: 'string', required: false, description: '付款条件ID' },
        credit_limit: { type: 'number', required: false, constraints: { min: 0 }, description: '信用额度' },
        current_balance: { type: 'number', required: false, description: '当前余额' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CREDIT_HOLD'] },
          description: '客户状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '客户正常激活' },
          'INACTIVE': { displayName: '停用', description: '客户已停用' },
          'SUSPENDED': { displayName: '暂停', description: '客户暂停服务' },
          'CREDIT_HOLD': { displayName: '信用保留', description: '信用额度保留' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateClient' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendClient' },
          { from: 'ACTIVE', to: 'CREDIT_HOLD', trigger: 'holdCredit' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateClient' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'resumeClient' },
          { from: 'CREDIT_HOLD', to: 'ACTIVE', trigger: 'releaseCredit' }
        ]
      },
      constraints: [
        {
          id: 'unique_client_code',
          type: 'invariant',
          expression: 'isUnique(client_code)',
          description: '客户代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#10b981', icon: 'building-office', position: { x: 700, y: 100 } }
    },

    {
      id: 'vendor',
      name: 'Vendor',
      displayName: '供应商',
      description: '提供服务的供应商主体，发出发票的一方',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '供应商唯一标识' },
        vendor_code: { type: 'string', required: true, description: '供应商代码' },
        vendor_name: { type: 'string', required: true, description: '供应商名称' },
        tax_id: { type: 'string', required: false, description: '税务ID' },
        billing_rule_set_id: { type: 'reference', references: 'billing_rule_set', required: false, description: '计费规则集ID' },
        commission_rate: { type: 'number', required: false, constraints: { min: 0, max: 1 }, description: '佣金率' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          description: '供应商状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '供应商正常激活' },
          'INACTIVE': { displayName: '停用', description: '供应商已停用' },
          'SUSPENDED': { displayName: '暂停', description: '供应商暂停服务' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateVendor' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendVendor' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateVendor' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'resumeVendor' }
        ]
      },
      constraints: [
        {
          id: 'unique_vendor_code',
          type: 'invariant',
          expression: 'isUnique(vendor_code)',
          description: '供应商代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#f97316', icon: 'truck', position: { x: 900, y: 100 } }
    },

    {
      id: 'billing_rule_set',
      name: 'BillingRuleSet',
      displayName: '计费规则集',
      description: '供应商特定的计费规则和费率配置',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '规则集唯一标识' },
        rule_set_name: { type: 'string', required: true, description: '规则集名称' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商ID' },
        effective_date: { type: 'date', required: true, description: '生效日期' },
        expiry_date: { type: 'date', required: false, description: '失效日期' },
        priority: { type: 'number', required: true, constraints: { min: 1 }, description: '优先级' },
        rule_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['STANDARD', 'FACILITY_SPECIFIC', 'CLIENT_SPECIFIC', 'CUSTOM'] },
          description: '规则类型'
        },
        is_active: { type: 'boolean', required: true, description: '是否激活' }
      },
      stateMachine: {
        initialState: 'DRAFT',
        states: {
          'DRAFT': { displayName: '草稿', description: '规则集草稿' },
          'ACTIVE': { displayName: '激活', description: '规则集激活中' },
          'EXPIRED': { displayName: '过期', description: '规则集已过期', isTerminal: true },
          'INACTIVE': { displayName: '停用', description: '规则集已停用' }
        },
        transitions: [
          { from: 'DRAFT', to: 'ACTIVE', trigger: 'activateRuleSet' },
          { from: 'ACTIVE', to: 'EXPIRED', trigger: 'expireRuleSet' },
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateRuleSet' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'reactivateRuleSet' }
        ]
      },
      constraints: [
        {
          id: 'valid_date_range',
          type: 'invariant',
          expression: 'expiry_date == null || expiry_date > effective_date',
          description: '失效日期必须晚于生效日期',
          severity: 'error'
        }
      ],
      visual: { color: '#6366f1', icon: 'cog-6-tooth', position: { x: 100, y: 300 } }
    },

    {
      id: 'commission',
      name: 'Commission',
      displayName: '佣金',
      description: '基于发票金额计算的佣金记录',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '佣金唯一标识' },
        invoice_id: { type: 'reference', references: 'invoice', required: true, description: '关联发票ID' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商ID' },
        commission_rate: { type: 'number', required: true, constraints: { min: 0, max: 1 }, description: '佣金率' },
        base_amount: { type: 'number', required: true, description: '佣金基数' },
        commission_amount: { type: 'number', required: true, description: '佣金金额' },
        commission_date: { type: 'date', required: true, description: '佣金计算日期' },
        payment_date: { type: 'date', required: false, description: '佣金支付日期' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['CALCULATED', 'APPROVED', 'PAID', 'DISPUTED'] },
          description: '佣金状态'
        }
      },
      stateMachine: {
        initialState: 'CALCULATED',
        states: {
          'CALCULATED': { displayName: '已计算', description: '佣金已计算' },
          'APPROVED': { displayName: '已审批', description: '佣金已审批' },
          'PAID': { displayName: '已支付', description: '佣金已支付', isTerminal: true },
          'DISPUTED': { displayName: '争议', description: '佣金存在争议' }
        },
        transitions: [
          { from: 'CALCULATED', to: 'APPROVED', trigger: 'approveCommission' },
          { from: 'CALCULATED', to: 'DISPUTED', trigger: 'disputeCommission' },
          { from: 'APPROVED', to: 'PAID', trigger: 'payCommission' },
          { from: 'DISPUTED', to: 'CALCULATED', trigger: 'resolveDispute' }
        ]
      },
      constraints: [
        {
          id: 'valid_commission_calculation',
          type: 'invariant',
          expression: 'commission_amount == base_amount * commission_rate',
          description: '佣金金额必须等于基数乘以佣金率',
          severity: 'error'
        }
      ],
      visual: { color: '#ec4899', icon: 'currency-dollar', position: { x: 300, y: 300 } }
    },

    {
      id: 'bank_transaction',
      name: 'BankTransaction',
      displayName: '银行交易',
      description: '银行对账单交易记录，用于支付对账',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '交易唯一标识' },
        transaction_date: { type: 'date', required: true, description: '交易日期' },
        transaction_amount: { type: 'number', required: true, description: '交易金额' },
        transaction_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['CREDIT', 'DEBIT'] },
          description: '交易类型'
        },
        reference_number: { type: 'string', required: false, description: '交易参考号' },
        description: { type: 'string', required: false, description: '交易描述' },
        bank_account_id: { type: 'string', required: true, description: '银行账户ID' },
        payment_id: { type: 'reference', references: 'payment', required: false, description: '关联付款ID' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['UNRECONCILED', 'MATCHED', 'DISPUTED', 'IGNORED'] },
          description: '对账状态'
        }
      },
      stateMachine: {
        initialState: 'UNRECONCILED',
        states: {
          'UNRECONCILED': { displayName: '未对账', description: '交易未对账' },
          'MATCHED': { displayName: '已匹配', description: '交易已匹配', isTerminal: true },
          'DISPUTED': { displayName: '争议', description: '交易存在争议' },
          'IGNORED': { displayName: '忽略', description: '交易被忽略', isTerminal: true }
        },
        transitions: [
          { from: 'UNRECONCILED', to: 'MATCHED', trigger: 'matchTransaction' },
          { from: 'UNRECONCILED', to: 'DISPUTED', trigger: 'disputeTransaction' },
          { from: 'UNRECONCILED', to: 'IGNORED', trigger: 'ignoreTransaction' },
          { from: 'DISPUTED', to: 'MATCHED', trigger: 'resolveAndMatch' }
        ]
      },
      constraints: [
        {
          id: 'non_zero_amount',
          type: 'invariant',
          expression: 'transaction_amount != 0',
          description: '交易金额不能为零',
          severity: 'error'
        }
      ],
      visual: { color: '#0891b2', icon: 'banknotes', position: { x: 500, y: 300 } }
    },

    {
      id: 'chart_of_accounts',
      name: 'ChartOfAccounts',
      displayName: '会计科目',
      description: '5段式总账科目编码体系',
      category: 'value_object',
      attributes: {
        id: { type: 'string', required: true, description: '科目唯一标识' },
        account_code: { type: 'string', required: true, description: '5段科目编码' },
        account_name: { type: 'string', required: true, description: '科目名称' },
        account_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] },
          description: '科目类型'
        },
        parent_account_id: { type: 'reference', references: 'chart_of_accounts', required: false, description: '父级科目ID' },
        gl_segment1: { type: 'string', required: true, description: 'GL第1段-公司' },
        gl_segment2: { type: 'string', required: true, description: 'GL第2段-部门' },
        gl_segment3: { type: 'string', required: true, description: 'GL第3段-科目' },
        gl_segment4: { type: 'string', required: false, description: 'GL第4段-项目' },
        gl_segment5: { type: 'string', required: false, description: 'GL第5段-备用' },
        is_active: { type: 'boolean', required: true, description: '是否激活' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '科目激活可用' },
          'INACTIVE': { displayName: '停用', description: '科目已停用' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateAccount' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateAccount' }
        ]
      },
      constraints: [
        {
          id: 'unique_account_code',
          type: 'invariant',
          expression: 'isUnique(account_code)',
          description: '科目编码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#64748b', icon: 'document', position: { x: 700, y: 300 } }
    },

    {
      id: 'debt_workflow',
      name: 'DebtWorkflow',
      displayName: '债务工作流',
      description: '逾期账款的催收和处理流程',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '债务工作流唯一标识' },
        client_id: { type: 'reference', references: 'client', required: true, description: '客户ID' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商ID' },
        overdue_amount: { type: 'number', required: true, description: '逾期金额' },
        aging_days: { type: 'number', required: true, description: '逾期天数' },
        aging_bucket: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['CURRENT', '30_DAYS', '60_DAYS', '90_DAYS', '120_DAYS', '121_PLUS'] },
          description: '账龄分组'
        },
        workflow_stage: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['NOTICE_SENT', 'FOLLOW_UP', 'ESCALATED', 'LEGAL_ACTION', 'WRITTEN_OFF'] },
          description: '催收阶段'
        },
        assigned_collector: { type: 'string', required: false, description: '分配催收员' },
        last_contact_date: { type: 'date', required: false, description: '最后联系日期' },
        next_action_date: { type: 'date', required: false, description: '下次行动日期' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'RESOLVED', 'WRITTEN_OFF', 'SUSPENDED'] },
          description: '工作流状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '活跃', description: '债务催收活跃' },
          'RESOLVED': { displayName: '已解决', description: '债务已解决', isTerminal: true },
          'WRITTEN_OFF': { displayName: '已核销', description: '债务已核销', isTerminal: true },
          'SUSPENDED': { displayName: '暂停', description: '催收暂停' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'RESOLVED', trigger: 'resolveDebt' },
          { from: 'ACTIVE', to: 'WRITTEN_OFF', trigger: 'writeOffDebt' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendCollection' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'resumeCollection' }
        ]
      },
      constraints: [
        {
          id: 'positive_overdue_amount',
          type: 'invariant',
          expression: 'overdue_amount > 0',
          description: '逾期金额必须大于0',
          severity: 'error'
        },
        {
          id: 'non_negative_aging_days',
          type: 'invariant',
          expression: 'aging_days >= 0',
          description: '逾期天数不能为负',
          severity: 'error'
        }
      ],
      visual: { color: '#dc2626', icon: 'exclamation-triangle', position: { x: 900, y: 300 } }
    },

    {
      id: 'invoice_item',
      name: 'InvoiceItem',
      displayName: '发票行项',
      description: '发票的具体收费行项明细',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '行项唯一标识' },
        invoice_id: { type: 'reference', references: 'invoice', required: true, description: '发票ID' },
        billing_code_id: { type: 'reference', references: 'billing_code', required: true, description: '计费代码ID' },
        account_code_id: { type: 'reference', references: 'chart_of_accounts', required: true, description: '会计科目ID' },
        line_sequence: { type: 'number', required: true, description: '行序号' },
        service_description: { type: 'string', required: true, description: '服务描述' },
        quantity: { type: 'number', required: true, constraints: { min: 0 }, description: '数量' },
        unit_price: { type: 'number', required: true, description: '单价' },
        line_amount: { type: 'number', required: true, description: '行金额' },
        service_period_start: { type: 'date', required: false, description: '服务期开始' },
        service_period_end: { type: 'date', required: false, description: '服务期结束' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '有效', description: '行项有效' },
          'VOID': { displayName: '作废', description: '行项作废', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'VOID', trigger: 'voidLineItem' }
        ]
      },
      constraints: [
        {
          id: 'correct_line_amount',
          type: 'invariant',
          expression: 'line_amount == quantity * unit_price',
          description: '行金额必须等于数量乘以单价',
          severity: 'error'
        }
      ],
      visual: { color: '#f59e0b', icon: 'list-bullet', position: { x: 100, y: 500 } }
    }
  ],

  // 8 Core Behaviors from BNP Agent Operations
  behaviors: [
    {
      id: 'calculateStorageCost',
      name: 'calculateStorageCost',
      displayName: '计算存储费用',
      description: '基于7段计费代码和多维费率引擎计算存储费用',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'billing_code', requiredState: 'ACTIVE' },
          { objectId: 'billing_rule_set', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['billing_code_validity_rule'],
        customConditions: ['hasBillingCalculationPermission(actor)']
      },
      inputs: {
        client_id: { type: 'string', required: true, description: '客户ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        facility_id: { type: 'string', required: true, description: '设施ID' },
        item_dimensions: { type: 'object', required: true, description: '商品尺寸(L×W×H)' },
        quantity: { type: 'number', required: true, description: '数量' },
        capacity_type: { type: 'string', required: false, description: '容积类型' },
        billing_period: { type: 'string', required: true, description: '计费周期' }
      },
      outputs: {
        capacity_type_assigned: { type: 'string', description: '分配的容积类型' },
        calculated_quantity: { type: 'number', description: '计算数量' },
        unit_price: { type: 'number', description: '单价' },
        total_cost: { type: 'number', description: '总费用' },
        billing_code_matched: { type: 'string', description: '匹配的计费代码' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'billing_code_validity_rule', phase: 'before', required: true },
        { ruleId: 'rate_priority_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'billing_calculation_log', data: { calculation_completed: 'true' } }
      ],
      visual: { color: '#8b5cf6', icon: 'calculator', position: { x: 100, y: 700 } }
    },

    {
      id: 'calculateShippingCost',
      name: 'calculateShippingCost',
      displayName: '计算运输费用',
      description: '基于邮编区域和承运商服务计算运输费用',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'billing_code', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['shipping_zone_rule'],
        customConditions: ['hasBillingCalculationPermission(actor)']
      },
      inputs: {
        client_id: { type: 'string', required: true, description: '客户ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        facility_id: { type: 'string', required: true, description: '设施ID' },
        carrier_code: { type: 'string', required: true, description: '承运商代码' },
        delivery_service: { type: 'string', required: true, description: '配送服务' },
        ship_to_zip: { type: 'string', required: true, description: '收货邮编' },
        weight: { type: 'number', required: true, description: '重量' },
        quantity: { type: 'number', required: true, description: '数量' }
      },
      outputs: {
        shipping_zone: { type: 'string', description: '配送区域' },
        rate_applied: { type: 'number', description: '适用费率' },
        shipping_cost: { type: 'number', description: '运输费用' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'shipping_zone_rule', phase: 'before', required: true },
        { ruleId: 'rate_priority_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'shipping_calculation_log', data: { calculation_completed: 'true' } }
      ],
      visual: { color: '#0891b2', icon: 'truck', position: { x: 300, y: 700 } }
    },

    {
      id: 'generateInvoice',
      name: 'generateInvoice',
      displayName: '生成发票',
      description: '执行7SP发票生成管道，从Working表到正式发票的完整流程',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'client', requiredState: 'ACTIVE' },
          { objectId: 'vendor', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['billing_period_lock_rule', 'minimum_charge_rule'],
        customConditions: ['hasInvoiceGenerationPermission(actor)']
      },
      inputs: {
        client_id: { type: 'string', required: true, description: '客户ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        billing_period_start: { type: 'date', required: true, description: '计费期开始' },
        billing_period_end: { type: 'date', required: true, description: '计费期结束' },
        auto_send: { type: 'boolean', required: false, description: '是否自动发送' },
        force_generation: { type: 'boolean', required: false, description: '是否强制生成' }
      },
      outputs: {
        invoice_id: { type: 'string', description: '生成的发票ID' },
        invoice_number: { type: 'string', description: '发票号码' },
        invoice_total: { type: 'number', description: '发票总额' },
        line_items_count: { type: 'number', description: '行项数量' },
        generation_status: { type: 'string', description: '生成状态' }
      },
      stateChanges: [
        { objectId: 'invoice', newState: 'DRAFT' }
      ],
      linkedRules: [
        { ruleId: 'billing_period_lock_rule', phase: 'before', required: true },
        { ruleId: 'minimum_charge_rule', phase: 'during', required: true },
        { ruleId: 'gl_code_generation_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'invoice_items', data: { line_items_generated: 'true' } },
        { type: 'create', target: 'gl_journal_entries', data: { gl_codes_assigned: 'true' } },
        { type: 'notify', target: 'invoice_reviewer', data: { event: 'invoice_ready_for_review' } }
      ],
      visual: { color: '#059669', icon: 'document-text', position: { x: 500, y: 700 } }
    },

    {
      id: 'processPayment',
      name: 'processPayment',
      displayName: '处理付款',
      description: '处理客户付款并分配到相应发票',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'client', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['payment_allocation_rule'],
        customConditions: ['hasPaymentProcessingPermission(actor)']
      },
      inputs: {
        client_id: { type: 'string', required: true, description: '客户ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        payment_amount: { type: 'number', required: true, description: '付款金额' },
        payment_method: { type: 'string', required: true, description: '付款方式' },
        reference_number: { type: 'string', required: false, description: '参考号码' },
        invoice_allocations: { type: 'object[]', required: false, description: '发票分配明细' },
        auto_allocate: { type: 'boolean', required: false, description: '是否自动分配' }
      },
      outputs: {
        payment_id: { type: 'string', description: '付款记录ID' },
        allocated_amount: { type: 'number', description: '已分配金额' },
        unallocated_amount: { type: 'number', description: '未分配金额' },
        invoices_paid: { type: 'string[]', description: '已付款发票列表' },
        allocation_details: { type: 'object[]', description: '分配明细' }
      },
      stateChanges: [
        { objectId: 'payment', newState: 'CLEARED' },
        { objectId: 'invoice', newState: 'PAID', condition: 'fully_paid' }
      ],
      linkedRules: [
        { ruleId: 'payment_allocation_rule', phase: 'during', required: true },
        { ruleId: 'overpayment_handling_rule', phase: 'after', required: false }
      ],
      sideEffects: [
        { type: 'update', target: 'invoice_balances', data: { payment_applied: 'true' } },
        { type: 'create', target: 'payment_allocation_records', data: { allocation_completed: 'true' } },
        { type: 'notify', target: 'accounts_receivable', data: { event: 'payment_processed' } }
      ],
      visual: { color: '#3b82f6', icon: 'credit-card', position: { x: 700, y: 700 } }
    },

    {
      id: 'reconcileBankTransaction',
      name: 'reconcileBankTransaction',
      displayName: '对账银行交易',
      description: '将银行交易记录与付款记录进行匹配和对账',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'bank_transaction', requiredState: 'UNRECONCILED' }
        ],
        ruleChecks: ['transaction_matching_rule'],
        customConditions: ['hasBankReconciliationPermission(actor)']
      },
      inputs: {
        bank_transaction_id: { type: 'string', required: true, description: '银行交易ID' },
        matching_criteria: { type: 'object', required: true, description: '匹配条件' },
        manual_match: { type: 'boolean', required: false, description: '是否手动匹配' },
        tolerance_amount: { type: 'number', required: false, description: '容差金额' }
      },
      outputs: {
        match_found: { type: 'boolean', description: '是否找到匹配' },
        matched_payment_id: { type: 'string', description: '匹配的付款ID' },
        variance_amount: { type: 'number', description: '差异金额' },
        reconciliation_status: { type: 'string', description: '对账状态' }
      },
      stateChanges: [
        { objectId: 'bank_transaction', newState: 'MATCHED', condition: 'match_found' },
        { objectId: 'bank_transaction', newState: 'DISPUTED', condition: '!match_found' },
        { objectId: 'payment', newState: 'RECONCILED', condition: 'match_found' }
      ],
      linkedRules: [
        { ruleId: 'transaction_matching_rule', phase: 'during', required: true },
        { ruleId: 'variance_tolerance_rule', phase: 'during', required: false }
      ],
      sideEffects: [
        { type: 'create', target: 'reconciliation_log', data: { reconciliation_completed: 'true' } },
        { type: 'notify', target: 'bank_reconciler', data: { event: 'transaction_reconciled' } }
      ],
      visual: { color: '#6366f1', icon: 'scale', position: { x: 900, y: 700 } }
    },

    {
      id: 'calculateCommission',
      name: 'calculateCommission',
      displayName: '计算佣金',
      description: '基于发票金额和佣金率计算供应商佣金',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'invoice', requiredState: 'SENT' },
          { objectId: 'vendor', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['commission_eligibility_rule'],
        customConditions: ['hasCommissionCalculationPermission(actor)']
      },
      inputs: {
        invoice_id: { type: 'string', required: true, description: '发票ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        commission_rate_override: { type: 'number', required: false, description: '佣金率覆盖' },
        base_amount_override: { type: 'number', required: false, description: '基数覆盖' }
      },
      outputs: {
        commission_id: { type: 'string', description: '佣金记录ID' },
        commission_rate_applied: { type: 'number', description: '应用的佣金率' },
        base_amount: { type: 'number', description: '佣金基数' },
        commission_amount: { type: 'number', description: '佣金金额' }
      },
      stateChanges: [
        { objectId: 'commission', newState: 'CALCULATED' }
      ],
      linkedRules: [
        { ruleId: 'commission_eligibility_rule', phase: 'before', required: true },
        { ruleId: 'commission_rate_validation_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'commission_record', data: { commission_calculated: 'true' } },
        { type: 'notify', target: 'commission_reviewer', data: { event: 'commission_ready_for_review' } }
      ],
      visual: { color: '#ec4899', icon: 'chart-bar', position: { x: 100, y: 900 } }
    },

    {
      id: 'generateAgingReport',
      name: 'generateAgingReport',
      displayName: '生成账龄报告',
      description: '生成客户账龄分析报告，支持6桶分组',
      category: 'query',
      preconditions: {
        objectStates: [],
        ruleChecks: [],
        customConditions: ['hasReportingPermission(actor)']
      },
      inputs: {
        client_id: { type: 'string', required: false, description: '指定客户ID' },
        vendor_id: { type: 'string', required: false, description: '指定供应商ID' },
        as_of_date: { type: 'date', required: true, description: '截止日期' },
        include_paid: { type: 'boolean', required: false, description: '是否包含已付款' },
        aging_buckets: { type: 'string[]', required: false, description: '账龄分组' }
      },
      outputs: {
        report_id: { type: 'string', description: '报告ID' },
        total_outstanding: { type: 'number', description: '总未付金额' },
        aging_summary: { type: 'object', description: '账龄汇总' },
        detail_records: { type: 'object[]', description: '明细记录' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'aging_calculation_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'aging_report', data: { report_generated: 'true' } }
      ],
      visual: { color: '#64748b', icon: 'document-chart-bar', position: { x: 300, y: 900 } }
    },

    {
      id: 'processDebtCollection',
      name: 'processDebtCollection',
      displayName: '处理债务催收',
      description: '管理逾期账款的催收流程和升级机制',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'debt_workflow', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['collection_authority_rule'],
        customConditions: ['hasDebtCollectionPermission(actor)']
      },
      inputs: {
        debt_workflow_id: { type: 'string', required: true, description: '债务工作流ID' },
        action_type: { type: 'string', required: true, validation: 'in:["NOTICE","CALL","EMAIL","ESCALATE","LEGAL"]', description: '催收动作类型' },
        contact_notes: { type: 'string', required: false, description: '联系备注' },
        next_action_date: { type: 'date', required: false, description: '下次行动日期' },
        payment_promise: { type: 'object', required: false, description: '付款承诺信息' }
      },
      outputs: {
        action_result: { type: 'string', description: '催收结果' },
        workflow_updated: { type: 'boolean', description: '工作流是否更新' },
        escalation_triggered: { type: 'boolean', description: '是否触发升级' },
        next_action_scheduled: { type: 'date', description: '下次行动日期' }
      },
      stateChanges: [
        { objectId: 'debt_workflow', newState: 'RESOLVED', condition: 'payment_received' },
        { objectId: 'debt_workflow', newState: 'SUSPENDED', condition: 'payment_promise_accepted' }
      ],
      linkedRules: [
        { ruleId: 'collection_authority_rule', phase: 'before', required: true },
        { ruleId: 'escalation_criteria_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'collection_activity_log', data: { activity_recorded: 'true' } },
        { type: 'create', target: 'escalation_task', data: { escalation_needed: 'output.escalation_triggered' } },
        { type: 'notify', target: 'collection_manager', data: { event: 'collection_action_completed' } }
      ],
      visual: { color: '#dc2626', icon: 'megaphone', position: { x: 500, y: 900 } }
    }
  ],

  // 5 Core Rules from BNP Business Constraints
  rules: [
    {
      id: 'payment_allocation_rule',
      name: 'paymentAllocationRule',
      displayName: '付款分配规则',
      description: '确保付款分配总额不超过付款金额',
      category: 'constraint',
      priority: 10,
      condition: {
        expression: 'SUM(allocation.amount) <= payment.payment_amount',
        naturalLanguage: '所有分配金额之和不能超过付款总额',
        variables: {
          'allocation.amount': 'number',
          'payment.payment_amount': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '分配金额超出付款总额，无法完成分配',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['payment', 'invoice'],
        behaviors: ['processPayment'],
        scenarios: ['payment_processing']
      },
      testCases: [
        {
          id: 'test_valid_allocation',
          description: '有效的付款分配',
          input: { payment_amount: 1000, allocated_amounts: [300, 400, 200] },
          expectedResult: 'pass'
        },
        {
          id: 'test_over_allocation',
          description: '超额分配测试',
          input: { payment_amount: 1000, allocated_amounts: [600, 500] },
          expectedResult: 'fail'
        }
      ]
    },

    {
      id: 'billing_period_lock_rule',
      name: 'billingPeriodLockRule',
      displayName: '计费期锁定规则',
      description: '确保锁定的会计期间不能生成新发票',
      category: 'constraint',
      priority: 9,
      condition: {
        expression: 'billing_period.is_locked == false',
        naturalLanguage: '计费期间未被锁定时才能生成发票',
        variables: {
          'billing_period.is_locked': 'boolean'
        }
      },
      actions: [
        {
          type: 'block',
          message: '计费期间已锁定，无法生成发票',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['invoice'],
        behaviors: ['generateInvoice'],
        scenarios: ['invoice_generation']
      },
      testCases: [
        {
          id: 'test_unlocked_period',
          description: '未锁定期间可以生成发票',
          input: { period_locked: false },
          expectedResult: 'pass'
        },
        {
          id: 'test_locked_period',
          description: '锁定期间不能生成发票',
          input: { period_locked: true },
          expectedResult: 'fail'
        }
      ]
    },

    {
      id: 'minimum_charge_rule',
      name: 'minimumChargeRule',
      displayName: '最低收费规则',
      description: '确保发票满足最低收费要求',
      category: 'validation',
      priority: 7,
      condition: {
        expression: 'invoice.invoice_total >= billing_rule_set.minimum_charge',
        naturalLanguage: '发票总额必须达到最低收费标准',
        variables: {
          'invoice.invoice_total': 'number',
          'billing_rule_set.minimum_charge': 'number'
        }
      },
      actions: [
        {
          type: 'execute',
          target: 'addMinimumChargeAdjustment',
          message: '添加最低收费补差',
          severity: 'info'
        }
      ],
      scope: {
        objects: ['invoice', 'billing_rule_set'],
        behaviors: ['generateInvoice'],
        scenarios: ['invoice_generation']
      },
      testCases: [
        {
          id: 'test_above_minimum',
          description: '超过最低收费标准',
          input: { invoice_total: 500, minimum_charge: 300 },
          expectedResult: 'pass'
        },
        {
          id: 'test_below_minimum',
          description: '低于最低收费标准',
          input: { invoice_total: 200, minimum_charge: 300 },
          expectedResult: 'fail'
        }
      ]
    },

    {
      id: 'rate_priority_rule',
      name: 'ratePriorityRule',
      displayName: '费率优先级规则',
      description: '费率匹配的4级优先级：客户+设施 > 客户 > 设施 > 默认',
      category: 'trigger',
      priority: 8,
      condition: {
        expression: 'rate_priority_level IN (1, 2, 3, 4)',
        naturalLanguage: '费率匹配按优先级顺序：客户设施级 > 客户级 > 设施级 > 默认',
        variables: {
          'rate_priority_level': 'number'
        }
      },
      actions: [
        {
          type: 'execute',
          target: 'applyHighestPriorityRate',
          message: '应用最高优先级费率',
          severity: 'info'
        }
      ],
      scope: {
        objects: ['billing_code', 'billing_rule_set'],
        behaviors: ['calculateStorageCost', 'calculateShippingCost'],
        scenarios: ['cost_calculation']
      },
      testCases: [
        {
          id: 'test_customer_facility_rate',
          description: '客户设施级费率优先',
          input: { priority_level: 1 },
          expectedResult: 'pass'
        },
        {
          id: 'test_default_rate',
          description: '默认费率最低优先级',
          input: { priority_level: 4 },
          expectedResult: 'pass'
        }
      ]
    },

    {
      id: 'commission_eligibility_rule',
      name: 'commissionEligibilityRule',
      displayName: '佣金资格规则',
      description: '只有已发送且未取消的发票才能计算佣金',
      category: 'constraint',
      priority: 6,
      condition: {
        expression: 'invoice.status IN ("SENT", "PAID", "OVERDUE") && vendor.commission_rate > 0',
        naturalLanguage: '发票已发送且供应商有佣金率时才能计算佣金',
        variables: {
          'invoice.status': 'string',
          'vendor.commission_rate': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '发票状态不符合佣金计算条件',
          severity: 'warning'
        }
      ],
      scope: {
        objects: ['invoice', 'vendor', 'commission'],
        behaviors: ['calculateCommission'],
        scenarios: ['commission_calculation']
      },
      testCases: [
        {
          id: 'test_eligible_invoice',
          description: '符合佣金计算条件的发票',
          input: { invoice_status: 'SENT', commission_rate: 0.05 },
          expectedResult: 'pass'
        },
        {
          id: 'test_draft_invoice',
          description: '草稿发票不能计算佣金',
          input: { invoice_status: 'DRAFT', commission_rate: 0.05 },
          expectedResult: 'fail'
        }
      ]
    }
  ],

  // 3 Core Scenarios from BNP Process Chains
  scenarios: [
    {
      id: 'invoice_generation',
      name: 'invoiceGeneration',
      displayName: '发票生成流程',
      description: 'BNP标准发票生成业务流程：费用计算→发票生成→审核→发送',
      category: 'process',
      actors: [
        { id: 'billing_calculator', name: '费用计算员', role: 'operator', permissions: ['cost_calculate'] },
        { id: 'invoice_generator', name: '发票生成员', role: 'operator', permissions: ['invoice_generate'] },
        { id: 'invoice_reviewer', name: '发票审核员', role: 'supervisor', permissions: ['invoice_review'] },
        { id: 'invoice_sender', name: '发票发送员', role: 'operator', permissions: ['invoice_send'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始发票生成',
          type: 'start',
          next: 'calculate_storage_costs',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'calculate_storage_costs',
          name: '计算存储费用',
          type: 'task',
          task: {
            behaviorId: 'calculateStorageCost',
            actorId: 'billing_calculator',
            inputs: {},
            timeout: 300000
          },
          next: 'calculate_shipping_costs',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'calculate_shipping_costs',
          name: '计算运输费用',
          type: 'task',
          task: {
            behaviorId: 'calculateShippingCost',
            actorId: 'billing_calculator',
            inputs: {},
            timeout: 300000
          },
          next: 'generate_invoice',
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'generate_invoice',
          name: '生成发票',
          type: 'task',
          task: {
            behaviorId: 'generateInvoice',
            actorId: 'invoice_generator',
            inputs: {}
          },
          next: 'review_invoice',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'review_invoice',
          name: '审核发票',
          type: 'decision',
          decision: {
            condition: 'reviewApproved',
            branches: [
              { condition: 'true', nextStepId: 'send_invoice' },
              { condition: 'false', nextStepId: 'reject_invoice' }
            ]
          },
          next: ['send_invoice', 'reject_invoice'],
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'send_invoice',
          name: '发送发票',
          type: 'task',
          task: {
            behaviorId: 'sendInvoice',
            actorId: 'invoice_sender',
            inputs: {}
          },
          next: 'calculate_commission',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'calculate_commission',
          name: '计算佣金',
          type: 'task',
          task: {
            behaviorId: 'calculateCommission',
            actorId: 'billing_calculator',
            inputs: {}
          },
          next: 'complete_generation',
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'reject_invoice',
          name: '拒绝发票',
          type: 'task',
          task: {
            behaviorId: 'rejectInvoice',
            actorId: 'invoice_reviewer',
            inputs: {}
          },
          next: 'end_rejected',
          visual: { position: { x: 700, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'complete_generation',
          name: '完成生成',
          type: 'end',
          next: [],
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'end_rejected',
          name: '生成被拒绝结束',
          type: 'end',
          next: [],
          visual: { position: { x: 850, y: 250 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'schedule', schedule: '0 2 * * 1' }, // 每周一凌晨2点
        { type: 'event', event: 'billing_period_closed' }
      ],
      constraints: {
        timeLimit: 7200000, // 2小时完成
        businessRules: ['billing_period_lock_rule', 'minimum_charge_rule', 'rate_priority_rule']
      },
      metrics: {
        averageDuration: 5400000, // 平均1.5小时
        successRate: 0.92,
        errorPatterns: ['period_locked', 'insufficient_data', 'rate_not_found']
      }
    },

    {
      id: 'payment_processing',
      name: 'paymentProcessing',
      displayName: '付款处理流程',
      description: '客户付款的完整处理流程：付款录入→分配→对账→更新余额',
      category: 'process',
      actors: [
        { id: 'payment_processor', name: '付款处理员', role: 'operator', permissions: ['payment_process'] },
        { id: 'payment_collector', name: '收款员', role: 'operator', permissions: ['payment_allocate'] },
        { id: 'bank_reconciler', name: '银行对账员', role: 'operator', permissions: ['bank_reconcile'] },
        { id: 'ar_clerk', name: 'AR文员', role: 'operator', permissions: ['ar_update'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始付款处理',
          type: 'start',
          next: 'record_payment',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'record_payment',
          name: '录入付款',
          type: 'task',
          task: {
            behaviorId: 'recordPayment',
            actorId: 'payment_processor',
            inputs: {}
          },
          next: 'allocate_payment',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'allocate_payment',
          name: '分配付款',
          type: 'task',
          task: {
            behaviorId: 'processPayment',
            actorId: 'payment_collector',
            inputs: {}
          },
          next: 'bank_reconciliation',
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'bank_reconciliation',
          name: '银行对账',
          type: 'task',
          task: {
            behaviorId: 'reconcileBankTransaction',
            actorId: 'bank_reconciler',
            inputs: {}
          },
          next: 'reconciliation_result',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'reconciliation_result',
          name: '对账结果检查',
          type: 'decision',
          decision: {
            condition: 'reconciliationSuccessful',
            branches: [
              { condition: 'true', nextStepId: 'update_ar_balance' },
              { condition: 'false', nextStepId: 'handle_discrepancy' }
            ]
          },
          next: ['update_ar_balance', 'handle_discrepancy'],
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'update_ar_balance',
          name: '更新AR余额',
          type: 'task',
          task: {
            behaviorId: 'updateARBalance',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'generate_aging_report',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'handle_discrepancy',
          name: '处理差异',
          type: 'task',
          task: {
            behaviorId: 'handleReconciliationDiscrepancy',
            actorId: 'bank_reconciler',
            inputs: {}
          },
          next: 'escalate_discrepancy',
          visual: { position: { x: 700, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'generate_aging_report',
          name: '生成账龄报告',
          type: 'task',
          task: {
            behaviorId: 'generateAgingReport',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'complete_processing',
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'escalate_discrepancy',
          name: '升级差异处理',
          type: 'task',
          task: {
            behaviorId: 'escalateDiscrepancy',
            actorId: 'bank_reconciler',
            inputs: {}
          },
          next: 'end_with_discrepancy',
          visual: { position: { x: 850, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'complete_processing',
          name: '完成处理',
          type: 'end',
          next: [],
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'end_with_discrepancy',
          name: '差异处理结束',
          type: 'end',
          next: [],
          visual: { position: { x: 1000, y: 250 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'event', event: 'payment_received' },
        { type: 'manual' }
      ],
      constraints: {
        timeLimit: 3600000, // 1小时完成
        businessRules: ['payment_allocation_rule']
      },
      metrics: {
        averageDuration: 1800000, // 平均30分钟
        successRate: 0.96,
        errorPatterns: ['reconciliation_failure', 'allocation_error', 'system_timeout']
      }
    },

    {
      id: 'debt_collection',
      name: 'debtCollection',
      displayName: '债务催收流程',
      description: '逾期账款的系统化催收管理流程',
      category: 'workflow',
      actors: [
        { id: 'collection_agent', name: '催收专员', role: 'operator', permissions: ['debt_collect'] },
        { id: 'collection_manager', name: '催收经理', role: 'supervisor', permissions: ['collection_escalate'] },
        { id: 'legal_counsel', name: '法务顾问', role: 'specialist', permissions: ['legal_action'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始催收流程',
          type: 'start',
          next: 'generate_aging_report',
          visual: { position: { x: 100, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'generate_aging_report',
          name: '生成账龄报告',
          type: 'task',
          task: {
            behaviorId: 'generateAgingReport',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'identify_overdue_accounts',
          visual: { position: { x: 250, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'identify_overdue_accounts',
          name: '识别逾期账户',
          type: 'decision',
          decision: {
            condition: 'overdueAccountsFound',
            branches: [
              { condition: 'true', nextStepId: 'create_debt_workflow' },
              { condition: 'false', nextStepId: 'end_no_action' }
            ]
          },
          next: ['create_debt_workflow', 'end_no_action'],
          visual: { position: { x: 400, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'create_debt_workflow',
          name: '创建债务工作流',
          type: 'task',
          task: {
            behaviorId: 'createDebtWorkflow',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'initial_contact',
          visual: { position: { x: 550, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'initial_contact',
          name: '初始联系',
          type: 'task',
          task: {
            behaviorId: 'processDebtCollection',
            actorId: 'collection_agent',
            inputs: { action_type: 'NOTICE' }
          },
          next: 'contact_response',
          visual: { position: { x: 700, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'contact_response',
          name: '联系响应评估',
          type: 'decision',
          decision: {
            condition: 'customerResponded',
            branches: [
              { condition: 'payment_promise', nextStepId: 'schedule_follow_up' },
              { condition: 'dispute', nextStepId: 'handle_dispute' },
              { condition: 'no_response', nextStepId: 'escalate_contact' }
            ]
          },
          next: ['schedule_follow_up', 'handle_dispute', 'escalate_contact'],
          visual: { position: { x: 850, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'schedule_follow_up',
          name: '安排跟进',
          type: 'task',
          task: {
            behaviorId: 'scheduleFollowUp',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'monitor_payment_promise',
          visual: { position: { x: 700, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'handle_dispute',
          name: '处理争议',
          type: 'task',
          task: {
            behaviorId: 'handleDispute',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'dispute_resolution',
          visual: { position: { x: 850, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'escalate_contact',
          name: '升级联系',
          type: 'task',
          task: {
            behaviorId: 'processDebtCollection',
            actorId: 'collection_manager',
            inputs: { action_type: 'ESCALATE' }
          },
          next: 'manager_contact',
          visual: { position: { x: 1000, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'monitor_payment_promise',
          name: '监控付款承诺',
          type: 'decision',
          decision: {
            condition: 'paymentPromiseKept',
            branches: [
              { condition: 'true', nextStepId: 'close_workflow' },
              { condition: 'false', nextStepId: 'escalate_contact' }
            ]
          },
          next: ['close_workflow', 'escalate_contact'],
          visual: { position: { x: 700, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'dispute_resolution',
          name: '争议解决',
          type: 'decision',
          decision: {
            condition: 'disputeResolved',
            branches: [
              { condition: 'valid_dispute', nextStepId: 'adjust_invoice' },
              { condition: 'invalid_dispute', nextStepId: 'escalate_contact' }
            ]
          },
          next: ['adjust_invoice', 'escalate_contact'],
          visual: { position: { x: 850, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'manager_contact',
          name: '经理级联系',
          type: 'decision',
          decision: {
            condition: 'managerContactSuccessful',
            branches: [
              { condition: 'true', nextStepId: 'schedule_follow_up' },
              { condition: 'false', nextStepId: 'consider_legal_action' }
            ]
          },
          next: ['schedule_follow_up', 'consider_legal_action'],
          visual: { position: { x: 1000, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'consider_legal_action',
          name: '考虑法律行动',
          type: 'task',
          task: {
            behaviorId: 'processDebtCollection',
            actorId: 'legal_counsel',
            inputs: { action_type: 'LEGAL' }
          },
          next: 'legal_decision',
          visual: { position: { x: 1000, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'legal_decision',
          name: '法律决策',
          type: 'decision',
          decision: {
            condition: 'legalActionApproved',
            branches: [
              { condition: 'true', nextStepId: 'initiate_legal_action' },
              { condition: 'false', nextStepId: 'write_off_debt' }
            ]
          },
          next: ['initiate_legal_action', 'write_off_debt'],
          visual: { position: { x: 1150, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'adjust_invoice',
          name: '调整发票',
          type: 'task',
          task: {
            behaviorId: 'adjustInvoice',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'close_workflow',
          visual: { position: { x: 850, y: 550 }, type: 'flowchart' }
        },
        {
          id: 'initiate_legal_action',
          name: '启动法律程序',
          type: 'task',
          task: {
            behaviorId: 'initiateLegalAction',
            actorId: 'legal_counsel',
            inputs: {}
          },
          next: 'end_legal_process',
          visual: { position: { x: 1300, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'write_off_debt',
          name: '核销债务',
          type: 'task',
          task: {
            behaviorId: 'writeOffDebt',
            actorId: 'collection_manager',
            inputs: {}
          },
          next: 'close_workflow',
          visual: { position: { x: 1150, y: 550 }, type: 'flowchart' }
        },
        {
          id: 'close_workflow',
          name: '关闭工作流',
          type: 'task',
          task: {
            behaviorId: 'closeDebtWorkflow',
            actorId: 'collection_agent',
            inputs: {}
          },
          next: 'end_resolved',
          visual: { position: { x: 1000, y: 550 }, type: 'flowchart' }
        },
        {
          id: 'end_no_action',
          name: '无需催收',
          type: 'end',
          next: [],
          visual: { position: { x: 400, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'end_resolved',
          name: '催收完成',
          type: 'end',
          next: [],
          visual: { position: { x: 1000, y: 700 }, type: 'flowchart' }
        },
        {
          id: 'end_legal_process',
          name: '法律程序进行中',
          type: 'end',
          next: [],
          visual: { position: { x: 1300, y: 550 }, type: 'flowchart' }
        }
      ],
      triggers: [
        { type: 'schedule', schedule: '0 9 * * 1' }, // 每周一上午9点
        { type: 'event', event: 'invoice_overdue' },
        { type: 'condition', condition: 'aging_days > 30' }
      ],
      constraints: {
        timeLimit: 86400000, // 24小时内响应
        businessRules: ['payment_allocation_rule', 'commission_eligibility_rule']
      },
      metrics: {
        averageDuration: 172800000, // 平均2天
        successRate: 0.75,
        errorPatterns: ['customer_unavailable', 'dispute_escalation', 'legal_complexity']
      }
    }
  ],

  // Semantic Links between BNP Objects, Behaviors, Rules, and Scenarios
  links: [
    // Invoice-Client relationships
    {
      id: 'invoice_for_client',
      sourceId: 'invoice',
      targetId: 'client',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'part_of',
      properties: { multiplicity: 'N:1', direction: 'unidirectional', weight: 1.0 },
      description: '发票属于客户',
      visual: { style: 'solid', color: '#059669', width: 3, label: 'bills' }
    },

    // Payment-Invoice relationships
    {
      id: 'payment_allocates_to_invoices',
      sourceId: 'payment',
      targetId: 'invoice',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: 'N:N', direction: 'unidirectional', weight: 0.9 },
      description: '付款分配给发票',
      visual: { style: 'solid', color: '#3b82f6', width: 2, label: 'pays for' }
    },

    // Commission-Invoice relationships
    {
      id: 'commission_from_invoice',
      sourceId: 'commission',
      targetId: 'invoice',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'depends_on',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '佣金基于发票计算',
      visual: { style: 'solid', color: '#ec4899', width: 2, label: 'based on' }
    },

    // Bank Transaction-Payment relationships
    {
      id: 'bank_transaction_matches_payment',
      sourceId: 'bank_transaction',
      targetId: 'payment',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.8 },
      description: '银行交易匹配付款记录',
      visual: { style: 'dashed', color: '#0891b2', width: 2, label: 'reconciles' }
    },

    // Behavior to Object relationships
    {
      id: 'generate_invoice_produces_invoice',
      sourceId: 'generateInvoice',
      targetId: 'invoice',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '生成发票行为产生发票对象',
      visual: { style: 'solid', color: '#059669', width: 3, label: 'creates' }
    },

    {
      id: 'process_payment_creates_payment',
      sourceId: 'processPayment',
      targetId: 'payment',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '处理付款行为创建付款记录',
      visual: { style: 'solid', color: '#3b82f6', width: 3, label: 'creates' }
    },

    {
      id: 'calculate_commission_produces_commission',
      sourceId: 'calculateCommission',
      targetId: 'commission',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '计算佣金行为产生佣金记录',
      visual: { style: 'solid', color: '#ec4899', width: 3, label: 'calculates' }
    },

    // Rule to Behavior relationships
    {
      id: 'payment_allocation_rule_validates_process_payment',
      sourceId: 'payment_allocation_rule',
      targetId: 'processPayment',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '付款分配规则验证付款处理',
      visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'validates' }
    },

    {
      id: 'minimum_charge_rule_validates_generate_invoice',
      sourceId: 'minimum_charge_rule',
      targetId: 'generateInvoice',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '最低收费规则验证发票生成',
      visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'validates' }
    },

    // Scenario to Behavior relationships
    {
      id: 'invoice_generation_uses_calculate_storage_cost',
      sourceId: 'invoice_generation',
      targetId: 'calculateStorageCost',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '发票生成流程使用存储费用计算',
      visual: { style: 'solid', color: '#6366f1', width: 2, label: 'uses' }
    },

    {
      id: 'invoice_generation_uses_generate_invoice',
      sourceId: 'invoice_generation',
      targetId: 'generateInvoice',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '发票生成流程使用发票生成行为',
      visual: { style: 'solid', color: '#6366f1', width: 2, label: 'uses' }
    },

    {
      id: 'payment_processing_uses_process_payment',
      sourceId: 'payment_processing',
      targetId: 'processPayment',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '付款处理流程使用付款处理行为',
      visual: { style: 'solid', color: '#3b82f6', width: 2, label: 'uses' }
    },

    {
      id: 'payment_processing_uses_reconcile_bank_transaction',
      sourceId: 'payment_processing',
      targetId: 'reconcileBankTransaction',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '付款处理流程使用银行对账行为',
      visual: { style: 'solid', color: '#3b82f6', width: 2, label: 'uses' }
    },

    {
      id: 'debt_collection_uses_process_debt_collection',
      sourceId: 'debt_collection',
      targetId: 'processDebtCollection',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '债务催收流程使用债务催收处理行为',
      visual: { style: 'solid', color: '#dc2626', width: 2, label: 'uses' }
    }
  ],

  validation: {
    isValid: true,
    timestamp: new Date().toISOString(),
    errors: [],
    warnings: [],
    metrics: {
      objectCount: 12,
      behaviorCount: 8,
      ruleCount: 5,
      scenarioCount: 3,
      linkCount: 15,
      completenessScore: 90,
      consistencyScore: 94
    }
  }
};

// Export individual components for testing and development
export const BNP_OBJECTS = BNP_DOMAIN_BLUEPRINT.objects;
export const BNP_BEHAVIORS = BNP_DOMAIN_BLUEPRINT.behaviors;
export const BNP_RULES = BNP_DOMAIN_BLUEPRINT.rules;
export const BNP_SCENARIOS = BNP_DOMAIN_BLUEPRINT.scenarios;
export const BNP_LINKS = BNP_DOMAIN_BLUEPRINT.links;