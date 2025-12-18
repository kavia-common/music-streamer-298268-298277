import React, { useState } from 'react';
import './TrackRow.css';

/**
 * PUBLIC_INTERFACE
 * Track row component displaying a single track with hover effects.
 * Shows track number, title, artist, album, duration, and context menu.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.track - Track data object
 * @param {number} props.index - Track index in playlist
 */
function TrackRow({ track, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="track-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="track-number">
        {isHovered ? (
          <button className="track-play-button" aria-label={`Play ${track.title}`}>
            ▶
          </button>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>

      <div className="track-album">{track.album}</div>

      <div className="track-actions">
        <button className="track-like-button" aria-label="Like song">
          ♡
        </button>
        <span className="track-duration">{track.duration}</span>
        <button className="track-menu-button" aria-label="More options">
          ⋯
        </button>
      </div>
    </div>
  );
}

export default TrackRow;
