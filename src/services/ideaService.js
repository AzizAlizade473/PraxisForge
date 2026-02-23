import api from './api';

export const ideaService = {
  // Send the idea to the backend AI
  generateIdea: async (mode, prompt) => {
    const response = await api.post('/forge/generate', { 
      mode: mode, 
      prompt: prompt 
    });
    return response.data; // The backend MUST return the JSON structure we designed earlier!
  },

  // Fetch past projects for the Profile page
  getHistory: async () => {
    const response = await api.get('/forge/history');
    return response.data;
  }
};