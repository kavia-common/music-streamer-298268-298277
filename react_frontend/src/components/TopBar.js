import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

/**
 * PUBLIC_INTERFACE
 * TopBar component with navigation, search placeholder, user info, and profile dropdown.
 * Includes back/forward buttons, user avatar with dropdown menu (Profile, Logout).
 * Dropdown closes on outside click and Escape key for accessibility.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data object
 */
function TopBar({ user }) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  /**
   * Toggle dropdown menu
   */
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      navigate('/login');
    }
  };

  /**
   * Handle profile navigation (placeholder)
   */
  const handleProfile = () => {
    setIsDropdownOpen(false);
    // TODO: Navigate to profile page when implemented
    console.log('Profile clicked - feature to be implemented');
  };

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  /**
   * Close dropdown on Escape key
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

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
          <div className="user-menu">
            <div 
              ref={avatarRef}
              className="user-avatar"
              onClick={toggleDropdown}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleDropdown();
                }
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {user.email ? user.email.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="user-name">{user.profile?.display_name || user.email}</span>

            {isDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="profile-dropdown"
                role="menu"
                aria-label="User menu"
              >
                <button
                  className="dropdown-item"
                  onClick={handleProfile}
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="dropdown-icon">👤</span>
                  <span>Profile</span>
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              className="auth-button signup"
              onClick={() => navigate('/register')}
            >
              Sign up
            </button>
            <button 
              className="auth-button login"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
