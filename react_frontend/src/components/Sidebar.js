import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPlaylist, getPlaylists } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation component for the music streaming app.
 * Provides navigation links with Spotify-like styling and green theme.
 * Fetches and displays user playlists from backend.
 * Allows creating new playlists via the "Create Playlist" button.
 */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: '🔍', label: 'Search', path: '/search', active: location.pathname === '/search' },
    { icon: '📚', label: 'Your Library', path: '/library', active: location.pathname === '/library' },
  ];

  // Fetch playlists on mount if authenticated
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!isAuthenticated) {
        setPlaylists([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getPlaylists();
        // Ensure data is an array
        const playlistsArray = Array.isArray(data) ? data : (data?.playlists || []);
        setPlaylists(playlistsArray);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError(err.message);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [isAuthenticated]);

  /**
   * Handle create playlist button click
   */
  const handleCreatePlaylist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const newPlaylist = await createPlaylist({
        name: 'New Playlist',
        description: 'My new playlist',
      });

      // Optimistically add to the list
      setPlaylists((prev) => [...prev, newPlaylist]);

      // Navigate to the new playlist page
      if (newPlaylist.id) {
        navigate(`/playlist/${newPlaylist.id}`);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle playlist click
   */
  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  /**
   * Handle liked songs navigation
   */
  const handleLikedSongsClick = () => {
    navigate('/playlist/liked-songs');
  };

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
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
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
          <li>
            <button 
              className="nav-link"
              aria-label="Create Playlist"
              onClick={handleCreatePlaylist}
              disabled={loading || !isAuthenticated}
              style={{ 
                width: '100%', 
                background: 'none', 
                border: 'none', 
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-label">
                {loading ? 'Creating...' : 'Create Playlist'}
              </span>
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              aria-label="Liked Songs"
              onClick={handleLikedSongsClick}
              style={{ 
                width: '100%', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
              }}
            >
              <span className="nav-icon">❤️</span>
              <span className="nav-label">Liked Songs</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-playlists">
        {error && (
          <div style={{ 
            padding: '8px 12px', 
            color: '#ef4444', 
            fontSize: '12px',
            marginBottom: '8px',
          }}>
            {error}
          </div>
        )}
        {loading && playlists.length === 0 && (
          <div style={{ 
            padding: '8px 12px', 
            color: '#b3b3b3', 
            fontSize: '14px',
          }}>
            Loading playlists...
          </div>
        )}
        {!loading && playlists.length === 0 && isAuthenticated && !error && (
          <div style={{ 
            padding: '8px 12px', 
            color: '#b3b3b3', 
            fontSize: '14px',
          }}>
            No playlists yet
          </div>
        )}
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            className="playlist-item"
            onClick={() => handlePlaylistClick(playlist.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePlaylistClick(playlist.id);
              }
            }}
          >
            {playlist.name || 'Untitled Playlist'}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
