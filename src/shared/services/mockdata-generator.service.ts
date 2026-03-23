/**
 * Mock Data Generator Service
 * Generates realistic test data for database tables with proper FK constraints
 * Supports various data types and business rules
 */

import { SchemaTable, SchemaColumn, SchemaForeignKey } from '@/data/agency-schemas';

export interface DataGenerationConfig {
  domain: string;
  tables: TableGenerationConfig[];
  globalSettings: {
    seed?: number;
    dateRange: [Date, Date];
    locale: string;
  };
}

export interface TableGenerationConfig {
  tableName: string;
  rowCount: number;
  statusDistribution?: Record<string, number>;
  customGenerators?: Record<string, DataGenerator>;
  constraints?: GenerationConstraint[];
}

export interface GenerationConstraint {
  type: 'range' | 'pattern' | 'enum' | 'reference';
  column: string;
  value: any;
}

export interface DataGenerator {
  type: string;
  config: any;
}

export interface GeneratedDataSet {
  id: string;
  configId: string;
  domain: string;
  data: Map<string, any[]>;
  metadata: {
    rowCounts: Record<string, number>;
    generationTime: number;
    checksum: string;
  };
  createdAt: Date;
}

export interface TableData {
  [column: string]: any;
}

/**
 * Constraint Solver for handling FK dependencies and generation order
 */
export class ConstraintSolver {
  
  /**
   * Topological sort of tables by foreign key dependencies
   */
  topologicalSort(tables: SchemaTable[], relationships: SchemaForeignKey[]): SchemaTable[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize graph
    tables.forEach(table => {
      graph.set(table.name, []);
      inDegree.set(table.name, 0);
    });
    
    // Build dependency graph
    tables.forEach(table => {
      table.foreignKeys.forEach(fk => {
        const referencedTable = fk.referencedTable;
        if (graph.has(referencedTable)) {
          graph.get(referencedTable)!.push(table.name);
          inDegree.set(table.name, (inDegree.get(table.name) || 0) + 1);
        }
      });
    });
    
    // Perform topological sort
    const queue: string[] = [];
    const result: SchemaTable[] = [];
    
    // Start with tables that have no dependencies
    inDegree.forEach((degree, tableName) => {
      if (degree === 0) {
        queue.push(tableName);
      }
    });
    
    while (queue.length > 0) {
      const currentTable = queue.shift()!;
      const table = tables.find(t => t.name === currentTable);
      if (table) {
        result.push(table);
      }
      
      // Process dependent tables
      const dependents = graph.get(currentTable) || [];
      dependents.forEach(dependent => {
        const newDegree = (inDegree.get(dependent) || 0) - 1;
        inDegree.set(dependent, newDegree);
        
        if (newDegree === 0) {
          queue.push(dependent);
        }
      });
    }
    
    // Handle any remaining tables (circular dependencies)
    tables.forEach(table => {
      if (!result.find(t => t.name === table.name)) {
        result.push(table);
      }
    });
    
    return result;
  }
  
  /**
   * Validate generated data against constraints
   */
  validateConstraints(
    table: SchemaTable,
    data: any[],
    allGeneratedData: Map<string, any[]>
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    
    data.forEach((row, index) => {
      // Validate foreign key constraints
      table.foreignKeys.forEach(fk => {
        const referencedData = allGeneratedData.get(fk.referencedTable);
        if (referencedData && row[fk.column]) {
          const referencedIds = referencedData.map(r => r[fk.referencedColumn]);
          if (!referencedIds.includes(row[fk.column])) {
            violations.push({
              table: table.name,
              row: index,
              column: fk.column,
              type: 'foreign_key_violation',
              message: `Referenced ${fk.referencedTable}.${fk.referencedColumn} = ${row[fk.column]} does not exist`
            });
          }
        }
      });
      
      // Validate column constraints
      table.columns.forEach(column => {
        const value = row[column.name];
        
        // NOT NULL constraint
        if (!column.nullable && (value === null || value === undefined)) {
          violations.push({
            table: table.name,
            row: index,
            column: column.name,
            type: 'not_null_violation',
            message: `Column ${column.name} cannot be null`
          });
        }
        
        // Type constraints
        if (value !== null && value !== undefined) {
          const validType = this.validateColumnType(column, value);
          if (!validType) {
            violations.push({
              table: table.name,
              row: index,
              column: column.name,
              type: 'type_violation',
              message: `Value ${value} is not valid for type ${column.type}`
            });
          }
        }
      });
    });
    
    return violations;
  }
  
