/**
 * API helper module for making requests to the backend authentication endpoints.
 * This module provides functions to interact with the Express backend authentication API.
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * PUBLIC_INTERFACE
 * Register a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password
 * @param {string} userData.displayName - User display name
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        display_name: userData.displayName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Return normalized response with token and user data
    return {
      token: data.data?.session?.access_token,
      refreshToken: data.data?.session?.refresh_token,
      expiresAt: data.data?.session?.expires_at,
      user: data.data?.user,
      profile: data.data?.profile,
    };
  } catch (error) {
    throw new Error(error.message || 'Network error during registration');
  }
};

/**
 * PUBLIC_INTERFACE
 * Login an existing user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email address
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Return normalized response with token and user data
    return {
      token: data.data?.session?.access_token,
      refreshToken: data.data?.session?.refresh_token,
      expiresAt: data.data?.session?.expires_at,
      user: data.data?.user,
    };
  } catch (error) {
    throw new Error(error.message || 'Network error during login');
  }
};

/**
 * PUBLIC_INTERFACE
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    // Clear local storage
    removeAuthToken();
    removeUserData();
  } catch (error) {
    // Even if logout fails on server, clear local data
    removeAuthToken();
    removeUserData();
    throw new Error(error.message || 'Network error during logout');
  }
};

/**
 * PUBLIC_INTERFACE
 * Get current authenticated user information
 * @returns {Promise<Object>} User data and profile
 */
export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user information');
    }

    return {
      user: data.data?.user,
      profile: data.data?.profile,
    };
  } catch (error) {
    throw new Error(error.message || 'Network error fetching user data');
  }
};

/**
 * PUBLIC_INTERFACE
 * Store authentication token in localStorage
 * @param {string} token - JWT authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * PUBLIC_INTERFACE
 * Retrieve authentication token from localStorage
 * @returns {string|null} JWT authentication token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * PUBLIC_INTERFACE
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * PUBLIC_INTERFACE
 * Store user data in localStorage
 * @param {Object} userData - User data object
 */
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
};

/**
 * PUBLIC_INTERFACE
 * Retrieve user data from localStorage
 * @returns {Object|null} User data object or null
 */
export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

/**
 * PUBLIC_INTERFACE
 * Remove user data from localStorage
 */
export const removeUserData = () => {
  localStorage.removeItem('userData');
};

/**
 * PUBLIC_INTERFACE
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};
