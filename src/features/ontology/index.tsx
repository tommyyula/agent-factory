import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OntologyList } from './components/OntologyList';
import { KnowledgeGraphViewer } from './components/KnowledgeGraphViewer';

export function OntologyOverview() {
  return (
    <Routes>
      <Route index element={<OntologyList />} />
      <Route path="graph/:ontologyId?" element={<KnowledgeGraphViewer />} />
      <Route path="versions/:ontologyId" element={<div>Version History (Coming Soon)</div>} />
    </Routes>
  );
}


