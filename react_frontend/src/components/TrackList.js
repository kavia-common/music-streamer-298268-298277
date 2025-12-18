import React from 'react';
import TrackRow from './TrackRow';
import './TrackList.css';

/**
 * PUBLIC_INTERFACE
 * Track list component displaying playlist action bar and list of tracks.
 * Includes play, shuffle, like buttons and column headers.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.tracks - Array of track objects
 */
function TrackList({ tracks }) {
  return (
    <div className="track-list-container">
      <div className="playlist-actions">
        <button className="play-all-button" aria-label="Play all">
          <span className="play-icon">▶</span>
        </button>
        <button className="shuffle-button" aria-label="Shuffle">
          🔀
        </button>
        <button className="like-all-button" aria-label="Like playlist">
          ♡
        </button>
        <button className="more-options-button" aria-label="More options">
          ⋯
        </button>
      </div>

      <div className="track-list-header">
        <div className="header-number">#</div>
        <div className="header-title">TITLE</div>
        <div className="header-album">ALBUM</div>
        <div className="header-duration">🕐</div>
      </div>

      <div className="track-list">
        {tracks.map((track, index) => (
          <TrackRow key={index} track={track} index={index} />
        ))}
      </div>
    </div>
  );
}

export default TrackList;
