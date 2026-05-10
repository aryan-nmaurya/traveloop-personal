import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  // Example: handle 401 Unauthorized for token refresh here
  if (error.response?.status === 401) {
    console.warn("Unauthorized: Token might be expired.");
    // In a real implementation: refresh token logic goes here.
  }
  return Promise.reject(error);
});

export default api;
