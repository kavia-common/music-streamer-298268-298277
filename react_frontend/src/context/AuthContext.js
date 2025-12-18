import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAuthToken, 
  getUserData, 
  removeAuthToken, 
  removeUserData,
  logout as apiLogout 
} from '../utils/api';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * PUBLIC_INTERFACE
 * AuthProvider component that wraps the app and provides authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = getAuthToken();
      const userData = getUserData();

      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Update user state after login or registration
   * @param {Object} userData - User data to set
   */
  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Clear user state and logout
   */
  const logoutUser = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
      removeUserData();
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
