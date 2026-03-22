// Simplified agency agents data structure to avoid type conflicts
// Generated from unis-agency-agents project

export interface SimpleAgencyAgent {
  id: string;
  name: string;
  description: string;
  domain: 'wms' | 'oms' | 'fms' | 'bnp' | 'yms' | 'enterprise';
  department: string;
  role: string;
  capabilities: string[];
  status: 'active' | 'inactive';
}

export const simpleAgencyAgents: SimpleAgencyAgent[] = [
  // BNP Domain (19 agents)
  { id: 'bnp-bank-reconciler', name: 'Bank Reconciler Agent', description: '💰 Bank transaction reconciliation and matching', domain: 'bnp', department: 'bank', role: 'reconciler', capabilities: ['Bank reconciliation', 'Transaction matching', 'Report generation'], status: 'active' },
  { id: 'bnp-billing-calculator', name: 'Billing Calculator Agent', description: '💰 Automated billing calculation and processing', domain: 'bnp', department: 'billing', role: 'calculator', capabilities: ['Rate calculation', 'Fee computation', 'Billing automation'], status: 'active' },
  { id: 'bnp-bookkeeping-accountant', name: 'GL Accountant Agent', description: '📊 General ledger management and accounting', domain: 'bnp', department: 'bookkeeping', role: 'accountant', capabilities: ['GL posting', 'Journal entries', 'Financial reports'], status: 'active' },
  { id: 'bnp-claim-handler', name: 'Claim Handler Agent', description: '📋 Insurance and freight claim processing', domain: 'bnp', department: 'claim', role: 'handler', capabilities: ['Claim processing', 'Documentation', 'Settlement'], status: 'active' },
  { id: 'bnp-commission-calculator', name: 'Commission Calculator Agent', description: '💰 Sales commission calculation and tracking', domain: 'bnp', department: 'commission', role: 'calculator', capabilities: ['Commission calculation', 'Tracking', 'Reporting'], status: 'active' },
  { id: 'bnp-contract-rate-operator', name: 'Rate Engine Operator Agent', description: '⚙️ Contract rate management and optimization', domain: 'bnp', department: 'contract', role: 'operator', capabilities: ['Rate management', 'Contract processing', 'Optimization'], status: 'active' },
  { id: 'bnp-debt-collection-agent', name: 'Collection Agent Agent', description: '📞 Debt collection and recovery management', domain: 'bnp', department: 'debt-collection', role: 'agent', capabilities: ['Debt collection', 'Recovery', 'Communication'], status: 'active' },
  { id: 'bnp-debt-credit-warning', name: 'Credit Warning Agent Agent', description: '⚠️ Credit risk monitoring and alerts', domain: 'bnp', department: 'debt-collection', role: 'warning', capabilities: ['Credit monitoring', 'Risk assessment', 'Alerts'], status: 'active' },
  { id: 'bnp-integration-data-sync', name: 'Data Sync Agent Agent', description: '🔄 Cross-system data integration and synchronization', domain: 'bnp', department: 'integration', role: 'sync', capabilities: ['Data sync', 'Integration', 'ETL'], status: 'active' },
  { id: 'bnp-invoice-generator', name: 'Invoice Generator Agent', description: '📄 Automated invoice generation and distribution', domain: 'bnp', department: 'invoice', role: 'generator', capabilities: ['Invoice generation', 'Distribution', 'Automation'], status: 'active' },
  { id: 'bnp-invoice-merger', name: 'Invoice Merger Agent', description: '🔗 Multiple invoice consolidation and merging', domain: 'bnp', department: 'invoice', role: 'merger', capabilities: ['Invoice merging', 'Consolidation', 'Processing'], status: 'active' },
  { id: 'bnp-invoice-sender', name: 'Invoice Sender Agent', description: '📧 Invoice delivery and communication management', domain: 'bnp', department: 'invoice', role: 'sender', capabilities: ['Invoice delivery', 'Communication', 'Tracking'], status: 'active' },
  { id: 'bnp-invoice-preview-converter', name: 'Preview Converter Agent', description: '🔄 Invoice format conversion and preview', domain: 'bnp', department: 'invoice', role: 'converter', capabilities: ['Format conversion', 'Preview generation', 'Processing'], status: 'active' },
  { id: 'bnp-lso-agent', name: 'LSO Agent Agent', description: '🚛 Logistics service optimization and management', domain: 'bnp', department: 'lso', role: 'agent', capabilities: ['LSO management', 'Optimization', 'Service delivery'], status: 'active' },
  { id: 'bnp-orchestrator', name: 'BNP Orchestrator Agent', description: '🎮 Bill and Pay domain orchestration', domain: 'bnp', department: 'orchestrator', role: 'orchestrator', capabilities: ['Domain orchestration', 'Process coordination', 'Workflow management'], status: 'active' },
  { id: 'bnp-payment-deduction', name: 'Deduction Agent Agent', description: '💸 Payment deduction processing and management', domain: 'bnp', department: 'payment', role: 'deduction', capabilities: ['Payment deduction', 'Processing', 'Management'], status: 'active' },
  { id: 'bnp-payment-collector', name: 'Payment Collector Agent', description: '💰 Payment collection and processing', domain: 'bnp', department: 'payment', role: 'collector', capabilities: ['Payment collection', 'Processing', 'Tracking'], status: 'active' },
  { id: 'bnp-small-parcel-reconciler', name: 'Small Parcel Reconciler Agent', description: '📦 Small parcel billing reconciliation', domain: 'bnp', department: 'small-parcel', role: 'reconciler', capabilities: ['Parcel reconciliation', 'Billing', 'Processing'], status: 'active' },
  { id: 'bnp-vendor-bill-agent', name: 'Vendor Bill Agent Agent', description: '📋 Vendor billing and payment processing', domain: 'bnp', department: 'vendor-bill', role: 'agent', capabilities: ['Vendor billing', 'Payment processing', 'Management'], status: 'active' },
  
  // Enterprise Domain (2 agents)
  { id: 'enterprise-bi-analyst', name: 'Enterprise BI Analyst', description: '📊 Enterprise business intelligence and analytics', domain: 'enterprise', department: 'bi', role: 'analyst', capabilities: ['Business intelligence', 'Analytics', 'Reporting'], status: 'active' },
  { id: 'enterprise-orchestrator', name: 'Enterprise Orchestrator Agent', description: '🎮 Global enterprise process orchestration', domain: 'enterprise', department: 'orchestrator', role: 'orchestrator', capabilities: ['Enterprise orchestration', 'Global coordination', 'Process management'], status: 'active' },
  
  // FMS Domain (22 agents) - Adding representative samples
  { id: 'fms-analytics-operations', name: 'Operations Analyst Agent', description: '📈 Freight operations analysis and optimization', domain: 'fms', department: 'analytics', role: 'analyst', capabilities: ['Operations analysis', 'Performance monitoring', 'Optimization'], status: 'active' },
  { id: 'fms-billing-ap-clerk', name: 'AP Clerk Agent', description: '💰 Accounts payable processing', domain: 'fms', department: 'billing', role: 'clerk', capabilities: ['AP processing', 'Invoice processing', 'Payment management'], status: 'active' },
  { id: 'fms-billing-ar-clerk', name: 'AR Clerk Agent', description: '💰 Accounts receivable processing', domain: 'fms', department: 'billing', role: 'clerk', capabilities: ['AR processing', 'Collections', 'Customer billing'], status: 'active' },
  { id: 'fms-dispatch-dispatcher', name: 'Dispatcher Agent', description: '🚛 Load dispatching and coordination', domain: 'fms', department: 'dispatch', role: 'dispatcher', capabilities: ['Load dispatching', 'Driver coordination', 'Route optimization'], status: 'active' },
  { id: 'fms-orchestrator', name: 'FMS Orchestrator Agent', description: '🎮 Freight Management System orchestration', domain: 'fms', department: 'orchestrator', role: 'orchestrator', capabilities: ['FMS orchestration', 'Process coordination', 'Workflow management'], status: 'active' },
  
  // OMS Domain (22 agents) - Adding representative samples
  { id: 'oms-analytics-order-analyst', name: 'Order Analyst Agent', description: '📊 Order analytics and performance monitoring', domain: 'oms', department: 'analytics', role: 'analyst', capabilities: ['Order analysis', 'Performance monitoring', 'Reporting'], status: 'active' },
  { id: 'oms-foundation-carrier-manager', name: 'Carrier Manager Agent', description: '🚛 Carrier relationship and management', domain: 'oms', department: 'foundation', role: 'manager', capabilities: ['Carrier management', 'Relationship management', 'Performance tracking'], status: 'active' },
  { id: 'oms-fulfillment-tracker', name: 'Fulfillment Tracker Agent', description: '📦 Order fulfillment tracking and monitoring', domain: 'oms', department: 'fulfillment', role: 'tracker', capabilities: ['Fulfillment tracking', 'Status monitoring', 'Performance analysis'], status: 'active' },
  { id: 'oms-orchestrator', name: 'OMS Orchestrator Agent', description: '🎮 Order Management System orchestration', domain: 'oms', department: 'orchestrator', role: 'orchestrator', capabilities: ['OMS orchestration', 'Process coordination', 'Workflow management'], status: 'active' },
  { id: 'oms-sales-order-processor', name: 'Order Processor Agent', description: '📋 Sales order processing and management', domain: 'oms', department: 'sales-order', role: 'processor', capabilities: ['Order processing', 'Validation', 'Management'], status: 'active' },
  
  // WMS Domain (28 agents) - Adding representative samples
  { id: 'wms-analytics-inventory-analyst', name: 'Inventory Analyst', description: '📈 Warehouse inventory analysis and optimization', domain: 'wms', department: 'analytics', role: 'analyst', capabilities: ['Inventory analysis', 'Optimization', 'Reporting'], status: 'active' },
  { id: 'wms-foundation-customer-manager', name: 'Customer Manager Agent', description: '👤 Customer data and relationship management', domain: 'wms', department: 'foundation', role: 'manager', capabilities: ['Customer management', 'Data management', 'Relationship tracking'], status: 'active' },
  { id: 'wms-inbound-dock-coordinator', name: 'Dock Coordinator Agent', description: '🚛 Inbound dock scheduling and coordination', domain: 'wms', department: 'inbound', role: 'coordinator', capabilities: ['Dock coordination', 'Scheduling', 'Resource management'], status: 'active' },
  { id: 'wms-inventory-controller', name: 'Inventory Controller Agent', description: '📦 Inventory control and management', domain: 'wms', department: 'inventory', role: 'controller', capabilities: ['Inventory control', 'Stock management', 'Optimization'], status: 'active' },
  { id: 'wms-orchestrator', name: 'WMS Orchestrator Agent', description: '🎮 Warehouse Management System orchestration', domain: 'wms', department: 'orchestrator', role: 'orchestrator', capabilities: ['WMS orchestration', 'Process coordination', 'Workflow management'], status: 'active' },
  { id: 'wms-outbound-pick-operator', name: 'Pick Operator Agent', description: '📦 Order picking operations and optimization', domain: 'wms', department: 'outbound', role: 'operator', capabilities: ['Pick operations', 'Order fulfillment', 'Optimization'], status: 'active' },
  
  // YMS Domain (6 agents)
  { id: 'yms-analytics-yard-analyst', name: 'Yard Analyst Agent', description: '📊 Yard operations analysis and optimization', domain: 'yms', department: 'analytics', role: 'analyst', capabilities: ['Yard analysis', 'Operations optimization', 'Performance monitoring'], status: 'active' },
  { id: 'yms-appointment-approver', name: 'Appointment Approver', description: '✅ Yard appointment approval and scheduling', domain: 'yms', department: 'appointment', role: 'approver', capabilities: ['Appointment approval', 'Scheduling', 'Resource allocation'], status: 'active' },
  { id: 'yms-appointment-scheduler', name: 'Appointment Scheduler', description: '📅 Yard appointment scheduling and management', domain: 'yms', department: 'appointment', role: 'scheduler', capabilities: ['Appointment scheduling', 'Time management', 'Resource coordination'], status: 'active' },
  { id: 'yms-carrier-portal-liaison', name: 'Carrier Portal Liaison', description: '🤝 Carrier portal management and communication', domain: 'yms', department: 'carrier-portal', role: 'liaison', capabilities: ['Carrier communication', 'Portal management', 'Relationship coordination'], status: 'active' },
  { id: 'yms-gate-checkin-operator', name: 'Check-in Operator', description: '🚪 Vehicle gate check-in processing', domain: 'yms', department: 'gate-operations', role: 'operator', capabilities: ['Gate check-in', 'Vehicle processing', 'Documentation'], status: 'active' },
  { id: 'yms-gate-checkout-operator', name: 'Check-out Operator', description: '🚪 Vehicle gate check-out processing', domain: 'yms', department: 'gate-operations', role: 'operator', capabilities: ['Gate check-out', 'Vehicle processing', 'Documentation'], status: 'active' },
];

export const agencyStats = {
  total: simpleAgencyAgents.length,
  domains: {
    bnp: simpleAgencyAgents.filter(a => a.domain === 'bnp').length,
    enterprise: simpleAgencyAgents.filter(a => a.domain === 'enterprise').length,
    fms: simpleAgencyAgents.filter(a => a.domain === 'fms').length,
    oms: simpleAgencyAgents.filter(a => a.domain === 'oms').length,
    wms: simpleAgencyAgents.filter(a => a.domain === 'wms').length,
    yms: simpleAgencyAgents.filter(a => a.domain === 'yms').length
  }
};

export const AGENCY_DOMAINS = {
  bnp: { name: 'BNP', color: '#F59E0B', count: agencyStats.domains.bnp },
  enterprise: { name: 'Enterprise', color: '#EF4444', count: agencyStats.domains.enterprise },
  fms: { name: 'FMS', color: '#F59E0B', count: agencyStats.domains.fms },
  oms: { name: 'OMS', color: '#10B981', count: agencyStats.domains.oms },
  wms: { name: 'WMS', color: '#3B82F6', count: agencyStats.domains.wms },
  yms: { name: 'YMS', color: '#8B5CF6', count: agencyStats.domains.yms }
};