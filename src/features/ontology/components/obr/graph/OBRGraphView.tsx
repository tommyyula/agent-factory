// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ReactFlow, 
  Node, 
  Edge, 
  useNodesState, 
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  NodeTypes,
  EdgeTypes,
  MarkerType
} from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import dagre from 'dagre';

import { OntologyBlueprint, OBRLink } from '@/shared/types/obr.types';
import { useOBRStore } from '@/stores/obr.store';
import { ObjectNode, BehaviorNode, RuleNode, ScenarioNode } from './OBRNodeTypes';

// Custom node types
const nodeTypes: NodeTypes = {
  objectNode: ObjectNode as any,
  behaviorNode: BehaviorNode as any,
  ruleNode: RuleNode as any,
  scenarioNode: ScenarioNode as any
};

// Edge styles for different relationship types
const getEdgeStyle = (relationshipType: OBRLink['relationshipType']) => {
  const styles = {
    is_a: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '0' },
    part_of: { stroke: '#ef4444', strokeWidth: 3, strokeDasharray: '0' },
    depends_on: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
    triggers: { stroke: '#10b981', strokeWidth: 3, strokeDasharray: '0' },
    precedes: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '0' },
    conflicts_with: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '3,3' },
    implements: { stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '0' },
    validates: { stroke: '#84cc16', strokeWidth: 1, strokeDasharray: '2,2' },
    aggregates: { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '0' },
    uses: { stroke: '#6b7280', strokeWidth: 2, strokeDasharray: '0' },
    produces: { stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '0' },
    consumes: { stroke: '#be185d', strokeWidth: 2, strokeDasharray: '0' }
  };
  return styles[relationshipType] || { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '0' };
};

interface OBRGraphViewProps {
  blueprint?: OntologyBlueprint;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string, nodeType: 'object' | 'behavior' | 'rule' | 'scenario') => void;
  readonly?: boolean;
}

