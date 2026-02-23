import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from '../services/authService'; // Uncomment when backend is ready

const AuthContext = createContext();

// ==========================================
// 🚀 DEVELOPMENT TOGGLE
// Set this to `false` when your backend team is ready!
// ==========================================
const USE_MOCK_BACKEND = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on refresh
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('forge_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (USE_MOCK_BACKEND) {
        // MOCK LOGIN
        const mockUser = { email, name: email.split('@')[0], joined: new Date().toLocaleDateString() };
        setUser(mockUser);
        localStorage.setItem('forge_user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        // REAL API LOGIN (For when backend is ready)
        // const data = await authService.login(email, password);
        // localStorage.setItem('forge_token', data.token);
        // setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: "Invalid credentials or server is down." };
    }
  };

  const signup = async (email, password, name) => {
    try {
      if (USE_MOCK_BACKEND) {
        // MOCK SIGNUP
        const mockUser = { email, name: name || email.split('@')[0], joined: new Date().toLocaleDateString() };
        setUser(mockUser);
        localStorage.setItem('forge_user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        // REAL API SIGNUP
        // const data = await authService.register(email, password, name);
        // localStorage.setItem('forge_token', data.token);
        // setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: "Registration failed." };
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