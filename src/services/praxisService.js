import api from './api';

export const praxisService = {
  createProject: async (name, description, mode) => {
    const response = await api.post('/projects/', {
      name,
      description,
      mode,
    });
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProjectSummary: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/summary/`);
    return response.data;
  },

  getBrainSummary: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/brain/summary`);
    return response.data;
  },

  getTasks: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks/`);
    return response.data;
  },

  createTask: async (projectId, task) => {
    const response = await api.post(`/projects/${projectId}/tasks/`, task);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

