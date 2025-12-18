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
 * Create a new playlist
 * @param {Object} playlistData - Playlist creation data
 * @param {string} playlistData.name - Playlist name
 * @param {string} playlistData.description - Playlist description (optional)
 * @returns {Promise<Object>} Created playlist data
 */
export const createPlaylist = async (playlistData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create playlist');
    }

    return data.data || data;
  } catch (error) {
    throw new Error(error.message || 'Network error creating playlist');
  }
};

/**
 * PUBLIC_INTERFACE
 * Get all playlists for the current user
 * @returns {Promise<Array>} Array of playlist objects
 */
export const getPlaylists = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/playlists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch playlists');
    }

    return data.data || data;
  } catch (error) {
    throw new Error(error.message || 'Network error fetching playlists');
  }
};

/**
 * PUBLIC_INTERFACE
 * Get a specific playlist by ID
 * @param {string} playlistId - Playlist ID
 * @returns {Promise<Object>} Playlist data
 */
export const getPlaylistById = async (playlistId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch playlist');
    }

    return data.data || data;
  } catch (error) {
    throw new Error(error.message || 'Network error fetching playlist');
  }
};

/**
 * PUBLIC_INTERFACE
 * Update a playlist
 * @param {string} playlistId - Playlist ID
 * @param {Object} updateData - Data to update
 * @param {string} updateData.name - New playlist name (optional)
 * @param {string} updateData.description - New playlist description (optional)
 * @returns {Promise<Object>} Updated playlist data
 */
export const updatePlaylist = async (playlistId, updateData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update playlist');
    }

    return data.data || data;
  } catch (error) {
    throw new Error(error.message || 'Network error updating playlist');
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
