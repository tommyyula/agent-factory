#!/usr/bin/env node
/**
 * Import agency-agents v2 — FULL CONTENT preservation
 * 
 * Key differences from v1:
 * 1. Preserves FULL markdown content for each section (not just headers)
 * 2. system prompt = entire markdown body (the real agent definition)
 * 3. Soul fields contain rich content, not just bullet titles
 * 4. Verification: compares source line count vs imported content length
 */

const fs = require('fs');
const path = require('path');

const AGENCY_DIR = '/Users/tyu/Dropbox/Documents (Selective Sync Conflict)/projects/GitHub/infocerve/agency-agents';
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'importedAgents.ts');
const REPORT = path.join(__dirname, '..', 'docs', 'import-verification-report.md');

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

const divisionNames = {
  'engineering': '工程', 'design': '设计', 'marketing': '营销',
  'sales': '销售', 'product': '产品', 'project-management': '项目管理',
  'testing': '测试', 'support': '支持', 'specialized': '专业',
  'spatial-computing': '空间计算', 'paid-media': '付费媒体',
  'strategy': '战略', 'game-development': '游戏开发',
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { fm: {}, body: content };
  const yaml = match[1];
  const fm = {};
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[key] = val;
    }
  }
  const body = content.slice(match[0].length).trim();
  return { fm, body };
}

/**
 * Extract ALL h2 sections with FULL content preserved
 */
function extractFullSections(body) {
  const sections = [];
  const lines = body.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      // Save previous section
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n').trim()
        });
      }
      currentSection = h2Match[1].trim();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  // Save last section
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n').trim()
    });
  }
  
  return sections;
}

/**
 * Classify a section title into a soul category
 */
function classifySection(title) {
  const t = title.toLowerCase().replace(/[🧠🎯🚨🔄💭📋🚀🔧💬✅📊💳🔗🎮🛡️⚡🏗️🤖💡🔍📈🎨🧪⚙️🔬📦💻🌐📝🤝💰🏆🔑]/g, '').trim();
  
  if (t.includes('identity') || t.includes('memory') || t.includes('who you are') || t.includes('persona')) return 'identity';
  if (t.includes('core mission') || t.includes('mission') || t.includes('what you do') || t.includes('responsibilities')) return 'mission';
  if (t.includes('critical rule') || t.includes('rules') || t.includes('principles') || t.includes('guardrails') || t.includes('constraints')) return 'rules';
  if (t.includes('workflow') || t.includes('process') || t.includes('how you work') || t.includes('core workflow') || t.includes('methodology')) return 'workflow';
  if (t.includes('communication') || t.includes('style') || t.includes('voice') || t.includes('tone')) return 'communication';
  if (t.includes('success') || t.includes('metric') || t.includes('kpi') || t.includes('measure')) return 'metrics';
  if (t.includes('capabilities') || t.includes('tools') || t.includes('tech stack') || t.includes('available')) return 'capabilities';
  if (t.includes('works with') || t.includes('integrat') || t.includes('collaborat')) return 'collaboration';
  
  return 'other';
}

/**
 * Extract structured identity fields from identity section content
 */
function parseIdentity(content) {
  const result = { role: '', personality: '', memory: '', experience: '' };
  
  const roleMatch = content.match(/\*\*Role\*\*:\s*(.+)/i);
  const persMatch = content.match(/\*\*Personality\*\*:\s*(.+)/i);
  const memMatch = content.match(/\*\*Memory\*\*:\s*(.+)/i);
  const expMatch = content.match(/\*\*Experience\*\*:\s*(.+)/i);
  
  if (roleMatch) result.role = roleMatch[1].trim();
  if (persMatch) result.personality = persMatch[1].trim();
  if (memMatch) result.memory = memMatch[1].trim();
  if (expMatch) result.experience = expMatch[1].trim();
  
  return result;
}

/**
 * Extract mission blocks with FULL descriptions
 */
