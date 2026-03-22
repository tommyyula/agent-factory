// FMS Domain Model Implementation
// Complete OBR model for Fleet Management System domain
// Based on FMS schema and agent definitions

import { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink
} from '@/shared/types/obr.types';

// FMS Domain Blueprint
export const FMS_DOMAIN_BLUEPRINT: OntologyBlueprint = {
  $schema: 'https://schemas.agent-factory.com/obr/v1.0.0',
  metadata: {
    id: 'fms-domain-v1',
    name: 'Fleet Management System Ontology',
    version: '1.0.0',
    domain: 'FMS',
    description: '运输管理系统完整业务域本体模型，包含拖车、LTL运输、结算等核心业务流程',
    author: 'Unis Agency Agents',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checksum: 'fms-v1-checksum'
  },
  
  // 12 Core Objects from FMS Schema
  objects: [
    {
      id: 'company',
      name: 'Company',
      displayName: '公司',
      description: '运输公司主体，管理终端、客户和运营',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '公司唯一标识' },
        name: { type: 'string', required: true, description: '公司名称' },
        code: { type: 'string', required: true, description: '公司代码' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          defaultValue: 'ACTIVE',
          description: '公司状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '公司正常运营' },
          'INACTIVE': { displayName: '停用', description: '公司暂停运营' },
          'SUSPENDED': { displayName: '暂停', description: '公司因违规暂停' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateCompany' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendCompany' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateCompany' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'reinstateCompany' }
        ]
      },
      constraints: [
        {
          id: 'unique_company_code',
          type: 'invariant',
          expression: 'isUnique(code)',
          description: '公司代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#1f2937', icon: 'building-office', position: { x: 100, y: 100 } }
    },
    
    {
      id: 'terminal',
      name: 'Terminal',
      displayName: '终端/站点',
      description: '运输终端或配送站点',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '终端唯一标识' },
        terminal_code: { type: 'string', required: true, description: '终端代码' },
        name: { type: 'string', required: true, description: '终端名称' },
        address: { type: 'string', required: false, description: '终端地址' },
        company_id: { type: 'reference', references: 'company', required: true, description: '所属公司' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'] },
          defaultValue: 'ACTIVE',
          description: '终端状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '运营中', description: '终端正常运营' },
          'INACTIVE': { displayName: '停用', description: '终端暂停运营' },
          'MAINTENANCE': { displayName: '维护中', description: '终端设施维护' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateTerminal' },
          { from: 'ACTIVE', to: 'MAINTENANCE', trigger: 'startMaintenance' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateTerminal' },
          { from: 'MAINTENANCE', to: 'ACTIVE', trigger: 'completeMaintenance' }
        ]
      },
      constraints: [
        {
          id: 'unique_terminal_code',
          type: 'invariant',
          expression: 'isUnique(terminal_code)',
          description: '终端代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#3b82f6', icon: 'map-pin', position: { x: 300, y: 100 } }
    },
    
    {
      id: 'customer',
      name: 'Customer',
      displayName: '客户(托运人)',
      description: '运输服务客户，即货物托运人',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '客户唯一标识' },
        code: { type: 'string', required: true, description: '客户代码' },
        name: { type: 'string', required: true, description: '客户名称' },
        credit_limit: { type: 'number', required: false, constraints: { min: 0 }, description: '信用额度' },
        payment_terms: { type: 'string', required: false, description: '付款条件' },
        company_id: { type: 'reference', references: 'company', required: true, description: '所属公司' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '客户正常服务' },
          'INACTIVE': { displayName: '停用', description: '客户暂停服务' },
          'CREDIT_HOLD': { displayName: '信用冻结', description: '客户信用额度冻结' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateCustomer' },
          { from: 'ACTIVE', to: 'CREDIT_HOLD', trigger: 'holdCredit' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateCustomer' },
          { from: 'CREDIT_HOLD', to: 'ACTIVE', trigger: 'releaseCredit' }
        ]
      },
      constraints: [
        {
          id: 'unique_customer_code',
          type: 'invariant',
          expression: 'isUnique(code)',
          description: '客户代码必须唯一',
          severity: 'error'
        },
        {
          id: 'positive_credit_limit',
          type: 'invariant',
          expression: 'credit_limit == null || credit_limit >= 0',
          description: '信用额度必须非负',
          severity: 'error'
        }
      ],
      visual: { color: '#10b981', icon: 'user-group', position: { x: 500, y: 100 } }
    },
    
    {
      id: 'shipment_order',
      name: 'ShipmentOrder',
      displayName: '运输订单',
      description: '货物运输订单，包含发货人、收货人、计费方等信息',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '运输订单唯一标识' },
        pro_number: { type: 'string', required: true, description: 'PRO号(运单号)' },
        status: { type: 'string', required: true, description: '订单状态' },
        stage: { type: 'string', required: false, description: '执行阶段' },
        shipper_id: { type: 'reference', references: 'customer', required: true, description: '发货人' },
        consignee_id: { type: 'reference', references: 'customer', required: true, description: '收货人' },
        billto_id: { type: 'reference', references: 'customer', required: true, description: '付款方' },
        company_id: { type: 'reference', references: 'company', required: true, description: '运输公司' },
        terminal_id: { type: 'reference', references: 'terminal', required: true, description: '始发终端' },
        pickup_date: { type: 'date', required: false, description: '取货日期' },
        delivery_date: { type: 'date', required: false, description: '送货日期' },
        created_at: { type: 'date', required: true, description: '创建时间' }
      },
      stateMachine: {
        initialState: 'CREATED',
        states: {
          'CREATED': { displayName: '已创建', description: '订单已创建' },
          'DISPATCHED': { displayName: '已调度', description: '订单已分配车辆' },
          'IN_TRANSIT': { displayName: '运输中', description: '货物运输中' },
          'DELIVERED': { displayName: '已送达', description: '货物已送达', isTerminal: true },
          'CANCELLED': { displayName: '已取消', description: '订单被取消', isTerminal: true }
        },
        transitions: [
          { from: 'CREATED', to: 'DISPATCHED', trigger: 'dispatchOrder' },
          { from: 'DISPATCHED', to: 'IN_TRANSIT', trigger: 'startTransport' },
          { from: 'IN_TRANSIT', to: 'DELIVERED', trigger: 'completeDelivery' },
          { from: 'CREATED', to: 'CANCELLED', trigger: 'cancelOrder' },
          { from: 'DISPATCHED', to: 'CANCELLED', trigger: 'cancelOrder' }
        ]
      },
      constraints: [
        {
          id: 'unique_pro_number',
          type: 'invariant',
          expression: 'isUnique(pro_number)',
          description: 'PRO号必须全局唯一',
          severity: 'error'
        },
        {
          id: 'valid_date_sequence',
          type: 'invariant',
          expression: 'delivery_date == null || pickup_date == null || delivery_date >= pickup_date',
          description: '送货日期不能早于取货日期',
          severity: 'error'
        }
      ],
      visual: { color: '#f59e0b', icon: 'document-text', position: { x: 700, y: 100 } }
    },
    
    {
      id: 'trip',
      name: 'Trip',
      displayName: '运输行程',
      description: '车辆运输行程，包含司机、路线和任务',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '行程唯一标识' },
        type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['DRAYAGE', 'LTL', 'LINEHAUL', 'LOCAL_DELIVERY'] },
          description: '行程类型'
        },
        status: { 
          type: 'number', 
          required: true, 
          constraints: { min: 0, max: 10 },
          defaultValue: 0,
          description: '行程状态(0-10)'
        },
        driver_id: { type: 'reference', references: 'driver', required: false, description: '司机' },
        carrier_id: { type: 'string', required: false, description: '承运商ID' },
        terminal_id: { type: 'reference', references: 'terminal', required: true, description: '始发终端' },
        company_id: { type: 'reference', references: 'company', required: true, description: '运输公司' },
        scheduled_date: { type: 'date', required: true, description: '计划日期' }
      },
      stateMachine: {
        initialState: 'PLANNED',
        states: {
          'PLANNED': { displayName: '已计划', description: '行程已计划' },
          'DISPATCHED': { displayName: '已调度', description: '行程已调度' },
          'IN_PROGRESS': { displayName: '执行中', description: '行程执行中' },
          'COMPLETED': { displayName: '已完成', description: '行程已完成', isTerminal: true },
          'CANCELLED': { displayName: '已取消', description: '行程被取消', isTerminal: true }
        },
        transitions: [
          { from: 'PLANNED', to: 'DISPATCHED', trigger: 'dispatchTrip' },
          { from: 'DISPATCHED', to: 'IN_PROGRESS', trigger: 'startTrip' },
          { from: 'IN_PROGRESS', to: 'COMPLETED', trigger: 'completeTrip' },
          { from: 'PLANNED', to: 'CANCELLED', trigger: 'cancelTrip' },
          { from: 'DISPATCHED', to: 'CANCELLED', trigger: 'cancelTrip' }
        ]
      },
      constraints: [
        {
          id: 'future_scheduled_date',
          type: 'precondition',
          expression: 'scheduled_date >= today()',
          description: '计划日期不能是过去时间',
          severity: 'error'
        },
        {
          id: 'valid_status_range',
          type: 'invariant',
          expression: 'status >= 0 && status <= 10',
          description: '行程状态必须在0-10范围内',
          severity: 'error'
        }
      ],
      visual: { color: '#8b5cf6', icon: 'truck', position: { x: 900, y: 100 } }
    },
    
    {
      id: 'driver',
      name: 'Driver',
      displayName: '司机',
      description: '运输司机，执行货物运输任务',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '司机唯一标识' },
        name: { type: 'string', required: true, description: '司机姓名' },
        license: { type: 'string', required: true, description: '驾驶证号' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED'] },
          defaultValue: 'ACTIVE',
          description: '司机状态'
        },
        hazmat: { type: 'boolean', required: false, defaultValue: false, description: '危险品资质' },
        company_id: { type: 'reference', references: 'company', required: true, description: '所属公司' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '可用', description: '司机正常工作' },
          'INACTIVE': { displayName: '不可用', description: '司机不可用' },
          'ON_LEAVE': { displayName: '休假', description: '司机休假中' },
          'SUSPENDED': { displayName: '停职', description: '司机被停职' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateDriver' },
          { from: 'ACTIVE', to: 'ON_LEAVE', trigger: 'grantLeave' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendDriver' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateDriver' },
          { from: 'ON_LEAVE', to: 'ACTIVE', trigger: 'returnFromLeave' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'reinstateDriver' }
        ]
      },
      constraints: [
        {
          id: 'unique_license',
          type: 'invariant',
          expression: 'isUnique(license)',
          description: '驾驶证号必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#ef4444', icon: 'identification', position: { x: 100, y: 300 } }
    },
    
    {
      id: 'tractor',
      name: 'Tractor',
      displayName: '牵引车',
      description: '运输牵引车辆',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '牵引车唯一标识' },
        truck_no: { type: 'string', required: true, description: '车辆编号' },
        vin: { type: 'string', required: false, description: '车架号' },
        license_plate: { type: 'string', required: true, description: '车牌号' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'REPAIR'] },
          defaultValue: 'ACTIVE',
          description: '车辆状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '可用', description: '车辆正常运营' },
          'INACTIVE': { displayName: '停用', description: '车辆暂停使用' },
          'MAINTENANCE': { displayName: '保养', description: '车辆保养中' },
          'REPAIR': { displayName: '维修', description: '车辆维修中' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateTractor' },
          { from: 'ACTIVE', to: 'MAINTENANCE', trigger: 'startMaintenance' },
          { from: 'ACTIVE', to: 'REPAIR', trigger: 'startRepair' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateTractor' },
          { from: 'MAINTENANCE', to: 'ACTIVE', trigger: 'completeMaintenance' },
          { from: 'REPAIR', to: 'ACTIVE', trigger: 'completeRepair' }
        ]
      },
      constraints: [
        {
          id: 'unique_truck_number',
          type: 'invariant',
          expression: 'isUnique(truck_no)',
          description: '车辆编号必须唯一',
          severity: 'error'
        },
        {
          id: 'unique_license_plate',
          type: 'invariant',
          expression: 'isUnique(license_plate)',
          description: '车牌号必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#06b6d4', icon: 'truck', position: { x: 300, y: 300 } }
    },
    
    {
      id: 'load_info',
      name: 'LoadInfo',
      displayName: '货载信息',
      description: '集装箱或货物装载信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '货载信息唯一标识' },
        load_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['CONTAINER', 'LTL', 'FTL', 'DRAYAGE'] },
          description: '货载类型'
        },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['PENDING', 'LOADED', 'IN_TRANSIT', 'DELIVERED', 'EMPTY'] },
          defaultValue: 'PENDING',
          description: '货载状态'
        },
        container_no: { type: 'string', required: false, description: '集装箱号' },
        chassis_no: { type: 'string', required: false, description: '底盘号' },
        customer_id: { type: 'reference', references: 'customer', required: true, description: '客户' },
        company_id: { type: 'reference', references: 'company', required: true, description: '运输公司' },
        terminal_id: { type: 'reference', references: 'terminal', required: true, description: '装载终端' },
        routing_template: { type: 'string', required: false, description: '路由模板' }
      },
      stateMachine: {
        initialState: 'PENDING',
        states: {
          'PENDING': { displayName: '待装载', description: '货载等待装载' },
          'LOADED': { displayName: '已装载', description: '货载已装载完毕' },
          'IN_TRANSIT': { displayName: '运输中', description: '货载运输中' },
          'DELIVERED': { displayName: '已送达', description: '货载已送达', isTerminal: true },
          'EMPTY': { displayName: '空载', description: '空集装箱或空车', isTerminal: true }
        },
        transitions: [
          { from: 'PENDING', to: 'LOADED', trigger: 'loadCargo' },
          { from: 'LOADED', to: 'IN_TRANSIT', trigger: 'startTransit' },
          { from: 'IN_TRANSIT', to: 'DELIVERED', trigger: 'deliverCargo' },
          { from: 'DELIVERED', to: 'EMPTY', trigger: 'unloadCargo' }
        ]
      },
      constraints: [
        {
          id: 'container_no_for_container_load',
          type: 'invariant',
          expression: 'load_type != "CONTAINER" || container_no != null',
          description: '集装箱货载必须有集装箱号',
          severity: 'error'
        }
      ],
      visual: { color: '#84cc16', icon: 'cube', position: { x: 500, y: 300 } }
    },
    
    {
      id: 'order_invoice',
      name: 'OrderInvoice',
      displayName: '订单发票',
      description: '运输订单对应的发票信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '发票唯一标识' },
        order_id: { type: 'reference', references: 'shipment_order', required: true, description: '关联订单' },
        invoice_number: { type: 'string', required: true, description: '发票号' },
        amount: { type: 'number', required: true, constraints: { min: 0 }, description: '发票金额' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['OUTSTANDING', 'PAID', 'OVERDUE', 'DISPUTED'] },
          defaultValue: 'OUTSTANDING',
          description: '发票状态'
        },
        locked: { type: 'boolean', required: false, defaultValue: false, description: '是否锁定' }
      },
      stateMachine: {
        initialState: 'OUTSTANDING',
        states: {
          'OUTSTANDING': { displayName: '待付款', description: '发票待客户付款' },
          'PAID': { displayName: '已付款', description: '发票已付款', isTerminal: true },
          'OVERDUE': { displayName: '逾期', description: '发票付款逾期' },
          'DISPUTED': { displayName: '争议', description: '发票金额有争议' }
        },
        transitions: [
          { from: 'OUTSTANDING', to: 'PAID', trigger: 'payInvoice' },
          { from: 'OUTSTANDING', to: 'OVERDUE', trigger: 'markOverdue' },
          { from: 'OUTSTANDING', to: 'DISPUTED', trigger: 'disputeInvoice' },
          { from: 'OVERDUE', to: 'PAID', trigger: 'payInvoice' },
          { from: 'DISPUTED', to: 'OUTSTANDING', trigger: 'resolveDispute' }
        ]
      },
      constraints: [
        {
          id: 'unique_invoice_number',
          type: 'invariant',
          expression: 'isUnique(invoice_number)',
          description: '发票号必须唯一',
          severity: 'error'
        },
        {
          id: 'positive_amount',
          type: 'invariant',
          expression: 'amount > 0',
          description: '发票金额必须大于零',
          severity: 'error'
        }
      ],
      visual: { color: '#f97316', icon: 'document-currency-dollar', position: { x: 700, y: 300 } }
    },
    
    {
      id: 'ap_payment',
      name: 'APPayment',
      displayName: 'AP付款单',
      description: '应付账款付款单，支付给承运商',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: 'AP付款单唯一标识' },
        trip_id: { type: 'reference', references: 'trip', required: true, description: '关联行程' },
        carrier_id: { type: 'string', required: true, description: '承运商ID' },
        amount: { type: 'number', required: true, constraints: { min: 0 }, description: '付款金额' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['UNCLAIMED', 'CLAIMED', 'APPROVED', 'PAID'] },
          defaultValue: 'UNCLAIMED',
          description: 'AP状态'
        }
      },
      stateMachine: {
        initialState: 'UNCLAIMED',
        states: {
          'UNCLAIMED': { displayName: '未认领', description: '承运商未认领' },
          'CLAIMED': { displayName: '已认领', description: '承运商已认领' },
          'APPROVED': { displayName: '已审批', description: '付款已审批' },
          'PAID': { displayName: '已付款', description: '付款已完成', isTerminal: true }
        },
        transitions: [
          { from: 'UNCLAIMED', to: 'CLAIMED', trigger: 'claimPayment' },
          { from: 'CLAIMED', to: 'APPROVED', trigger: 'approvePayment' },
          { from: 'APPROVED', to: 'PAID', trigger: 'executePayment' }
        ]
      },
      constraints: [
        {
          id: 'positive_ap_amount',
          type: 'invariant',
          expression: 'amount > 0',
          description: 'AP付款金额必须大于零',
          severity: 'error'
        }
      ],
      visual: { color: '#dc2626', icon: 'credit-card', position: { x: 900, y: 300 } }
    },
    
    {
      id: 'rate_type',
      name: 'RateType',
      displayName: '费率类型',
      description: '运输费率类型定义',
      category: 'value_object',
      attributes: {
        id: { type: 'string', required: true, description: '费率类型唯一标识' },
        name: { type: 'string', required: true, description: '费率类型名称' },
        base_rate: { type: 'number', required: true, constraints: { min: 0 }, description: '基础费率' },
        fsc_rate: { type: 'number', required: false, constraints: { min: 0 }, description: '燃油附加费率' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '有效', description: '费率类型有效' },
          'DEPRECATED': { displayName: '废弃', description: '费率类型已废弃', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'DEPRECATED', trigger: 'deprecateRateType' }
        ]
      },
      constraints: [
        {
          id: 'unique_rate_type_name',
          type: 'invariant',
          expression: 'isUnique(name)',
          description: '费率类型名称必须唯一',
          severity: 'error'
        },
        {
          id: 'positive_rates',
          type: 'invariant',
          expression: 'base_rate >= 0 && (fsc_rate == null || fsc_rate >= 0)',
          description: '费率必须非负',
          severity: 'error'
        }
      ],
      visual: { color: '#6b7280', icon: 'calculator', position: { x: 100, y: 500 } }
    },
    
    {
      id: 'workflow_instance',
      name: 'WorkflowInstance',
      displayName: '工作流实例',
      description: '业务流程工作流实例',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '工作流实例唯一标识' },
        process_def: { type: 'string', required: true, description: '流程定义' },
        business_key: { type: 'string', required: true, description: '业务键值' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'SUSPENDED', 'COMPLETED', 'TERMINATED'] },
          defaultValue: 'ACTIVE',
          description: '工作流状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '运行中', description: '工作流正在运行' },
          'SUSPENDED': { displayName: '暂停', description: '工作流暂停执行' },
          'COMPLETED': { displayName: '已完成', description: '工作流正常完成', isTerminal: true },
          'TERMINATED': { displayName: '已终止', description: '工作流异常终止', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendWorkflow' },
          { from: 'ACTIVE', to: 'COMPLETED', trigger: 'completeWorkflow' },
          { from: 'ACTIVE', to: 'TERMINATED', trigger: 'terminateWorkflow' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'resumeWorkflow' }
        ]
      },
      constraints: [
        {
          id: 'unique_business_key_per_process',
          type: 'invariant',
          expression: 'isUniquePerGroup(business_key, process_def)',
          description: '同一流程定义内业务键值必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#7c3aed', icon: 'cog', position: { x: 300, y: 500 } }
    }
  ],
  
  // 8 Core Behaviors from FMS Agent Operations
  behaviors: [
    {
      id: 'createShipmentOrder',
      name: 'createShipmentOrder',
      displayName: '创建运输订单',
      description: '创建新的运输订单，包含发货人、收货人、计费方信息',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'company', requiredState: 'ACTIVE' },
          { objectId: 'customer', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['pro_number_unique_rule'],
        customConditions: ['hasOrderCreationPermission(actor)']
      },
      inputs: {
        shipper_id: { type: 'string', required: true, description: '发货人ID' },
        consignee_id: { type: 'string', required: true, description: '收货人ID' },
        billto_id: { type: 'string', required: true, description: '付款方ID' },
        company_id: { type: 'string', required: true, description: '运输公司ID' },
        terminal_id: { type: 'string', required: true, description: '始发终端ID' },
        pickup_date: { type: 'date', required: false, description: '取货日期' },
        delivery_date: { type: 'date', required: false, description: '送货日期' },
        cargo_details: { type: 'object', required: true, description: '货物明细' }
      },
      outputs: {
        order_id: { type: 'string', description: '创建的订单ID' },
        pro_number: { type: 'string', description: 'PRO运单号' },
        success: { type: 'boolean', description: '创建是否成功' }
      },
      stateChanges: [
        { objectId: 'shipment_order', newState: 'CREATED' }
      ],
      linkedRules: [
        { ruleId: 'pro_number_unique_rule', phase: 'during', required: true },
        { ruleId: 'customer_credit_check_rule', phase: 'before', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'shipment_order_lines', data: { cargo_details: 'input.cargo_details' } },
        { type: 'notify', target: 'dispatcher', data: { event: 'new_order_created' } }
      ],
      visual: { color: '#f59e0b', icon: 'document-plus', position: { x: 100, y: 700 } }
    },
    
    {
      id: 'dispatchTrip',
      name: 'dispatchTrip',
      displayName: '调度行程',
      description: '为运输订单创建和调度运输行程',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'shipment_order', requiredState: 'CREATED' },
          { objectId: 'driver', requiredState: 'ACTIVE' },
          { objectId: 'tractor', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['driver_hours_rule', 'vehicle_availability_rule'],
        customConditions: ['hasDispatchPermission(actor)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '运输订单ID' },
        driver_id: { type: 'string', required: true, description: '司机ID' },
        tractor_id: { type: 'string', required: false, description: '牵引车ID' },
        trip_type: { type: 'string', required: true, validation: 'in:["DRAYAGE","LTL","LINEHAUL","LOCAL_DELIVERY"]', description: '行程类型' },
        scheduled_date: { type: 'date', required: true, description: '计划执行日期' }
      },
      outputs: {
        trip_id: { type: 'string', description: '创建的行程ID' },
        estimated_duration: { type: 'number', description: '预计行程时长(小时)' },
        route_plan: { type: 'object', description: '路线规划' }
      },
      stateChanges: [
        { objectId: 'trip', newState: 'DISPATCHED' },
        { objectId: 'shipment_order', newState: 'DISPATCHED' },
        { objectId: 'driver', newState: 'ACTIVE' },
        { objectId: 'tractor', newState: 'ACTIVE' }
      ],
      linkedRules: [
        { ruleId: 'driver_hours_rule', phase: 'before', required: true },
        { ruleId: 'vehicle_availability_rule', phase: 'before', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'trip_tasks', data: { trip_execution: 'planned' } },
        { type: 'update', target: 'driver_schedule', data: { trip_assigned: 'true' } },
        { type: 'notify', target: 'driver_coordinator', data: { event: 'trip_dispatched' } }
      ],
      visual: { color: '#8b5cf6', icon: 'arrows-right-left', position: { x: 300, y: 700 } }
    },
    
    {
      id: 'executePickup',
      name: 'executePickup',
      displayName: '执行取货',
      description: '司机执行货物取货操作',
      category: 'event',
      preconditions: {
        objectStates: [
          { objectId: 'trip', requiredState: 'DISPATCHED' },
          { objectId: 'driver', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['pickup_time_window_rule'],
        customConditions: ['isAssignedDriver(actor, trip)']
      },
      inputs: {
        trip_id: { type: 'string', required: true, description: '行程ID' },
        pickup_location: { type: 'string', required: true, description: '取货地点' },
        actual_pickup_time: { type: 'date', required: true, description: '实际取货时间' },
        cargo_condition: { type: 'string', required: false, description: '货物状况' },
        pickup_signature: { type: 'string', required: false, description: '取货签名' }
      },
      outputs: {
        pickup_confirmation: { type: 'string', description: '取货确认号' },
        cargo_received: { type: 'object', description: '实际接收货物信息' },
        next_stop: { type: 'string', description: '下一站点' }
      },
      stateChanges: [
        { objectId: 'trip', newState: 'IN_PROGRESS' },
        { objectId: 'load_info', newState: 'LOADED' },
        { objectId: 'shipment_order', newState: 'IN_TRANSIT' }
      ],
      linkedRules: [
        { ruleId: 'pickup_time_window_rule', phase: 'during', required: true },
        { ruleId: 'cargo_documentation_rule', phase: 'after', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'pickup_proof', data: { pickup_completed: 'true' } },
        { type: 'update', target: 'trip_timeline', data: { pickup_milestone: 'completed' } },
        { type: 'notify', target: 'customer', data: { event: 'pickup_completed' } }
      ],
      visual: { color: '#10b981', icon: 'arrow-down-on-square', position: { x: 500, y: 700 } }
    },
    
    {
      id: 'executeDelivery',
      name: 'executeDelivery',
      displayName: '执行送货',
      description: '司机执行货物送货操作',
      category: 'event',
      preconditions: {
        objectStates: [
          { objectId: 'trip', requiredState: 'IN_PROGRESS' },
          { objectId: 'load_info', requiredState: 'IN_TRANSIT' }
        ],
        ruleChecks: ['delivery_time_window_rule'],
        customConditions: ['isAssignedDriver(actor, trip)', 'hasCargoLoaded(trip)']
      },
      inputs: {
        trip_id: { type: 'string', required: true, description: '行程ID' },
        delivery_location: { type: 'string', required: true, description: '送货地点' },
        actual_delivery_time: { type: 'date', required: true, description: '实际送货时间' },
        delivery_signature: { type: 'string', required: true, description: '收货签名' },
        pod_photo: { type: 'string', required: false, description: '签收照片' }
      },
      outputs: {
        delivery_confirmation: { type: 'string', description: '送货确认号' },
        pod_document: { type: 'string', description: 'POD签收单' },
        trip_completed: { type: 'boolean', description: '行程是否完成' }
      },
      stateChanges: [
        { objectId: 'trip', newState: 'COMPLETED' },
        { objectId: 'load_info', newState: 'DELIVERED' },
        { objectId: 'shipment_order', newState: 'DELIVERED' }
      ],
      linkedRules: [
        { ruleId: 'delivery_time_window_rule', phase: 'during', required: true },
        { ruleId: 'pod_documentation_rule', phase: 'after', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'pod_record', data: { delivery_completed: 'true' } },
        { type: 'update', target: 'trip_timeline', data: { delivery_milestone: 'completed' } },
        { type: 'notify', target: 'customer', data: { event: 'delivery_completed' } },
        { type: 'notify', target: 'rate_engine_operator', data: { event: 'trip_ready_for_billing' } }
      ],
      visual: { color: '#059669', icon: 'arrow-up-on-square', position: { x: 700, y: 700 } }
    },
    
    {
      id: 'calculateRate',
      name: 'calculateRate',
      displayName: '计算费率',
      description: '根据运输订单计算运费和相关费用',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'shipment_order', requiredState: 'DELIVERED' }
        ],
        ruleChecks: ['rate_calculation_rule'],
        customConditions: ['hasRateEnginePermission(actor)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '运输订单ID' },
        rate_type_id: { type: 'string', required: true, description: '费率类型ID' },
        distance: { type: 'number', required: true, description: '运输距离' },
        weight: { type: 'number', required: false, description: '货物重量' },
        special_services: { type: 'string[]', required: false, description: '特殊服务列表' }
      },
      outputs: {
        base_rate: { type: 'number', description: '基础运费' },
        fuel_surcharge: { type: 'number', description: '燃油附加费' },
        accessorial_charges: { type: 'number', description: '附加服务费' },
        total_amount: { type: 'number', description: '总金额' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'rate_calculation_rule', phase: 'during', required: true },
        { ruleId: 'fuel_surcharge_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'rate_calculation_record', data: { calculation_completed: 'true' } }
      ],
      visual: { color: '#6b7280', icon: 'calculator', position: { x: 900, y: 700 } }
    },
    
    {
      id: 'generateInvoice',
      name: 'generateInvoice',
      displayName: '生成发票',
      description: '为已完成的运输订单生成客户发票',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'shipment_order', requiredState: 'DELIVERED' }
        ],
        ruleChecks: ['invoice_generation_rule'],
        customConditions: ['hasARClerkPermission(actor)', 'hasRateCalculation(order)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '运输订单ID' },
        invoice_date: { type: 'date', required: false, description: '发票日期' },
        payment_terms: { type: 'string', required: false, description: '付款条件' },
        billing_notes: { type: 'string', required: false, description: '账单备注' }
      },
      outputs: {
        invoice_id: { type: 'string', description: '生成的发票ID' },
        invoice_number: { type: 'string', description: '发票号' },
        invoice_amount: { type: 'number', description: '发票金额' },
        due_date: { type: 'date', description: '付款截止日期' }
      },
      stateChanges: [
        { objectId: 'order_invoice', newState: 'OUTSTANDING' }
      ],
      linkedRules: [
        { ruleId: 'invoice_generation_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'ar_record', data: { invoice_generated: 'true' } },
        { type: 'notify', target: 'customer', data: { event: 'invoice_sent' } }
      ],
      visual: { color: '#f97316', icon: 'document-currency-dollar', position: { x: 100, y: 900 } }
    },
    
    {
      id: 'processAPPayment',
      name: 'processAPPayment',
      displayName: '处理AP付款',
      description: '为承运商生成和处理应付账款',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'trip', requiredState: 'COMPLETED' }
        ],
        ruleChecks: ['ap_payment_rule'],
        customConditions: ['hasAPClerkPermission(actor)']
      },
      inputs: {
        trip_id: { type: 'string', required: true, description: '行程ID' },
        carrier_id: { type: 'string', required: true, description: '承运商ID' },
        payment_amount: { type: 'number', required: true, description: '付款金额' },
        payment_basis: { type: 'string', required: false, description: '付款依据' }
      },
      outputs: {
        ap_id: { type: 'string', description: 'AP付款单ID' },
        claim_deadline: { type: 'date', description: '认领截止日期' },
        payment_scheduled: { type: 'boolean', description: '付款是否已安排' }
      },
      stateChanges: [
        { objectId: 'ap_payment', newState: 'UNCLAIMED' }
      ],
      linkedRules: [
        { ruleId: 'ap_payment_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'ap_record', data: { payment_created: 'true' } },
        { type: 'notify', target: 'carrier', data: { event: 'payment_available_for_claim' } }
      ],
      visual: { color: '#dc2626', icon: 'banknotes', position: { x: 300, y: 900 } }
    },
    
    {
      id: 'optimizeRoute',
      name: 'optimizeRoute',
      displayName: '优化路线',
      description: '为运输行程规划最优路线',
      category: 'command',
      preconditions: {
        objectStates: [],
        ruleChecks: ['route_optimization_rule'],
        customConditions: ['hasRoutePlannerPermission(actor)']
      },
      inputs: {
        origin: { type: 'string', required: true, description: '起点地址' },
        destination: { type: 'string', required: true, description: '终点地址' },
        stops: { type: 'string[]', required: false, description: '中途停靠点' },
        vehicle_type: { type: 'string', required: true, description: '车辆类型' },
        constraints: { type: 'object', required: false, description: '路线约束条件' }
      },
      outputs: {
        optimal_route: { type: 'object', description: '最优路线' },
        estimated_distance: { type: 'number', description: '预计距离' },
        estimated_duration: { type: 'number', description: '预计时长' },
        fuel_cost: { type: 'number', description: '预计燃油成本' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'route_optimization_rule', phase: 'during', required: true },
        { ruleId: 'driver_hours_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'route_plan', data: { optimization_completed: 'true' } }
      ],
      visual: { color: '#06b6d4', icon: 'map', position: { x: 500, y: 900 } }
    }
  ],
  
  // 6 Core Rules from FMS Business Constraints
  rules: [
    {
      id: 'pro_number_unique_rule',
      name: 'proNumberUniqueRule',
      displayName: 'PRO号唯一性规则',
      description: '确保每个PRO运单号在系统内全局唯一',
      category: 'invariant',
      priority: 10,
      condition: {
        expression: 'isUnique(shipment_order.pro_number)',
        naturalLanguage: 'PRO运单号必须在系统内全局唯一',
        variables: {
          'shipment_order.pro_number': 'string'
        }
      },
      actions: [
        {
          type: 'block',
          message: 'PRO号已存在，请使用不同的PRO号',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['shipment_order'],
        behaviors: ['createShipmentOrder'],
        scenarios: ['drayage_import_process', 'ltl_transport_process']
      },
      testCases: [
        {
          id: 'test_unique_pro_number',
          description: 'PRO号唯一性检查',
          input: { pro_number: 'PRO-001-2024' },
          expectedResult: 'pass'
        },
        {
          id: 'test_duplicate_pro_number',
          description: '重复PRO号应该失败',
          input: { pro_number: 'PRO-001-2024' },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'driver_hours_rule',
      name: 'driverHoursRule',
      displayName: '司机工时规则',
      description: '确保司机工作时间符合DOT法规要求',
      category: 'constraint',
      priority: 9,
      condition: {
        expression: 'driver.daily_hours <= 11 && driver.weekly_hours <= 60',
        naturalLanguage: '司机每日工作时间不超过11小时，每周不超过60小时',
        variables: {
          'driver.daily_hours': 'number',
          'driver.weekly_hours': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '司机工时超限，无法分配新行程',
          severity: 'error'
        },
        {
          type: 'warn',
          message: '司机接近工时上限，请谨慎安排',
          severity: 'warning'
        }
      ],
      scope: {
        objects: ['driver', 'trip'],
        behaviors: ['dispatchTrip'],
        scenarios: ['drayage_import_process', 'ltl_transport_process']
      },
      testCases: [
        {
          id: 'test_within_hours_limit',
          description: '工时在限制范围内',
          input: { daily_hours: 9, weekly_hours: 45 },
          expectedResult: 'pass'
        },
        {
          id: 'test_exceed_daily_limit',
          description: '超出每日工时限制',
          input: { daily_hours: 12, weekly_hours: 45 },
          expectedResult: 'fail'
        },
        {
          id: 'test_exceed_weekly_limit',
          description: '超出每周工时限制',
          input: { daily_hours: 9, weekly_hours: 65 },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'vehicle_availability_rule',
      name: 'vehicleAvailabilityRule',
      displayName: '车辆可用性规则',
      description: '确保车辆在调度时处于可用状态',
      category: 'constraint',
      priority: 8,
      condition: {
        expression: 'tractor.status == "ACTIVE" && !hasConflictingTrip(tractor.id, scheduled_time)',
        naturalLanguage: '牵引车必须处于可用状态且无时间冲突',
        variables: {
          'tractor.status': 'string',
          'scheduled_time': 'Date'
        }
      },
      actions: [
        {
          type: 'block',
          message: '车辆不可用或时间冲突，无法调度',
          severity: 'error'
        },
        {
          type: 'execute',
          target: 'suggestAlternativeVehicle',
          message: '建议替代车辆',
          severity: 'info'
        }
      ],
      scope: {
        objects: ['tractor', 'trip'],
        behaviors: ['dispatchTrip'],
        scenarios: ['drayage_import_process', 'ltl_transport_process']
      },
      testCases: [
        {
          id: 'test_available_vehicle',
          description: '车辆可用性正常检查',
          input: { status: 'ACTIVE', time_conflict: false },
          expectedResult: 'pass'
        },
        {
          id: 'test_unavailable_vehicle',
          description: '车辆不可用检查',
          input: { status: 'MAINTENANCE', time_conflict: false },
          expectedResult: 'fail'
        },
        {
          id: 'test_time_conflict',
          description: '车辆时间冲突检查',
          input: { status: 'ACTIVE', time_conflict: true },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'customer_credit_check_rule',
      name: 'customerCreditCheckRule',
      displayName: '客户信用检查规则',
      description: '创建订单前检查客户信用状态和额度',
      category: 'validation',
      priority: 7,
      condition: {
        expression: 'customer.status != "CREDIT_HOLD" && customer.outstanding_balance <= customer.credit_limit',
        naturalLanguage: '客户不能处于信用冻结状态且未清余额不能超过信用额度',
        variables: {
          'customer.status': 'string',
          'customer.outstanding_balance': 'number',
          'customer.credit_limit': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '客户信用状态异常，无法创建订单',
          severity: 'error'
        },
        {
          type: 'warn',
          message: '客户信用额度紧张，建议谨慎处理',
          severity: 'warning'
        }
      ],
      scope: {
        objects: ['customer', 'shipment_order'],
        behaviors: ['createShipmentOrder'],
        scenarios: ['drayage_import_process', 'ltl_transport_process']
      },
      testCases: [
        {
          id: 'test_good_credit_status',
          description: '客户信用状态良好',
          input: { status: 'ACTIVE', outstanding: 5000, limit: 10000 },
          expectedResult: 'pass'
        },
        {
          id: 'test_credit_hold',
          description: '客户信用冻结',
          input: { status: 'CREDIT_HOLD', outstanding: 3000, limit: 10000 },
          expectedResult: 'fail'
        },
        {
          id: 'test_exceed_credit_limit',
          description: '超出信用额度',
          input: { status: 'ACTIVE', outstanding: 12000, limit: 10000 },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'pickup_time_window_rule',
      name: 'pickupTimeWindowRule',
      displayName: '取货时间窗规则',
      description: '取货必须在客户指定的时间窗口内执行',
      category: 'constraint',
      priority: 6,
      condition: {
        expression: 'actual_pickup_time >= pickup_window_start && actual_pickup_time <= pickup_window_end',
        naturalLanguage: '实际取货时间必须在客户指定的取货时间窗口内',
        variables: {
          'actual_pickup_time': 'Date',
          'pickup_window_start': 'Date',
          'pickup_window_end': 'Date'
        }
      },
      actions: [
        {
          type: 'warn',
          message: '取货时间超出客户指定窗口，可能产生额外费用',
          severity: 'warning'
        },
        {
          type: 'validate',
          message: '取货时间检查完成',
          severity: 'info'
        }
      ],
      scope: {
        objects: ['trip', 'shipment_order'],
        behaviors: ['executePickup'],
        scenarios: ['drayage_import_process', 'ltl_transport_process']
      },
      testCases: [
        {
          id: 'test_within_time_window',
          description: '在时间窗口内取货',
          input: { 
            pickup_time: '2024-03-25T10:00:00Z',
            window_start: '2024-03-25T08:00:00Z',
            window_end: '2024-03-25T12:00:00Z'
          },
          expectedResult: 'pass'
        },
        {
          id: 'test_outside_time_window',
          description: '超出时间窗口取货',
          input: { 
            pickup_time: '2024-03-25T14:00:00Z',
            window_start: '2024-03-25T08:00:00Z',
            window_end: '2024-03-25T12:00:00Z'
          },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'rate_calculation_rule',
      name: 'rateCalculationRule',
      displayName: '费率计算规则',
      description: '运费计算必须基于有效费率和准确的运输数据',
      category: 'validation',
      priority: 5,
      condition: {
        expression: 'rate_type.status == "ACTIVE" && distance > 0 && weight > 0',
        naturalLanguage: '费率类型必须有效，距离和重量必须大于零',
        variables: {
          'rate_type.status': 'string',
          'distance': 'number',
          'weight': 'number'
        }
      },
      actions: [
        {
          type: 'validate',
          message: '费率计算数据验证通过',
          severity: 'info'
        },
        {
          type: 'block',
          message: '费率计算数据不完整或无效',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['rate_type', 'shipment_order'],
        behaviors: ['calculateRate'],
        scenarios: ['settlement_process']
      },
      testCases: [
        {
          id: 'test_valid_calculation_data',
          description: '有效的费率计算数据',
          input: { rate_status: 'ACTIVE', distance: 150, weight: 2000 },
          expectedResult: 'pass'
        },
        {
          id: 'test_invalid_rate_type',
          description: '无效的费率类型',
          input: { rate_status: 'DEPRECATED', distance: 150, weight: 2000 },
          expectedResult: 'fail'
        },
        {
          id: 'test_zero_distance',
          description: '距离为零',
          input: { rate_status: 'ACTIVE', distance: 0, weight: 2000 },
          expectedResult: 'fail'
        }
      ]
    }
  ],
  
  // 3 Core Scenarios from FMS Process Chains
  scenarios: [
    {
      id: 'drayage_import_process',
      name: 'drayageImportProcess',
      displayName: '拖车进口流程',
      description: 'FMS拖车进口业务流程：订单→调度→Hook→取货→送货→Drop→结算',
      category: 'process',
      actors: [
        { id: 'order_clerk', name: '订单员', role: 'operator', permissions: ['order_create', 'order_manage'] },
        { id: 'load_coordinator', name: '装载协调员', role: 'coordinator', permissions: ['load_coordinate', 'equipment_manage'] },
        { id: 'route_planner', name: '路线规划员', role: 'planner', permissions: ['route_plan', 'optimization'] },
        { id: 'dispatcher', name: '调度员', role: 'coordinator', permissions: ['trip_dispatch', 'driver_assign'] },
        { id: 'chassis_operator', name: '底盘操作员', role: 'operator', permissions: ['chassis_hook', 'chassis_drop'] },
        { id: 'container_handler', name: '集装箱操作员', role: 'operator', permissions: ['container_pickup', 'container_delivery'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始拖车进口流程',
          type: 'start',
          next: 'create_order',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'create_order',
          name: '创建运输订单',
          type: 'task',
          task: {
            behaviorId: 'createShipmentOrder',
            actorId: 'order_clerk',
            inputs: {
              type: 'DRAYAGE_IMPORT'
            },
            timeout: 600000
          },
          next: 'coordinate_load',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'coordinate_load',
          name: '协调装载',
          type: 'task',
          task: {
            behaviorId: 'coordinateLoad',
            actorId: 'load_coordinator',
            inputs: {}
          },
          next: 'plan_route',
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'plan_route',
          name: '规划路线',
          type: 'task',
          task: {
            behaviorId: 'optimizeRoute',
            actorId: 'route_planner',
            inputs: {}
          },
          next: 'dispatch_trip',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'dispatch_trip',
          name: '调度行程',
          type: 'task',
          task: {
            behaviorId: 'dispatchTrip',
            actorId: 'dispatcher',
            inputs: {
              trip_type: 'DRAYAGE'
            }
          },
          next: 'chassis_hook',
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'chassis_hook',
          name: '底盘连接',
          type: 'task',
          task: {
            behaviorId: 'hookChassis',
            actorId: 'chassis_operator',
            inputs: {}
          },
          next: 'container_pickup',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'container_pickup',
          name: '集装箱取货',
          type: 'task',
          task: {
            behaviorId: 'executePickup',
            actorId: 'container_handler',
            inputs: {}
          },
          next: 'container_delivery',
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'container_delivery',
          name: '集装箱送货',
          type: 'task',
          task: {
            behaviorId: 'executeDelivery',
            actorId: 'container_handler',
            inputs: {}
          },
          next: 'chassis_drop',
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'chassis_drop',
          name: '底盘分离',
          type: 'task',
          task: {
            behaviorId: 'dropChassis',
            actorId: 'chassis_operator',
            inputs: {}
          },
          next: 'complete_load',
          visual: { position: { x: 1300, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'complete_load',
          name: '完成装载',
          type: 'task',
          task: {
            behaviorId: 'completeLoad',
            actorId: 'load_coordinator',
            inputs: {}
          },
          next: 'calculate_rate',
          visual: { position: { x: 1450, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'calculate_rate',
          name: '计算费率',
          type: 'task',
          task: {
            behaviorId: 'calculateRate',
            actorId: 'rate_engine_operator',
            inputs: {}
          },
          next: 'generate_ar',
          visual: { position: { x: 1600, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'generate_ar',
          name: '生成应收账款',
          type: 'task',
          task: {
            behaviorId: 'generateInvoice',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'generate_ap',
          visual: { position: { x: 1750, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'generate_ap',
          name: '生成应付账款',
          type: 'task',
          task: {
            behaviorId: 'processAPPayment',
            actorId: 'ap_clerk',
            inputs: {}
          },
          next: 'end',
          visual: { position: { x: 1900, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'end',
          name: '拖车进口流程完成',
          type: 'end',
          next: [],
          visual: { position: { x: 2050, y: 100 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'manual' },
        { type: 'event', event: 'container_arrival_notification' },
        { type: 'schedule', schedule: '0 6,10,14,18 * * 1-5' } // 工作日多个时间点
      ],
      constraints: {
        timeLimit: 28800000, // 8小时完成
        businessRules: ['pro_number_unique_rule', 'driver_hours_rule', 'vehicle_availability_rule', 'customer_credit_check_rule']
      },
      metrics: {
        averageDuration: 21600000, // 平均6小时
        successRate: 0.93,
        errorPatterns: ['equipment_shortage', 'driver_unavailable', 'container_delay']
      }
    },
    
    {
      id: 'ltl_transport_process',
      name: 'ltlTransportProcess',
      displayName: 'LTL运输流程',
      description: 'FMS零担运输业务流程：订单→调度→取货→干线→送货→POD',
      category: 'process',
      actors: [
        { id: 'order_clerk', name: '订单员', role: 'operator', permissions: ['order_create', 'order_manage'] },
        { id: 'dispatcher', name: '调度员', role: 'coordinator', permissions: ['trip_dispatch', 'driver_assign'] },
        { id: 'route_planner', name: '路线规划员', role: 'planner', permissions: ['route_plan', 'optimization'] },
        { id: 'pickup_driver', name: '取货司机', role: 'operator', permissions: ['pickup_execute'] },
        { id: 'linehaul_operator', name: '干线操作员', role: 'operator', permissions: ['linehaul_execute'] },
        { id: 'delivery_driver', name: '送货司机', role: 'operator', permissions: ['delivery_execute'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始LTL运输',
          type: 'start',
          next: 'create_ltl_order',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'create_ltl_order',
          name: '创建LTL订单',
          type: 'task',
          task: {
            behaviorId: 'createShipmentOrder',
            actorId: 'order_clerk',
            inputs: {
              type: 'LTL'
            }
          },
          next: 'dispatch_pickup',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'dispatch_pickup',
          name: '调度取货',
          type: 'task',
          task: {
            behaviorId: 'dispatchTrip',
            actorId: 'dispatcher',
            inputs: {
              trip_type: 'LOCAL_PICKUP'
            }
          },
          next: 'plan_pickup_route',
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'plan_pickup_route',
          name: '规划取货路线',
          type: 'task',
          task: {
            behaviorId: 'optimizeRoute',
            actorId: 'route_planner',
            inputs: {}
          },
          next: 'execute_pickup',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'execute_pickup',
          name: '执行取货',
          type: 'task',
          task: {
            behaviorId: 'executePickup',
            actorId: 'pickup_driver',
            inputs: {}
          },
          next: 'linehaul_transport',
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'linehaul_transport',
          name: '干线运输',
          type: 'task',
          task: {
            behaviorId: 'executeLinehaul',
            actorId: 'linehaul_operator',
            inputs: {}
          },
          next: 'dispatch_delivery',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'dispatch_delivery',
          name: '调度送货',
          type: 'task',
          task: {
            behaviorId: 'dispatchTrip',
            actorId: 'dispatcher',
            inputs: {
              trip_type: 'LOCAL_DELIVERY'
            }
          },
          next: 'plan_delivery_route',
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'plan_delivery_route',
          name: '规划送货路线',
          type: 'task',
          task: {
            behaviorId: 'optimizeRoute',
            actorId: 'route_planner',
            inputs: {}
          },
          next: 'execute_delivery',
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'execute_delivery',
          name: '执行送货',
          type: 'task',
          task: {
            behaviorId: 'executeDelivery',
            actorId: 'delivery_driver',
            inputs: {}
          },
          next: 'collect_pod',
          visual: { position: { x: 1300, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'collect_pod',
          name: '收集POD',
          type: 'task',
          task: {
            behaviorId: 'collectPOD',
            actorId: 'delivery_driver',
            inputs: {}
          },
          next: 'calculate_ltl_rate',
          visual: { position: { x: 1450, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'calculate_ltl_rate',
          name: '计算LTL费率',
          type: 'task',
          task: {
            behaviorId: 'calculateRate',
            actorId: 'rate_engine_operator',
            inputs: {}
          },
          next: 'generate_ltl_invoice',
          visual: { position: { x: 1600, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'generate_ltl_invoice',
          name: '生成LTL发票',
          type: 'task',
          task: {
            behaviorId: 'generateInvoice',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'end',
          visual: { position: { x: 1750, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'end',
          name: 'LTL运输完成',
          type: 'end',
          next: [],
          visual: { position: { x: 1900, y: 100 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'manual' },
        { type: 'event', event: 'ltl_shipment_request' },
        { type: 'schedule', schedule: '0 8,12,16 * * 1-6' } // 工作日多次
      ],
      constraints: {
        timeLimit: 172800000, // 48小时完成
        businessRules: ['pro_number_unique_rule', 'driver_hours_rule', 'pickup_time_window_rule']
      },
      metrics: {
        averageDuration: 86400000, // 平均24小时
        successRate: 0.91,
        errorPatterns: ['pickup_delay', 'linehaul_breakdown', 'delivery_failure']
      }
    },
    
    {
      id: 'settlement_process',
      name: 'settlementProcess',
      displayName: '结算流程',
      description: 'FMS结算业务流程：费率计算→AR生成→锁定AR→AP生成→承运商认领→付款→对账',
      category: 'workflow',
      actors: [
        { id: 'rate_engine_operator', name: '费率引擎操作员', role: 'operator', permissions: ['rate_calculate'] },
        { id: 'ar_clerk', name: 'AR员', role: 'operator', permissions: ['ar_generate', 'ar_manage'] },
        { id: 'ap_clerk', name: 'AP员', role: 'operator', permissions: ['ap_generate', 'ap_manage'] },
        { id: 'carrier_representative', name: '承运商代表', role: 'external', permissions: ['claim_payment'] },
        { id: 'finance_manager', name: '财务经理', role: 'supervisor', permissions: ['payment_approve', 'reconciliation'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始结算流程',
          type: 'start',
          next: 'calculate_rates',
          visual: { position: { x: 100, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'calculate_rates',
          name: '计算费率',
          type: 'task',
          task: {
            behaviorId: 'calculateRate',
            actorId: 'rate_engine_operator',
            inputs: {}
          },
          next: 'generate_ar',
          visual: { position: { x: 250, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'generate_ar',
          name: '生成AR',
          type: 'task',
          task: {
            behaviorId: 'generateInvoice',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'ar_review',
          visual: { position: { x: 400, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'ar_review',
          name: 'AR审核',
          type: 'decision',
          decision: {
            condition: 'arRequiresReview',
            branches: [
              { condition: 'true', nextStepId: 'ar_approval' },
              { condition: 'false', nextStepId: 'lock_ar' }
            ]
          },
          next: ['ar_approval', 'lock_ar'],
          visual: { position: { x: 550, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'ar_approval',
          name: 'AR审批',
          type: 'task',
          task: {
            behaviorId: 'approveAR',
            actorId: 'finance_manager',
            inputs: {}
          },
          next: 'lock_ar',
          visual: { position: { x: 550, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'lock_ar',
          name: '锁定AR',
          type: 'task',
          task: {
            behaviorId: 'lockAR',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'generate_ap',
          visual: { position: { x: 700, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'generate_ap',
          name: '生成AP',
          type: 'task',
          task: {
            behaviorId: 'processAPPayment',
            actorId: 'ap_clerk',
            inputs: {}
          },
          next: 'carrier_claim',
          visual: { position: { x: 850, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'carrier_claim',
          name: '承运商认领',
          type: 'task',
          task: {
            behaviorId: 'claimCarrierPayment',
            actorId: 'carrier_representative',
            inputs: {}
          },
          next: 'ap_approval',
          visual: { position: { x: 1000, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'ap_approval',
          name: 'AP审批',
          type: 'task',
          task: {
            behaviorId: 'approveAPPayment',
            actorId: 'finance_manager',
            inputs: {}
          },
          next: 'execute_payment',
          visual: { position: { x: 1150, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'execute_payment',
          name: '执行付款',
          type: 'task',
          task: {
            behaviorId: 'executeCarrierPayment',
            actorId: 'ap_clerk',
            inputs: {}
          },
          next: 'reconciliation',
          visual: { position: { x: 1300, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'reconciliation',
          name: 'AR对账',
          type: 'task',
          task: {
            behaviorId: 'reconcileAR',
            actorId: 'ar_clerk',
            inputs: {}
          },
          next: 'end',
          visual: { position: { x: 1450, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'end',
          name: '结算流程完成',
          type: 'end',
          next: [],
          visual: { position: { x: 1600, y: 100 }, type: 'flowchart' }
        }
      ],
      triggers: [
        { type: 'event', event: 'trip_completed' },
        { type: 'schedule', schedule: '0 9 * * 1-5' }, // 工作日每天9点
        { type: 'manual' }
      ],
      constraints: {
        timeLimit: 604800000, // 7天完成
        businessRules: ['rate_calculation_rule', 'customer_credit_check_rule']
      },
      metrics: {
        averageDuration: 259200000, // 平均3天
        successRate: 0.97,
        errorPatterns: ['rate_dispute', 'carrier_non_claim', 'payment_delay']
      }
    }
  ],
  
  // Semantic Links between FMS Objects, Behaviors, Rules, and Scenarios
  links: [
    // Company relationships
    {
      id: 'company_manages_terminals',
      sourceId: 'company',
      targetId: 'terminal',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '公司管理多个终端',
      visual: { style: 'solid', color: '#1f2937', width: 3, label: 'manages' }
    },
    
    {
      id: 'company_serves_customers',
      sourceId: 'company',
      targetId: 'customer',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '公司服务多个客户',
      visual: { style: 'solid', color: '#1f2937', width: 2, label: 'serves' }
    },
    
    // Order relationships
    {
      id: 'customer_places_orders',
      sourceId: 'customer',
      targetId: 'shipment_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '客户下达运输订单',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'places' }
    },
    
    {
      id: 'shipment_order_generates_trip',
      sourceId: 'shipment_order',
      targetId: 'trip',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '运输订单生成运输行程',
      visual: { style: 'solid', color: '#f59e0b', width: 3, label: 'generates' }
    },
    
    // Trip execution relationships
    {
      id: 'trip_assigns_driver',
      sourceId: 'trip',
      targetId: 'driver',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'uses',
      properties: { multiplicity: 'N:1', direction: 'unidirectional', weight: 1.0 },
      description: '行程分配司机',
      visual: { style: 'solid', color: '#8b5cf6', width: 2, label: 'assigns' }
    },
    
    {
      id: 'trip_uses_tractor',
      sourceId: 'trip',
      targetId: 'tractor',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'uses',
      properties: { multiplicity: 'N:1', direction: 'unidirectional', weight: 1.0 },
      description: '行程使用牵引车',
      visual: { style: 'solid', color: '#8b5cf6', width: 2, label: 'uses' }
    },
    
    {
      id: 'trip_handles_load',
      sourceId: 'trip',
      targetId: 'load_info',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'implements',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '行程处理货载',
      visual: { style: 'solid', color: '#84cc16', width: 2, label: 'handles' }
    },
    
    // Billing relationships
    {
      id: 'order_generates_invoice',
      sourceId: 'shipment_order',
      targetId: 'order_invoice',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '运输订单生成发票',
      visual: { style: 'solid', color: '#f97316', width: 3, label: 'generates' }
    },
    
    {
      id: 'trip_generates_ap',
      sourceId: 'trip',
      targetId: 'ap_payment',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '行程生成应付账款',
      visual: { style: 'solid', color: '#dc2626', width: 3, label: 'generates' }
    },
    
    // Rate and workflow relationships
    {
      id: 'order_uses_rate_type',
      sourceId: 'shipment_order',
      targetId: 'rate_type',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'depends_on',
      properties: { multiplicity: 'N:1', direction: 'unidirectional', weight: 0.8 },
      description: '运输订单依据费率类型计费',
      visual: { style: 'dashed', color: '#6b7280', width: 1, label: 'uses rate' }
    },
    
    {
      id: 'workflow_orchestrates_order',
      sourceId: 'workflow_instance',
      targetId: 'shipment_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'implements',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 0.9 },
      description: '工作流实例编排订单执行',
      visual: { style: 'dashed', color: '#7c3aed', width: 2, label: 'orchestrates' }
    },
    
    // Behavior relationships
    {
      id: 'create_order_produces_shipment',
      sourceId: 'createShipmentOrder',
      targetId: 'shipment_order',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '创建订单行为产生运输订单',
      visual: { style: 'solid', color: '#f59e0b', width: 3, label: 'creates' }
    },
    
    {
      id: 'dispatch_trip_creates_trip',
      sourceId: 'dispatchTrip',
      targetId: 'trip',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '调度行程行为创建行程',
      visual: { style: 'solid', color: '#8b5cf6', width: 3, label: 'creates' }
    },
    
    {
      id: 'execute_pickup_modifies_load',
      sourceId: 'executePickup',
      targetId: 'load_info',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '执行取货修改货载状态',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'modifies' }
    },
    
    {
      id: 'execute_delivery_completes_load',
      sourceId: 'executeDelivery',
      targetId: 'load_info',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '执行送货完成货载',
      visual: { style: 'solid', color: '#059669', width: 2, label: 'completes' }
    },
    
    {
      id: 'generate_invoice_creates_ar',
      sourceId: 'generateInvoice',
      targetId: 'order_invoice',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '生成发票行为创建应收账款',
      visual: { style: 'solid', color: '#f97316', width: 3, label: 'creates' }
    },
    
    {
      id: 'process_ap_creates_payment',
      sourceId: 'processAPPayment',
      targetId: 'ap_payment',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '处理AP行为创建应付账款',
      visual: { style: 'solid', color: '#dc2626', width: 3, label: 'creates' }
    },
    
    // Rule relationships
    {
      id: 'pro_unique_validates_order_creation',
      sourceId: 'pro_number_unique_rule',
      targetId: 'createShipmentOrder',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: 'PRO号唯一规则验证订单创建',
      visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'validates' }
    },
    
    {
      id: 'driver_hours_validates_dispatch',
      sourceId: 'driver_hours_rule',
      targetId: 'dispatchTrip',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '司机工时规则验证行程调度',
      visual: { style: 'dotted', color: '#ef4444', width: 1, label: 'validates' }
    },
    
    {
      id: 'vehicle_availability_validates_dispatch',
      sourceId: 'vehicle_availability_rule',
      targetId: 'dispatchTrip',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '车辆可用性规则验证行程调度',
      visual: { style: 'dotted', color: '#06b6d4', width: 1, label: 'validates' }
    },
    
    {
      id: 'credit_check_validates_order',
      sourceId: 'customer_credit_check_rule',
      targetId: 'createShipmentOrder',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '客户信用检查规则验证订单创建',
      visual: { style: 'dotted', color: '#10b981', width: 1, label: 'validates' }
    },
    
    // Scenario relationships
    {
      id: 'drayage_process_uses_create_order',
      sourceId: 'drayage_import_process',
      targetId: 'createShipmentOrder',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '拖车进口流程使用创建订单行为',
      visual: { style: 'solid', color: '#0ea5e9', width: 2, label: 'uses' }
    },
    
    {
      id: 'drayage_process_uses_dispatch',
      sourceId: 'drayage_import_process',
      targetId: 'dispatchTrip',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '拖车进口流程使用调度行程行为',
      visual: { style: 'solid', color: '#0ea5e9', width: 2, label: 'uses' }
    },
    
    {
      id: 'ltl_process_uses_pickup',
      sourceId: 'ltl_transport_process',
      targetId: 'executePickup',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: 'LTL运输流程使用执行取货行为',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'uses' }
    },
    
    {
      id: 'ltl_process_uses_delivery',
      sourceId: 'ltl_transport_process',
      targetId: 'executeDelivery',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: 'LTL运输流程使用执行送货行为',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'uses' }
    },
    
    {
      id: 'settlement_uses_calculate_rate',
      sourceId: 'settlement_process',
      targetId: 'calculateRate',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '结算流程使用计算费率行为',
      visual: { style: 'solid', color: '#6b7280', width: 2, label: 'uses' }
    },
    
    {
      id: 'settlement_uses_generate_invoice',
      sourceId: 'settlement_process',
      targetId: 'generateInvoice',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '结算流程使用生成发票行为',
      visual: { style: 'solid', color: '#6b7280', width: 2, label: 'uses' }
    },
    
    {
      id: 'settlement_uses_process_ap',
      sourceId: 'settlement_process',
      targetId: 'processAPPayment',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '结算流程使用处理AP付款行为',
      visual: { style: 'solid', color: '#6b7280', width: 2, label: 'uses' }
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
      ruleCount: 6,
      scenarioCount: 3,
      linkCount: 25,
      completenessScore: 90,
      consistencyScore: 93
    }
  }
};

// Export individual components for testing and development
export const FMS_OBJECTS = FMS_DOMAIN_BLUEPRINT.objects;
export const FMS_BEHAVIORS = FMS_DOMAIN_BLUEPRINT.behaviors;
export const FMS_RULES = FMS_DOMAIN_BLUEPRINT.rules;
export const FMS_SCENARIOS = FMS_DOMAIN_BLUEPRINT.scenarios;
export const FMS_LINKS = FMS_DOMAIN_BLUEPRINT.links;