  private validateColumnType(column: SchemaColumn, value: any): boolean {
    switch (column.type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return value instanceof Date || !isNaN(Date.parse(value));
      default:
        return true; // Allow unknown types
    }
  }
}

/**
 * Data Generator Factory
 */
export class DataGeneratorFactory {
  private faker: FakerService;
  
  constructor(locale: string = 'zh_CN') {
    this.faker = new FakerService(locale);
  }
  
  createGenerator(table: SchemaTable, config: TableGenerationConfig): TableDataGenerator {
    return new TableDataGenerator(table, config, this.faker);
  }
}

/**
 * Table-specific data generator
 */
class TableDataGenerator {
  constructor(
    private table: SchemaTable,
    private config: TableGenerationConfig,
    private faker: FakerService
  ) {}
  
  async generateRows(rowCount: number, existingData: Map<string, any[]>): Promise<any[]> {
    const rows: any[] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const row = await this.generateSingleRow(i, existingData, rows);
      rows.push(row);
    }
    
    return rows;
  }
  
  private async generateSingleRow(
    index: number,
    existingData: Map<string, any[]>,
    currentRows: any[]
  ): Promise<any> {
    const row: any = {};
    
    for (const column of this.table.columns) {
      row[column.name] = this.generateColumnValue(
        column,
        index,
        existingData,
        currentRows,
        row
      );
    }
    
    return row;
  }
  
  private generateColumnValue(
    column: SchemaColumn,
    rowIndex: number,
    existingData: Map<string, any[]>,
    currentRows: any[],
    currentRow: any
  ): any {
    
    // Check for custom generator
    const customGenerator = this.config.customGenerators?.[column.name];
    if (customGenerator) {
      return this.executeCustomGenerator(customGenerator, column, rowIndex);
    }
    
    // Handle foreign keys
    const foreignKey = this.table.foreignKeys.find(fk => fk.column === column.name);
    if (foreignKey) {
      return this.generateForeignKeyValue(foreignKey, existingData);
    }
    
    // Handle primary keys and common patterns
    if (this.isPrimaryKey(column)) {
      return this.generatePrimaryKey(column, rowIndex);
    }
    
    // Handle status columns with distribution
    if (this.isStatusColumn(column)) {
      return this.generateStatusValue(column);
    }
    
    // Handle date columns
    if (this.isDateColumn(column)) {
      return this.generateDateValue(column);
    }
    
    // Generate by type
    return this.generateByType(column, rowIndex);
  }
  
  private generateForeignKeyValue(fk: SchemaForeignKey, existingData: Map<string, any[]>): any {
    const referencedData = existingData.get(fk.referencedTable);
    if (!referencedData || referencedData.length === 0) {
      return null; // Will be caught by constraint validation
    }
    
    // Randomly select a referenced value
    const randomRow = referencedData[Math.floor(Math.random() * referencedData.length)];
    return randomRow[fk.referencedColumn];
  }
  
  private generatePrimaryKey(column: SchemaColumn, index: number): any {
    if (column.constraints.includes('AUTOINCREMENT')) {
      return index + 1;
    }
    
    if (column.type === 'string') {
      // Generate UUID-like primary key
      return `${this.table.name}_${Date.now()}_${index.toString().padStart(4, '0')}`;
    }
    
    return index + 1;
  }
  
  private generateStatusValue(column: SchemaColumn): string {
    const distribution = this.config.statusDistribution;
    
    if (distribution) {
      // Use weighted random selection
      const rand = Math.random();
      let cumulative = 0;
      
      for (const [status, probability] of Object.entries(distribution)) {
        cumulative += probability;
        if (rand <= cumulative) {
          return status;
        }
      }
    }
    
    // Default status values by domain
    const defaultStatuses = this.getDefaultStatusValues();
    return this.faker.randomChoice(defaultStatuses);
  }
  
  private generateDateValue(column: SchemaColumn): string | Date {
    const dateRange: [Date, Date] = [new Date(2024, 0, 1), new Date()];
    
    if (column.name.toLowerCase().includes('created')) {
      // Created dates should be earlier
      const start = dateRange[0].getTime();
      const end = dateRange[1].getTime();
      const randomTime = start + Math.random() * (end - start);
      return new Date(randomTime).toISOString();
    }
    
    if (column.name.toLowerCase().includes('updated')) {
      // Updated dates should be more recent
      const now = Date.now();
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
      const randomTime = monthAgo + Math.random() * (now - monthAgo);
      return new Date(randomTime).toISOString();
    }
    
    // Default date generation
    return this.faker.dateInRange(dateRange[0], dateRange[1]).toISOString();
  }
  
  private generateByType(column: SchemaColumn, index: number): any {
    switch (column.type) {
      case 'string':
        return this.generateStringValue(column, index);
      case 'number':
        return this.generateNumberValue(column);
      case 'boolean':
        return Math.random() > 0.5;
      case 'date':
      case 'datetime':
      case 'timestamp':
        return this.generateDateValue(column);
      default:
        return null;
    }
  }
  
  private generateStringValue(column: SchemaColumn, index: number): string {
    const columnName = column.name.toLowerCase();
    
    // Pattern-based generation
    if (columnName.includes('name')) {
      return this.faker.companyName();
    }
    if (columnName.includes('email')) {
      return this.faker.email();
    }
    if (columnName.includes('phone')) {
      return this.faker.phoneNumber();
    }
    if (columnName.includes('address')) {
      return this.faker.address();
    }
    if (columnName.includes('description') || columnName.includes('note')) {
      return this.faker.sentence();
    }
    if (columnName.includes('code') || columnName.includes('number')) {
      return this.faker.alphanumeric(8).toUpperCase();
    }
    
    // Default string
    return `${column.name}_${index.toString().padStart(4, '0')}`;
  }
  
  private generateNumberValue(column: SchemaColumn): number {
    const columnName = column.name.toLowerCase();
    
    if (columnName.includes('amount') || columnName.includes('price') || columnName.includes('cost')) {
      return Math.round((Math.random() * 10000 + 100) * 100) / 100;
    }
    if (columnName.includes('quantity') || columnName.includes('count')) {
      return Math.floor(Math.random() * 1000) + 1;
    }
    if (columnName.includes('weight')) {
      return Math.round((Math.random() * 100 + 1) * 100) / 100;
    }
    if (columnName.includes('percentage') || columnName.includes('rate')) {
      return Math.round(Math.random() * 100 * 100) / 100;
    }
    
    // Default number
    return Math.floor(Math.random() * 1000000);
  }
  
  private executeCustomGenerator(generator: DataGenerator, column: SchemaColumn, index: number): any {
    // Implement custom generator logic based on type
    switch (generator.type) {
      case 'sequence':
        return generator.config.start + index * (generator.config.step || 1);
      case 'pattern':
        return generator.config.pattern.replace('{index}', index.toString().padStart(4, '0'));
      case 'enum':
        return this.faker.randomChoice(generator.config.values);
      default:
        return this.generateByType(column, index);
    }
  }
  
  private isPrimaryKey(column: SchemaColumn): boolean {
    return column.constraints.includes('PRIMARY_KEY') || 
           column.name.toLowerCase() === 'id' ||
           column.name.toLowerCase().endsWith('_id') && column.constraints.includes('UNIQUE');
  }
  
  private isStatusColumn(column: SchemaColumn): boolean {
    return column.name.toLowerCase().includes('status') ||
           column.name.toLowerCase().includes('state');
  }
  
  private isDateColumn(column: SchemaColumn): boolean {
    return column.type === 'date' || 
           column.type === 'datetime' || 
           column.type === 'timestamp' ||
           column.name.toLowerCase().includes('date') ||
           column.name.toLowerCase().includes('time');
  }
  
  private getDefaultStatusValues(): string[] {
    const domainStatuses: Record<string, string[]> = {
      'wms': ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      'fms': ['PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      'oms': ['DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'],
      'bnp': ['PENDING', 'APPROVED', 'PAID', 'OVERDUE', 'CANCELLED'],
      'yms': ['SCHEDULED', 'CHECKED_IN', 'LOADING', 'LOADED', 'CHECKED_OUT']
    };
    
    return domainStatuses[this.table.domain.toLowerCase()] || ['ACTIVE', 'INACTIVE', 'PENDING'];
  }
}