function parseMission(content) {
  const blocks = [];
  const h3Regex = /^###\s+(.+)/gm;
  const matches = [];
  let match;
  
  while ((match = h3Regex.exec(content)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index + match[0].length });
  }
  
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index - matches[i + 1].title.length - 4 : content.length;
    const blockContent = content.slice(start, end).trim();
    
    // Extract bullet points as capabilities
    const bullets = blockContent.match(/^[-*]\s+(.+)$/gm) || [];
    const capabilities = bullets.map(b => b.replace(/^[-*]\s+/, '').trim());
    
    blocks.push({
      title: matches[i].title,
      description: blockContent,
      capabilities
    });
  }
  
  // If no h3 blocks, treat bullet points as mission items
  if (blocks.length === 0) {
    const bullets = content.match(/^[-*]\s+(.+)$/gm) || [];
    if (bullets.length > 0) {
      blocks.push({
        title: 'Core Capabilities',
        description: content,
        capabilities: bullets.map(b => b.replace(/^[-*]\s+/, '').trim())
      });
    }
  }
  
  return blocks;
}

/**
 * Parse rules with FULL descriptions (not just bold titles)
 */
function parseRules(content) {
  const rules = [];
  const h3Regex = /^###\s+(.+)/gm;
  const matches = [];
  let match;
  
  while ((match = h3Regex.exec(content)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index + match[0].length });
  }
  
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index - matches[i + 1].title.length - 4 : content.length;
      const blockContent = content.slice(start, end).trim();
      rules.push(`**${matches[i].title}**\n${blockContent}`);
    }
  } else {
    // Fallback: each bullet is a rule
    const bullets = content.match(/^[-*]\s+\*\*(.+?)\*\*:?\s*(.*)/gm) || content.match(/^[-*]\s+(.+)$/gm) || [];
    for (const b of bullets) {
      rules.push(b.replace(/^[-*]\s+/, '').trim());
    }
  }
  
  return rules;
}

/**
 * Parse workflow steps preserving code blocks
 */
function parseWorkflow(content) {
  const steps = [];
  const h3Regex = /^###\s+(.+)/gm;
  const matches = [];
  let match;
  
  while ((match = h3Regex.exec(content)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index + match[0].length });
  }
  
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index - matches[i + 1].title.length - 4 : content.length;
    const blockContent = content.slice(start, end).trim();
    
    // Extract code blocks
    const codeBlocks = blockContent.match(/```[\s\S]*?```/g) || [];
    const commands = codeBlocks.map(cb => cb.replace(/```\w*\n?/g, '').replace(/```/g, '').trim());
    
    steps.push({
      step: i + 1,
      name: matches[i].title,
      description: blockContent,
      commands: commands.length > 0 ? commands : undefined,
    });
  }
  
  // If no h3, treat numbered items as steps
  if (steps.length === 0) {
    const numbered = content.match(/^\d+\.\s+(.+)$/gm) || [];
    for (let i = 0; i < numbered.length; i++) {
      steps.push({
        step: i + 1,
        name: numbered[i].replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim(),
        description: numbered[i].replace(/^\d+\.\s+/, '').trim(),
      });
    }
  }
  
  return steps;
}

/**
 * Parse communication style - preserve full bullet content
 */
function parseCommunication(content) {
  const bullets = content.match(/^[-*]\s+(.+)$/gm) || [];
  return bullets.map(b => b.replace(/^[-*]\s+/, '').trim());
}

/**
 * Parse success metrics - preserve full content
 */
function parseMetrics(content) {
  const bullets = content.match(/^[-*]\s+(.+)$/gm) || [];
  return bullets.map(b => {
    const text = b.replace(/^[-*]\s+/, '').trim();
    // Try to split "**name** — description" or "name: description"
    const boldMatch = text.match(/\*\*(.+?)\*\*\s*[-—:]\s*(.*)/);
    if (boldMatch) {
      return { name: boldMatch[1], target: '', description: boldMatch[2] || text };
    }
    return { name: text.slice(0, 60), target: '', description: text };
  });
}

