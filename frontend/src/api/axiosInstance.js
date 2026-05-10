import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
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
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
      const newAccessToken = res.data.access_token;
      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    } catch {
      console.warn("Refresh token expired or unauthorized. Logging out...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
