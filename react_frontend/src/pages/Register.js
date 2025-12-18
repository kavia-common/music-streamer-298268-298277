import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { register, setAuthToken, setUserData } from '../utils/api';

/**
 * PUBLIC_INTERFACE
 * Registration page component that handles new user account creation.
 * Uses the AuthForm component and calls the backend register endpoint.
 */
function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle registration form submission
   * @param {Object} formData - Registration data from the form
   */
  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      });

      // Store the authentication token if provided
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

      // Navigate to home page on successful registration
      navigate('/');
    } catch (error) {
      // Error will be displayed by AuthForm component
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />;
}

export default Register;
