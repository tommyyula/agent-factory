// Cross-Domain Semantic Links
// Semantic relationships between WMS, FMS, OMS, YMS, and BNP domains

import { OBRLink } from '@/shared/types/obr.types';

// Cross-Domain Link Collection
export const crossDomainLinks: OBRLink[] = [
  // WMS ↔ OMS: Order Fulfillment Chain
  {
    id: 'wms_inventory_fulfills_oms_orders',
    sourceId: 'inventory', // WMS
    targetId: 'sales_order', // OMS
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'consumes',
    properties: { 
      multiplicity: 'N:N', 
      direction: 'bidirectional', 
      weight: 0.95,
      constraints: ['inventory_availability', 'order_completeness'] 
    },
    description: 'WMS库存满足OMS销售订单需求',
    visual: { style: 'solid', color: '#059669', width: 3, label: 'fulfills' }
  },

  {
    id: 'oms_order_triggers_wms_picking',
    sourceId: 'sales_order', // OMS
    targetId: 'pick_task', // WMS
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'triggers',
    properties: { 
      multiplicity: '1:N', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['order_released', 'inventory_allocated'] 
    },
    description: 'OMS订单触发WMS拣选任务生成',
    visual: { style: 'solid', color: '#dc2626', width: 2, label: 'triggers picking' }
  },

  {
    id: 'wms_shipping_confirms_oms_dispatch',
    sourceId: 'executeShipping', // WMS
    targetId: 'dispatchOrder', // OMS
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'triggers',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85 
    },
    description: 'WMS发货执行触发OMS派发确认',
    visual: { style: 'solid', color: '#0891b2', width: 2, label: 'confirms dispatch' }
  },

  // WMS ↔ FMS: Freight Handoff Chain
  {
    id: 'wms_shipment_handoff_to_fms_order',
    sourceId: 'order', // WMS outbound order
    targetId: 'freight_order', // FMS
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'produces',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['shipment_ready', 'carrier_assigned'] 
    },
    description: 'WMS出库订单移交给FMS运输订单',
    visual: { style: 'solid', color: '#f97316', width: 3, label: 'handoff to freight' }
  },

  {
    id: 'wms_executeShipping_triggers_fms_dispatch',
    sourceId: 'executeShipping', // WMS
    targetId: 'dispatchFreight', // FMS
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'triggers',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.95 
    },
    description: 'WMS发货执行触发FMS运输调度',
    visual: { style: 'solid', color: '#6366f1', width: 3, label: 'triggers freight dispatch' }
  },

  {
    id: 'fms_delivery_updates_wms_shipment_status',
    sourceId: 'executeDelivery', // FMS
    targetId: 'order', // WMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'consumes',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.8 
    },
    description: 'FMS交付执行更新WMS发货状态',
    visual: { style: 'dashed', color: '#10b981', width: 2, label: 'updates delivery status' }
  },

  // FMS ↔ BNP: Cost Settlement Chain
  {
    id: 'fms_freight_order_generates_bnp_billing',
    sourceId: 'freight_order', // FMS
    targetId: 'invoice', // BNP
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'produces',
    properties: { 
      multiplicity: 'N:1', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['delivery_completed', 'billing_period_active'] 
    },
    description: 'FMS运输订单生成BNP费用发票',
    visual: { style: 'solid', color: '#8b5cf6', width: 3, label: 'generates billing' }
  },

  {
    id: 'fms_cost_calculation_feeds_bnp_billing',
    sourceId: 'calculateFreightCost', // FMS
    targetId: 'calculateShippingCost', // BNP
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'consumes',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85 
    },
    description: 'FMS运输成本计算为BNP账单计算提供数据',
    visual: { style: 'dotted', color: '#ec4899', width: 2, label: 'feeds cost data' }
  },

  {
    id: 'bnp_payment_settles_fms_billing',
    sourceId: 'processPayment', // BNP
    targetId: 'freight_order', // FMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'validates',
    properties: { 
      multiplicity: 'N:N', 
      direction: 'unidirectional', 
      weight: 0.8 
    },
    description: 'BNP付款处理结算FMS运输费用',
    visual: { style: 'solid', color: '#059669', width: 2, label: 'settles freight cost' }
  },

  // YMS ↔ WMS: Inbound Coordination Chain
  {
    id: 'yms_appointment_coordinates_wms_receipt',
    sourceId: 'appointment', // YMS
    targetId: 'appointment', // WMS
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'implements',
    properties: { 
      multiplicity: '1:1', 
      direction: 'bidirectional', 
      weight: 0.95,
      constraints: ['dock_availability', 'resource_coordination'] 
    },
    description: 'YMS预约协调WMS月台预约',
    visual: { style: 'solid', color: '#6366f1', width: 3, label: 'coordinates dock assignment' }
  },

  {
    id: 'yms_yard_management_supports_wms_inbound',
    sourceId: 'executeYardShuttle', // YMS
    targetId: 'assignDock', // WMS
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'precedes',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85 
    },
    description: 'YMS院内穿梭为WMS月台分配提供支持',
    visual: { style: 'solid', color: '#f59e0b', width: 2, label: 'supports inbound' }
  },

  {
    id: 'wms_dock_status_updates_yms_location',
    sourceId: 'assignDock', // WMS
    targetId: 'location', // YMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'uses',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.8 
    },
    description: 'WMS月台分配状态更新YMS位置信息',
    visual: { style: 'dashed', color: '#64748b', width: 2, label: 'updates yard location' }
  },

  // OMS ↔ WMS: Returns Processing Chain
  {
    id: 'oms_return_order_triggers_wms_rma',
    sourceId: 'return_order', // OMS
    targetId: 'receipt', // WMS (for returns)
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'triggers',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['return_authorized', 'rma_number_assigned'] 
    },
    description: 'OMS退货单触发WMS退货收货处理',
    visual: { style: 'solid', color: '#ef4444', width: 2, label: 'triggers RMA processing' }
  },

  {
    id: 'wms_rma_receipt_updates_oms_return_status',
    sourceId: 'executeReceiving', // WMS
    targetId: 'return_order', // OMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'consumes',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85 
    },
    description: 'WMS退货收货更新OMS退货订单状态',
    visual: { style: 'dashed', color: '#dc2626', width: 2, label: 'updates return status' }
  },

  // OMS ↔ BNP: Order Billing Chain
  {
    id: 'oms_sales_order_generates_bnp_invoice',
    sourceId: 'sales_order', // OMS
    targetId: 'invoice', // BNP
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'produces',
    properties: { 
      multiplicity: 'N:1', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['order_completed', 'billing_enabled'] 
    },
    description: 'OMS销售订单生成BNP计费发票',
    visual: { style: 'solid', color: '#059669', width: 3, label: 'generates invoice' }
  },

  {
    id: 'bnp_invoice_validates_oms_pricing',
    sourceId: 'generateInvoice', // BNP
    targetId: 'confirmOrder', // OMS
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'validates',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.8 
    },
    description: 'BNP发票生成验证OMS订单定价',
    visual: { style: 'dotted', color: '#8b5cf6', width: 1, label: 'validates pricing' }
  },

  // YMS ↔ FMS: Transportation Coordination
  {
    id: 'yms_gate_entry_coordinates_fms_arrival',
    sourceId: 'processGateEntry', // YMS
    targetId: 'freight_order', // FMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'validates',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85,
      constraints: ['carrier_verified', 'schedule_matched'] 
    },
    description: 'YMS门禁入场验证FMS运输订单到达',
    visual: { style: 'solid', color: '#0891b2', width: 2, label: 'validates arrival' }
  },

  {
    id: 'fms_route_optimization_considers_yms_capacity',
    sourceId: 'optimizeRoute', // FMS
    targetId: 'location', // YMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'uses',
    properties: { 
      multiplicity: '1:N', 
      direction: 'unidirectional', 
      weight: 0.75 
    },
    description: 'FMS路径优化考虑YMS院内容量',
    visual: { style: 'dashed', color: '#f97316', width: 2, label: 'considers capacity' }
  },

  // WMS ↔ BNP: Storage Billing Chain
  {
    id: 'wms_inventory_generates_bnp_storage_billing',
    sourceId: 'inventory', // WMS
    targetId: 'invoice_item', // BNP
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'produces',
    properties: { 
      multiplicity: 'N:N', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['inventory_active', 'billing_period_open'] 
    },
    description: 'WMS库存记录生成BNP存储费用行项',
    visual: { style: 'solid', color: '#8b5cf6', width: 3, label: 'generates storage billing' }
  },

  {
    id: 'bnp_storage_cost_validates_wms_putaway_logic',
    sourceId: 'calculateStorageCost', // BNP
    targetId: 'executePutaway', // WMS
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'validates',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.75 
    },
    description: 'BNP存储成本计算验证WMS上架逻辑',
    visual: { style: 'dotted', color: '#ec4899', width: 1, label: 'validates putaway logic' }
  },

  // Cross-Domain Workflow Integration
  {
    id: 'end_to_end_order_fulfillment_process',
    sourceId: 'order_management', // OMS scenario
    targetId: 'outbound_process', // WMS scenario
    sourceType: 'scenario',
    targetType: 'scenario',
    relationshipType: 'precedes',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.95,
      constraints: ['order_confirmed', 'inventory_available'] 
    },
    description: '端到端订单履行：OMS订单管理触发WMS出库流程',
    visual: { style: 'solid', color: '#6366f1', width: 4, label: 'end-to-end fulfillment' }
  },

  {
    id: 'integrated_freight_and_billing_workflow',
    sourceId: 'freight_dispatch', // FMS scenario
    targetId: 'invoice_generation', // BNP scenario
    sourceType: 'scenario',
    targetType: 'scenario',
    relationshipType: 'triggers',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.9,
      constraints: ['delivery_completed', 'cost_data_available'] 
    },
    description: '一体化运输计费：FMS货运调度触发BNP发票生成',
    visual: { style: 'solid', color: '#059669', width: 3, label: 'integrated billing' }
  },

  // Cross-Domain Rule Dependencies
  {
    id: 'inventory_availability_supports_order_validation',
    sourceId: 'inventory_availability_rule', // WMS
    targetId: 'order_completeness_rule', // OMS
    sourceType: 'rule',
    targetType: 'rule',
    relationshipType: 'validates',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.85 
    },
    description: 'WMS库存可用性规则支持OMS订单完整性验证',
    visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'supports validation' }
  },

  {
    id: 'dock_availability_coordinates_with_yard_capacity',
    sourceId: 'dock_availability_rule', // WMS
    targetId: 'yard_capacity_rule', // YMS
    sourceType: 'rule',
    targetType: 'rule',
    relationshipType: 'depends_on',
    properties: { 
      multiplicity: '1:1', 
      direction: 'unidirectional', 
      weight: 0.8 
    },
    description: 'WMS月台可用性依赖YMS院内容量规则',
    visual: { style: 'dotted', color: '#f59e0b', width: 1, label: 'depends on capacity' }
  },

  // Integration Points for Future Extensions
  {
    id: 'cross_domain_data_sync_integration',
    sourceId: 'syncInventoryData', // OMS
    targetId: 'inventory', // WMS
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'consumes',
    properties: { 
      multiplicity: '1:N', 
      direction: 'bidirectional', 
      weight: 0.75,
      constraints: ['real_time_sync', 'data_consistency'] 
    },
    description: '跨域数据同步：OMS-WMS库存数据实时同步',
    visual: { style: 'dashed', color: '#64748b', width: 2, label: 'cross-domain sync' }
  }
];

export default crossDomainLinks;