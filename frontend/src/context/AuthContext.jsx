/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';
import { profileFallback } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const bootstrapUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser({ ...response.data, token });
      } catch {
        setUser({ ...profileFallback, token });
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, user: userPayload } = response.data;
    localStorage.setItem('access_token', access_token);
    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
    setUser(userPayload ? { ...userPayload, token: access_token } : { ...profileFallback, token: access_token });
  };

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    const { access_token, refresh_token, user: userPayload } = response.data;
    localStorage.setItem('access_token', access_token);
    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
    setUser(userPayload ? { ...userPayload, token: access_token } : { ...profileFallback, token: access_token });
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await api.get('/users/me');
      setUser({ ...response.data, token });
    } catch {
      setUser((current) => ({ ...(current ?? profileFallback), token }));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
