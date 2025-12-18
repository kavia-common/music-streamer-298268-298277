import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Main App component with routing for authentication pages.
 * Includes routes for login, register, and home page.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

/**
 * Home component - landing/dashboard page
 */
function Home() {
  const [theme, setTheme] = useState('dark');
  const { user, isAuthenticated, logoutUser, isLoading } = useAuth();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await logoutUser();
  };

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        
        {isAuthenticated ? (
          <>
            <p>
              Welcome back, <strong>{user?.email}</strong>!
            </p>
            {user?.profile?.display_name && (
              <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                {user.profile.display_name}
              </p>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              You are successfully logged in to Music Streamer
            </p>
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              Welcome to Music Streamer
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Please login or register to start streaming music
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Link 
                to="/login" 
                style={{ 
                  color: '#ffffff',
                  backgroundColor: '#3b82f6',
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  color: '#ffffff',
                  backgroundColor: '#06b6d4',
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                Register
              </Link>
            </div>
          </>
        )}
        
        <p style={{ fontSize: '0.8rem', marginTop: '3rem', opacity: 0.7 }}>
          Current theme: <strong>{theme}</strong>
        </p>
      </header>
    </div>
  );
}

export default App;
