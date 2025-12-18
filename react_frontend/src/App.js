import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

// PUBLIC_INTERFACE
/**
 * Main App component with routing for authentication pages.
 * Includes routes for login, register, and home page.
 */
function App() {
  const [theme, setTheme] = useState('dark');

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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  );
}

/**
 * Home component - placeholder landing page
 */
function Home({ theme, toggleTheme }) {
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
        <p>
          Welcome to Music Streamer
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
            Login
          </Link>
          <Link to="/register" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 'bold' }}>
            Register
          </Link>
        </div>
      </header>
    </div>
  );
}

export default App;
