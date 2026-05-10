import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ token });
      // Optional: fetch real user profile
      // api.get('/users/me').then(res => setUser({ ...res.data, token })).catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    setUser({ token: access_token });
  };

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    setUser({ token: access_token });
  };

  const logout = async () => {
    try {
      // If there's an API logout endpoint
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
