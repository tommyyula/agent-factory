import { OntologyDomain, Concept, Relation } from '../shared/types/ontology.types';

// 6 个物流行业知识域
export const mockOntologies: OntologyDomain[] = [
  {
    id: 'wms-001',
    name: 'warehouse-management-system',
    displayName: 'WMS - 仓库管理系统',
    description: '仓库管理系统知识域，包含入库、出库、盘点、库存管理等核心概念',
    industry: 'WMS',
    status: 'active',
    version: '2.1.0',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
    metadata: {
      conceptCount: 45,
      relationCount: 120,
      cqCoverage: 92,
      completeness: 88
    }
  },
  {
    id: 'tms-001',
    name: 'transport-management-system',
    displayName: 'TMS - 运输管理系统',
    description: '运输管理系统知识域，包含配送、路径优化、车辆调度等核心概念',
    industry: 'TMS',
    status: 'active',
    version: '1.8.2',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-12'),
    metadata: {
      conceptCount: 38,
      relationCount: 95,
      cqCoverage: 85,
      completeness: 82
    }
  },
  {
    id: 'fms-001',
    name: 'fleet-management-system',
    displayName: 'FMS - 车队管理系统',
    description: '车队管理系统知识域，包含车辆管理、司机管理、维修保养等概念',
    industry: 'FMS',
    status: 'active',
    version: '1.5.1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-08'),
    metadata: {
      conceptCount: 32,
      relationCount: 78,
      cqCoverage: 78,
      completeness: 75
    }
  },
  {
    id: 'hrm-001',
    name: 'human-resource-management',
    displayName: 'HRM - 人力资源管理',
    description: '人力资源管理知识域，包含员工管理、绩效考核、薪资管理等概念',
    industry: 'HRM',
    status: 'development',
    version: '0.9.0',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-14'),
    metadata: {
      conceptCount: 28,
      relationCount: 65,
      cqCoverage: 65,
      completeness: 60
    }
  },
  {
    id: 'yms-001',
    name: 'yard-management-system',
    displayName: 'YMS - 堆场管理系统',
    description: '堆场管理系统知识域，包含堆场规划、设备管理、作业调度等概念',
    industry: 'YMS',
    status: 'active',
    version: '1.2.3',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-05'),
    metadata: {
      conceptCount: 35,
      relationCount: 88,
      cqCoverage: 80,
      completeness: 77
    }
  },
  {
    id: 'oms-001',
    name: 'order-management-system',
    displayName: 'OMS - 订单管理系统',
    description: '订单管理系统知识域，包含订单处理、库存分配、配送安排等概念',
    industry: 'OMS',
    status: 'active',
    version: '2.0.1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-11'),
    metadata: {
      conceptCount: 42,
      relationCount: 115,
      cqCoverage: 90,
      completeness: 86
    }
  }
];

// WMS 概念示例
export const wmsConcepts: Concept[] = [
  {
    id: 'wms-c-001',
    ontologyId: 'wms-001',
    name: 'warehouse',
    displayName: '仓库',
    description: '存储货物的物理场所',
    type: 'entity',
    properties: {
      area: 'number',
      capacity: 'number',
      location: 'string'
    },
    relations: [],
    position: { x: 100, y: 50 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'wms-c-002',
    ontologyId: 'wms-001',
    name: 'inventory_item',
    displayName: '库存商品',
    description: '仓库中存储的具体商品',
    type: 'entity',
    properties: {
      sku: 'string',
      quantity: 'number',
      location: 'string'
    },
    relations: [],
    position: { x: 300, y: 100 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'wms-c-003',
    ontologyId: 'wms-001',
    name: 'inbound_operation',
    displayName: '入库作业',
    description: '货物入库的操作流程',
    type: 'event',
    properties: {
      operationType: 'string',
      timestamp: 'datetime',
      operator: 'string'
    },
    relations: [],
    position: { x: 150, y: 200 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'wms-c-004',
    ontologyId: 'wms-001',
    name: 'outbound_operation',
    displayName: '出库作业',
    description: '货物出库的操作流程',
    type: 'event',
    properties: {
      operationType: 'string',
      timestamp: 'datetime',
      operator: 'string'
    },
    relations: [],
    position: { x: 350, y: 200 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'wms-c-005',
    ontologyId: 'wms-001',
    name: 'storage_location',
    displayName: '存储位置',
    description: '仓库内的具体存储位置',
    type: 'entity',
    properties: {
      zone: 'string',
      aisle: 'string',
      shelf: 'string',
      level: 'number'
    },
    relations: [],
    position: { x: 200, y: 300 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// 概念关系示例
export const wmsRelations: Relation[] = [
  {
    id: 'wms-r-001',
    sourceId: 'wms-c-001', // warehouse
    targetId: 'wms-c-005', // storage_location
    type: 'has_part',
    name: 'contains',
    description: '仓库包含存储位置',
    properties: {},
    weight: 0.9
  },
  {
    id: 'wms-r-002',
    sourceId: 'wms-c-002', // inventory_item
    targetId: 'wms-c-005', // storage_location
    type: 'related_to',
    name: 'stored_at',
    description: '库存商品存储在位置',
    properties: {},
    weight: 0.8
  },
  {
    id: 'wms-r-003',
    sourceId: 'wms-c-003', // inbound_operation
    targetId: 'wms-c-002', // inventory_item
    type: 'related_to',
    name: 'processes',
    description: '入库作业处理库存商品',
    properties: {},
    weight: 0.7
  },
  {
    id: 'wms-r-004',
    sourceId: 'wms-c-004', // outbound_operation
    targetId: 'wms-c-002', // inventory_item
    type: 'related_to',
    name: 'processes',
    description: '出库作业处理库存商品',
    properties: {},
    weight: 0.7
  }
];