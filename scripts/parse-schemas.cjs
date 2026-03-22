#!/usr/bin/env node

/**
 * Parse unis-agency-agents schema files and convert to Agent Factory format
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_FILES_PATH = '/tmp/unis-agents-data/shared';

function parseSchemaFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '_init_schema.py');
  const domain = filename.toUpperCase();
  
  // Extract table definitions - handle both formats
  const tables = [];
  
  // Format 1: Direct CREATE TABLE statements
  const directTablePattern = /CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\((.*?)\);/gs;
  const directMatches = content.matchAll(directTablePattern);
  
  // Format 2: TABLES dictionary format (like BNP)
  const tablesDict = {};
  const tableDictPattern = /TABLES\['(\w+)']\s*=\s*'''(.*?)'''/gs;
  const dictMatches = content.matchAll(tableDictPattern);
  
  // Parse direct statements first
  for (const match of directMatches) {
    const tableName = match[1];
    const tableDefRaw = match[2];
    tables.push(parseTableDefinition(tableName, tableDefRaw, domain, content));
  }
  
  // Parse dictionary format
  for (const match of dictMatches) {
    const tableName = match[1];
    const createStatement = match[2];
    
    // Extract table definition from CREATE statement
    const createMatch = createStatement.match(/CREATE TABLE IF NOT EXISTS\s+\w+\s*\((.*)\)/s);
    if (createMatch) {
      const tableDefRaw = createMatch[1];
      tables.push(parseTableDefinition(tableName, tableDefRaw, domain, content));
    }
  }
  
  return {
    domain,
    filename: filename,
    tables,
    metadata: {
      file: path.basename(filePath),
      parsedAt: new Date(),
      tablesCount: tables.length
    }
  };
}

function parseTableDefinition(tableName, tableDefRaw, domain, fullContent) {
  // Parse columns
  const columns = [];
  const columnLines = tableDefRaw.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('--') && !line.startsWith('CONSTRAINT'));
  
  for (const line of columnLines) {
    if (line.includes('FOREIGN KEY') || line.includes('PRIMARY KEY') || line.includes('UNIQUE')) {
      continue; // Skip constraint lines
    }
    
    const columnMatch = line.match(/^(\w+)\s+(\w+)(?:\([^)]+\))?\s*(.*)?(?:,|$)/);
    if (columnMatch) {
      const [, name, type, constraints] = columnMatch;
      columns.push({
        name,
        type: mapSQLiteType(type),
        constraints: parseConstraints(constraints || ''),
        nullable: !constraints?.includes('NOT NULL'),
        defaultValue: extractDefault(constraints || '')
      });
    }
  }
  
  // Extract foreign keys
  const foreignKeys = [];
  const fkPattern = /FOREIGN KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/g;
  const fkMatches = tableDefRaw.matchAll(fkPattern);
  
  for (const fkMatch of fkMatches) {
    foreignKeys.push({
      column: fkMatch[1],
      referencedTable: fkMatch[2],
      referencedColumn: fkMatch[3]
    });
  }
  
  return {
    name: tableName,
    domain,
    columns,
    foreignKeys,
    indexes: extractIndexes(fullContent, tableName)
  };
  
  return {
    domain,
    filename: filename,
    tables,
    metadata: {
      file: path.basename(filePath),
      parsedAt: new Date(),
      tablesCount: tables.length
    }
  };
}

function mapSQLiteType(sqliteType) {
  const typeMapping = {
    'TEXT': 'string',
    'INTEGER': 'number',
    'REAL': 'number',
    'BLOB': 'binary',
    'NUMERIC': 'number',
    'BOOLEAN': 'boolean',
    'DATE': 'date',
    'DATETIME': 'datetime',
    'TIMESTAMP': 'timestamp'
  };
  
  const upperType = sqliteType.toUpperCase();
  return typeMapping[upperType] || 'string';
}

function parseConstraints(constraintStr) {
  const constraints = [];
  
  if (constraintStr.includes('PRIMARY KEY')) {
    constraints.push('PRIMARY_KEY');
  }
  if (constraintStr.includes('NOT NULL')) {
    constraints.push('NOT_NULL');
  }
  if (constraintStr.includes('UNIQUE')) {
    constraints.push('UNIQUE');
  }
  if (constraintStr.includes('AUTOINCREMENT')) {
    constraints.push('AUTOINCREMENT');
  }
  
  return constraints;
}

function extractDefault(constraintStr) {
  const defaultMatch = constraintStr.match(/DEFAULT\s+(['"]?[^,\s)]+['"]?)/);
  return defaultMatch ? defaultMatch[1] : null;
}

function extractIndexes(content, tableName) {
  const indexes = [];
  const indexPattern = new RegExp(`CREATE\\s+(?:UNIQUE\\s+)?INDEX\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(\\w+)\\s+ON\\s+${tableName}\\s*\\(([^)]+)\\)`, 'gi');
  const matches = content.matchAll(indexPattern);
  
  for (const match of matches) {
    indexes.push({
      name: match[1],
      columns: match[2].split(',').map(col => col.trim()),
      unique: match[0].toUpperCase().includes('UNIQUE')
    });
  }
  
  return indexes;
}

// Main execution
function main() {
  console.log('🗄️  Parsing unis-agency-agents schemas...');
  
  const schemaFiles = fs.readdirSync(SCHEMA_FILES_PATH)
    .filter(f => f.endsWith('_init_schema.py'))
    .sort();
  
  console.log(`📁 Found ${schemaFiles.length} schema files`);
  
  const parsedSchemas = [];
  const stats = {
    domains: {},
    totalTables: 0,
    totalColumns: 0
  };
  
  for (const file of schemaFiles) {
    try {
      const filePath = path.join(SCHEMA_FILES_PATH, file);
      const schema = parseSchemaFile(filePath);
      parsedSchemas.push(schema);
      
      // Update stats
      stats.domains[schema.domain] = {
        tables: schema.tables.length,
        columns: schema.tables.reduce((sum, table) => sum + table.columns.length, 0)
      };
      stats.totalTables += schema.tables.length;
      stats.totalColumns += schema.tables.reduce((sum, table) => sum + table.columns.length, 0);
      
      console.log(`✅ Parsed: ${file} (${schema.domain}) - ${schema.tables.length} tables`);
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error.message);
    }
  }
  
  console.log('\n📊 Schema Parse Results:');
  console.log(`Total domains: ${Object.keys(stats.domains).length}`);
  console.log(`Total tables: ${stats.totalTables}`);
  console.log(`Total columns: ${stats.totalColumns}`);
  console.log('Domain breakdown:', stats.domains);
  
  // Create domain relationships map
  const relationships = createRelationshipsMap(parsedSchemas);
  
  // Write output
  const outputPath = '/tmp/agent-factory-check/src/data/agency-schemas.ts';
  const output = `// Generated from unis-agency-agents schema files
// Total domains: ${Object.keys(stats.domains).length}
// Total tables: ${stats.totalTables}
// Total columns: ${stats.totalColumns}
// Generated on: ${new Date().toISOString()}

export interface SchemaColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'binary';
  constraints: string[];
  nullable: boolean;
  defaultValue?: string | null;
}

export interface SchemaForeignKey {
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface SchemaIndex {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface SchemaTable {
  name: string;
  domain: string;
  columns: SchemaColumn[];
  foreignKeys: SchemaForeignKey[];
  indexes: SchemaIndex[];
}

export interface DomainSchema {
  domain: string;
  filename: string;
  tables: SchemaTable[];
  metadata: {
    file: string;
    parsedAt: Date;
    tablesCount: number;
  };
}

export const agencySchemas: DomainSchema[] = ${JSON.stringify(parsedSchemas, null, 2)};

export const schemaStats = ${JSON.stringify(stats, null, 2)};

export const domainRelationships = ${JSON.stringify(relationships, null, 2)};

// Helper functions
export function getTablesByDomain(domain: string): SchemaTable[] {
  const schema = agencySchemas.find(s => s.domain === domain);
  return schema ? schema.tables : [];
}

export function getTableByName(tableName: string): SchemaTable | undefined {
  for (const schema of agencySchemas) {
    const table = schema.tables.find(t => t.name === tableName);
    if (table) return table;
  }
  return undefined;
}

export function getRelatedTables(tableName: string): string[] {
  const related = new Set<string>();
  
  // Find tables that reference this table
  for (const schema of agencySchemas) {
    for (const table of schema.tables) {
      for (const fk of table.foreignKeys) {
        if (fk.referencedTable === tableName) {
          related.add(table.name);
        }
        if (table.name === tableName) {
          related.add(fk.referencedTable);
        }
      }
    }
  }
  
  return Array.from(related);
}

// Domain color mapping (matches agency-agents.ts)
export const DOMAIN_COLORS = {
  WMS: '#3B82F6',    // Blue
  OMS: '#10B981',    // Green
  FMS: '#F59E0B',    // Amber
  BNP: '#F59E0B',    // Amber
  YMS: '#8B5CF6'     // Purple
};
`;
  
  fs.writeFileSync(outputPath, output);
  console.log(`\n💾 Saved agency schemas to: ${outputPath}`);
  
  return parsedSchemas;
}

function createRelationshipsMap(schemas) {
  const relationships = {};
  
  for (const schema of schemas) {
    relationships[schema.domain] = {};
    
    for (const table of schema.tables) {
      relationships[schema.domain][table.name] = {
        referencedBy: [],
        references: []
      };
      
      // Find what this table references
      for (const fk of table.foreignKeys) {
        relationships[schema.domain][table.name].references.push({
          table: fk.referencedTable,
          column: fk.column,
          referencedColumn: fk.referencedColumn
        });
      }
    }
  }
  
  // Find what references each table
  for (const schema of schemas) {
    for (const table of schema.tables) {
      for (const fk of table.foreignKeys) {
        // Find the referenced table in any domain
        for (const targetSchema of schemas) {
          const targetTable = targetSchema.tables.find(t => t.name === fk.referencedTable);
          if (targetTable) {
            if (!relationships[targetSchema.domain]) {
              relationships[targetSchema.domain] = {};
            }
            if (!relationships[targetSchema.domain][targetTable.name]) {
              relationships[targetSchema.domain][targetTable.name] = { referencedBy: [], references: [] };
            }
            
            relationships[targetSchema.domain][targetTable.name].referencedBy.push({
              table: table.name,
              domain: schema.domain,
              column: fk.column,
              referencedColumn: fk.referencedColumn
            });
          }
        }
      }
    }
  }
  
  return relationships;
}

if (require.main === module) {
  main();
}

module.exports = { main, parseSchemaFile };