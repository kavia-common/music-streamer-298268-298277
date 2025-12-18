import React from 'react';
import './BottomPlayerBar.css';

/**
 * PUBLIC_INTERFACE
 * Bottom player bar component (UI-only stub for now).
 * Displays currently playing track info and playback controls with Spotify-like styling.
 */
function BottomPlayerBar() {
  return (
    <div className="player-bar">
      <div className="player-track-info">
        <div className="track-image">🎵</div>
        <div className="track-details">
          <div className="track-title">Track Title</div>
          <div className="track-artist">Artist Name</div>
        </div>
        <button className="track-like-button" aria-label="Like song">
          ♡
        </button>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-button" aria-label="Shuffle">
            🔀
          </button>
          <button className="control-button" aria-label="Previous">
            ⏮
          </button>
          <button className="control-button play-button-main" aria-label="Play">
            <span className="play-icon-main">▶</span>
          </button>
          <button className="control-button" aria-label="Next">
            ⏭
          </button>
          <button className="control-button" aria-label="Repeat">
            🔁
          </button>
        </div>
        <div className="progress-bar-container">
          <span className="progress-time">0:00</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '30%' }}></div>
            <div className="progress-handle"></div>
          </div>
          <span className="progress-time">3:45</span>
        </div>
      </div>

      <div className="player-volume">
        <button className="volume-button" aria-label="Mute">
          🔊
        </button>
        <div className="volume-slider">
          <div className="volume-fill" style={{ width: '70%' }}></div>
        </div>
        <button className="extras-button" aria-label="More options">
          ⋯
        </button>
      </div>
    </div>
  );
}

export default BottomPlayerBar;
