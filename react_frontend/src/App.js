import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

// PUBLIC_INTERFACE
/**
 * Main App component with routing for authentication pages.
 * Includes routes for login, register, home page, and playlist pages.
 * Wraps the app with AuthProvider and PlayerProvider for global state management.
 */
function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/playlist/:slug" element={<Playlist />} />
          </Routes>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
