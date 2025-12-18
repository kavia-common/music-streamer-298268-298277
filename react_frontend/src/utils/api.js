/**
 * API helper module for making requests to the backend authentication endpoints.
 * This module provides functions to interact with the Express backend authentication API.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

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
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
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

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error during login');
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
