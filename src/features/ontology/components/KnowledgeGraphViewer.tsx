import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Filter, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useOntologyStore } from '@/stores/ontologyStore';
import { ontologyDB } from '@/shared/services/database';
import { Concept, Relation, OntologyDomain } from '@/shared/types/ontology.types';
import { wmsConcepts, wmsRelations } from '@/data/mockOntologies';

// Domain colors for nodes
const DOMAIN_COLORS = {
  'WMS': '#3b82f6', // blue-500
  'TMS': '#22c55e', // green-500
  'FMS': '#f97316', // orange-500
  'HRM': '#a855f7', // purple-500
  'YMS': '#14b8a6', // teal-500
  'OMS': '#ef4444'  // red-500
};

// Node types for styling
const NODE_TYPES = {
  entity: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6' },
  attribute: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: '#22c55e' },
  relation: { backgroundColor: 'rgba(249, 115, 22, 0.2)', borderColor: '#f97316' },
  event: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: '#a855f7' }
};

interface NodeDetailPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

function NodeDetailPanel({ selectedNode, onClose }: NodeDetailPanelProps) {
  const { t } = useTranslation();

  if (!selectedNode) return null;

  const concept = selectedNode.data as unknown as Concept;

  return (
    <Card className="absolute top-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">{concept.displayName}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {concept.type}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {concept.description}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">{t('ontology.properties', '属性')}</h4>
          <div className="space-y-1">
            {Object.entries(concept.properties || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('ontology.created', '创建')}: {new Date(concept.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DomainFilterProps {
  availableDomains: string[];
  selectedDomains: string[];
  onDomainToggle: (domain: string) => void;
}

function DomainFilter({ availableDomains, selectedDomains, onDomainToggle }: DomainFilterProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4">
      <h3 className="font-medium text-sm mb-3 flex items-center">
        <Filter className="mr-2 h-4 w-4" />
        {t('ontology.domainFilter', '域筛选')}
      </h3>
      <div className="space-y-2">
        {availableDomains.map((domain) => (
          <div key={domain} className="flex items-center space-x-2">
            <Checkbox
              id={domain}
              checked={selectedDomains.includes(domain)}
              onCheckedChange={() => onDomainToggle(domain)}
            />
            <label htmlFor={domain} className="text-sm flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] }}
              />
              {domain}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function KnowledgeGraphViewer() {
  const { t } = useTranslation();
  const { ontologyId } = useParams();
  const { domains, selectedDomain, setSelectedDomain } = useOntologyStore();
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);

  // Load ontology data
  useEffect(() => {
    const loadOntologyData = async () => {
      try {
        if (ontologyId) {
          // Load specific ontology
          const domain = await ontologyDB.ontologies.get(ontologyId);
          if (domain) {
            setSelectedDomain(domain);
            // For demo purposes, use mock data
            if (domain.industry === 'WMS') {
              setConcepts(wmsConcepts);
              setRelations(wmsRelations);
            }
          }
        } else {
          // Load all ontologies - combine concepts from all domains
          setConcepts(wmsConcepts); // For demo, just use WMS data
          setRelations(wmsRelations);
        }
      } catch (error) {
        console.error('Failed to load ontology data:', error);
      }
    };

    loadOntologyData();
  }, [ontologyId, setSelectedDomain]);

  // Convert concepts and relations to React Flow nodes and edges
  useEffect(() => {
    // Convert concepts to nodes
    const flowNodes: Node[] = concepts.map((concept) => {
      const domain = domains.find(d => d.id === concept.ontologyId);
      const domainColor = DOMAIN_COLORS[domain?.industry as keyof typeof DOMAIN_COLORS] || '#64748b';
      const nodeTypeStyle = NODE_TYPES[concept.type] || NODE_TYPES.entity;

      return {
        id: concept.id,
        type: 'default',
        position: concept.position || { x: Math.random() * 500, y: Math.random() * 500 },
        data: {
          ...concept,
          label: concept.displayName
        },
        style: {
          backgroundColor: nodeTypeStyle.backgroundColor,
          borderColor: domainColor,
          borderWidth: 2,
          borderRadius: 8,
          padding: 10,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#1f2937',
          minWidth: 120,
          textAlign: 'center'
        },
        hidden: selectedDomains.length > 0 && !selectedDomains.includes(domain?.industry || '')
      };
    });

    // Convert relations to edges
    const flowEdges: Edge[] = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceId,
      target: relation.targetId,
      label: relation.name,
      type: 'default',
      style: {
        strokeWidth: Math.max(1, relation.weight * 3),
        stroke: '#6b7280'
      },
      labelStyle: {
        fontSize: 10,
        fontWeight: 'bold'
      }
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [concepts, relations, domains, selectedDomains, setNodes, setEdges]);

  // Get available domains for filtering
  const availableDomains = [...new Set(domains.map(d => d.industry))];

  // Initialize selected domains
  useEffect(() => {
    if (selectedDomains.length === 0 && availableDomains.length > 0) {
      setSelectedDomains(availableDomains);
    }
  }, [availableDomains, selectedDomains.length]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleCloseDetailPanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="h-[800px] w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          style={{
            height: 120,
            width: 200
          }}
          zoomable
          pannable
          nodeColor={(node) => {
            const concept = node.data as unknown as Concept;
            const domain = domains.find(d => d.id === concept.ontologyId);
            return DOMAIN_COLORS[domain?.industry as keyof typeof DOMAIN_COLORS] || '#64748b';
          }}
        />

        <Panel position="top-left" className="bg-background">
          <DomainFilter
            availableDomains={availableDomains}
            selectedDomains={selectedDomains}
            onDomainToggle={handleDomainToggle}
          />
        </Panel>

        <Panel position="top-center" className="bg-background">
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <Brain className="h-5 w-5" />
              <div>
                <h2 className="font-semibold">
                  {selectedDomain?.displayName || t('ontology.knowledgeGraph', '知识图谱')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {nodes.filter(n => !(n as any).hidden).length} {t('ontology.concepts', '概念')} •
                  {edges.length} {t('ontology.relations', '关系')}
                </p>
              </div>
            </div>
          </Card>
        </Panel>
      </ReactFlow>

      <NodeDetailPanel selectedNode={selectedNode} onClose={handleCloseDetailPanel} />
    </div>
  );
}