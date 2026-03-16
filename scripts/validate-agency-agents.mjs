import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  extractRawSections,
  normalizeSectionText,
  parseFrontmatter,
  sha256,
  walkMarkdownFiles,
  SECTION_KEYS,
} from './agency-agents-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(repoRoot, 'data', 'agency-agents');
const manifestFile = path.join(repoRoot, 'data', 'agency-agents-manifest.json');
const reportFile = path.join(repoRoot, 'data', 'agency-agents-validation-report.json');

function normalizeRawContent(value) {
  return (value || '').replace(/\r\n/g, '\n').trim();
}

function validate() {
  if (!fs.existsSync(manifestFile)) {
    throw new Error(`Validation manifest not found: ${manifestFile}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const sourceFiles = walkMarkdownFiles(sourceRoot);
  const manifestByPath = new Map(manifest.map((entry) => [entry.relativePath, entry]));
  const failures = [];
  let checkedAgents = 0;

  for (const filePath of sourceFiles) {
    const relativePath = path.relative(sourceRoot, filePath);
    const manifestEntry = manifestByPath.get(relativePath);
    if (!manifestEntry) {
      failures.push({ relativePath, reason: 'missing_manifest_entry' });
      continue;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const checksum = sha256(raw);
    const { body } = parseFrontmatter(raw);
    const sourceSections = extractRawSections(body);
    checkedAgents += 1;

    if (checksum !== manifestEntry.checksum) {
      failures.push({
        relativePath,
        reason: 'checksum_mismatch',
        expected: checksum,
        actual: manifestEntry.checksum,
      });
      continue;
    }

    const sourceContent = normalizeRawContent(raw);
    const importedContent = normalizeRawContent(manifestEntry.rawContent);
    if (sourceContent !== importedContent) {
      failures.push({
        relativePath,
        reason: 'raw_content_mismatch',
        sourcePreview: sourceContent.slice(0, 200),
        importedPreview: importedContent.slice(0, 200),
      });
      continue;
    }

    for (const key of SECTION_KEYS) {
      const sourceText = normalizeSectionText(sourceSections[key]);
      const importedText = normalizeSectionText(manifestEntry.rawSections?.[key]);
      if (sourceText !== importedText) {
        failures.push({
          relativePath,
          reason: 'section_mismatch',
          section: key,
          sourcePreview: sourceText.slice(0, 200),
          importedPreview: importedText.slice(0, 200),
        });
      }
    }
  }

  const report = {
    checkedAgents,
    manifestEntries: manifest.length,
    sourceFiles: sourceFiles.length,
    fullContentValidated: true,
    failures,
    passed: failures.length === 0,
  };

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  if (failures.length > 0) {
    console.error(`Validation failed: ${failures.length} mismatches. See ${path.relative(repoRoot, reportFile)}`);
    process.exit(1);
  }

  console.log(`Validated ${checkedAgents} imported agency agents with zero section mismatches.`);
  console.log(`Report written to ${path.relative(repoRoot, reportFile)}`);
}

validate();
