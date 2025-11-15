import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearAuthData, getStoredUser, getStoredToken } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    try {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();
      
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Error initializing auth context:', error);
      clearAuthData();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuthenticated(true);
    
    if (userData) {
      try {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error('Error storing user data:', error);
        setUser(null);
      }
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
