#!/usr/bin/env node
/**
 * Import agency-agents markdown files into Agent Factory mock data
 * Parses YAML frontmatter + markdown body → AgentDefinition[]
 */

const fs = require('fs');
const path = require('path');

const AGENCY_DIR = '/Users/tyu/Dropbox/Documents (Selective Sync Conflict)/projects/GitHub/infocerve/agency-agents';
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'importedAgents.ts');

// Division → category mapping
const divisionMap = {
  'engineering': { industry: 'development', function: 'code-analysis', icon: '💻' },
  'design': { industry: 'creative', function: 'visualization', icon: '🎨' },
  'marketing': { industry: 'marketing', function: 'generation', icon: '📢' },
  'sales': { industry: 'general', function: 'analytics', icon: '💼' },
  'product': { industry: 'general', function: 'analytics', icon: '📊' },
  'project-management': { industry: 'general', function: 'productivity', icon: '📋' },
  'testing': { industry: 'development', function: 'code-analysis', icon: '🧪' },
  'support': { industry: 'general', function: 'customer-service', icon: '🛟' },
  'specialized': { industry: 'ai-tools', function: 'automation', icon: '⚙️' },
  'spatial-computing': { industry: 'development', function: 'visualization', icon: '🥽' },
  'paid-media': { industry: 'marketing', function: 'analytics', icon: '💰' },
  'strategy': { industry: 'general', function: 'analytics', icon: '🎯' },
  'game-development': { industry: 'development', function: 'generation', icon: '🎮' },
};

// Division display names (zh)
const divisionNames = {
  'engineering': '工程',
  'design': '设计',
  'marketing': '营销',
  'sales': '销售',
  'product': '产品',
  'project-management': '项目管理',
  'testing': '测试',
  'support': '支持',
  'specialized': '专业',
  'spatial-computing': '空间计算',
  'paid-media': '付费媒体',
  'strategy': '战略',
  'game-development': '游戏开发',
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      // Remove quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

function extractSections(content) {
  // Remove frontmatter
  const body = content.replace(/^---\n[\s\S]*?\n---\n*/, '');
  
  const sections = {};
  const sectionRegex = /^##\s+(.+)$/gm;
  let lastKey = null;
  let lastIndex = 0;
  let match;
  
  const matches = [];
  while ((match = sectionRegex.exec(body)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index });
  }
  
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].title.length + 3;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const sectionContent = body.slice(start, end).trim();
    
    const title = matches[i].title.replace(/[🧠🎯🚨🔄💭📋🚀🔧💬✅]/g, '').trim();
    if (title.toLowerCase().includes('identity') || title.toLowerCase().includes('memory')) {
      sections.identity = sectionContent;
    } else if (title.toLowerCase().includes('mission') || title.toLowerCase().includes('core')) {
      sections.mission = sectionContent;
    } else if (title.toLowerCase().includes('critical') || title.toLowerCase().includes('rules')) {
      sections.rules = sectionContent;
    } else if (title.toLowerCase().includes('workflow') || title.toLowerCase().includes('process')) {
      sections.workflow = sectionContent;
    } else if (title.toLowerCase().includes('communication') || title.toLowerCase().includes('style')) {
      sections.communication = sectionContent;
    } else if (title.toLowerCase().includes('success') || title.toLowerCase().includes('metrics')) {
      sections.metrics = sectionContent;
    } else if (title.toLowerCase().includes('capabilities') || title.toLowerCase().includes('tools')) {
      sections.capabilities = sectionContent;
    }
  }
  
  return sections;
}

function extractBulletPoints(text, max = 5) {
  if (!text) return [];
  const bullets = text.match(/^[-*]\s+\*\*(.+?)\*\*/gm) || text.match(/^[-*]\s+(.+)$/gm) || [];
  return bullets.slice(0, max).map(b => b.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim());
}

function extractCapabilities(sections) {
  const caps = [];
  const text = sections.mission || sections.capabilities || '';
  const items = text.match(/\*\*(.+?)\*\*/g) || [];
  for (const item of items.slice(0, 6)) {
    caps.push(item.replace(/\*\*/g, ''));
  }
  if (caps.length === 0) {
    // fallback: first few bullet points
    const bullets = extractBulletPoints(text, 4);
    caps.push(...bullets);
  }
  return caps.length > 0 ? caps : ['AI Agent'];
}

function generatePrice(division) {
  const prices = {
    'engineering': [15, 20, 25],
    'design': [12, 18, 22],
    'marketing': [8, 12, 16],
    'sales': [10, 15, 20],
    'product': [18, 22, 28],
    'project-management': [15, 20, 25],
    'testing': [10, 15, 18],
    'support': [5, 8, 12],
    'specialized': [20, 25, 30],
    'spatial-computing': [25, 30, 35],
    'paid-media': [12, 18, 22],
    'strategy': [22, 28, 35],
    'game-development': [15, 20, 25],
  };
  const options = prices[division] || [10, 15, 20];
  return options[Math.floor(Math.random() * options.length)];
}

function generateTags(fm, division, sections) {
  const tags = [divisionNames[division] || division];
  if (fm.name) {
    // Extract key words from name
    const words = fm.name.split(/[\s-]+/).filter(w => w.length > 2);
    tags.push(...words.slice(0, 2));
  }
  return [...new Set(tags)].slice(0, 4);
}