/**
 * Faker Service for generating realistic data
 */
class FakerService {
  private locale: string;
  
  constructor(locale: string = 'zh_CN') {
    this.locale = locale;
  }
  
  companyName(): string {
    const companies = [
      '北京物流有限公司', '上海运输集团', '深圳国际货运', '广州供应链管理',
      '天津港务集团', '青岛海运公司', '杭州智慧物流', '成都仓储服务',
      'Global Logistics Corp', 'Express Transport Inc', 'Swift Cargo Ltd',
      'Prime Shipping Solutions', 'Rapid Freight Services'
    ];
    return this.randomChoice(companies);
  }
  
  email(): string {
    const domains = ['example.com', 'test.com', 'logistics.com', 'freight.com'];
    const names = ['user', 'admin', 'manager', 'operator', 'clerk'];
    const name = this.randomChoice(names);
    const domain = this.randomChoice(domains);
    const number = Math.floor(Math.random() * 1000);
    return `${name}${number}@${domain}`;
  }
  
  phoneNumber(): string {
    if (this.locale.includes('zh')) {
      // Chinese mobile format
      const prefixes = ['138', '139', '186', '188', '199'];
      const prefix = this.randomChoice(prefixes);
      const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      return `${prefix}${suffix}`;
    }
    
    // US format
    const area = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `(${area}) ${exchange}-${number}`;
  }
  
