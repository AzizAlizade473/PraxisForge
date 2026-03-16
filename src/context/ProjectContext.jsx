import React, { createContext, useContext, useState } from 'react';
import { praxisService } from '../services/praxisService';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedMode, setSelectedMode] = useState('startup');
  const [userIdea, setUserIdea] = useState('');
  const [projectName, setProjectName] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [brainData, setBrainData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProject = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [summary, brain] = await Promise.all([
        praxisService.getProjectSummary(projectId),
        praxisService.getBrainSummary(projectId),
      ]);
      setSummaryData(summary);
      setBrainData(brain);
      setActiveProjectId(projectId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedMode,
        setSelectedMode,
        userIdea,
        setUserIdea,
        projectName,
        setProjectName,
        activeProjectId,
        setActiveProjectId,
        summaryData,
        brainData,
        loading,
        loadProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

