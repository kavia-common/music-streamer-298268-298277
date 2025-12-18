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
 * @param {Function} props.onCardClick - Optional callback when card is clicked
 */
function CardGrid({ items, type = 'playlist', onCardClick }) {
  const handleCardClick = (item) => {
    if (onCardClick && item.slug) {
      onCardClick(item.slug);
    }
  };

  return (
    <div className="card-grid">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="card"
          onClick={() => handleCardClick(item)}
        >
          <div className="card-image-container">
            <div className={`card-image ${type}`}>
              <span className="card-image-placeholder">{item.icon || '🎵'}</span>
            </div>
            <button 
              className="play-button" 
              aria-label={`Play ${item.title}`}
              onClick={(e) => {
                e.stopPropagation();
                // Handle play action separately if needed
              }}
            >
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
