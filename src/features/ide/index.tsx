import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IDEHome } from './components/IDEHome';
import { AgentCreationWizard } from './components/AgentCreationWizard';
import { AgentEditor } from './components/AgentEditor';
import { OBRAgentWizardRoute } from './components/OBRAgentWizardRoute';

export function IDEOverview() {
  return (
    <Routes>
      <Route index element={<IDEHome />} />
      <Route path="create" element={<AgentCreationWizard />} />
      <Route path="obr-create" element={<OBRAgentWizardRoute />} />
      <Route path="agent/:agentId/*" element={<AgentEditor />} />
    </Routes>
  );
}