export function OBRGraphView({ 
  blueprint, 
  selectedNodeId, 
  onNodeSelect,
  readonly = false 
}: OBRGraphViewProps) {
  // Store hooks
  const { 
    currentBlueprint, 
    graphViewState, 
    updateGraphView,
    selectNode 
  } = useOBRStore();

  // Use provided blueprint or current from store
  const activeBlueprint = blueprint || currentBlueprint;

  // Local state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLayouting, setIsLayouting] = useState(false);

  // Convert OBR data to React Flow nodes
  const convertToNodes = useCallback((blueprint: OntologyBlueprint): Node[] => {
    const nodeList: Node[] = [];
    
    // Object nodes
    if (graphViewState.filters.nodeTypes.includes('object')) {
      blueprint.objects.forEach(obj => {
        nodeList.push({
          id: obj.id,
          type: 'objectNode',
          position: obj.visual.position || { x: Math.random() * 500, y: Math.random() * 500 },
          data: { 
            object: obj,
            isSelected: selectedNodeId === obj.id,
            onClick: () => onNodeSelect?.(obj.id, 'object')
          },
          style: {
            background: obj.visual.color || '#3b82f6',
          }
        });
      });
    }

    // Behavior nodes
    if (graphViewState.filters.nodeTypes.includes('behavior')) {
      blueprint.behaviors.forEach(behavior => {
        nodeList.push({
          id: behavior.id,
          type: 'behaviorNode',
          position: behavior.visual.position || { x: Math.random() * 500, y: Math.random() * 500 },
          data: { 
            behavior,
            isSelected: selectedNodeId === behavior.id,
            onClick: () => onNodeSelect?.(behavior.id, 'behavior')
          },
          style: {
            background: behavior.visual.color || '#22c55e',
          }
        });
      });
    }

    // Rule nodes
    if (graphViewState.filters.nodeTypes.includes('rule')) {
      blueprint.rules.forEach(rule => {
        nodeList.push({
          id: rule.id,
          type: 'ruleNode',
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { 
            rule,
            isSelected: selectedNodeId === rule.id,
            onClick: () => onNodeSelect?.(rule.id, 'rule')
          },
          style: {
            background: '#f97316',
          }
        });
      });
    }

    // Scenario nodes
    if (graphViewState.filters.nodeTypes.includes('scenario')) {
      blueprint.scenarios.forEach(scenario => {
        nodeList.push({
          id: scenario.id,
          type: 'scenarioNode',
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { 
            scenario,
            isSelected: selectedNodeId === scenario.id,
            onClick: () => onNodeSelect?.(scenario.id, 'scenario')
          },
          style: {
            background: '#8b5cf6',
          }
        });
      });
    }

    return nodeList;
  }, [graphViewState.filters.nodeTypes, selectedNodeId, onNodeSelect]);

  // Convert OBR links to React Flow edges
  const convertToEdges = useCallback((blueprint: OntologyBlueprint, nodes: Node[]): Edge[] => {
    const nodeIds = new Set(nodes.map(n => n.id));
    
    return blueprint.links
      .filter(link => 
        nodeIds.has(link.sourceId) && 
        nodeIds.has(link.targetId) &&
        graphViewState.filters.linkTypes.includes(link.relationshipType)
      )
      .map(link => {
        const style = getEdgeStyle(link.relationshipType);
        
        return {
          id: link.id,
          source: link.sourceId,
          target: link.targetId,
          type: 'smoothstep',
          style: style,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: style.stroke
          },
          label: graphViewState.filters.showLabels ? link.visual.label || link.relationshipType : undefined,
          labelStyle: { fontSize: 10, fontWeight: 'bold' },
          data: { link }
        };
      });
  }, [graphViewState.filters.linkTypes, graphViewState.filters.showLabels]);

  // Auto layout using dagre
  const applyAutoLayout = useCallback((nodes: Node[], edges: Edge[]) => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    
    // Configure layout
    g.setGraph({ 
      rankdir: 'TB',
      nodesep: 100,
      ranksep: 150,
      marginx: 20,
      marginy: 20
    });

    // Add nodes
    nodes.forEach(node => {
      g.setNode(node.id, { 
        width: node.type === 'scenarioNode' ? 200 : 150, 
        height: node.type === 'scenarioNode' ? 120 : 80 
      });
    });

    // Add edges
    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    // Apply new positions
    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.type === 'scenarioNode' ? 100 : 75),
          y: nodeWithPosition.y - (node.type === 'scenarioNode' ? 60 : 40)
        }
      };
    });

    return layoutedNodes;
  }, []);

  // Update nodes and edges when blueprint changes
  useEffect(() => {
    if (!activeBlueprint) return;

    setIsLayouting(true);
    
    const newNodes = convertToNodes(activeBlueprint);
    const newEdges = convertToEdges(activeBlueprint, newNodes);
    
    // Apply auto layout if enabled
    const layoutedNodes = graphViewState.layout === 'hierarchical' 
      ? applyAutoLayout(newNodes, newEdges)
      : newNodes;
    
    setNodes(layoutedNodes);
    setEdges(newEdges);
    
    setIsLayouting(false);
  }, [activeBlueprint, convertToNodes, convertToEdges, applyAutoLayout, graphViewState.layout, setNodes, setEdges]);

  // Handle node selection
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data.onClick) {
      node.data.onClick();
    }
  }, []);

  // Handle filter changes
  const toggleNodeType = useCallback((nodeType: 'object' | 'behavior' | 'rule' | 'scenario') => {
    const currentTypes = graphViewState.filters.nodeTypes;
    const newTypes = currentTypes.includes(nodeType)
      ? currentTypes.filter(t => t !== nodeType)
      : [...currentTypes, nodeType];
    
    updateGraphView({
      filters: { ...graphViewState.filters, nodeTypes: newTypes }
    });
  }, [graphViewState.filters, updateGraphView]);

  const toggleLinkType = useCallback((linkType: OBRLink['relationshipType']) => {
    const currentTypes = graphViewState.filters.linkTypes;
    const newTypes = currentTypes.includes(linkType)
      ? currentTypes.filter(t => t !== linkType)
      : [...currentTypes, linkType];
    
    updateGraphView({
      filters: { ...graphViewState.filters, linkTypes: newTypes }
    });
  }, [graphViewState.filters, updateGraphView]);

  // Handle layout change
  const handleLayoutChange = useCallback((layout: string) => {
    updateGraphView({ layout: layout as any });
  }, [updateGraphView]);

  // Force re-layout
  const handleForceLayout = useCallback(() => {
    if (graphViewState.layout === 'hierarchical') {
      const layoutedNodes = applyAutoLayout(nodes, edges);
      setNodes(layoutedNodes);
    }
  }, [graphViewState.layout, nodes, edges, applyAutoLayout, setNodes]);

  // Export graph as image
  const handleExportImage = useCallback(() => {
    // This would need additional implementation for image export
    console.log('Export image functionality would be implemented here');
  }, []);

  // No blueprint available
  if (!activeBlueprint) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">暂无本体数据可显示</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="obr-graph-view h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        {graphViewState.filters.showMiniMap && <MiniMap />}
        <Background variant={BackgroundVariant.Dots} />

        {/* Filter Panel */}
        <Panel position="top-left">
          <Card className={`transition-all ${isFilterPanelOpen ? 'w-80' : 'w-auto'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">图形控制</CardTitle>
                <Button
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  size="sm"
                  variant="ghost"
                >
                  {isFilterPanelOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            
            {isFilterPanelOpen && (
              <CardContent className="space-y-4">
                {/* Layout Controls */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">布局</Label>
                  <div className="flex gap-2">
                    <Select value={graphViewState.layout} onValueChange={handleLayoutChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="force">力导向</SelectItem>
                        <SelectItem value="hierarchical">层次结构</SelectItem>
                        <SelectItem value="circular">环形</SelectItem>
                        <SelectItem value="grid">网格</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleForceLayout} size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Node Filters */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">节点类型</Label>
                  <div className="space-y-1">
                    {[
                      { key: 'object', label: '对象', color: '#3b82f6' },
                      { key: 'behavior', label: '行为', color: '#22c55e' },
                      { key: 'rule', label: '规则', color: '#f97316' },
                      { key: 'scenario', label: '场景', color: '#8b5cf6' }
                    ].map(({ key, label, color }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-${key}`}
                          checked={graphViewState.filters.nodeTypes.includes(key as any)}
                          onCheckedChange={() => toggleNodeType(key as any)}
                        />
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: color }}
                          />
                          <Label htmlFor={`filter-${key}`} className="text-xs">
                            {label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link Type Filters */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">关系类型</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {[
                      { key: 'is_a', label: '继承' },
                      { key: 'part_of', label: '组成' },
                      { key: 'depends_on', label: '依赖' },
                      { key: 'triggers', label: '触发' },
                      { key: 'precedes', label: '先于' },
                      { key: 'conflicts_with', label: '冲突' },
                      { key: 'implements', label: '实现' },
                      { key: 'validates', label: '验证' },
                      { key: 'aggregates', label: '聚合' },
                      { key: 'uses', label: '使用' },
                      { key: 'produces', label: '产生' },
                      { key: 'consumes', label: '消费' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`link-${key}`}
                          checked={graphViewState.filters.linkTypes.includes(key as any)}
                          onCheckedChange={() => toggleLinkType(key as any)}
                        />
                        <Label htmlFor={`link-${key}`} className="text-xs">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">显示选项</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-labels"
                        checked={graphViewState.filters.showLabels}
                        onCheckedChange={(checked) => updateGraphView({
                          filters: { ...graphViewState.filters, showLabels: !!checked }
                        })}
                      />
                      <Label htmlFor="show-labels" className="text-xs">
                        显示标签
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-minimap"
                        checked={graphViewState.filters.showMiniMap}
                        onCheckedChange={(checked) => updateGraphView({
                          filters: { ...graphViewState.filters, showMiniMap: !!checked }
                        })}
                      />
                      <Label htmlFor="show-minimap" className="text-xs">
                        小地图
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </Panel>

        {/* Statistics Panel */}
        <Panel position="top-right">
          <Card>
            <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                <div>节点: {nodes.length}</div>
                <div>关系: {edges.length}</div>
                <div>域: {activeBlueprint.metadata.domain}</div>
              </div>
            </CardContent>
          </Card>
        </Panel>

        {/* Action Panel */}
        <Panel position="bottom-right">
          <div className="flex gap-2">
            <Button onClick={handleExportImage} size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
            {isLayouting && (
              <Badge variant="secondary">布局中...</Badge>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default OBRGraphView;