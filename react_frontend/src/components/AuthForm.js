import React, { useState } from 'react';
import './AuthForm.css';

/**
 * PUBLIC_INTERFACE
 * Reusable authentication form component for login and registration.
 * Includes client-side validation, error display, and dark Spotify-like styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Form type: 'login' or 'register'
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {boolean} props.isLoading - Loading state for submit button
 */
function AuthForm({ type = 'login', onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const isRegister = type === 'register';

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate password strength
   */
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  /**
   * Validate display name
   */
  const validateDisplayName = (name) => {
    return name.trim().length >= 2;
  };

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear server error when user modifies form
    if (serverError) {
      setServerError('');
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegister) {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      } else if (!validateDisplayName(formData.displayName)) {
        newErrors.displayName = 'Display name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setServerError(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h1 className="auth-form-title">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="auth-form-subtitle">
          {isRegister
            ? 'Sign up to start streaming music'
            : 'Log in to continue listening'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className={`form-input ${errors.displayName ? 'error' : ''}`}
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isLoading}
              />
              {errors.displayName && (
                <span className="error-message">{errors.displayName}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {serverError && (
            <div className="server-error">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="auth-form-footer">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <a href="/login" className="auth-link">
                Log in
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <a href="/register" className="auth-link">
                Sign up
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
