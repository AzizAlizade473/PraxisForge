import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';


const AuthContext = createContext();


const USE_MOCK_BACKEND = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('forge_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        const userData = profile?.user || profile;
        if (userData) {
          setUser(userData);
          localStorage.setItem('forge_user', JSON.stringify(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('forge_token');
        localStorage.removeItem('forge_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      if (USE_MOCK_BACKEND) {
        const mockUser = { username, name: username, joined: new Date().toLocaleDateString() };
        setUser(mockUser);
        localStorage.setItem('forge_user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        const data = await authService.login(username, password);
        if (data?.token) {
          localStorage.setItem('forge_token', data.token);
        }
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('forge_user', JSON.stringify(data.user));
        }
        return { success: true };
      }
    } catch (error) {
      const detail = error?.response?.data?.detail;
      let message;

      if (Array.isArray(detail)) {
        message = detail.map((d) => d.msg).join(' ');
      } else if (typeof detail === 'string') {
        message = detail;
      } else if (typeof error?.response?.data?.message === 'string') {
        message = error.response.data.message;
      } else if (typeof error?.message === 'string') {
        message = error.message;
      } else {
        message = "Invalid credentials or server is down.";
      }

      return { success: false, error: message };
    }
  };

  const signup = async (username, email, password, role = 'user') => {
    try {
      if (USE_MOCK_BACKEND) {
        const mockUser = { email, name: username, joined: new Date().toLocaleDateString(), role };
        setUser(mockUser);
        localStorage.setItem('forge_user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        const data = await authService.register(username, email, password, role);
        if (data?.token) {
          localStorage.setItem('forge_token', data.token);
        }
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('forge_user', JSON.stringify(data.user));
        }
        return { success: true };
      }
    } catch (error) {
      const detail = error?.response?.data?.detail;
      let message;

      if (Array.isArray(detail)) {
        message = detail.map((d) => d.msg).join(' ');
      } else if (typeof detail === 'string') {
        message = detail;
      } else if (typeof error?.response?.data?.message === 'string') {
        message = error.response.data.message;
      } else if (typeof error?.message === 'string') {
        message = error.message;
      } else {
        message = "Registration failed.";
      }

      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forge_user');
    localStorage.removeItem('forge_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);