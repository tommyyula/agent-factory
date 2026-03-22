// OBR Domains Index
// Central registry and exports for all domain models

// Import all domain blueprints
import { WMS_DOMAIN_BLUEPRINT } from './wms-domain';
import { FMS_DOMAIN_BLUEPRINT } from './fms-domain';
import { OMS_DOMAIN_BLUEPRINT } from './oms-domain';
import { YMS_DOMAIN_BLUEPRINT } from './yms-domain';
import { BNP_DOMAIN_BLUEPRINT } from './bnp-domain';

// Import cross-domain links
import { crossDomainLinks } from './cross-domain-links';

// Domain Registry - Central access point for all domains
export const OBR_DOMAINS = {
  wms: WMS_DOMAIN_BLUEPRINT,
  fms: FMS_DOMAIN_BLUEPRINT,
  oms: OMS_DOMAIN_BLUEPRINT,
  yms: YMS_DOMAIN_BLUEPRINT,
  bnp: BNP_DOMAIN_BLUEPRINT
} as const;

// Domain identifiers type
export type DomainId = keyof typeof OBR_DOMAINS;

// Export cross-domain links
export { crossDomainLinks };

// Export individual domain blueprints
export { WMS_DOMAIN_BLUEPRINT } from './wms-domain';
export { FMS_DOMAIN_BLUEPRINT } from './fms-domain';
export { OMS_DOMAIN_BLUEPRINT } from './oms-domain';
export { YMS_DOMAIN_BLUEPRINT } from './yms-domain';
export { BNP_DOMAIN_BLUEPRINT } from './bnp-domain';

// Export individual domain components for granular access
export {
  WMS_OBJECTS,
  WMS_BEHAVIORS,
  WMS_RULES,
  WMS_SCENARIOS,
  WMS_LINKS
} from './wms-domain';

export {
  FMS_OBJECTS,
  FMS_BEHAVIORS,
  FMS_RULES,
  FMS_SCENARIOS,
  FMS_LINKS
} from './fms-domain';

export {
  OMS_OBJECTS,
  OMS_BEHAVIORS,
  OMS_RULES,
  OMS_SCENARIOS,
  OMS_LINKS
} from './oms-domain';

export {
  YMS_OBJECTS,
  YMS_BEHAVIORS,
  YMS_RULES,
  YMS_SCENARIOS,
  YMS_LINKS
} from './yms-domain';

export {
  BNP_OBJECTS,
  BNP_BEHAVIORS,
  BNP_RULES,
  BNP_SCENARIOS,
  BNP_LINKS
} from './bnp-domain';

// Helper functions for domain access
export function getDomain(domainId: DomainId) {
  return OBR_DOMAINS[domainId];
}

export function getAllDomains() {
  return Object.values(OBR_DOMAINS);
}

export function getDomainIds(): DomainId[] {
  return Object.keys(OBR_DOMAINS) as DomainId[];
}

// Combined metrics across all domains
export function getCombinedMetrics() {
  const domains = getAllDomains();
  
  return {
    totalDomains: domains.length,
    totalObjects: domains.reduce((sum, domain) => sum + domain.objects.length, 0),
    totalBehaviors: domains.reduce((sum, domain) => sum + domain.behaviors.length, 0),
    totalRules: domains.reduce((sum, domain) => sum + domain.rules.length, 0),
    totalScenarios: domains.reduce((sum, domain) => sum + domain.scenarios.length, 0),
    totalLinks: domains.reduce((sum, domain) => sum + domain.links.length, 0) + crossDomainLinks.length,
    crossDomainLinks: crossDomainLinks.length,
    averageCompletenessScore: domains.reduce((sum, domain) => sum + (domain.validation?.metrics.completenessScore || 0), 0) / domains.length,
    averageConsistencyScore: domains.reduce((sum, domain) => sum + (domain.validation?.metrics.consistencyScore || 0), 0) / domains.length
  };
}

// Domain validation summary
export function validateAllDomains() {
  const domains = getAllDomains();
  
  const validationSummary = {
    isValid: true,
    totalErrors: 0,
    totalWarnings: 0,
    domainValidations: {} as Record<DomainId, boolean>
  };

  for (const [domainId, domain] of Object.entries(OBR_DOMAINS)) {
    const validation = domain.validation;
    if (validation) {
      validationSummary.domainValidations[domainId as DomainId] = validation.isValid;
      validationSummary.totalErrors += validation.errors.length;
      validationSummary.totalWarnings += validation.warnings.length;
      if (!validation.isValid) {
        validationSummary.isValid = false;
      }
    }
  }

  return validationSummary;
}

// Cross-domain relationship analysis
export function analyzeCrossDomainRelationships() {
  const relationshipTypes = crossDomainLinks.reduce((acc, link) => {
    acc[link.relationshipType] = (acc[link.relationshipType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const domainPairs = crossDomainLinks.reduce((acc, link) => {
    // Extract domain from sourceId and targetId (simplified assumption)
    const sourceDomain = inferDomainFromId(link.sourceId);
    const targetDomain = inferDomainFromId(link.targetId);
    
    if (sourceDomain && targetDomain && sourceDomain !== targetDomain) {
      const pair = `${sourceDomain}↔${targetDomain}`;
      acc[pair] = (acc[pair] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCrossDomainLinks: crossDomainLinks.length,
    relationshipTypes,
    domainPairs,
    mostConnectedPair: Object.entries(domainPairs).reduce((max, [pair, count]) => 
      count > max.count ? { pair, count } : max, { pair: '', count: 0 }
    )
  };
}

// Helper function to infer domain from object/behavior ID (simplified)
function inferDomainFromId(id: string): string | null {
  // This is a simplified inference - in practice, you might have a more sophisticated mapping
  if (id.includes('inventory') || id.includes('receipt') || id.includes('pick') || id.includes('putaway')) return 'WMS';
  if (id.includes('freight') || id.includes('route') || id.includes('dispatch') || id.includes('delivery')) return 'FMS';
  if (id.includes('sales_order') || id.includes('return_order') || id.includes('customer_order')) return 'OMS';
  if (id.includes('appointment') || id.includes('yard') || id.includes('gate') || id.includes('shuttle')) return 'YMS';
  if (id.includes('invoice') || id.includes('payment') || id.includes('billing') || id.includes('commission')) return 'BNP';
  
  return null;
}

// Export type definitions for external use
export type { 
  OntologyBlueprint,
  OBRObject,
  OBRBehavior,
  OBRRule,
  OBRScenario,
  OBRLink,
  OBRMetadata
} from '@/shared/types/obr.types';