import React, { useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, GitBranch, Calendar, User, RotateCcw, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OntologyList } from './components/OntologyList';
import { KnowledgeGraphViewer } from './components/KnowledgeGraphViewer';
// Import OBR components
import { OBRPanel } from './components/obr/OBRPanel';
import { OBRGraphView } from './components/obr/graph/OBRGraphView';
import { SimulationPanel } from './components/obr/simulation/SimulationPanel';

export function OntologyOverview() {
  return (
    <Routes>
      <Route index element={<OntologyList />} />
      {/* OBR Panel routes */}
      <Route path="obr" element={<OBRPanel />} />
      <Route path="obr/:domainId" element={<OBRPanel />} />
      {/* OBR Graph View - replaced old KnowledgeGraphViewer */}
      <Route path="graph/:domainId?" element={<OBRGraphView />} />
      {/* Simulation Panel */}
      <Route path="simulation/:scenarioId?" element={<SimulationPanel />} />
      {/* Keep version history */}
      <Route path="versions/:ontologyId" element={<VersionHistory />} />
      {/* Legacy fallback for old graph route */}
      <Route path="legacy-graph/:ontologyId?" element={<KnowledgeGraphViewer />} />
    </Routes>
  );
}

function VersionHistory() {
  const { t } = useTranslation();
  const { ontologyId } = useParams();
  const navigate = useNavigate();

  // Mock version history data
  const mockVersions = [
    {
      id: 'v-001',
      version: '3.2.1',
      date: '2026-03-14',
      author: 'Sarah Chen',
      changes: [
        'Added new logistics concepts for international shipping',
        'Updated warehouse management relationships',
        'Fixed inconsistencies in product classification'
      ],
      status: 'current',
      conceptCount: 1247,
      relationCount: 3856
    },
    {
      id: 'v-002',
      version: '3.2.0',
      date: '2026-03-08',
      author: 'Michael Rodriguez',
      changes: [
        'Major update: Integrated AI-driven categorization',
        'Added 150+ new transportation concepts',
        'Restructured order management ontology'
      ],
      status: 'stable',
      conceptCount: 1203,
      relationCount: 3721
    },
    {
      id: 'v-003',
      version: '3.1.5',
      date: '2026-02-28',
      author: 'Emma Thompson',
      changes: [
        'Hotfix for inventory tracking relationships',
        'Updated compliance mappings for new regulations',
        'Performance improvements for large queries'
      ],
      status: 'stable',
      conceptCount: 1156,
      relationCount: 3698
    },
    {
      id: 'v-004',
      version: '3.1.4',
      date: '2026-02-15',
      author: 'David Kim',
      changes: [
        'Enhanced customer relationship mappings',
        'Added support for multi-tenant operations',
        'Bug fixes in geospatial concepts'
      ],
      status: 'deprecated',
      conceptCount: 1142,
      relationCount: 3654
    },
    {
      id: 'v-005',
      version: '3.1.3',
      date: '2026-01-30',
      author: 'Sarah Chen',
      changes: [
        'Initial release of WMS integration concepts',
        'Added quality control ontology branch',
        'Documentation improvements'
      ],
      status: 'deprecated',
      conceptCount: 1089,
      relationCount: 3521
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500';
      case 'stable': return 'bg-blue-500';
      case 'deprecated': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'current': return 'default';
      case 'stable': return 'secondary';
      case 'deprecated': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current': return t('ontology.versions.status.current', 'Current');
      case 'stable': return t('ontology.versions.status.stable', 'Stable');
      case 'deprecated': return t('ontology.versions.status.deprecated', 'Deprecated');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ontology')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('ontology.versions.title', 'Version History')}
          </h1>
          <p className="text-muted-foreground">
            {t('ontology.versions.subtitle', 'Track changes and manage ontology versions')}
            {ontologyId && ` • Domain: ${ontologyId}`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Versions</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVersions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Version</CardTitle>
            <Badge variant="default" className="text-xs">LATEST</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v{mockVersions[0].version}</div>
            <p className="text-xs text-muted-foreground">{mockVersions[0].date}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVersions[0].conceptCount}</div>
            <p className="text-xs text-muted-foreground">
              +{mockVersions[0].conceptCount - mockVersions[1].conceptCount} from previous
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVersions[0].relationCount}</div>
            <p className="text-xs text-muted-foreground">
              +{mockVersions[0].relationCount - mockVersions[1].relationCount} from previous
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Version List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Version History</h2>
        {mockVersions.map((version, index) => (
          <Card key={version.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(version.status)}`} />
                  <div>
                    <CardTitle className="text-lg">v{version.version}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{version.date}</span>
                      <User className="h-3 w-3 ml-2" />
                      <span>{version.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(version.status)}>
                    {getStatusText(version.status)}
                  </Badge>
                  {index === 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      CURRENT
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Changes:</h4>
                <ul className="space-y-1">
                  {version.changes.map((change, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    <strong>{version.conceptCount}</strong> concepts
                  </span>
                  <span>
                    <strong>{version.relationCount}</strong> relations
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                  {version.status !== 'current' && (
                    <Button size="sm" variant="outline">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


