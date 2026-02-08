import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = (email) => {
    const userData = { email, name: email.split('@')[0], joined: new Date().toLocaleDateString() };
    setUser(userData);
    localStorage.setItem('forge_user', JSON.stringify(userData));
  };

  const signup = (email) => login(email);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forge_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);