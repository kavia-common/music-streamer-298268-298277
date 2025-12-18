import React from 'react';
import './Sidebar.css';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation component for the music streaming app.
 * Provides navigation links with Spotify-like styling and green theme.
 */
function Sidebar() {
  const navItems = [
    { icon: '🏠', label: 'Home', path: '/', active: true },
    { icon: '🔍', label: 'Search', path: '/search', active: false },
    { icon: '📚', label: 'Your Library', path: '/library', active: false },
  ];

  const playlistItems = [
    { icon: '➕', label: 'Create Playlist', path: '/create-playlist' },
    { icon: '❤️', label: 'Liked Songs', path: '/liked' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🎵</span>
        <span className="logo-text">Music Streamer</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.path} 
                className={`nav-link ${item.active ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {playlistItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.path} 
                className="nav-link"
                aria-label={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-playlists">
        <div className="playlist-item">My Playlist #1</div>
        <div className="playlist-item">Road Trip Mix</div>
        <div className="playlist-item">Workout Beats</div>
      </div>
    </aside>
  );
}

export default Sidebar;
