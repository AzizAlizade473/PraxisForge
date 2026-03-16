import axios from 'axios';

// Main PraxisForge API instance (talks directly to deployed backend)
// Expect VITE_API_BASE_URL to already include the correct base path,
// e.g. http://16.170.179.235/PraxisForge_Backend/api/v1
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://16.170.179.235/PraxisForge_Backend/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API for register, token, and me endpoints
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL || 'http://16.170.179.235/backend_forge',
  headers: {
    'Content-Type': 'application/json',
  },
});

[api, authApi].forEach((instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('forge_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('forge_token');
        localStorage.removeItem('forge_user');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    },
  );
});

export default api;