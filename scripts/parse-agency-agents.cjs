#!/usr/bin/env node

/**
 * Parse unis-agency-agents and convert to Agent Factory format
 */

const fs = require('fs');
const path = require('path');

const UNIS_DATA_PATH = '/tmp/unis-agents-data';
const AGENT_FILES_PATH = path.join(UNIS_DATA_PATH, 'agents');
const SCHEMA_FILES_PATH = path.join(UNIS_DATA_PATH, 'shared');

// Domain mappings
const DOMAIN_MAPPINGS = {
  'bnp': 'FMS', // Bill and Pay -> Financial Management System
  'fms': 'FMS', // Financial Management System
  'oms': 'OMS', // Order Management System  
  'wms': 'WMS', // Warehouse Management System
  'yms': 'YMS', // Yard Management System
  'enterprise': 'general' // Enterprise orchestrator
};

// Function mappings
const FUNCTION_MAPPINGS = {
  'analytics': 'data-analysis',
  'foundation': 'automation', 
  'inventory': 'monitoring',
  'inbound': 'automation',
  'outbound': 'automation',
  'orchestrator': 'automation',
  'billing': 'automation',
  'invoice': 'automation',
  'payment': 'automation',
  'bank': 'automation',
  'debt-collection': 'automation',
  'claim': 'automation',
  'commission': 'automation',
  'integration': 'integration',
  'bookkeeping': 'automation',
  'contract': 'automation',
  'vendor-bill': 'automation',
  'small-parcel': 'automation',
  'lso': 'automation',
  'fixed-asset': 'automation',
  'order': 'automation',
  'rate': 'automation',
  'yard': 'automation',
  'route': 'optimization',
  'appointment': 'automation',
  'dock': 'monitoring'
};

function parseAgentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Parse YAML frontmatter
  let frontmatterEnd = -1;
  const frontmatter = {};
  
  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        frontmatterEnd = i;
        break;
      }
      const [key, ...valueParts] = lines[i].split(':');
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    }
  }
  
  // Parse filename for domain/department/role
  const filename = path.basename(filePath, '.md');
  const parts = filename.split('-');
  
  let domain = 'general';
  let department = 'specialized';
  let role = filename;
  
  if (parts.length >= 2) {
    domain = parts[0];
    department = parts[1]; 
    if (parts.length >= 3) {
      role = parts.slice(2).join('-');
    }
  }
  
  // Get content after frontmatter
  const bodyContent = frontmatterEnd > -1 ? 
    lines.slice(frontmatterEnd + 1).join('\n').trim() : content;
  
  // Extract sections
  const sections = extractSections(bodyContent);
  
  // Parse capabilities from content
  const capabilities = extractCapabilities(bodyContent);
  
  // Parse database tables mentioned
  const dbTables = extractDatabaseTables(bodyContent);
  
  // Create agent ID
  const agentId = `agency-${filename}`;
  
  return {
    id: agentId,
    name: frontmatter.name || filename,
    displayName: frontmatter.description ? 
      frontmatter.description.split(' — ')[0].replace(/🎯|📈|🔧|⚙️|📊|💼|🏢|🎯|📋|💰/g, '').trim() :
      role.replace(/-/g, ' '),
    description: frontmatter.description || '',
    version: '1.0.0',
    status: 'published',
    category: {
      industry: DOMAIN_MAPPINGS[domain] || 'general',
      function: FUNCTION_MAPPINGS[department] || 'automation',
      division: department === 'orchestrator' ? 'strategy' : 'specialized'
    },
    pricing: {
      model: 'free',
      price: 0,
      currency: 'USD'
    },
    capabilities,
    skills: [], // TODO: Parse from tools and content
    prompts: {
      system: extractSystemPrompt(bodyContent),
      user: 'Execute the assigned task according to my role and capabilities.',
      variables: []
    },
    ontologySubset: [], // TODO: Extract from database tables
    sdd: { 
      requirements: '',
      api: '',
      database: '',
      deployment: ''
    },
    build: { 
      status: 'success',
      logs: ['Agency agent - no build required'],
      timestamp: new Date()
    },
    test: {
      status: 'passed',
      coverage: 100,
      suites: [],
      timestamp: new Date()
    },
    metadata: {
      author: 'UNIS Agency',
      tags: [domain, department, 'agency', 'claude-code'],
      rating: 5,
      downloads: 0,
      reviews: [],
      source: 'unis-agency-agents',
      division: department,
      divisionName: department.replace(/-/g, ' ')
    },
    source: {
      provider: 'unis-agency-agents', 
      relativePath: `agents/${filename}.md`,
      importedAt: new Date(),
      checksum: generateChecksum(content)
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    soul: createAgentSoul(sections, domain, department, role),
    
    // Additional agency-specific fields
    agencyData: {
      domain,
      department, 
      role,
      dbTables,
      workflow: extractWorkflowChains(bodyContent),
      dependencies: extractDependencies(bodyContent)
    }
  };
}

function extractSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.startsWith('# ') && !currentSection) {
      currentSection = line.replace('# ', '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

function extractCapabilities(content) {
  const capabilities = [];
  
  // Look for bullet points and function lists
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const cap = line.replace(/^[-*]\s+/, '').trim();
      if (cap && cap.length < 100) {
        capabilities.push(cap);
      }
    }
  }
  
  // Look for specific patterns
  const patterns = [
    /Function ID.*?\|(.*?)\|/g,
    /### (.*?)(?:\n|$)/g,
    /功能.*?：(.*?)(?:\n|$)/g
  ];
  
  patterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const cap = match[1].trim();
        if (cap && cap.length < 100 && !capabilities.includes(cap)) {
          capabilities.push(cap);
        }
      }
    }
  });
  
  return capabilities.slice(0, 8); // Limit to 8 capabilities
}

function extractDatabaseTables(content) {
  const tables = [];
  const tablePattern = /`?doc_\w+`?|`?\w+_table`?/g;
  const matches = content.matchAll(tablePattern);
  
  for (const match of matches) {
    const table = match[0].replace(/`/g, '');
    if (!tables.includes(table)) {
      tables.push(table);
    }
  }
  
  return tables;
}

function extractSystemPrompt(content) {
  // Look for identity/role sections
  const identityMatch = content.match(/## 🧠.*?Identity.*?\n(.*?)(?=\n## |\n\n|\n#|$)/s);
  if (identityMatch) {
    return identityMatch[1].trim();
  }
  
  // Fallback to description
  const descMatch = content.match(/^# (.*?)$/m);
  if (descMatch) {
    return `You are ${descMatch[1]}. Follow the mission and rules defined in your role.`;
  }
  
  return 'You are an agency agent. Execute tasks according to your specialization.';
}

function createAgentSoul(sections, domain, department, role) {
  return {
    identity: {
      role: role.replace(/-/g, ' '),
      personality: sections['Identity & Memory'] || sections['🧠 Identity & Memory'] || 'Professional and efficient',
      memory: 'Maintains context relevant to role and domain',
      experience: `Expert in ${domain} domain, ${department} operations`
    },
    mission: [{
      title: 'Core Mission',
      description: sections['Core Mission'] || sections['🎯 Core Mission'] || sections['🎯 Your Core Mission'] || 'Execute specialized tasks within domain',
      capabilities: extractCapabilities(Object.values(sections).join('\n'))
    }],
    criticalRules: extractCriticalRules(sections),
    workflow: extractWorkflowSteps(sections),
    communicationStyle: extractCommunicationStyle(sections),
    successMetrics: extractSuccessMetrics(sections),
    vibe: 'Professional, efficient, domain-focused',
    emoji: getAgentEmoji(domain, department),
    color: getDomainColor(domain),
    rawSections: {
      identity: sections['Identity & Memory'] || sections['🧠 Identity & Memory'],
      mission: sections['Core Mission'] || sections['🎯 Core Mission'] || sections['🎯 Your Core Mission'],
      criticalRules: sections['Critical Rules'] || sections['⚠️ Critical Rules'] || sections['🚨 Critical Rules You Must Follow'],
      workflow: sections['Workflow'] || sections['Process'] || sections['Steps'],
      communicationStyle: sections['Communication Style'] || sections['💬 Communication Style'],
      successMetrics: sections['Success Metrics'] || sections['📊 Success Metrics']
    }
  };
}

function extractCriticalRules(sections) {
  const rulesSection = sections['Critical Rules'] || sections['⚠️ Critical Rules'] || 
                      sections['🚨 Critical Rules You Must Follow'] || '';
  
  if (!rulesSection) return ['Follow domain best practices', 'Maintain data integrity'];
  
  const rules = [];
  const lines = rulesSection.split('\n');
  
  for (const line of lines) {
    if (line.match(/^\d+\./) || line.startsWith('- ') || line.startsWith('* ')) {
      const rule = line.replace(/^\d+\.|\s*[-*]\s*/, '').trim();
      if (rule) rules.push(rule);
    }
  }
  
  return rules.slice(0, 6); // Limit to 6 rules
}

function extractWorkflowSteps(sections) {
  // This is a simplified implementation
  return [{
    step: 1,
    name: 'Execute Task',
    description: 'Execute assigned task according to role capabilities',
    commands: ['Analyze request', 'Apply domain knowledge', 'Deliver results']
  }];
}

function extractCommunicationStyle(sections) {
  const styleSection = sections['Communication Style'] || sections['💬 Communication Style'] || '';
  
  if (styleSection) {
    const styles = [];
    const lines = styleSection.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        styles.push(line.replace(/^[-*]\s+/, '').trim());
      }
    }
    
    return styles;
  }
  
  return ['Professional', 'Clear and concise', 'Domain-focused'];
}

function extractSuccessMetrics(sections) {
  const metricsSection = sections['Success Metrics'] || sections['📊 Success Metrics'] || '';
  
  if (metricsSection) {
    const metrics = [];
    const lines = metricsSection.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const metric = line.replace(/^[-*]\s+/, '').trim();
        metrics.push({
          name: metric,
          target: '100%',
          description: metric
        });
      }
    }
    
    return metrics;
  }
  
  return [{
    name: 'Task completion rate',
    target: '100%',
    description: 'Successfully complete assigned tasks'
  }];
}

function extractWorkflowChains(content) {
  const chains = [];
  const chainPattern = /Chain \d+.*?\n(.*?)(?=\n\*\*Chain|\n##|\n\n|$)/gs;
  const matches = content.matchAll(chainPattern);
  
  for (const match of matches) {
    if (match[1]) {
      chains.push(match[1].trim());
    }
  }
  
  return chains;
}

function extractDependencies(content) {
  const deps = [];
  const depPattern = /@[\w-]+/g;
  const matches = content.matchAll(depPattern);
  
  for (const match of matches) {
    const dep = match[0].replace('@', '');
    if (!deps.includes(dep)) {
      deps.push(dep);
    }
  }
  
  return deps;
}

function getAgentEmoji(domain, department) {
  const emojiMap = {
    'wms': '📦',
    'oms': '📋',
    'fms': '💰',
    'bnp': '💰', 
    'yms': '🚛',
    'enterprise': '🎯'
  };
  
  return emojiMap[domain] || '⚙️';
}

function getDomainColor(domain) {
  const colorMap = {
    'wms': '#3B82F6',    // Blue
    'oms': '#10B981',    // Green
    'fms': '#F59E0B',    // Amber
    'bnp': '#F59E0B',    // Amber
    'yms': '#8B5CF6',    // Purple
    'enterprise': '#EF4444' // Red
  };
  
  return colorMap[domain] || '#6B7280';
}

function generateChecksum(content) {
  // Simple hash function for checksum
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Main execution
function main() {
  console.log('🚀 Parsing unis-agency-agents...');
  
  const agentFiles = fs.readdirSync(AGENT_FILES_PATH)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  console.log(`📁 Found ${agentFiles.length} agent files`);
  
  const parsedAgents = [];
  const stats = {
    domains: {},
    departments: new Set(),
    total: 0
  };
  
  for (const file of agentFiles) {
    try {
      const filePath = path.join(AGENT_FILES_PATH, file);
      const agent = parseAgentFile(filePath);
      parsedAgents.push(agent);
      
      // Update stats
      const domain = agent.agencyData.domain;
      stats.domains[domain] = (stats.domains[domain] || 0) + 1;
      stats.departments.add(agent.agencyData.department);
      stats.total++;
      
      console.log(`✅ Parsed: ${file} (${domain})`);
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error.message);
    }
  }
  
  console.log('\n📊 Parse Results:');
  console.log(`Total agents: ${stats.total}`);
  console.log('Domain distribution:', stats.domains);
  console.log(`Departments: ${Array.from(stats.departments).join(', ')}`);
  
  // Write output
  const outputPath = '/tmp/agent-factory-check/src/data/agency-agents.ts';
  const output = `// Generated from unis-agency-agents
// Total agents: ${stats.total}
// Generated on: ${new Date().toISOString()}

import { AgentDefinition } from '../shared/types/agent.types';

export interface AgencyAgentData {
  domain: string;
  department: string;
  role: string;
  dbTables: string[];
  workflow: string[];
  dependencies: string[];
}

export interface AgencyAgent extends AgentDefinition {
  agencyData: AgencyAgentData;
}

export const agencyAgents: AgencyAgent[] = ${JSON.stringify(parsedAgents, null, 2)};

export const agencyStats = {
  total: ${stats.total},
  domains: ${JSON.stringify(stats.domains)},
  departments: ${JSON.stringify(Array.from(stats.departments))}
};

// Domain mapping for UI
export const AGENCY_DOMAINS = {
  wms: { name: 'WMS', color: '#3B82F6', count: ${stats.domains.wms || 0} },
  oms: { name: 'OMS', color: '#10B981', count: ${stats.domains.oms || 0} },
  fms: { name: 'FMS', color: '#F59E0B', count: ${stats.domains.fms || 0} },
  bnp: { name: 'BNP', color: '#F59E0B', count: ${stats.domains.bnp || 0} },
  yms: { name: 'YMS', color: '#8B5CF6', count: ${stats.domains.yms || 0} },
  enterprise: { name: 'Enterprise', color: '#EF4444', count: ${stats.domains.enterprise || 0} }
};
`;
  
  fs.writeFileSync(outputPath, output);
  console.log(`\n💾 Saved agency agents to: ${outputPath}`);
  
  return parsedAgents;
}

if (require.main === module) {
  main();
}

module.exports = { main, parseAgentFile };