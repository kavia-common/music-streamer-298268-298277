import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login, setAuthToken, setUserData } from '../utils/api';

/**
 * PUBLIC_INTERFACE
 * Login page component that handles user authentication.
 * Uses the AuthForm component and calls the backend login endpoint.
 */
function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle login form submission
   * @param {Object} formData - Login credentials from the form
   */
  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Store the authentication token
      if (response.token) {
        setAuthToken(response.token);
      }

      // Store user data
      if (response.user) {
        setUserData({
          ...response.user,
          profile: response.profile,
        });
      }

      // Navigate to home page on successful login
      navigate('/');
    } catch (error) {
      // Error will be displayed by AuthForm component
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />;
}

export default Login;