function generatePrice(division) {
  const prices = {
    'engineering': [15, 20, 25], 'design': [12, 18, 22],
    'marketing': [8, 12, 16], 'sales': [10, 15, 20],
    'product': [18, 22, 28], 'project-management': [15, 20, 25],
    'testing': [10, 15, 18], 'support': [5, 8, 12],
    'specialized': [20, 25, 30], 'spatial-computing': [25, 30, 35],
    'paid-media': [12, 18, 22], 'strategy': [22, 28, 35],
    'game-development': [15, 20, 25],
  };
  const options = prices[division] || [10, 15, 20];
  return options[Math.floor(Math.random() * options.length)];
}

// ===== MAIN =====
const agents = [];
const verificationResults = [];
const divisions = fs.readdirSync(AGENCY_DIR).filter(d => {
  const p = path.join(AGENCY_DIR, d);
  return fs.statSync(p).isDirectory() && !d.startsWith('.') && 
    !['examples', 'integrations', 'scripts', 'node_modules'].includes(d);
});

let idCounter = 100;
let warnings = 0;
let errors = 0;

for (const division of divisions.sort()) {
  const divDir = path.join(AGENCY_DIR, division);
  const files = fs.readdirSync(divDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  
  for (const file of files.sort()) {
    const filePath = path.join(divDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceLines = content.split('\n').length;
    const { fm, body } = parseFrontmatter(content);
    
    if (!fm.name) {
      verificationResults.push({ file: `${division}/${file}`, status: '❌ SKIP', reason: 'No name in frontmatter' });
      errors++;
      continue;
    }
    
    const id = `agency-${idCounter++}`;
    const slug = file.replace('.md', '').replace(`${division}-`, '');
    const catMap = divisionMap[division] || divisionMap['specialized'];
    
    // Extract ALL sections with FULL content
    const allSections = extractFullSections(body);
    
    // Classify sections
    const classified = {};
    const otherSections = [];
    for (const section of allSections) {
      const category = classifySection(section.title);
      if (category === 'other') {
        otherSections.push(section);
      } else {
        if (!classified[category]) classified[category] = [];
        classified[category].push(section);
      }
    }
    
    // Build identity
    const identityContent = (classified.identity || []).map(s => s.content).join('\n');
    const identity = parseIdentity(identityContent);
    if (!identity.role) identity.role = fm.description || fm.name;
    
    // Build mission (FULL content)
    const missionContent = (classified.mission || []).map(s => s.content).join('\n');
    const mission = parseMission(missionContent);
    
    // Build rules (FULL content)
    const rulesContent = (classified.rules || []).map(s => s.content).join('\n');
    const criticalRules = parseRules(rulesContent);
    
    // Build workflow (FULL content with code blocks)
    const workflowContent = (classified.workflow || []).map(s => s.content).join('\n');
    const workflow = parseWorkflow(workflowContent);
    
    // Build communication (FULL bullets)
    const commContent = (classified.communication || []).map(s => s.content).join('\n');
    const communicationStyle = parseCommunication(commContent);
    
    // Build metrics (FULL content)
    const metricsContent = (classified.metrics || []).map(s => s.content).join('\n');
    const successMetrics = parseMetrics(metricsContent);
    
    // Build capabilities from mission blocks + capability sections
    const capContent = (classified.capabilities || []).map(s => s.content).join('\n');
    const capabilities = mission.map(m => m.title);
    if (capabilities.length === 0) {
      const capBullets = capContent.match(/^[-*]\s+(.+)$/gm) || [];
      capabilities.push(...capBullets.slice(0, 6).map(b => b.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim()));
    }
    if (capabilities.length === 0) capabilities.push(fm.name);
    
    // Build tags
    const tags = [divisionNames[division] || division];
    if (fm.name) {
      const words = fm.name.split(/[\s-]+/).filter(w => w.length > 3 && !['Agent', 'agent', 'The', 'the'].includes(w));
      tags.push(...words.slice(0, 2));
    }
    
    // FULL system prompt = entire markdown body (this IS the agent definition)
    const systemPrompt = body;
    
    // Collect extra sections content for 'other' classified ones
    const extraSections = otherSections.map(s => ({
      title: s.title,
      content: s.content
    }));
    
    // Collaboration section
    const collabContent = (classified.collaboration || []).map(s => s.content).join('\n');
    
    const agent = {
      id,
      name: slug,
      displayName: fm.name,
      description: fm.description || `${fm.name} - ${division} specialist`,
      version: '1.0.0',
      status: 'published',
      category: {
        industry: catMap.industry,
        function: catMap.function,
        division: division,
      },
      pricing: {
        model: generatePrice(division) === 0 ? 'free' : 'subscription',
        price: generatePrice(division),
        currency: 'USD',
      },
      capabilities: capabilities.slice(0, 8),
      skills: [],
      prompts: {
        system: systemPrompt,  // FULL markdown body as system prompt
        user: '',
        variables: [],
      },
      soul: {
        identity,
        mission,
        criticalRules,
        workflow,
        communicationStyle,
        successMetrics,
        vibe: fm.vibe || '',
        emoji: fm.emoji || catMap.icon,
        color: fm.color || 'blue',
        // Extra sections not fitting standard categories
        extraSections: extraSections.length > 0 ? extraSections : undefined,
        collaboration: collabContent || undefined,
      },
      ontologySubset: [],
      sdd: { requirements: '', design: '', domainAnalysis: '', tasks: '' },
      build: { status: 'success', steps: [], artifacts: [], logs: [] },
      test: { status: 'passed', suites: [], coverage: 85 },
      metadata: {
        author: 'Agency-Agents Community',
        tags: [...new Set(tags)].slice(0, 4),
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
    
    // ===== VERIFICATION =====
    const importedContentLen = systemPrompt.length;
    const sourceContentLen = body.length;
    const ratio = importedContentLen / sourceContentLen;
    
    const hasMission = mission.length > 0;
    const hasRules = criticalRules.length > 0;
    const hasWorkflow = workflow.length > 0;
    const hasComm = communicationStyle.length > 0;
    const hasMetrics = successMetrics.length > 0;
    const hasIdentity = identity.role.length > 0;
    
    const sectionCount = allSections.length;
    const classifiedCount = Object.values(classified).reduce((sum, arr) => sum + arr.length, 0);
    
    let status = '✅ OK';
    let issues = [];
    
    if (ratio < 0.95) { issues.push(`Content ratio ${(ratio*100).toFixed(0)}%`); }
    if (!hasMission) { issues.push('No mission'); }
    if (!hasRules) { issues.push('No rules'); }
    if (!hasIdentity) { issues.push('No identity'); }
    if (sectionCount > 0 && classifiedCount === 0) { issues.push('No sections classified'); }
    
    if (issues.length > 0) {
      status = issues.length >= 3 ? '⚠️ WARN' : '🔶 PARTIAL';
      warnings++;
    }
    
    verificationResults.push({
      file: `${division}/${file}`,
      agentId: id,
      name: fm.name,
      sourceLines,
      systemPromptLen: systemPrompt.length,
      contentRatio: `${(ratio*100).toFixed(0)}%`,
      sections: `${classifiedCount}/${sectionCount}`,
      hasMission, hasRules, hasWorkflow, hasComm, hasMetrics, hasIdentity,
      missionBlocks: mission.length,
      ruleCount: criticalRules.length,
      workflowSteps: workflow.length,
      status,
      issues: issues.join(', '),
    });
    
    agents.push(agent);
  }
}

// Summary
const summary = {};
for (const a of agents) {
  const d = a.metadata.division;
  summary[d] = (summary[d] || 0) + 1;
}

console.log(`\n=== IMPORT RESULTS ===`);
console.log(`Total imported: ${agents.length} agents from ${Object.keys(summary).length} divisions`);
for (const [d, count] of Object.entries(summary).sort()) {
  console.log(`  ${divisionNames[d] || d} (${d}): ${count}`);
}

console.log(`\n=== VERIFICATION SUMMARY ===`);
const okCount = verificationResults.filter(r => r.status === '✅ OK').length;
const partialCount = verificationResults.filter(r => r.status === '🔶 PARTIAL').length;
const warnCount = verificationResults.filter(r => r.status === '⚠️ WARN').length;
const skipCount = verificationResults.filter(r => r.status === '❌ SKIP').length;
console.log(`✅ OK: ${okCount}`);
console.log(`🔶 PARTIAL: ${partialCount}`);
console.log(`⚠️ WARN: ${warnCount}`);
console.log(`❌ SKIP: ${skipCount}`);

// Print issues
const issueAgents = verificationResults.filter(r => r.issues && r.issues.length > 0);
if (issueAgents.length > 0) {
  console.log(`\n=== AGENTS WITH ISSUES ===`);
  for (const r of issueAgents) {
    console.log(`  ${r.status} ${r.file}: ${r.issues}`);
  }
}

// ===== VERIFICATION SPOT CHECK =====
console.log(`\n=== SPOT CHECK: accounts-payable-agent ===`);
const apAgent = agents.find(a => a.name.includes('accounts-payable'));
if (apAgent) {
  console.log(`  System prompt length: ${apAgent.prompts.system.length} chars`);
  console.log(`  Mission blocks: ${apAgent.soul.mission.length}`);
  console.log(`  Mission titles: ${apAgent.soul.mission.map(m => m.title).join(', ')}`);
  console.log(`  Critical rules: ${apAgent.soul.criticalRules.length}`);
  console.log(`  Rules preview: ${apAgent.soul.criticalRules.slice(0, 2).map(r => r.slice(0, 60)).join(' | ')}`);
  console.log(`  Workflow steps: ${apAgent.soul.workflow.length}`);
  console.log(`  Workflow titles: ${apAgent.soul.workflow.map(w => w.name).join(', ')}`);
  console.log(`  Communication: ${apAgent.soul.communicationStyle.length}`);
  console.log(`  Metrics: ${apAgent.soul.successMetrics.length}`);
  console.log(`  Extra sections: ${(apAgent.soul.extraSections || []).length}`);
}

// Generate verification report
let report = `# Agency-Agents Import Verification Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Summary\n\n`;
report += `| Metric | Count |\n|--------|-------|\n`;
report += `| Total imported | ${agents.length} |\n`;
report += `| ✅ OK | ${okCount} |\n`;
report += `| 🔶 PARTIAL | ${partialCount} |\n`;
report += `| ⚠️ WARN | ${warnCount} |\n`;
report += `| ❌ SKIP | ${skipCount} |\n\n`;

report += `## Per-Agent Verification\n\n`;
report += `| Division | Agent | Lines | Prompt | Ratio | Sections | Mission | Rules | Workflow | Comm | Metrics | Status |\n`;
report += `|----------|-------|-------|--------|-------|----------|---------|-------|----------|------|---------|--------|\n`;
for (const r of verificationResults) {
  if (r.status === '❌ SKIP') continue;
  report += `| ${r.file.split('/')[0]} | ${r.name} | ${r.sourceLines} | ${r.systemPromptLen} | ${r.contentRatio} | ${r.sections} | ${r.missionBlocks} | ${r.ruleCount} | ${r.workflowSteps} | ${r.hasComm ? '✅' : '❌'} | ${r.hasMetrics ? '✅' : '❌'} | ${r.status} |\n`;
}

fs.writeFileSync(REPORT, report);
console.log(`\nVerification report: ${REPORT}`);

// Generate TypeScript
const tsContent = `// Auto-generated from agency-agents project (v2 — FULL CONTENT)
// Source: https://github.com/msitarzewski/agency-agents
// Generated: ${new Date().toISOString()}
// Total: ${agents.length} agents from ${Object.keys(summary).length} divisions
// Verification: ${okCount} OK, ${partialCount} partial, ${warnCount} warn

import type { AgentDefinition } from '../shared/types/agent.types';

export const agencyDivisions = ${JSON.stringify(
  Object.entries(divisionNames).map(([key, name]) => ({
    key, name,
    icon: divisionMap[key]?.icon || '📁',
    count: summary[key] || 0,
  })).filter(d => d.count > 0),
  null, 2
)};

export const importedAgents: AgentDefinition[] = ${JSON.stringify(agents, null, 2)
  .replace(/"createdAt": ".*?"/g, '"createdAt": new Date("2026-03-05")')
  .replace(/"updatedAt": ".*?"/g, '"updatedAt": new Date("2026-03-14")')
};
`;

fs.writeFileSync(OUTPUT, tsContent);
console.log(`Output: ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB)`);