// Main
const agents = [];
const divisions = fs.readdirSync(AGENCY_DIR).filter(d => {
  const p = path.join(AGENCY_DIR, d);
  return fs.statSync(p).isDirectory() && !d.startsWith('.') && 
    !['examples', 'integrations', 'scripts', 'node_modules'].includes(d);
});

let idCounter = 100;

for (const division of divisions.sort()) {
  const divDir = path.join(AGENCY_DIR, division);
  const files = fs.readdirSync(divDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  
  for (const file of files.sort()) {
    const content = fs.readFileSync(path.join(divDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const sections = extractSections(content);
    
    if (!fm.name) continue;
    
    const id = `agency-${idCounter++}`;
    const displayName = fm.name;
    const slug = file.replace('.md', '').replace(`${division}-`, '');
    const catMap = divisionMap[division] || divisionMap['specialized'];
    
    const capabilities = extractCapabilities(sections);
    const price = generatePrice(division);
    const tags = generateTags(fm, division, sections);
    
    // Build soul
    const identityText = sections.identity || '';
    const roleMatch = identityText.match(/\*\*Role\*\*:\s*(.+)/i) || identityText.match(/Role:\s*(.+)/i);
    const personalityMatch = identityText.match(/\*\*Personality\*\*:\s*(.+)/i);
    const memoryMatch = identityText.match(/\*\*Memory\*\*:\s*(.+)/i);
    const experienceMatch = identityText.match(/\*\*Experience\*\*:\s*(.+)/i);
    
    const criticalRules = extractBulletPoints(sections.rules, 4);
    const commStyle = extractBulletPoints(sections.communication, 4);
    const metrics = extractBulletPoints(sections.metrics || '', 4);

    const agent = {
      id,
      name: slug,
      displayName,
      description: fm.description || `${displayName} - ${division} specialist`,
      version: '1.0.0',
      status: 'published',
      category: {
        industry: catMap.industry,
        function: catMap.function,
        division: division,
      },
      pricing: {
        model: price === 0 ? 'free' : 'subscription',
        price,
        currency: 'USD',
      },
      capabilities,
      skills: [],
      prompts: {
        system: fm.description || '',
        user: '',
        variables: [],
      },
      soul: {
        identity: {
          role: roleMatch ? roleMatch[1].trim() : fm.description || displayName,
          personality: personalityMatch ? personalityMatch[1].trim() : '',
          memory: memoryMatch ? memoryMatch[1].trim() : '',
          experience: experienceMatch ? experienceMatch[1].trim() : '',
        },
        mission: capabilities.map(c => ({
          title: c,
          description: '',
          capabilities: [],
        })),
        criticalRules,
        workflow: [],
        communicationStyle: commStyle,
        successMetrics: metrics.map(m => ({
          name: m,
          target: '',
          description: '',
        })),
        vibe: fm.vibe || '',
        emoji: fm.emoji || catMap.icon,
        color: fm.color || 'blue',
      },
      ontologySubset: [],
      sdd: { requirements: '', design: '', domainAnalysis: '', tasks: '' },
      build: { status: 'success', steps: [], artifacts: [], logs: [] },
      test: { status: 'passed', suites: [], coverage: 85 },
      metadata: {
        author: 'Agency-Agents Community',
        tags,
        rating: 4.5 + Math.round(Math.random() * 4) / 10,
        downloads: Math.floor(Math.random() * 2000) + 200,
        reviews: [],
        source: 'agency-agents',
        division,
        divisionName: divisionNames[division] || division,
      },
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-14'),
    };
    
    agents.push(agent);
  }
}

// Group by division for summary
const summary = {};
for (const a of agents) {
  const d = a.metadata.division;
  summary[d] = (summary[d] || 0) + 1;
}

console.log(`\nImported ${agents.length} agents from ${Object.keys(summary).length} divisions:`);
for (const [d, count] of Object.entries(summary).sort()) {
  console.log(`  ${divisionNames[d] || d} (${d}): ${count}`);
}

// Generate TypeScript file
const tsContent = `// Auto-generated from agency-agents project
// Source: https://github.com/msitarzewski/agency-agents
// Generated: ${new Date().toISOString()}
// Total: ${agents.length} agents from ${Object.keys(summary).length} divisions

import { AgentDefinition } from '../shared/types/agent.types';

// Division metadata for filtering
export const agencyDivisions = ${JSON.stringify(
  Object.entries(divisionNames).map(([key, name]) => ({
    key,
    name,
    icon: divisionMap[key]?.icon || '📁',
    count: summary[key] || 0,
  })).filter(d => d.count > 0),
  null, 2
)};

export const importedAgents: AgentDefinition[] = ${JSON.stringify(agents, null, 2).replace(/"createdAt": ".*?"/g, '"createdAt": new Date("2026-03-05")').replace(/"updatedAt": ".*?"/g, '"updatedAt": new Date("2026-03-14")')};
`;

fs.writeFileSync(OUTPUT, tsContent);
console.log(`\nWritten to: ${OUTPUT}`);
console.log(`File size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
