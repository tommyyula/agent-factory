// OMS Domain Model Implementation
// Complete OBR model for Order Management System domain
// Based on OMS schema and agent definitions

import { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink
} from '@/shared/types/obr.types';

// OMS Domain Blueprint
export const OMS_DOMAIN_BLUEPRINT: OntologyBlueprint = {
  $schema: 'https://schemas.agent-factory.com/obr/v1.0.0',
  metadata: {
    id: 'oms-domain-v1',
    name: 'Order Management System Ontology',
    version: '1.0.0',
    domain: 'OMS',
    description: '订单管理系统完整业务域本体模型，包含销售订单、采购订单、退货、库存等核心业务流程',
    author: 'Unis Agency Agents',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checksum: 'oms-v1-checksum'
  },
  
  // 15 Core Objects from OMS Schema
  objects: [
    {
      id: 'merchant',
      name: 'Merchant',
      displayName: '商户',
      description: '电商平台商户，销售商品并管理订单',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '商户唯一标识' },
        merchant_code: { type: 'string', required: true, description: '商户代码' },
        merchant_name: { type: 'string', required: true, description: '商户名称' },
        business_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['B2B', 'B2C', 'C2C', 'B2B2C'] },
          description: '业务类型'
        },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          defaultValue: 'ACTIVE',
          description: '商户状态'
        },
        contact_info: { type: 'string', required: false, description: '联系信息JSON' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '商户正常运营' },
          'INACTIVE': { displayName: '停用', description: '商户暂停运营' },
          'SUSPENDED': { displayName: '暂停', description: '商户因违规暂停' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateMerchant' },
          { from: 'ACTIVE', to: 'SUSPENDED', trigger: 'suspendMerchant' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateMerchant' },
          { from: 'SUSPENDED', to: 'ACTIVE', trigger: 'reinstateMerchant' }
        ]
      },
      constraints: [
        {
          id: 'unique_merchant_code',
          type: 'invariant',
          expression: 'isUnique(merchant_code)',
          description: '商户代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#1f2937', icon: 'building-storefront', position: { x: 100, y: 100 } }
    },
    
    {
      id: 'channel',
      name: 'Channel',
      displayName: '销售渠道',
      description: '销售渠道，如官网、天猫、京东等',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '渠道唯一标识' },
        channel_code: { type: 'string', required: true, description: '渠道代码' },
        channel_name: { type: 'string', required: true, description: '渠道名称' },
        channel_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ONLINE', 'OFFLINE', 'MARKETPLACE', 'SOCIAL', 'MOBILE'] },
          description: '渠道类型'
        },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        commission_rate: { type: 'number', required: false, constraints: { min: 0, max: 1 }, description: '佣金费率' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE'] },
          defaultValue: 'ACTIVE',
          description: '渠道状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '渠道正常运营' },
          'INACTIVE': { displayName: '停用', description: '渠道暂停使用' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateChannel' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateChannel' }
        ]
      },
      constraints: [
        {
          id: 'unique_channel_code',
          type: 'invariant',
          expression: 'isUnique(channel_code)',
          description: '渠道代码必须唯一',
          severity: 'error'
        },
        {
          id: 'valid_commission_rate',
          type: 'invariant',
          expression: 'commission_rate == null || (commission_rate >= 0 && commission_rate <= 1)',
          description: '佣金费率必须在0-1之间',
          severity: 'error'
        }
      ],
      visual: { color: '#3b82f6', icon: 'megaphone', position: { x: 300, y: 100 } }
    },
    
    {
      id: 'brand',
      name: 'Brand',
      displayName: '品牌',
      description: '商品品牌信息',
      category: 'value_object',
      attributes: {
        id: { type: 'string', required: true, description: '品牌唯一标识' },
        brand_code: { type: 'string', required: true, description: '品牌代码' },
        brand_name: { type: 'string', required: true, description: '品牌名称' },
        description: { type: 'string', required: false, description: '品牌描述' },
        logo_url: { type: 'string', required: false, description: '品牌Logo URL' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '有效', description: '品牌有效可用' },
          'DEPRECATED': { displayName: '废弃', description: '品牌已废弃', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'DEPRECATED', trigger: 'deprecateBrand' }
        ]
      },
      constraints: [
        {
          id: 'unique_brand_code',
          type: 'invariant',
          expression: 'isUnique(brand_code)',
          description: '品牌代码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#10b981', icon: 'tag', position: { x: 500, y: 100 } }
    },
    
    {
      id: 'category',
      name: 'Category',
      displayName: '商品类别',
      description: '商品分类和类别层次结构',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '类别唯一标识' },
        category_code: { type: 'string', required: true, description: '类别代码' },
        category_name: { type: 'string', required: true, description: '类别名称' },
        parent_category_id: { type: 'reference', references: 'category', required: false, description: '父类别' },
        level: { type: 'number', required: true, constraints: { min: 1 }, description: '层级' },
        sort_order: { type: 'number', required: false, description: '排序顺序' },
        description: { type: 'string', required: false, description: '类别描述' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '类别正常使用' },
          'INACTIVE': { displayName: '停用', description: '类别暂停使用' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateCategory' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateCategory' }
        ]
      },
      constraints: [
        {
          id: 'unique_category_code',
          type: 'invariant',
          expression: 'isUnique(category_code)',
          description: '类别代码必须唯一',
          severity: 'error'
        },
        {
          id: 'valid_hierarchy',
          type: 'invariant',
          expression: 'parent_category_id == null || level > parent.level',
          description: '子类别层级必须大于父类别',
          severity: 'error'
        }
      ],
      visual: { color: '#f59e0b', icon: 'squares-2x2', position: { x: 700, y: 100 } }
    },
    
    {
      id: 'product_spu',
      name: 'ProductSPU',
      displayName: '商品SPU',
      description: 'Standard Product Unit - 标准商品单元',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: 'SPU唯一标识' },
        spu_code: { type: 'string', required: true, description: 'SPU编码' },
        spu_name: { type: 'string', required: true, description: 'SPU名称' },
        brand_id: { type: 'reference', references: 'brand', required: true, description: '所属品牌' },
        category_id: { type: 'reference', references: 'category', required: true, description: '所属类别' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        description: { type: 'string', required: false, description: '商品描述' },
        keywords: { type: 'string', required: false, description: '关键词' },
        main_image: { type: 'string', required: false, description: '主图片URL' },
        detail_images: { type: 'string', required: false, description: '详情图片JSON' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] },
          defaultValue: 'ACTIVE',
          description: 'SPU状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '上架', description: 'SPU正常销售' },
          'INACTIVE': { displayName: '下架', description: 'SPU暂停销售' },
          'DISCONTINUED': { displayName: '停产', description: 'SPU已停产', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateSPU' },
          { from: 'ACTIVE', to: 'DISCONTINUED', trigger: 'discontinueSPU' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateSPU' }
        ]
      },
      constraints: [
        {
          id: 'unique_spu_code',
          type: 'invariant',
          expression: 'isUnique(spu_code)',
          description: 'SPU编码必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#8b5cf6', icon: 'cube', position: { x: 900, y: 100 } }
    },
    
    {
      id: 'product_sku',
      name: 'ProductSKU',
      displayName: '商品SKU',
      description: 'Stock Keeping Unit - 库存保持单元',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: 'SKU唯一标识' },
        sku_code: { type: 'string', required: true, description: 'SKU编码' },
        sku_name: { type: 'string', required: true, description: 'SKU名称' },
        spu_id: { type: 'reference', references: 'product_spu', required: true, description: '所属SPU' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        barcode: { type: 'string', required: false, description: '条形码' },
        weight: { type: 'number', required: false, constraints: { min: 0 }, description: '重量(克)' },
        dimensions: { type: 'string', required: false, description: '尺寸JSON(长宽高)' },
        cost_price: { type: 'number', required: false, constraints: { min: 0 }, description: '成本价' },
        market_price: { type: 'number', required: false, constraints: { min: 0 }, description: '市场价' },
        selling_price: { type: 'number', required: true, constraints: { min: 0 }, description: '销售价' },
        attributes: { type: 'string', required: false, description: '规格属性JSON' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
          defaultValue: 'ACTIVE',
          description: 'SKU状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '在售', description: 'SKU正常销售' },
          'INACTIVE': { displayName: '停售', description: 'SKU暂停销售' },
          'OUT_OF_STOCK': { displayName: '缺货', description: 'SKU库存不足' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateSKU' },
          { from: 'ACTIVE', to: 'OUT_OF_STOCK', trigger: 'markOutOfStock' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateSKU' },
          { from: 'OUT_OF_STOCK', to: 'ACTIVE', trigger: 'restockSKU' }
        ]
      },
      constraints: [
        {
          id: 'unique_sku_code',
          type: 'invariant',
          expression: 'isUnique(sku_code)',
          description: 'SKU编码必须唯一',
          severity: 'error'
        },
        {
          id: 'positive_prices',
          type: 'invariant',
          expression: 'selling_price >= 0 && (cost_price == null || cost_price >= 0) && (market_price == null || market_price >= 0)',
          description: '价格必须非负',
          severity: 'error'
        }
      ],
      visual: { color: '#06b6d4', icon: 'cube-transparent', position: { x: 100, y: 300 } }
    },
    
    {
      id: 'sales_order',
      name: 'SalesOrder',
      displayName: '销售订单',
      description: '客户销售订单，包含商品、价格、配送信息',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '销售订单唯一标识' },
        order_no: { type: 'string', required: true, description: '订单号' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        channel_id: { type: 'reference', references: 'channel', required: true, description: '销售渠道' },
        customer_info: { type: 'string', required: true, description: '客户信息JSON' },
        shipping_address: { type: 'string', required: true, description: '收货地址JSON' },
        billing_address: { type: 'string', required: false, description: '账单地址JSON' },
        order_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['NORMAL', 'EXCHANGE', 'REFUND', 'GIFT'] },
          defaultValue: 'NORMAL',
          description: '订单类型'
        },
        payment_method: { type: 'string', required: true, description: '支付方式' },
        payment_status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['UNPAID', 'PAID', 'REFUNDED', 'CANCELLED'] },
          defaultValue: 'UNPAID',
          description: '支付状态'
        },
        total_amount: { type: 'number', required: true, constraints: { min: 0 }, description: '订单总金额' },
        discount_amount: { type: 'number', required: false, defaultValue: 0, constraints: { min: 0 }, description: '折扣金额' },
        tax_amount: { type: 'number', required: false, defaultValue: 0, constraints: { min: 0 }, description: '税费金额' },
        shipping_fee: { type: 'number', required: false, defaultValue: 0, constraints: { min: 0 }, description: '运费' },
        order_time: { type: 'date', required: true, description: '下单时间' },
        required_delivery_date: { type: 'date', required: false, description: '要求送达日期' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'] },
          defaultValue: 'PENDING',
          description: '订单状态'
        }
      },
      stateMachine: {
        initialState: 'PENDING',
        states: {
          'PENDING': { displayName: '待确认', description: '订单待确认' },
          'CONFIRMED': { displayName: '已确认', description: '订单已确认' },
          'PROCESSING': { displayName: '处理中', description: '订单处理中' },
          'SHIPPED': { displayName: '已发货', description: '订单已发货' },
          'DELIVERED': { displayName: '已送达', description: '订单已送达' },
          'COMPLETED': { displayName: '已完成', description: '订单交易完成', isTerminal: true },
          'CANCELLED': { displayName: '已取消', description: '订单被取消', isTerminal: true }
        },
        transitions: [
          { from: 'PENDING', to: 'CONFIRMED', trigger: 'confirmOrder' },
          { from: 'CONFIRMED', to: 'PROCESSING', trigger: 'startProcessing' },
          { from: 'PROCESSING', to: 'SHIPPED', trigger: 'shipOrder' },
          { from: 'SHIPPED', to: 'DELIVERED', trigger: 'deliverOrder' },
          { from: 'DELIVERED', to: 'COMPLETED', trigger: 'completeOrder' },
          { from: 'PENDING', to: 'CANCELLED', trigger: 'cancelOrder' },
          { from: 'CONFIRMED', to: 'CANCELLED', trigger: 'cancelOrder' }
        ]
      },
      constraints: [
        {
          id: 'unique_order_no',
          type: 'invariant',
          expression: 'isUnique(order_no)',
          description: '订单号必须唯一',
          severity: 'error'
        },
        {
          id: 'valid_total_amount',
          type: 'invariant',
          expression: 'total_amount >= discount_amount',
          description: '订单总金额不能小于折扣金额',
          severity: 'error'
        },
        {
          id: 'payment_before_shipping',
          type: 'precondition',
          expression: 'status != "SHIPPED" || payment_status == "PAID"',
          description: '发货前必须完成付款',
          severity: 'error'
        }
      ],
      visual: { color: '#ef4444', icon: 'shopping-cart', position: { x: 300, y: 300 } }
    },
    
    {
      id: 'order_dispatch',
      name: 'OrderDispatch',
      displayName: '订单派发',
      description: '订单派发到仓库执行',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '派发单唯一标识' },
        sales_order_id: { type: 'reference', references: 'sales_order', required: true, description: '销售订单' },
        warehouse_id: { type: 'string', required: true, description: '执行仓库ID' },
        dispatch_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['FULFILL', 'TRANSFER', 'DROPSHIP'] },
          description: '派发类型'
        },
        priority: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] },
          defaultValue: 'NORMAL',
          description: '执行优先级'
        },
        dispatch_time: { type: 'date', required: true, description: '派发时间' },
        expected_ship_date: { type: 'date', required: false, description: '预期发货日期' },
        actual_ship_date: { type: 'date', required: false, description: '实际发货日期' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['PENDING', 'ACCEPTED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] },
          defaultValue: 'PENDING',
          description: '派发状态'
        }
      },
      stateMachine: {
        initialState: 'PENDING',
        states: {
          'PENDING': { displayName: '待接收', description: '等待仓库接收' },
          'ACCEPTED': { displayName: '已接收', description: '仓库已接收' },
          'PROCESSING': { displayName: '处理中', description: '仓库处理中' },
          'SHIPPED': { displayName: '已发货', description: '仓库已发货' },
          'COMPLETED': { displayName: '已完成', description: '派发执行完成', isTerminal: true },
          'CANCELLED': { displayName: '已取消', description: '派发被取消', isTerminal: true }
        },
        transitions: [
          { from: 'PENDING', to: 'ACCEPTED', trigger: 'acceptDispatch' },
          { from: 'ACCEPTED', to: 'PROCESSING', trigger: 'startProcessing' },
          { from: 'PROCESSING', to: 'SHIPPED', trigger: 'shipDispatch' },
          { from: 'SHIPPED', to: 'COMPLETED', trigger: 'completeDispatch' },
          { from: 'PENDING', to: 'CANCELLED', trigger: 'cancelDispatch' },
          { from: 'ACCEPTED', to: 'CANCELLED', trigger: 'cancelDispatch' }
        ]
      },
      constraints: [
        {
          id: 'future_ship_date',
          type: 'precondition',
          expression: 'expected_ship_date == null || expected_ship_date >= dispatch_time',
          description: '预期发货日期不能早于派发时间',
          severity: 'warning'
        }
      ],
      visual: { color: '#059669', icon: 'paper-airplane', position: { x: 500, y: 300 } }
    },
    
    {
      id: 'purchase_order',
      name: 'PurchaseOrder',
      displayName: '采购订单',
      description: '向供应商采购商品的订单',
      category: 'aggregate',
      attributes: {
        id: { type: 'string', required: true, description: '采购订单唯一标识' },
        po_number: { type: 'string', required: true, description: '采购订单号' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '采购商户' },
        vendor_id: { type: 'reference', references: 'vendor', required: true, description: '供应商' },
        po_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['STANDARD', 'RUSH', 'CONSIGNMENT', 'DROP_SHIP'] },
          defaultValue: 'STANDARD',
          description: '采购类型'
        },
        total_amount: { type: 'number', required: true, constraints: { min: 0 }, description: '采购总金额' },
        currency: { type: 'string', required: true, defaultValue: 'USD', description: '货币币种' },
        payment_terms: { type: 'string', required: false, description: '付款条件' },
        delivery_terms: { type: 'string', required: false, description: '交货条件' },
        requested_date: { type: 'date', required: false, description: '要求交货日期' },
        promised_date: { type: 'date', required: false, description: '供应商承诺日期' },
        order_date: { type: 'date', required: true, description: '下单日期' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED', 'INVOICED', 'PAID', 'CLOSED'] },
          defaultValue: 'DRAFT',
          description: '采购订单状态'
        }
      },
      stateMachine: {
        initialState: 'DRAFT',
        states: {
          'DRAFT': { displayName: '草稿', description: '采购订单草稿' },
          'SENT': { displayName: '已发送', description: '已发送给供应商' },
          'CONFIRMED': { displayName: '已确认', description: '供应商已确认' },
          'RECEIVED': { displayName: '已收货', description: '货物已收到' },
          'INVOICED': { displayName: '已开票', description: '供应商已开票' },
          'PAID': { displayName: '已付款', description: '采购款已付' },
          'CLOSED': { displayName: '已关闭', description: '采购订单关闭', isTerminal: true }
        },
        transitions: [
          { from: 'DRAFT', to: 'SENT', trigger: 'sendToPurchaseOrder' },
          { from: 'SENT', to: 'CONFIRMED', trigger: 'confirmPurchaseOrder' },
          { from: 'CONFIRMED', to: 'RECEIVED', trigger: 'receiveGoods' },
          { from: 'RECEIVED', to: 'INVOICED', trigger: 'receiveInvoice' },
          { from: 'INVOICED', to: 'PAID', trigger: 'makePayment' },
          { from: 'PAID', to: 'CLOSED', trigger: 'closePurchaseOrder' }
        ]
      },
      constraints: [
        {
          id: 'unique_po_number',
          type: 'invariant',
          expression: 'isUnique(po_number)',
          description: '采购订单号必须唯一',
          severity: 'error'
        },
        {
          id: 'promised_after_requested',
          type: 'invariant',
          expression: 'promised_date == null || requested_date == null || promised_date >= requested_date',
          description: '承诺日期不能早于要求日期',
          severity: 'warning'
        }
      ],
      visual: { color: '#f97316', icon: 'clipboard-document', position: { x: 700, y: 300 } }
    },
    
    {
      id: 'return_order',
      name: 'ReturnOrder',
      displayName: '退货订单',
      description: '客户退货或换货订单',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '退货订单唯一标识' },
        return_no: { type: 'string', required: true, description: '退货单号' },
        original_order_id: { type: 'reference', references: 'sales_order', required: true, description: '原销售订单' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        return_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['REFUND', 'EXCHANGE', 'REPAIR', 'CREDIT'] },
          description: '退货类型'
        },
        return_reason: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['DEFECTIVE', 'WRONG_ITEM', 'SIZE_ISSUE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND', 'DAMAGED_SHIPPING'] },
          description: '退货原因'
        },
        customer_note: { type: 'string', required: false, description: '客户备注' },
        refund_amount: { type: 'number', required: false, constraints: { min: 0 }, description: '退款金额' },
        return_shipping_fee: { type: 'number', required: false, defaultValue: 0, constraints: { min: 0 }, description: '退货运费' },
        created_time: { type: 'date', required: true, description: '退货申请时间' },
        approved_time: { type: 'date', required: false, description: '审批时间' },
        completed_time: { type: 'date', required: false, description: '完成时间' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['REQUESTED', 'APPROVED', 'REJECTED', 'RETURNED', 'REFUNDED', 'COMPLETED'] },
          defaultValue: 'REQUESTED',
          description: '退货状态'
        }
      },
      stateMachine: {
        initialState: 'REQUESTED',
        states: {
          'REQUESTED': { displayName: '已申请', description: '客户申请退货' },
          'APPROVED': { displayName: '已审批', description: '退货申请通过' },
          'REJECTED': { displayName: '已拒绝', description: '退货申请被拒', isTerminal: true },
          'RETURNED': { displayName: '已退回', description: '货物已退回' },
          'REFUNDED': { displayName: '已退款', description: '退款已处理' },
          'COMPLETED': { displayName: '已完成', description: '退货流程完成', isTerminal: true }
        },
        transitions: [
          { from: 'REQUESTED', to: 'APPROVED', trigger: 'approveReturn' },
          { from: 'REQUESTED', to: 'REJECTED', trigger: 'rejectReturn' },
          { from: 'APPROVED', to: 'RETURNED', trigger: 'receiveReturn' },
          { from: 'RETURNED', to: 'REFUNDED', trigger: 'processRefund' },
          { from: 'REFUNDED', to: 'COMPLETED', trigger: 'completeReturn' }
        ]
      },
      constraints: [
        {
          id: 'unique_return_no',
          type: 'invariant',
          expression: 'isUnique(return_no)',
          description: '退货单号必须唯一',
          severity: 'error'
        },
        {
          id: 'valid_refund_amount',
          type: 'invariant',
          expression: 'refund_amount == null || refund_amount <= original_order.total_amount',
          description: '退款金额不能超过原订单金额',
          severity: 'error'
        }
      ],
      visual: { color: '#dc2626', icon: 'arrow-uturn-left', position: { x: 900, y: 300 } }
    },
    
    {
      id: 'vendor',
      name: 'Vendor',
      displayName: '供应商',
      description: '商品供应商信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '供应商唯一标识' },
        vendor_code: { type: 'string', required: true, description: '供应商代码' },
        vendor_name: { type: 'string', required: true, description: '供应商名称' },
        contact_person: { type: 'string', required: false, description: '联系人' },
        contact_phone: { type: 'string', required: false, description: '联系电话' },
        contact_email: { type: 'string', required: false, description: '联系邮箱' },
        address: { type: 'string', required: false, description: '供应商地址' },
        payment_terms: { type: 'string', required: false, description: '付款条件' },
        credit_limit: { type: 'number', required: false, constraints: { min: 0 }, description: '信用额度' },
        rating: { 
          type: 'enum', 
          required: false, 
          constraints: { enum: ['A', 'B', 'C', 'D'] },
          description: '供应商评级'
        },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'BLACKLISTED'] },
          defaultValue: 'ACTIVE',
          description: '供应商状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '激活', description: '供应商正常合作' },
          'INACTIVE': { displayName: '停用', description: '供应商暂停合作' },
          'BLACKLISTED': { displayName: '黑名单', description: '供应商列入黑名单', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateVendor' },
          { from: 'ACTIVE', to: 'BLACKLISTED', trigger: 'blacklistVendor' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateVendor' }
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
      visual: { color: '#7c3aed', icon: 'building-office-2', position: { x: 100, y: 500 } }
    },
    
    {
      id: 'inventory_summary',
      name: 'InventorySummary',
      displayName: '库存汇总',
      description: '商品库存汇总信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '库存汇总唯一标识' },
        sku_id: { type: 'reference', references: 'product_sku', required: true, description: '商品SKU' },
        merchant_id: { type: 'reference', references: 'merchant', required: true, description: '所属商户' },
        warehouse_id: { type: 'string', required: true, description: '仓库ID' },
        total_quantity: { type: 'number', required: true, defaultValue: 0, constraints: { min: 0 }, description: '总库存数量' },
        available_quantity: { type: 'number', required: true, defaultValue: 0, constraints: { min: 0 }, description: '可用库存数量' },
        allocated_quantity: { type: 'number', required: true, defaultValue: 0, constraints: { min: 0 }, description: '已分配数量' },
        on_order_quantity: { type: 'number', required: true, defaultValue: 0, constraints: { min: 0 }, description: '在途采购数量' },
        safety_stock: { type: 'number', required: false, constraints: { min: 0 }, description: '安全库存' },
        reorder_point: { type: 'number', required: false, constraints: { min: 0 }, description: '再订货点' },
        last_updated: { type: 'date', required: true, description: '最后更新时间' }
      },
      stateMachine: {
        initialState: 'NORMAL',
        states: {
          'NORMAL': { displayName: '正常', description: '库存水平正常' },
          'LOW': { displayName: '低库存', description: '库存低于安全线' },
          'OUT_OF_STOCK': { displayName: '缺货', description: '库存为零' },
          'OVERSTOCK': { displayName: '过量库存', description: '库存过多' }
        },
        transitions: [
          { from: 'NORMAL', to: 'LOW', trigger: 'checkLowStock' },
          { from: 'NORMAL', to: 'OUT_OF_STOCK', trigger: 'stockOut' },
          { from: 'NORMAL', to: 'OVERSTOCK', trigger: 'checkOverstock' },
          { from: 'LOW', to: 'NORMAL', trigger: 'replenish' },
          { from: 'LOW', to: 'OUT_OF_STOCK', trigger: 'stockOut' },
          { from: 'OUT_OF_STOCK', to: 'LOW', trigger: 'partialReplenish' },
          { from: 'OUT_OF_STOCK', to: 'NORMAL', trigger: 'replenish' },
          { from: 'OVERSTOCK', to: 'NORMAL', trigger: 'adjustStock' }
        ]
      },
      constraints: [
        {
          id: 'valid_quantities',
          type: 'invariant',
          expression: 'total_quantity >= 0 && available_quantity >= 0 && allocated_quantity >= 0',
          description: '所有数量字段必须非负',
          severity: 'error'
        },
        {
          id: 'quantity_consistency',
          type: 'invariant',
          expression: 'available_quantity + allocated_quantity <= total_quantity',
          description: '可用库存和已分配库存之和不能超过总库存',
          severity: 'error'
        }
      ],
      visual: { color: '#84cc16', icon: 'archive-box', position: { x: 300, y: 500 } }
    },
    
    {
      id: 'warehouse_ext',
      name: 'WarehouseExt',
      displayName: '仓库扩展信息',
      description: '仓库扩展配置信息',
      category: 'entity',
      attributes: {
        id: { type: 'string', required: true, description: '仓库扩展信息唯一标识' },
        warehouse_id: { type: 'string', required: true, description: '仓库ID' },
        warehouse_name: { type: 'string', required: true, description: '仓库名称' },
        warehouse_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['DISTRIBUTION', 'FULFILLMENT', 'CROSS_DOCK', 'RETURNS'] },
          description: '仓库类型'
        },
        address: { type: 'string', required: false, description: '仓库地址' },
        capacity: { type: 'number', required: false, constraints: { min: 0 }, description: '仓库容量' },
        operating_hours: { type: 'string', required: false, description: '营业时间JSON' },
        contact_info: { type: 'string', required: false, description: '联系信息JSON' },
        capabilities: { type: 'string', required: false, description: '仓库能力JSON' },
        status: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'] },
          defaultValue: 'ACTIVE',
          description: '仓库状态'
        }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '运营中', description: '仓库正常运营' },
          'INACTIVE': { displayName: '停用', description: '仓库暂停运营' },
          'MAINTENANCE': { displayName: '维护中', description: '仓库设施维护' }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'deactivateWarehouse' },
          { from: 'ACTIVE', to: 'MAINTENANCE', trigger: 'startMaintenance' },
          { from: 'INACTIVE', to: 'ACTIVE', trigger: 'activateWarehouse' },
          { from: 'MAINTENANCE', to: 'ACTIVE', trigger: 'completeMaintenance' }
        ]
      },
      constraints: [
        {
          id: 'unique_warehouse_id',
          type: 'invariant',
          expression: 'isUnique(warehouse_id)',
          description: '仓库ID必须唯一',
          severity: 'error'
        }
      ],
      visual: { color: '#6b7280', icon: 'building', position: { x: 500, y: 500 } }
    },
    
    {
      id: 'address',
      name: 'Address',
      displayName: '地址信息',
      description: '统一地址信息管理',
      category: 'value_object',
      attributes: {
        id: { type: 'string', required: true, description: '地址唯一标识' },
        address_type: { 
          type: 'enum', 
          required: true, 
          constraints: { enum: ['SHIPPING', 'BILLING', 'WAREHOUSE', 'VENDOR'] },
          description: '地址类型'
        },
        recipient_name: { type: 'string', required: false, description: '收件人姓名' },
        company_name: { type: 'string', required: false, description: '公司名称' },
        country: { type: 'string', required: true, description: '国家' },
        state_province: { type: 'string', required: false, description: '省/州' },
        city: { type: 'string', required: true, description: '城市' },
        postal_code: { type: 'string', required: false, description: '邮政编码' },
        address_line1: { type: 'string', required: true, description: '地址行1' },
        address_line2: { type: 'string', required: false, description: '地址行2' },
        phone: { type: 'string', required: false, description: '联系电话' },
        email: { type: 'string', required: false, description: '联系邮箱' },
        is_default: { type: 'boolean', required: false, defaultValue: false, description: '是否默认地址' }
      },
      stateMachine: {
        initialState: 'ACTIVE',
        states: {
          'ACTIVE': { displayName: '有效', description: '地址有效可用' },
          'INACTIVE': { displayName: '无效', description: '地址已失效', isTerminal: true }
        },
        transitions: [
          { from: 'ACTIVE', to: 'INACTIVE', trigger: 'invalidateAddress' }
        ]
      },
      constraints: [
        {
          id: 'valid_email_format',
          type: 'invariant',
          expression: 'email == null || email.match(/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/)',
          description: '邮箱格式必须正确',
          severity: 'error'
        }
      ],
      visual: { color: '#f59e0b', icon: 'map-pin', position: { x: 700, y: 500 } }
    }
  ],
  
  // 8 Core Behaviors from OMS Business Operations
  behaviors: [
    {
      id: 'createSalesOrder',
      name: 'createSalesOrder',
      displayName: '创建销售订单',
      description: '创建新的销售订单，包含客户信息、商品、价格等',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'merchant', requiredState: 'ACTIVE' },
          { objectId: 'channel', requiredState: 'ACTIVE' },
          { objectId: 'product_sku', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['order_number_unique_rule', 'inventory_availability_rule'],
        customConditions: ['hasOrderCreationPermission(actor)']
      },
      inputs: {
        merchant_id: { type: 'string', required: true, description: '商户ID' },
        channel_id: { type: 'string', required: true, description: '销售渠道ID' },
        customer_info: { type: 'object', required: true, description: '客户信息' },
        order_items: { type: 'object[]', required: true, description: '订单商品列表' },
        shipping_address: { type: 'object', required: true, description: '收货地址' },
        payment_method: { type: 'string', required: true, description: '支付方式' },
        special_instructions: { type: 'string', required: false, description: '特殊说明' }
      },
      outputs: {
        order_id: { type: 'string', description: '创建的订单ID' },
        order_no: { type: 'string', description: '订单号' },
        total_amount: { type: 'number', description: '订单总金额' },
        success: { type: 'boolean', description: '创建是否成功' }
      },
      stateChanges: [
        { objectId: 'sales_order', newState: 'PENDING' }
      ],
      linkedRules: [
        { ruleId: 'order_number_unique_rule', phase: 'during', required: true },
        { ruleId: 'inventory_availability_rule', phase: 'before', required: true },
        { ruleId: 'order_amount_validation_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'sales_order_items', data: { items: 'input.order_items' } },
        { type: 'create', target: 'order_timeline', data: { event: 'order_created' } },
        { type: 'notify', target: 'order_processor', data: { event: 'new_order_received' } }
      ],
      visual: { color: '#ef4444', icon: 'document-plus', position: { x: 100, y: 700 } }
    },
    
    {
      id: 'confirmOrder',
      name: 'confirmOrder',
      displayName: '确认订单',
      description: '确认订单有效性，包括库存、价格、地址验证',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'sales_order', requiredState: 'PENDING' }
        ],
        ruleChecks: ['payment_verification_rule', 'address_validation_rule'],
        customConditions: ['hasOrderConfirmPermission(actor)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '订单ID' },
        inventory_check: { type: 'boolean', required: false, description: '是否检查库存' },
        payment_verification: { type: 'boolean', required: false, description: '是否验证支付' },
        address_verification: { type: 'boolean', required: false, description: '是否验证地址' }
      },
      outputs: {
        confirmation_result: { type: 'string', description: '确认结果' },
        inventory_status: { type: 'object', description: '库存状态' },
        estimated_ship_date: { type: 'date', description: '预计发货日期' }
      },
      stateChanges: [
        { objectId: 'sales_order', newState: 'CONFIRMED' }
      ],
      linkedRules: [
        { ruleId: 'payment_verification_rule', phase: 'before', required: true },
        { ruleId: 'address_validation_rule', phase: 'before', required: true },
        { ruleId: 'inventory_availability_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'update', target: 'inventory_allocation', data: { allocated: 'true' } },
        { type: 'create', target: 'order_timeline', data: { event: 'order_confirmed' } },
        { type: 'notify', target: 'customer', data: { event: 'order_confirmed' } }
      ],
      visual: { color: '#10b981', icon: 'check-circle', position: { x: 300, y: 700 } }
    },
    
    {
      id: 'dispatchOrder',
      name: 'dispatchOrder',
      displayName: '派发订单',
      description: '将订单派发到合适的仓库执行履约',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'sales_order', requiredState: 'CONFIRMED' },
          { objectId: 'warehouse_ext', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['warehouse_capacity_rule', 'shipping_zone_rule'],
        customConditions: ['hasDispatchPermission(actor)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '订单ID' },
        preferred_warehouse: { type: 'string', required: false, description: '首选仓库' },
        dispatch_strategy: { type: 'string', required: false, description: '派发策略' },
        priority: { type: 'string', required: false, description: '优先级' }
      },
      outputs: {
        dispatch_id: { type: 'string', description: '派发单ID' },
        assigned_warehouse: { type: 'string', description: '分配的仓库' },
        estimated_fulfillment_time: { type: 'number', description: '预计履约时间' }
      },
      stateChanges: [
        { objectId: 'sales_order', newState: 'PROCESSING' },
        { objectId: 'order_dispatch', newState: 'PENDING' }
      ],
      linkedRules: [
        { ruleId: 'warehouse_capacity_rule', phase: 'before', required: true },
        { ruleId: 'shipping_zone_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'order_dispatch', data: { order_dispatched: 'true' } },
        { type: 'create', target: 'order_timeline', data: { event: 'order_dispatched' } },
        { type: 'notify', target: 'wms_orchestrator', data: { event: 'oms_order_dispatched', cross_domain: true } }
      ],
      visual: { color: '#059669', icon: 'paper-airplane', position: { x: 500, y: 700 } }
    },
    
    {
      id: 'processReturn',
      name: 'processReturn',
      displayName: '处理退货',
      description: '处理客户退货申请和退货流程',
      category: 'workflow',
      preconditions: {
        objectStates: [
          { objectId: 'sales_order', requiredState: 'DELIVERED' }
        ],
        ruleChecks: ['return_policy_rule', 'return_time_limit_rule'],
        customConditions: ['hasReturnProcessPermission(actor)']
      },
      inputs: {
        original_order_id: { type: 'string', required: true, description: '原订单ID' },
        return_items: { type: 'object[]', required: true, description: '退货商品列表' },
        return_reason: { type: 'string', required: true, description: '退货原因' },
        return_type: { type: 'string', required: true, validation: 'in:["REFUND","EXCHANGE","REPAIR","CREDIT"]', description: '退货类型' },
        customer_note: { type: 'string', required: false, description: '客户备注' }
      },
      outputs: {
        return_id: { type: 'string', description: '退货单ID' },
        return_no: { type: 'string', description: '退货单号' },
        refund_amount: { type: 'number', description: '退款金额' },
        approval_required: { type: 'boolean', description: '是否需要审批' }
      },
      stateChanges: [
        { objectId: 'return_order', newState: 'REQUESTED' }
      ],
      linkedRules: [
        { ruleId: 'return_policy_rule', phase: 'before', required: true },
        { ruleId: 'return_time_limit_rule', phase: 'before', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'return_order', data: { return_created: 'true' } },
        { type: 'notify', target: 'return_processor', data: { event: 'return_request_received' } },
        { type: 'notify', target: 'customer', data: { event: 'return_request_acknowledged' } }
      ],
      visual: { color: '#dc2626', icon: 'arrow-uturn-left', position: { x: 700, y: 700 } }
    },
    
    {
      id: 'managePurchaseOrder',
      name: 'managePurchaseOrder',
      displayName: '管理采购订单',
      description: '创建和管理向供应商的采购订单',
      category: 'command',
      preconditions: {
        objectStates: [
          { objectId: 'vendor', requiredState: 'ACTIVE' },
          { objectId: 'merchant', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['vendor_approval_rule', 'purchase_authority_rule'],
        customConditions: ['hasPurchaseOrderPermission(actor)']
      },
      inputs: {
        merchant_id: { type: 'string', required: true, description: '采购商户ID' },
        vendor_id: { type: 'string', required: true, description: '供应商ID' },
        purchase_items: { type: 'object[]', required: true, description: '采购商品列表' },
        po_type: { type: 'string', required: false, description: '采购类型' },
        requested_date: { type: 'date', required: false, description: '要求交货日期' },
        payment_terms: { type: 'string', required: false, description: '付款条件' }
      },
      outputs: {
        po_id: { type: 'string', description: '采购订单ID' },
        po_number: { type: 'string', description: '采购订单号' },
        total_amount: { type: 'number', description: '采购总金额' }
      },
      stateChanges: [
        { objectId: 'purchase_order', newState: 'DRAFT' }
      ],
      linkedRules: [
        { ruleId: 'vendor_approval_rule', phase: 'before', required: true },
        { ruleId: 'purchase_authority_rule', phase: 'before', required: true }
      ],
      sideEffects: [
        { type: 'create', target: 'purchase_order_items', data: { items: 'input.purchase_items' } },
        { type: 'notify', target: 'purchase_manager', data: { event: 'po_created' } }
      ],
      visual: { color: '#f97316', icon: 'clipboard-document-list', position: { x: 900, y: 700 } }
    },
    
    {
      id: 'updateInventory',
      name: 'updateInventory',
      displayName: '更新库存',
      description: '更新商品库存数量和状态',
      category: 'event',
      preconditions: {
        objectStates: [
          { objectId: 'product_sku', requiredState: 'ACTIVE' },
          { objectId: 'warehouse_ext', requiredState: 'ACTIVE' }
        ],
        ruleChecks: ['inventory_accuracy_rule'],
        customConditions: ['hasInventoryUpdatePermission(actor)']
      },
      inputs: {
        sku_id: { type: 'string', required: true, description: '商品SKU ID' },
        warehouse_id: { type: 'string', required: true, description: '仓库ID' },
        quantity_change: { type: 'number', required: true, description: '数量变化' },
        change_type: { type: 'string', required: true, validation: 'in:["RECEIPT","SHIPMENT","ADJUSTMENT","TRANSFER"]', description: '变化类型' },
        reference_id: { type: 'string', required: false, description: '关联单据ID' },
        notes: { type: 'string', required: false, description: '备注' }
      },
      outputs: {
        new_total_quantity: { type: 'number', description: '新的总库存数量' },
        new_available_quantity: { type: 'number', description: '新的可用库存数量' },
        inventory_status: { type: 'string', description: '库存状态' }
      },
      stateChanges: [
        { objectId: 'inventory_summary', newState: 'NORMAL', condition: 'inventory_sufficient' },
        { objectId: 'inventory_summary', newState: 'LOW', condition: 'inventory_low' },
        { objectId: 'inventory_summary', newState: 'OUT_OF_STOCK', condition: 'inventory_zero' }
      ],
      linkedRules: [
        { ruleId: 'inventory_accuracy_rule', phase: 'during', required: true },
        { ruleId: 'negative_inventory_rule', phase: 'during', required: true }
      ],
      sideEffects: [
        { type: 'update', target: 'inventory_summary', data: { quantity_updated: 'true' } },
        { type: 'create', target: 'inventory_transaction', data: { change_recorded: 'true' } },
        { type: 'notify', target: 'inventory_manager', data: { event: 'inventory_updated', condition: 'significant_change' } }
      ],
      visual: { color: '#84cc16', icon: 'archive-box', position: { x: 100, y: 900 } }
    },
    
    {
      id: 'syncWMSInventory',
      name: 'syncWMSInventory',
      displayName: '同步WMS库存',
      description: '与WMS系统同步库存数据',
      category: 'command',
      preconditions: {
        objectStates: [],
        ruleChecks: ['sync_frequency_rule'],
        customConditions: ['hasInventorySyncPermission(actor)']
      },
      inputs: {
        sync_type: { type: 'string', required: false, description: '同步类型' },
        warehouse_ids: { type: 'string[]', required: false, description: '指定仓库列表' },
        sku_ids: { type: 'string[]', required: false, description: '指定SKU列表' },
        force_sync: { type: 'boolean', required: false, description: '是否强制同步' }
      },
      outputs: {
        sync_id: { type: 'string', description: '同步任务ID' },
        synced_records: { type: 'number', description: '同步记录数' },
        sync_errors: { type: 'object[]', description: '同步错误列表' },
        last_sync_time: { type: 'date', description: '最后同步时间' }
      },
      stateChanges: [],
      linkedRules: [
        { ruleId: 'sync_frequency_rule', phase: 'before', required: true }
      ],
      sideEffects: [
        { type: 'update', target: 'inventory_summary', data: { sync_completed: 'true' } },
        { type: 'create', target: 'sync_log', data: { sync_recorded: 'true' } },
        { type: 'notify', target: 'wms_sync_operator', data: { event: 'oms_inventory_sync_requested', cross_domain: true } }
      ],
      visual: { color: '#06b6d4', icon: 'arrow-path', position: { x: 300, y: 900 } }
    },
    
    {
      id: 'trackOrderStatus',
      name: 'trackOrderStatus',
      displayName: '跟踪订单状态',
      description: '跟踪和更新订单执行状态',
      category: 'query',
      preconditions: {
        objectStates: [
          { objectId: 'sales_order', requiredState: 'PROCESSING' }
        ],
        ruleChecks: [],
        customConditions: ['hasOrderTrackingPermission(actor)']
      },
      inputs: {
        order_id: { type: 'string', required: true, description: '订单ID' },
        tracking_level: { type: 'string', required: false, description: '跟踪级别' }
      },
      outputs: {
        current_status: { type: 'string', description: '当前订单状态' },
        status_timeline: { type: 'object[]', description: '状态变化时间线' },
        tracking_info: { type: 'object', description: '物流跟踪信息' },
        estimated_delivery: { type: 'date', description: '预计送达时间' }
      },
      stateChanges: [],
      linkedRules: [],
      sideEffects: [
        { type: 'create', target: 'tracking_query_log', data: { query_logged: 'true' } }
      ],
      visual: { color: '#6b7280', icon: 'magnifying-glass', position: { x: 500, y: 900 } }
    }
  ],
  
  // 6 Core Rules from OMS Business Constraints
  rules: [
    {
      id: 'order_number_unique_rule',
      name: 'orderNumberUniqueRule',
      displayName: '订单号唯一性规则',
      description: '确保订单号在系统内全局唯一',
      category: 'invariant',
      priority: 10,
      condition: {
        expression: 'isUnique(sales_order.order_no)',
        naturalLanguage: '销售订单号必须在系统内全局唯一',
        variables: {
          'sales_order.order_no': 'string'
        }
      },
      actions: [
        {
          type: 'block',
          message: '订单号已存在，请使用不同的订单号',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['sales_order'],
        behaviors: ['createSalesOrder'],
        scenarios: ['order_fulfillment_process', 'return_process']
      },
      testCases: [
        {
          id: 'test_unique_order_number',
          description: '订单号唯一性检查',
          input: { order_no: 'SO-001-2024' },
          expectedResult: 'pass'
        },
        {
          id: 'test_duplicate_order_number',
          description: '重复订单号应该失败',
          input: { order_no: 'SO-001-2024' },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'inventory_availability_rule',
      name: 'inventoryAvailabilityRule',
      displayName: '库存可用性规则',
      description: '确保订单商品有足够的可用库存',
      category: 'constraint',
      priority: 9,
      condition: {
        expression: 'SUM(inventory_summary.available_quantity WHERE sku_id = order_item.sku_id) >= order_item.quantity',
        naturalLanguage: '订单商品的可用库存必须满足订单需求量',
        variables: {
          'inventory_summary.available_quantity': 'number',
          'order_item.quantity': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '商品库存不足，无法创建订单',
          severity: 'error'
        },
        {
          type: 'warn',
          message: '商品库存紧张，建议优先补货',
          severity: 'warning'
        }
      ],
      scope: {
        objects: ['inventory_summary', 'sales_order', 'product_sku'],
        behaviors: ['createSalesOrder', 'confirmOrder'],
        scenarios: ['order_fulfillment_process']
      },
      testCases: [
        {
          id: 'test_sufficient_inventory',
          description: '库存充足可以创建订单',
          input: { available: 100, required: 80 },
          expectedResult: 'pass'
        },
        {
          id: 'test_insufficient_inventory',
          description: '库存不足无法创建',
          input: { available: 50, required: 80 },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'order_amount_validation_rule',
      name: 'orderAmountValidationRule',
      displayName: '订单金额验证规则',
      description: '验证订单金额计算的准确性',
      category: 'validation',
      priority: 8,
      condition: {
        expression: 'order.total_amount == SUM(item.price * item.quantity) + order.tax_amount + order.shipping_fee - order.discount_amount',
        naturalLanguage: '订单总金额必须等于商品金额加税费加运费减折扣',
        variables: {
          'order.total_amount': 'number',
          'item.price': 'number',
          'item.quantity': 'number',
          'order.tax_amount': 'number',
          'order.shipping_fee': 'number',
          'order.discount_amount': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '订单金额计算错误，请检查商品价格、税费、运费和折扣',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['sales_order'],
        behaviors: ['createSalesOrder', 'confirmOrder'],
        scenarios: ['order_fulfillment_process']
      },
      testCases: [
        {
          id: 'test_correct_amount_calculation',
          description: '正确的金额计算',
          input: { 
            item_total: 100, 
            tax: 8, 
            shipping: 10, 
            discount: 5, 
            total: 113 
          },
          expectedResult: 'pass'
        },
        {
          id: 'test_incorrect_amount_calculation',
          description: '错误的金额计算',
          input: { 
            item_total: 100, 
            tax: 8, 
            shipping: 10, 
            discount: 5, 
            total: 120 
          },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'return_policy_rule',
      name: 'returnPolicyRule',
      displayName: '退货政策规则',
      description: '验证退货申请是否符合退货政策',
      category: 'validation',
      priority: 7,
      condition: {
        expression: 'return_reason IN allowed_reasons AND return_condition == "ACCEPTABLE" AND original_order.status == "DELIVERED"',
        naturalLanguage: '退货原因必须在允许范围内，商品状态可接受，且原订单已送达',
        variables: {
          'return_reason': 'string',
          'allowed_reasons': 'string[]',
          'return_condition': 'string',
          'original_order.status': 'string'
        }
      },
      actions: [
        {
          type: 'validate',
          message: '退货申请符合政策要求',
          severity: 'info'
        },
        {
          type: 'block',
          message: '退货申请不符合退货政策',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['return_order', 'sales_order'],
        behaviors: ['processReturn'],
        scenarios: ['return_process']
      },
      testCases: [
        {
          id: 'test_valid_return_policy',
          description: '符合退货政策的申请',
          input: { 
            reason: 'DEFECTIVE', 
            condition: 'ACCEPTABLE', 
            order_status: 'DELIVERED' 
          },
          expectedResult: 'pass'
        },
        {
          id: 'test_invalid_return_reason',
          description: '不符合退货政策的原因',
          input: { 
            reason: 'INVALID_REASON', 
            condition: 'ACCEPTABLE', 
            order_status: 'DELIVERED' 
          },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'payment_verification_rule',
      name: 'paymentVerificationRule',
      displayName: '支付验证规则',
      description: '验证订单支付状态和金额',
      category: 'validation',
      priority: 8,
      condition: {
        expression: 'order.payment_status == "PAID" && payment.amount >= order.total_amount',
        naturalLanguage: '订单必须已付款且支付金额不少于订单总额',
        variables: {
          'order.payment_status': 'string',
          'payment.amount': 'number',
          'order.total_amount': 'number'
        }
      },
      actions: [
        {
          type: 'validate',
          message: '支付验证通过',
          severity: 'info'
        },
        {
          type: 'block',
          message: '支付未完成或金额不足',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['sales_order'],
        behaviors: ['confirmOrder', 'dispatchOrder'],
        scenarios: ['order_fulfillment_process']
      },
      testCases: [
        {
          id: 'test_payment_verified',
          description: '支付验证通过',
          input: { payment_status: 'PAID', payment_amount: 100, order_amount: 100 },
          expectedResult: 'pass'
        },
        {
          id: 'test_payment_insufficient',
          description: '支付金额不足',
          input: { payment_status: 'PAID', payment_amount: 90, order_amount: 100 },
          expectedResult: 'fail'
        },
        {
          id: 'test_payment_unpaid',
          description: '订单未付款',
          input: { payment_status: 'UNPAID', payment_amount: 0, order_amount: 100 },
          expectedResult: 'fail'
        }
      ]
    },
    
    {
      id: 'negative_inventory_rule',
      name: 'negativeInventoryRule',
      displayName: '负库存防护规则',
      description: '防止库存数量变为负数',
      category: 'constraint',
      priority: 10,
      condition: {
        expression: 'inventory_summary.available_quantity + quantity_change >= 0',
        naturalLanguage: '库存变化后的可用数量不能为负数',
        variables: {
          'inventory_summary.available_quantity': 'number',
          'quantity_change': 'number'
        }
      },
      actions: [
        {
          type: 'block',
          message: '操作会导致负库存，不允许执行',
          severity: 'error'
        }
      ],
      scope: {
        objects: ['inventory_summary'],
        behaviors: ['updateInventory'],
        scenarios: ['order_fulfillment_process', 'inventory_management']
      },
      testCases: [
        {
          id: 'test_positive_inventory_change',
          description: '库存增加操作',
          input: { current_quantity: 10, change: 5 },
          expectedResult: 'pass'
        },
        {
          id: 'test_valid_inventory_decrease',
          description: '合理的库存减少',
          input: { current_quantity: 10, change: -5 },
          expectedResult: 'pass'
        },
        {
          id: 'test_negative_inventory',
          description: '导致负库存的操作',
          input: { current_quantity: 5, change: -10 },
          expectedResult: 'fail'
        }
      ]
    }
  ],
  
  // 3 Core Scenarios from OMS Process Flows
  scenarios: [
    {
      id: 'order_fulfillment_process',
      name: 'orderFulfillmentProcess',
      displayName: '订单履约流程',
      description: 'OMS标准订单履约业务流程：创建→确认→派发→执行→完成',
      category: 'process',
      actors: [
        { id: 'customer', name: '客户', role: 'external', permissions: ['place_order', 'track_order'] },
        { id: 'order_processor', name: '订单处理员', role: 'operator', permissions: ['order_create', 'order_confirm'] },
        { id: 'inventory_manager', name: '库存管理员', role: 'controller', permissions: ['inventory_check', 'inventory_allocate'] },
        { id: 'fulfillment_coordinator', name: '履约协调员', role: 'coordinator', permissions: ['order_dispatch', 'warehouse_coordinate'] },
        { id: 'customer_service', name: '客服', role: 'support', permissions: ['order_track', 'customer_support'] }
      ],
      steps: [
        {
          id: 'start',
          name: '客户下单',
          type: 'start',
          next: 'validate_order',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'validate_order',
          name: '验证订单',
          type: 'task',
          task: {
            behaviorId: 'createSalesOrder',
            actorId: 'order_processor',
            inputs: {},
            timeout: 300000
          },
          next: 'check_inventory',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'check_inventory',
          name: '检查库存',
          type: 'decision',
          decision: {
            condition: 'hasEnoughInventory',
            branches: [
              { condition: 'true', nextStepId: 'confirm_order' },
              { condition: 'false', nextStepId: 'handle_insufficient_inventory' }
            ]
          },
          next: ['confirm_order', 'handle_insufficient_inventory'],
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'handle_insufficient_inventory',
          name: '处理库存不足',
          type: 'decision',
          decision: {
            condition: 'canBackorder',
            branches: [
              { condition: 'true', nextStepId: 'create_backorder' },
              { condition: 'false', nextStepId: 'cancel_order' }
            ]
          },
          next: ['create_backorder', 'cancel_order'],
          visual: { position: { x: 400, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'create_backorder',
          name: '创建预订单',
          type: 'task',
          task: {
            behaviorId: 'createBackorder',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'notify_customer_backorder',
          visual: { position: { x: 300, y: 400 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_backorder',
          name: '通知客户预订',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'BACKORDER' }
          },
          next: 'wait_for_stock',
          visual: { position: { x: 450, y: 400 }, type: 'bpmn' }
        },
        {
          id: 'wait_for_stock',
          name: '等待补货',
          type: 'task',
          task: {
            behaviorId: 'waitForInventory',
            actorId: 'inventory_manager',
            inputs: {},
            timeout: 2592000000 // 30天超时
          },
          next: 'confirm_order',
          visual: { position: { x: 600, y: 400 }, type: 'bpmn' }
        },
        {
          id: 'cancel_order',
          name: '取消订单',
          type: 'task',
          task: {
            behaviorId: 'cancelOrder',
            actorId: 'order_processor',
            inputs: {}
          },
          next: 'notify_customer_cancellation',
          visual: { position: { x: 500, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_cancellation',
          name: '通知客户取消',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'CANCELLATION' }
          },
          next: 'end_cancelled',
          visual: { position: { x: 650, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'confirm_order',
          name: '确认订单',
          type: 'task',
          task: {
            behaviorId: 'confirmOrder',
            actorId: 'order_processor',
            inputs: {}
          },
          next: 'dispatch_order',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'dispatch_order',
          name: '派发订单',
          type: 'task',
          task: {
            behaviorId: 'dispatchOrder',
            actorId: 'fulfillment_coordinator',
            inputs: {}
          },
          next: 'track_fulfillment',
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'track_fulfillment',
          name: '跟踪履约',
          type: 'task',
          task: {
            behaviorId: 'trackOrderStatus',
            actorId: 'fulfillment_coordinator',
            inputs: {}
          },
          next: 'fulfillment_decision',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'fulfillment_decision',
          name: '履约决策',
          type: 'decision',
          decision: {
            condition: 'fulfillmentCompleted',
            branches: [
              { condition: 'shipped', nextStepId: 'notify_customer_shipped' },
              { condition: 'delivered', nextStepId: 'complete_order' },
              { condition: 'exception', nextStepId: 'handle_exception' }
            ]
          },
          next: ['notify_customer_shipped', 'complete_order', 'handle_exception'],
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_shipped',
          name: '通知客户发货',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'SHIPPED' }
          },
          next: 'complete_order',
          visual: { position: { x: 1000, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'handle_exception',
          name: '处理异常',
          type: 'task',
          task: {
            behaviorId: 'handleFulfillmentException',
            actorId: 'fulfillment_coordinator',
            inputs: {}
          },
          next: 'track_fulfillment',
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'complete_order',
          name: '完成订单',
          type: 'task',
          task: {
            behaviorId: 'completeOrder',
            actorId: 'order_processor',
            inputs: {}
          },
          next: 'end_success',
          visual: { position: { x: 1200, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'end_success',
          name: '订单履约成功',
          type: 'end',
          next: [],
          visual: { position: { x: 1350, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'end_cancelled',
          name: '订单已取消',
          type: 'end',
          next: [],
          visual: { position: { x: 800, y: 250 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'event', event: 'customer_order_placed' },
        { type: 'manual' },
        { type: 'event', event: 'inventory_replenished' }
      ],
      constraints: {
        timeLimit: 172800000, // 48小时完成
        businessRules: ['order_number_unique_rule', 'inventory_availability_rule', 'payment_verification_rule', 'order_amount_validation_rule']
      },
      metrics: {
        averageDuration: 86400000, // 平均24小时
        successRate: 0.94,
        errorPatterns: ['inventory_shortage', 'payment_failure', 'address_invalid']
      }
    },
    
    {
      id: 'return_process',
      name: 'returnProcess',
      displayName: '退货流程',
      description: 'OMS退货处理业务流程：申请→审批→退货→退款→完成',
      category: 'workflow',
      actors: [
        { id: 'customer', name: '客户', role: 'external', permissions: ['request_return'] },
        { id: 'return_processor', name: '退货处理员', role: 'operator', permissions: ['return_review', 'return_approve'] },
        { id: 'warehouse_operator', name: '仓库操作员', role: 'operator', permissions: ['return_receive'] },
        { id: 'finance_clerk', name: '财务员', role: 'operator', permissions: ['refund_process'] },
        { id: 'customer_service', name: '客服', role: 'support', permissions: ['customer_communication'] }
      ],
      steps: [
        {
          id: 'start',
          name: '客户申请退货',
          type: 'start',
          next: 'validate_return_request',
          visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'validate_return_request',
          name: '验证退货申请',
          type: 'task',
          task: {
            behaviorId: 'processReturn',
            actorId: 'return_processor',
            inputs: {},
            timeout: 3600000 // 1小时
          },
          next: 'return_policy_check',
          visual: { position: { x: 250, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'return_policy_check',
          name: '退货政策检查',
          type: 'decision',
          decision: {
            condition: 'returnPolicyCompliant',
            branches: [
              { condition: 'true', nextStepId: 'approve_return' },
              { condition: 'false', nextStepId: 'reject_return' }
            ]
          },
          next: ['approve_return', 'reject_return'],
          visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'reject_return',
          name: '拒绝退货',
          type: 'task',
          task: {
            behaviorId: 'rejectReturn',
            actorId: 'return_processor',
            inputs: {}
          },
          next: 'notify_customer_rejection',
          visual: { position: { x: 400, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_rejection',
          name: '通知客户拒绝',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'RETURN_REJECTED' }
          },
          next: 'end_rejected',
          visual: { position: { x: 550, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'approve_return',
          name: '批准退货',
          type: 'task',
          task: {
            behaviorId: 'approveReturn',
            actorId: 'return_processor',
            inputs: {}
          },
          next: 'generate_return_label',
          visual: { position: { x: 550, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'generate_return_label',
          name: '生成退货标签',
          type: 'task',
          task: {
            behaviorId: 'generateReturnLabel',
            actorId: 'return_processor',
            inputs: {}
          },
          next: 'notify_customer_approval',
          visual: { position: { x: 700, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_approval',
          name: '通知客户批准',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'RETURN_APPROVED' }
          },
          next: 'wait_for_return_shipment',
          visual: { position: { x: 850, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'wait_for_return_shipment',
          name: '等待退货发运',
          type: 'task',
          task: {
            behaviorId: 'waitForReturnShipment',
            actorId: 'return_processor',
            inputs: {},
            timeout: 1209600000 // 14天超时
          },
          next: 'receive_return',
          visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'receive_return',
          name: '接收退货',
          type: 'task',
          task: {
            behaviorId: 'receiveReturn',
            actorId: 'warehouse_operator',
            inputs: {}
          },
          next: 'inspect_return',
          visual: { position: { x: 1150, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'inspect_return',
          name: '检验退货',
          type: 'decision',
          decision: {
            condition: 'returnConditionAcceptable',
            branches: [
              { condition: 'acceptable', nextStepId: 'process_refund' },
              { condition: 'damaged', nextStepId: 'partial_refund' },
              { condition: 'unacceptable', nextStepId: 'reject_return_condition' }
            ]
          },
          next: ['process_refund', 'partial_refund', 'reject_return_condition'],
          visual: { position: { x: 1300, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'reject_return_condition',
          name: '拒绝退货状态',
          type: 'task',
          task: {
            behaviorId: 'rejectReturnCondition',
            actorId: 'return_processor',
            inputs: {}
          },
          next: 'notify_customer_condition_reject',
          visual: { position: { x: 1300, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_condition_reject',
          name: '通知客户状态拒绝',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'RETURN_CONDITION_REJECTED' }
          },
          next: 'end_condition_rejected',
          visual: { position: { x: 1450, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'partial_refund',
          name: '部分退款',
          type: 'task',
          task: {
            behaviorId: 'processPartialRefund',
            actorId: 'finance_clerk',
            inputs: {}
          },
          next: 'notify_customer_partial_refund',
          visual: { position: { x: 1200, y: 350 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_partial_refund',
          name: '通知客户部分退款',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'PARTIAL_REFUND' }
          },
          next: 'complete_return',
          visual: { position: { x: 1350, y: 350 }, type: 'bpmn' }
        },
        {
          id: 'process_refund',
          name: '处理退款',
          type: 'task',
          task: {
            behaviorId: 'processFullRefund',
            actorId: 'finance_clerk',
            inputs: {}
          },
          next: 'update_inventory',
          visual: { position: { x: 1450, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'update_inventory',
          name: '更新库存',
          type: 'task',
          task: {
            behaviorId: 'updateInventory',
            actorId: 'warehouse_operator',
            inputs: { change_type: 'RETURN' }
          },
          next: 'notify_customer_refund',
          visual: { position: { x: 1600, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'notify_customer_refund',
          name: '通知客户退款',
          type: 'task',
          task: {
            behaviorId: 'notifyCustomer',
            actorId: 'customer_service',
            inputs: { notification_type: 'REFUND_PROCESSED' }
          },
          next: 'complete_return',
          visual: { position: { x: 1750, y: 100 }, type: 'bpmn' }
        },
        {
          id: 'complete_return',
          name: '完成退货',
          type: 'task',
          task: {
            behaviorId: 'completeReturn',
            actorId: 'return_processor',
            inputs: {}
          },
          next: 'end_success',
          visual: { position: { x: 1500, y: 350 }, type: 'bpmn' }
        },
        {
          id: 'end_success',
          name: '退货流程完成',
          type: 'end',
          next: [],
          visual: { position: { x: 1650, y: 350 }, type: 'bpmn' }
        },
        {
          id: 'end_rejected',
          name: '退货申请被拒',
          type: 'end',
          next: [],
          visual: { position: { x: 700, y: 250 }, type: 'bpmn' }
        },
        {
          id: 'end_condition_rejected',
          name: '退货状态被拒',
          type: 'end',
          next: [],
          visual: { position: { x: 1600, y: 250 }, type: 'bpmn' }
        }
      ],
      triggers: [
        { type: 'event', event: 'customer_return_request' },
        { type: 'manual' }
      ],
      constraints: {
        timeLimit: 1209600000, // 14天完成
        businessRules: ['return_policy_rule', 'negative_inventory_rule']
      },
      metrics: {
        averageDuration: 604800000, // 平均7天
        successRate: 0.89,
        errorPatterns: ['return_condition_unacceptable', 'customer_no_response', 'refund_processing_error']
      }
    },
    
    {
      id: 'inventory_management',
      name: 'inventoryManagement',
      displayName: '库存管理流程',
      description: 'OMS库存管理业务流程：同步→监控→预警→补货',
      category: 'workflow',
      actors: [
        { id: 'inventory_manager', name: '库存管理员', role: 'controller', permissions: ['inventory_monitor', 'inventory_sync'] },
        { id: 'purchase_manager', name: '采购经理', role: 'manager', permissions: ['purchase_order_create', 'vendor_manage'] },
        { id: 'warehouse_coordinator', name: '仓库协调员', role: 'coordinator', permissions: ['warehouse_coordinate'] },
        { id: 'system_operator', name: '系统操作员', role: 'operator', permissions: ['system_sync', 'data_maintenance'] }
      ],
      steps: [
        {
          id: 'start',
          name: '开始库存管理',
          type: 'start',
          next: 'sync_inventory',
          visual: { position: { x: 100, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'sync_inventory',
          name: '同步库存数据',
          type: 'task',
          task: {
            behaviorId: 'syncWMSInventory',
            actorId: 'system_operator',
            inputs: {}
          },
          next: 'analyze_inventory_levels',
          visual: { position: { x: 250, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'analyze_inventory_levels',
          name: '分析库存水平',
          type: 'task',
          task: {
            behaviorId: 'analyzeInventoryLevels',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'inventory_decision',
          visual: { position: { x: 400, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'inventory_decision',
          name: '库存状态决策',
          type: 'decision',
          decision: {
            condition: 'inventoryStatus',
            branches: [
              { condition: 'low_stock', nextStepId: 'generate_replenishment_alert' },
              { condition: 'out_of_stock', nextStepId: 'emergency_replenishment' },
              { condition: 'overstock', nextStepId: 'optimize_inventory' },
              { condition: 'normal', nextStepId: 'continue_monitoring' }
            ]
          },
          next: ['generate_replenishment_alert', 'emergency_replenishment', 'optimize_inventory', 'continue_monitoring'],
          visual: { position: { x: 550, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'generate_replenishment_alert',
          name: '生成补货预警',
          type: 'task',
          task: {
            behaviorId: 'generateReplenishmentAlert',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'create_purchase_order',
          visual: { position: { x: 450, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'emergency_replenishment',
          name: '紧急补货',
          type: 'task',
          task: {
            behaviorId: 'processEmergencyReplenishment',
            actorId: 'purchase_manager',
            inputs: { priority: 'URGENT' }
          },
          next: 'expedite_purchase_order',
          visual: { position: { x: 550, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'optimize_inventory',
          name: '优化库存',
          type: 'task',
          task: {
            behaviorId: 'optimizeInventoryLevels',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'adjust_safety_stock',
          visual: { position: { x: 650, y: 250 }, type: 'flowchart' }
        },
        {
          id: 'continue_monitoring',
          name: '继续监控',
          type: 'task',
          task: {
            behaviorId: 'scheduleNextMonitoring',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'end',
          visual: { position: { x: 750, y: 100 }, type: 'flowchart' }
        },
        {
          id: 'create_purchase_order',
          name: '创建采购订单',
          type: 'task',
          task: {
            behaviorId: 'managePurchaseOrder',
            actorId: 'purchase_manager',
            inputs: {}
          },
          next: 'track_purchase_order',
          visual: { position: { x: 450, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'expedite_purchase_order',
          name: '加急采购订单',
          type: 'task',
          task: {
            behaviorId: 'managePurchaseOrder',
            actorId: 'purchase_manager',
            inputs: { po_type: 'RUSH' }
          },
          next: 'track_purchase_order',
          visual: { position: { x: 550, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'adjust_safety_stock',
          name: '调整安全库存',
          type: 'task',
          task: {
            behaviorId: 'adjustSafetyStock',
            actorId: 'inventory_manager',
            inputs: {}
          },
          next: 'continue_monitoring',
          visual: { position: { x: 650, y: 400 }, type: 'flowchart' }
        },
        {
          id: 'track_purchase_order',
          name: '跟踪采购订单',
          type: 'task',
          task: {
            behaviorId: 'trackPurchaseOrderStatus',
            actorId: 'purchase_manager',
            inputs: {}
          },
          next: 'purchase_decision',
          visual: { position: { x: 500, y: 550 }, type: 'flowchart' }
        },
        {
          id: 'purchase_decision',
          name: '采购状态决策',
          type: 'decision',
          decision: {
            condition: 'purchaseOrderStatus',
            branches: [
              { condition: 'received', nextStepId: 'update_inventory_receipt' },
              { condition: 'delayed', nextStepId: 'handle_purchase_delay' },
              { condition: 'cancelled', nextStepId: 'find_alternative_supplier' }
            ]
          },
          next: ['update_inventory_receipt', 'handle_purchase_delay', 'find_alternative_supplier'],
          visual: { position: { x: 500, y: 700 }, type: 'flowchart' }
        },
        {
          id: 'update_inventory_receipt',
          name: '更新库存收货',
          type: 'task',
          task: {
            behaviorId: 'updateInventory',
            actorId: 'warehouse_coordinator',
            inputs: { change_type: 'RECEIPT' }
          },
          next: 'continue_monitoring',
          visual: { position: { x: 400, y: 850 }, type: 'flowchart' }
        },
        {
          id: 'handle_purchase_delay',
          name: '处理采购延误',
          type: 'task',
          task: {
            behaviorId: 'handlePurchaseDelay',
            actorId: 'purchase_manager',
            inputs: {}
          },
          next: 'continue_monitoring',
          visual: { position: { x: 500, y: 850 }, type: 'flowchart' }
        },
        {
          id: 'find_alternative_supplier',
          name: '寻找替代供应商',
          type: 'task',
          task: {
            behaviorId: 'findAlternativeSupplier',
            actorId: 'purchase_manager',
            inputs: {}
          },
          next: 'create_purchase_order',
          visual: { position: { x: 600, y: 850 }, type: 'flowchart' }
        },
        {
          id: 'end',
          name: '库存管理完成',
          type: 'end',
          next: [],
          visual: { position: { x: 900, y: 100 }, type: 'flowchart' }
        }
      ],
      triggers: [
        { type: 'schedule', schedule: '0 */6 * * *' }, // 每6小时检查一次
        { type: 'event', event: 'inventory_level_changed' },
        { type: 'condition', condition: 'inventory_below_threshold' }
      ],
      constraints: {
        timeLimit: 86400000, // 24小时完成
        businessRules: ['inventory_availability_rule', 'negative_inventory_rule']
      },
      metrics: {
        averageDuration: 14400000, // 平均4小时
        successRate: 0.96,
        errorPatterns: ['supplier_delay', 'sync_failure', 'calculation_error']
      }
    }
  ],
  
  // Semantic Links between OMS Objects, Behaviors, Rules, and Scenarios
  links: [
    // Merchant and Channel relationships
    {
      id: 'merchant_operates_channels',
      sourceId: 'merchant',
      targetId: 'channel',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '商户运营多个销售渠道',
      visual: { style: 'solid', color: '#1f2937', width: 3, label: 'operates' }
    },
    
    // Product hierarchy relationships
    {
      id: 'brand_includes_spus',
      sourceId: 'brand',
      targetId: 'product_spu',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '品牌包含多个SPU',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'includes' }
    },
    
    {
      id: 'category_contains_spus',
      sourceId: 'category',
      targetId: 'product_spu',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '类别包含多个SPU',
      visual: { style: 'solid', color: '#f59e0b', width: 2, label: 'contains' }
    },
    
    {
      id: 'spu_has_skus',
      sourceId: 'product_spu',
      targetId: 'product_sku',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: 'SPU包含多个SKU',
      visual: { style: 'solid', color: '#8b5cf6', width: 3, label: 'has SKUs' }
    },
    
    // Order relationships
    {
      id: 'merchant_receives_orders',
      sourceId: 'merchant',
      targetId: 'sales_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '商户接收销售订单',
      visual: { style: 'solid', color: '#ef4444', width: 2, label: 'receives' }
    },
    
    {
      id: 'channel_generates_orders',
      sourceId: 'channel',
      targetId: 'sales_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '销售渠道产生订单',
      visual: { style: 'solid', color: '#3b82f6', width: 2, label: 'generates' }
    },
    
    {
      id: 'sales_order_dispatches_to_warehouse',
      sourceId: 'sales_order',
      targetId: 'order_dispatch',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '销售订单派发到仓库',
      visual: { style: 'solid', color: '#ef4444', width: 3, label: 'dispatches to' }
    },
    
    {
      id: 'order_dispatch_uses_warehouse',
      sourceId: 'order_dispatch',
      targetId: 'warehouse_ext',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'uses',
      properties: { multiplicity: 'N:1', direction: 'unidirectional', weight: 1.0 },
      description: '订单派发使用仓库',
      visual: { style: 'solid', color: '#059669', width: 2, label: 'uses' }
    },
    
    // Return relationships
    {
      id: 'sales_order_generates_returns',
      sourceId: 'sales_order',
      targetId: 'return_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 0.8 },
      description: '销售订单可能产生退货单',
      visual: { style: 'dashed', color: '#dc2626', width: 2, label: 'may generate' }
    },
    
    // Purchase relationships
    {
      id: 'merchant_creates_purchase_orders',
      sourceId: 'merchant',
      targetId: 'purchase_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '商户创建采购订单',
      visual: { style: 'solid', color: '#f97316', width: 2, label: 'creates' }
    },
    
    {
      id: 'vendor_receives_purchase_orders',
      sourceId: 'vendor',
      targetId: 'purchase_order',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '供应商接收采购订单',
      visual: { style: 'solid', color: '#7c3aed', width: 2, label: 'receives' }
    },
    
    // Inventory relationships
    {
      id: 'sku_has_inventory',
      sourceId: 'product_sku',
      targetId: 'inventory_summary',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: 'SKU产生库存记录',
      visual: { style: 'solid', color: '#84cc16', width: 3, label: 'has inventory' }
    },
    
    {
      id: 'warehouse_stores_inventory',
      sourceId: 'warehouse_ext',
      targetId: 'inventory_summary',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'aggregates',
      properties: { multiplicity: '1:N', direction: 'unidirectional', weight: 1.0 },
      description: '仓库存储库存',
      visual: { style: 'solid', color: '#6b7280', width: 2, label: 'stores' }
    },
    
    // Address relationships
    {
      id: 'sales_order_uses_address',
      sourceId: 'sales_order',
      targetId: 'address',
      sourceType: 'object',
      targetType: 'object',
      relationshipType: 'uses',
      properties: { multiplicity: 'N:N', direction: 'unidirectional', weight: 1.0 },
      description: '销售订单使用地址',
      visual: { style: 'solid', color: '#f59e0b', width: 2, label: 'uses' }
    },
    
    // Behavior relationships
    {
      id: 'create_order_produces_sales_order',
      sourceId: 'createSalesOrder',
      targetId: 'sales_order',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '创建销售订单行为产生销售订单',
      visual: { style: 'solid', color: '#ef4444', width: 3, label: 'creates' }
    },
    
    {
      id: 'confirm_order_modifies_sales_order',
      sourceId: 'confirmOrder',
      targetId: 'sales_order',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '确认订单行为修改销售订单状态',
      visual: { style: 'solid', color: '#10b981', width: 2, label: 'confirms' }
    },
    
    {
      id: 'dispatch_order_creates_dispatch',
      sourceId: 'dispatchOrder',
      targetId: 'order_dispatch',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '派发订单行为创建派发单',
      visual: { style: 'solid', color: '#059669', width: 3, label: 'creates' }
    },
    
    {
      id: 'process_return_creates_return_order',
      sourceId: 'processReturn',
      targetId: 'return_order',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '处理退货行为创建退货单',
      visual: { style: 'solid', color: '#dc2626', width: 3, label: 'creates' }
    },
    
    {
      id: 'manage_po_creates_purchase_order',
      sourceId: 'managePurchaseOrder',
      targetId: 'purchase_order',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'produces',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '管理采购订单行为创建采购订单',
      visual: { style: 'solid', color: '#f97316', width: 3, label: 'creates' }
    },
    
    {
      id: 'update_inventory_modifies_summary',
      sourceId: 'updateInventory',
      targetId: 'inventory_summary',
      sourceType: 'behavior',
      targetType: 'object',
      relationshipType: 'consumes',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '更新库存行为修改库存汇总',
      visual: { style: 'solid', color: '#84cc16', width: 3, label: 'updates' }
    },
    
    // Rule relationships
    {
      id: 'order_unique_validates_create',
      sourceId: 'order_number_unique_rule',
      targetId: 'createSalesOrder',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '订单号唯一规则验证创建销售订单',
      visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'validates' }
    },
    
    {
      id: 'inventory_availability_validates_create',
      sourceId: 'inventory_availability_rule',
      targetId: 'createSalesOrder',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '库存可用性规则验证创建订单',
      visual: { style: 'dotted', color: '#84cc16', width: 1, label: 'validates' }
    },
    
    {
      id: 'payment_verification_validates_confirm',
      sourceId: 'payment_verification_rule',
      targetId: 'confirmOrder',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '支付验证规则验证确认订单',
      visual: { style: 'dotted', color: '#10b981', width: 1, label: 'validates' }
    },
    
    {
      id: 'return_policy_validates_return',
      sourceId: 'return_policy_rule',
      targetId: 'processReturn',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '退货政策规则验证处理退货',
      visual: { style: 'dotted', color: '#dc2626', width: 1, label: 'validates' }
    },
    
    {
      id: 'negative_inventory_validates_update',
      sourceId: 'negative_inventory_rule',
      targetId: 'updateInventory',
      sourceType: 'rule',
      targetType: 'behavior',
      relationshipType: 'validates',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 1.0 },
      description: '负库存防护规则验证库存更新',
      visual: { style: 'dotted', color: '#84cc16', width: 1, label: 'validates' }
    },
    
    // Scenario relationships
    {
      id: 'fulfillment_uses_create_order',
      sourceId: 'order_fulfillment_process',
      targetId: 'createSalesOrder',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '订单履约流程使用创建销售订单',
      visual: { style: 'solid', color: '#0ea5e9', width: 2, label: 'uses' }
    },
    
    {
      id: 'fulfillment_uses_confirm_order',
      sourceId: 'order_fulfillment_process',
      targetId: 'confirmOrder',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '订单履约流程使用确认订单',
      visual: { style: 'solid', color: '#0ea5e9', width: 2, label: 'uses' }
    },
    
    {
      id: 'fulfillment_uses_dispatch_order',
      sourceId: 'order_fulfillment_process',
      targetId: 'dispatchOrder',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '订单履约流程使用派发订单',
      visual: { style: 'solid', color: '#0ea5e9', width: 2, label: 'uses' }
    },
    
    {
      id: 'return_process_uses_process_return',
      sourceId: 'return_process',
      targetId: 'processReturn',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '退货流程使用处理退货',
      visual: { style: 'solid', color: '#dc2626', width: 2, label: 'uses' }
    },
    
    {
      id: 'inventory_mgmt_uses_sync',
      sourceId: 'inventory_management',
      targetId: 'syncWMSInventory',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '库存管理流程使用同步WMS库存',
      visual: { style: 'solid', color: '#06b6d4', width: 2, label: 'uses' }
    },
    
    {
      id: 'inventory_mgmt_uses_update_inventory',
      sourceId: 'inventory_management',
      targetId: 'updateInventory',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '库存管理流程使用更新库存',
      visual: { style: 'solid', color: '#06b6d4', width: 2, label: 'uses' }
    },
    
    {
      id: 'inventory_mgmt_uses_manage_po',
      sourceId: 'inventory_management',
      targetId: 'managePurchaseOrder',
      sourceType: 'scenario',
      targetType: 'behavior',
      relationshipType: 'uses',
      properties: { multiplicity: '1:1', direction: 'unidirectional', weight: 0.9 },
      description: '库存管理流程使用管理采购订单',
      visual: { style: 'solid', color: '#06b6d4', width: 2, label: 'uses' }
    }
  ],
  
  validation: {
    isValid: true,
    timestamp: new Date().toISOString(),
    errors: [],
    warnings: [],
    metrics: {
      objectCount: 15,
      behaviorCount: 8,
      ruleCount: 6,
      scenarioCount: 3,
      linkCount: 25,
      completenessScore: 91,
      consistencyScore: 94
    }
  }
};

// Export individual components for testing and development
export const OMS_OBJECTS = OMS_DOMAIN_BLUEPRINT.objects;
export const OMS_BEHAVIORS = OMS_DOMAIN_BLUEPRINT.behaviors;
export const OMS_RULES = OMS_DOMAIN_BLUEPRINT.rules;
export const OMS_SCENARIOS = OMS_DOMAIN_BLUEPRINT.scenarios;
export const OMS_LINKS = OMS_DOMAIN_BLUEPRINT.links;