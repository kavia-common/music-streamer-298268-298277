import React from 'react';
import './TopBar.css';

/**
 * PUBLIC_INTERFACE
 * TopBar component with navigation, search placeholder, and user info.
 * Includes back/forward buttons and user avatar with Spotify-like styling.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data object
 */
function TopBar({ user }) {
  return (
    <div className="topbar">
      <div className="topbar-nav">
        <button className="nav-button" aria-label="Go back">
          <span>←</span>
        </button>
        <button className="nav-button" aria-label="Go forward">
          <span>→</span>
        </button>
      </div>

      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          className="search-input"
          aria-label="Search for music"
        />
      </div>

      <div className="topbar-user">
        {user ? (
          <>
            <div className="user-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="user-name">{user.profile?.display_name || user.email}</span>
          </>
        ) : (
          <>
            <button className="auth-button signup">Sign up</button>
            <button className="auth-button login">Log in</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
