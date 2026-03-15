import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const SECTION_KEYS = [
  'identity',
  'mission',
  'criticalRules',
  'workflow',
  'communicationStyle',
  'successMetrics',
];

export const COLOR_MAP = {
  blue: '#3b82f6',
  cyan: '#06b6d4',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  pink: '#ec4899',
  purple: '#8b5cf6',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  teal: '#14b8a6',
  emerald: '#10b981',
  gray: '#6b7280',
  grey: '#6b7280',
  slate: '#64748b',
  black: '#111827',
  white: '#f8fafc',
};

export const DIVISION_CATEGORY_MAP = {
  engineering: { industry: 'development', function: 'code-analysis' },
  design: { industry: 'creative', function: 'visualization' },
  marketing: { industry: 'marketing', function: 'analytics' },
  'paid-media': { industry: 'marketing', function: 'analytics' },
  product: { industry: 'general', function: 'productivity' },
  'project-management': { industry: 'general', function: 'productivity' },
  sales: { industry: 'marketing', function: 'automation' },
  'spatial-computing': { industry: 'development', function: 'integration' },
  specialized: { industry: 'ai-tools', function: 'automation' },
  strategy: { industry: 'knowledge', function: 'analytics' },
  support: { industry: 'general', function: 'customer-service' },
  testing: { industry: 'development', function: 'monitoring' },
  'game-development': { industry: 'creative', function: 'generation' },
};

export function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (!entry.name.endsWith('.md')) continue;
    if (entry.name.toLowerCase() === 'readme.md') continue;
    files.push(fullPath);
  }

  return files.sort();
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    data[key] = value;
  }

  return { data, body: raw.slice(match[0].length) };
}

function normalizeHeadingText(text) {
  return text
    .replace(/[`*_>#]/g, ' ')
    .replace(/[^\p{L}\p{N}&/ -]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function sectionKeyForHeading(heading) {
  const normalized = normalizeHeadingText(heading);
  if (normalized.includes('identity') && normalized.includes('memory')) return 'identity';
  if (normalized.includes('core mission') || normalized === 'mission' || normalized.includes('your core mission')) return 'mission';
  if (normalized.includes('critical rules')) return 'criticalRules';
  if (normalized.includes('workflow')) return 'workflow';
  if (normalized.includes('communication style')) return 'communicationStyle';
  if (normalized.includes('success metrics')) return 'successMetrics';
  return null;
}

export function extractRawSections(body) {
  const sections = {
    identity: '',
    mission: '',
    criticalRules: '',
    workflow: '',
    communicationStyle: '',
    successMetrics: '',
  };

  const lines = body.replace(/\r\n/g, '\n').split('\n');
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (!currentKey) return;
    sections[currentKey] = buffer.join('\n').trim();
  };

  for (const line of lines) {
    const h2Match = line.match(/^##(?!#)\s+(.*)$/);
    if (h2Match) {
      flush();
      currentKey = sectionKeyForHeading(h2Match[1]);
      buffer = [];
      continue;
    }
    if (currentKey) {
      buffer.push(line);
    }
  }

  flush();
  return sections;
}

export function parseIdentity(section) {
  const fields = {
    role: '',
    personality: '',
    memory: '',
    experience: '',
  };

  for (const line of section.split('\n')) {
    const bulletMatch = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
    if (!bulletMatch) continue;
    const label = bulletMatch[1].toLowerCase();
    const value = bulletMatch[2].trim();
    if (label.includes('role')) fields.role = value;
    if (label.includes('personality')) fields.personality = value;
    if (label.includes('memory')) fields.memory = value;
    if (label.includes('experience')) fields.experience = value;
  }

  return fields;
}

export function parseMission(section) {
  const blocks = [];
  const matches = section.matchAll(/### (.+)\n([\s\S]*?)(?=\n### |\n*$)/g);
  for (const match of matches) {
    const title = match[1].trim();
    const content = match[2].trim();
    const bullets = content
      .split('\n')
      .filter((line) => line.startsWith('- '))
      .map((line) => line.replace(/^- /, '').trim());

    blocks.push({
      title,
      description: bullets[0] || content.split('\n')[0] || title,
      capabilities: bullets.slice(0, 8),
    });
  }
  return blocks;
}

export function parseBullets(section) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim());
}

export function parseWorkflow(section) {
  const steps = [];
  const matches = section.matchAll(/### (.+)\n([\s\S]*?)(?=\n### |\n*$)/g);
  let index = 1;

  for (const match of matches) {
    const name = match[1].trim();
    const content = match[2].trim();
    const bullets = parseBullets(content);
    const codeCommands = [...content.matchAll(/`([^`]+)`/g)].map((item) => item[1]);

    steps.push({
      step: index++,
      name,
      description: bullets[0] || content.split('\n')[0] || name,
      commands: codeCommands.slice(0, 8),
    });
  }

  return steps;
}

export function parseSuccessMetrics(section) {
  return parseBullets(section).slice(0, 8).map((line) => {
    const cleaned = line.replace(/\*\*/g, '');
    const parts = cleaned.split(/[—-]/);
    return {
      name: parts[0]?.trim() || cleaned,
      target: parts[1]?.trim() || 'Tracked',
      description: cleaned,
    };
  });
}

export function firstParagraph(body) {
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');
  const paragraphs = withoutCode
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter((item) => item && !item.startsWith('#'));
  return paragraphs[0] || '';
}

export function slugFromPath(relativePath) {
  return relativePath.replace(/\.md$/, '').split(path.sep).join('-').toLowerCase();
}

export function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeColor(color) {
  if (!color) return '#64748b';
  if (color.startsWith('#')) return color;
  return COLOR_MAP[color.toLowerCase()] || '#64748b';
}

export function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function buildSkillType(division) {
  if (division === 'support') return 'knowledge';
  if (division === 'testing') return 'analytics';
  if (division === 'design') return 'generation';
  if (division === 'specialized') return 'integration';
  if (division === 'engineering' || division === 'game-development' || division === 'spatial-computing') return 'function';
  return 'workflow';
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function extractCapabilityPool(description, mission, workflow, criticalRules) {
  return unique([
    ...mission.flatMap((block) => block.capabilities),
    ...workflow.map((step) => step.name),
    ...criticalRules.slice(0, 3),
    description,
  ])
    .map((item) => item.replace(/\*\*/g, '').trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
}

export function normalizeSectionText(value) {
  return (value || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .trim();
}
