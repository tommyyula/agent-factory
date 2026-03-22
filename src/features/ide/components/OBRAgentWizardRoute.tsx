import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OBRAgentWizard } from './OBRAgentWizard';
import { agentDB } from '@/shared/services/database';
import { AgentDefinition } from '@/shared/types/agent.types';
import { OBRScenario } from '@/shared/types/obr.types';

interface AgentConfiguration {
  name: string;
  description: string;
  domain: string;
  scenario: OBRScenario;
  selectedObjects: string[];
  selectedBehaviors: string[];
  selectedRules: string[];
  customSkills: string[];
  promptTemplate: string;
  agentType: 'assistant' | 'executor' | 'validator' | 'orchestrator';
}

export function OBRAgentWizardRoute() {
  const navigate = useNavigate();

  const handleComplete = async (agentConfig: AgentConfiguration) => {
    try {
      // Create a minimal agent definition from OBR configuration
      // For now, create a basic agent that can be stored and edited later
      const agentDefinition = {
        id: '',
        name: agentConfig.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: agentConfig.name,
        description: agentConfig.description,
        version: '1.0.0',
        status: 'draft' as const,
        category: {
          industry: (agentConfig.domain as any) || 'general' as const,
          function: 'automation' as const
        },
        pricing: {
          model: 'free' as const,
          price: 0,
          currency: 'USD' as const
        },
        capabilities: agentConfig.customSkills,
        skills: [],
        prompts: {
          system: agentConfig.promptTemplate,
          user: 'Please help me with my request.',
          variables: []
        },
        ontologySubset: [],
        sdd: {
          requirements: '# Requirements\n\nGenerated from OBR wizard.\n',
          design: '# Design\n\nBased on OBR ontology.\n',
          domainAnalysis: `# Domain Analysis\n\nDomain: ${agentConfig.domain}\n`,
          tasks: '# Tasks\n\nTo be defined.\n'
        },
        build: {
          status: 'pending' as const,
          steps: [],
          artifacts: [],
          logs: []
        },
        test: {
          status: 'pending' as const,
          suites: [],
          coverage: 0
        },
        metadata: {
          author: 'OBR Wizard',
          tags: [agentConfig.domain, agentConfig.agentType, 'obr-generated'],
          rating: 0,
          downloads: 0,
          reviews: [],
          source: 'obr-wizard'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as AgentDefinition;

      // Save to database
      const agentId = await agentDB.agents.add(agentDefinition as AgentDefinition);

      // Navigate to agent editor
      navigate(`/ide/agent/${agentId}`);
    } catch (error) {
      console.error('Failed to create OBR agent:', error);
      // Could show error toast here
    }
  };

  const handleCancel = () => {
    navigate('/ide');
  };

  return (
    <OBRAgentWizard 
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}