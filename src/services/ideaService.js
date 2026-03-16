import api from './api';

export const ideaService = {
  generateIdea: async (mode, prompt) => {
    // 1. Map frontend modes to backend Enum values
    const modeMapping = {
      'Student': 'idea',
      'Entrepreneur': 'startup',
      'Hackathon': 'hackathon',
      'Team': 'enterprise'
    };
    
    // 2. Create the project
    const projectResponse = await api.post('/api/v1/projects/', { 
      name: "Project Forge",
      description: prompt,
      mode: modeMapping[mode] || 'idea'
    });
    
    const projectId = projectResponse.data.id;
    
    // 3. Optional: Add a delay to let the async celery tasks run 
    // Usually we would poll or use websockets, but for now we'll wait a couple of seconds before fetching the summary
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 4. Fetch the generated summary
    try {
      const summaryResponse = await api.get(`/api/v1/projects/${projectId}/summary/`);
      return { ...summaryResponse.data, projectId }; 
    } catch (err) {
      console.warn("Backend summary generation failed. Returning mock data.", err);
      // Fallback object matching what ResultsDashboard.jsx expects
      return {
        projectId,
        project_mode: modeMapping[mode] || 'idea',
        task_overview: { "pending": 5, "in_progress": 2 },
        summary: "The AI processor generated an initial framework but encountered an error synthesizing the final summary. This is a locally generated fallback.",
        key_insights: [
          "Market potential remains strong despite processing delays.",
          "Consider manually refining the architecture.",
          "Backend AI processing may require additional configuration."
        ],
        key_facts: [
          { id: 'fact_1', category: 'Problem Space', content: prompt || "Identified market gap.", is_user_directive: true },
          { id: 'fact_2', category: 'Target Market', content: "Initial analysis suggests an expanding user base.", is_user_directive: false },
          { id: 'fact_3', category: 'Feasibility', content: "High technical viability with modern stacks.", is_user_directive: false }
        ],
        architecture_overview: "Fallback Architecture:\n- Frontend: React / Vite\n- Backend: Node.js / Python\n- AI: External API integration",
        recommended_db_structure: "users {\n  uuid id PK\n  varchar username\n}\n\nprojects {\n  uuid id PK\n  uuid owner_id FK\n}"
      };
    }
  },
  
  getHistory: async () => {
    // List user projects
    const response = await api.get('/api/v1/projects/');
    return response.data;
  },

  updateFact: async (projectId, factId, content) => {
    const response = await api.patch(`/api/v1/projects/${projectId}/insights/${factId}`, {
      content: content
    });
    return response.data;
  }
};