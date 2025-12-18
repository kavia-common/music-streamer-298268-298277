import React from 'react';
import './CardGrid.css';

/**
 * PUBLIC_INTERFACE
 * Card grid component for displaying playlists, albums, or artists.
 * Includes hover effects and play button with Spotify-like styling.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display
 * @param {string} props.type - Type of cards: 'playlist', 'album', or 'artist'
 */
function CardGrid({ items, type = 'playlist' }) {
  return (
    <div className="card-grid">
      {items.map((item, index) => (
        <div key={index} className="card">
          <div className="card-image-container">
            <div className={`card-image ${type}`}>
              <span className="card-image-placeholder">{item.icon || '🎵'}</span>
            </div>
            <button className="play-button" aria-label={`Play ${item.title}`}>
              <span className="play-icon">▶</span>
            </button>
          </div>
          <div className="card-content">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardGrid;