  address(): string {
    const chineseAddresses = [
      '北京市朝阳区建国门外大街1号',
      '上海市浦东新区陆家嘴环路1000号',
      '深圳市福田区深南大道1号',
      '广州市天河区珠江新城华夏路1号',
      '杭州市西湖区文三路1号'
    ];
    
    const englishAddresses = [
      '123 Main Street, Anytown, NY 12345',
      '456 Oak Avenue, Somewhere, CA 90210',
      '789 Elm Drive, Cityville, TX 75001',
      '321 Pine Road, Township, FL 33101'
    ];
    
    const addresses = this.locale.includes('zh') ? chineseAddresses : englishAddresses;
    return this.randomChoice(addresses);
  }
  
  sentence(): string {
    const sentences = [
      '这是一个示例描述，用于演示数据生成功能。',
      '系统自动生成的测试数据，包含基础信息。',
      '用于模拟真实业务场景的样本数据记录。',
      'Generated sample data for testing and demonstration purposes.',
      'Automated data generation with realistic business content.',
      'Mock data entry created for system testing and validation.'
    ];
    return this.randomChoice(sentences);
  }
  
  alphanumeric(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  dateInRange(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }
  
  randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

/**
 * Main Mock Data Generator Service
 */
export class MockDataGenerator {
  private constraintSolver: ConstraintSolver;
  private dataGeneratorFactory: DataGeneratorFactory;
  
  constructor() {
    this.constraintSolver = new ConstraintSolver();
    this.dataGeneratorFactory = new DataGeneratorFactory();
  }
  
  async generateData(
    config: DataGenerationConfig,
    tables: SchemaTable[]
  ): Promise<Map<string, TableData[]>> {
    
    // Sort tables by FK dependencies
    const sortedTables = this.constraintSolver.topologicalSort(tables, []);
    
    const generatedData = new Map<string, TableData[]>();
    
    // Generate data for each table in dependency order
    for (const table of sortedTables) {
      const tableConfig = config.tables.find(t => t.tableName === table.name);
      if (!tableConfig) continue;
      
      console.log(`Generating data for table: ${table.name} (${tableConfig.rowCount} rows)`);
      
      try {
        const generator = this.dataGeneratorFactory.createGenerator(table, tableConfig);
        const data = await generator.generateRows(tableConfig.rowCount, generatedData);
        
        generatedData.set(table.name, data);
        
        // Validate constraints
        const violations = this.constraintSolver.validateConstraints(table, data, generatedData);
        
        if (violations.length > 0) {
          console.warn(`Constraint violations in ${table.name}:`, violations);
          // Could implement constraint violation handling here
        }
        
        console.log(`✅ Generated ${data.length} rows for ${table.name}`);
        
      } catch (error: unknown) {
        console.error(`Failed to generate data for ${table.name}:`, error);
        throw new Error(`Data generation failed for table ${table.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return generatedData;
  }
  
  /**
   * Create default generation config for a domain
   */
  createDefaultConfig(domain: string, tables: SchemaTable[]): DataGenerationConfig {
    const now = new Date();
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    return {
      domain,
      tables: tables.map(table => ({
        tableName: table.name,
        rowCount: this.getDefaultRowCount(table),
        statusDistribution: this.getDefaultStatusDistribution(domain),
        customGenerators: {},
        constraints: []
      })),
      globalSettings: {
        dateRange: [yearAgo, now],
        locale: 'zh_CN'
      }
    };
  }
  
  private getDefaultRowCount(table: SchemaTable): number {
    // Assign different row counts based on table type
    const tableName = table.name.toLowerCase();
    
    if (tableName.includes('user') || tableName.includes('customer') || tableName.includes('vendor')) {
      return 50;
    }
    if (tableName.includes('order') || tableName.includes('shipment') || tableName.includes('invoice')) {
      return 200;
    }
    if (tableName.includes('item') || tableName.includes('product') || tableName.includes('sku')) {
      return 100;
    }
    if (tableName.includes('log') || tableName.includes('history') || tableName.includes('audit')) {
      return 500;
    }
    
    // Default
    return 100;
  }
  
  private getDefaultStatusDistribution(domain: string): Record<string, number> {
    const distributions: Record<string, Record<string, number>> = {
      wms: {
        'ACTIVE': 0.7,
        'PENDING': 0.2,
        'COMPLETED': 0.08,
        'CANCELLED': 0.02
      },
      fms: {
        'DELIVERED': 0.6,
        'IN_TRANSIT': 0.25,
        'PLANNED': 0.1,
        'CANCELLED': 0.05
      },
      oms: {
        'DELIVERED': 0.5,
        'CONFIRMED': 0.3,
        'PROCESSING': 0.15,
        'CANCELLED': 0.05
      },
      bnp: {
        'PAID': 0.6,
        'PENDING': 0.25,
        'OVERDUE': 0.1,
        'CANCELLED': 0.05
      },
      yms: {
        'CHECKED_OUT': 0.4,
        'SCHEDULED': 0.3,
        'CHECKED_IN': 0.2,
        'LOADING': 0.1
      }
    };
    
    return distributions[domain.toLowerCase()] || distributions.wms;
  }
}

// Supporting interfaces and types

export interface ConstraintViolation {
  table: string;
  row: number;
  column: string;
  type: 'foreign_key_violation' | 'not_null_violation' | 'type_violation' | 'unique_violation';
  message: string;
}

export class ConstraintViolationError extends Error {
  constructor(public violations: ConstraintViolation[]) {
    super(`Constraint violations: ${violations.length} errors`);
    this.name = 'ConstraintViolationError';
  }
}

// Export singleton instance
export const mockDataGenerator = new MockDataGenerator();