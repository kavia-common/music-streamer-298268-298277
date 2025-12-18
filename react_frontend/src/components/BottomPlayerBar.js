import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import './BottomPlayerBar.css';

/**
 * PUBLIC_INTERFACE
 * Bottom player bar component with functional playback controls.
 * Displays currently playing track info and playback controls with Spotify-like styling.
 * Consumes PlayerContext to control and display playback state.
 */
function BottomPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seekTo,
    changeVolume,
  } = usePlayer();

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  // Handle volume bar click
  const handleVolumeClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    changeVolume(percent);
  };

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className="player-bar">
      <div className="player-track-info">
        <div className="track-image">🎵</div>
        <div className="track-details">
          <div className="track-title">
            {currentTrack ? currentTrack.title : 'No track playing'}
          </div>
          <div className="track-artist">
            {currentTrack ? currentTrack.artist : 'Select a track to play'}
          </div>
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
          <button 
            className="control-button play-button-main" 
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlayPause}
            disabled={!currentTrack}
          >
            <span className="play-icon-main">{isPlaying ? '⏸' : '▶'}</span>
          </button>
          <button className="control-button" aria-label="Next">
            ⏭
          </button>
          <button className="control-button" aria-label="Repeat">
            🔁
          </button>
        </div>
        <div className="progress-bar-container">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
            style={{ cursor: currentTrack ? 'pointer' : 'default' }}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-handle"></div>
            </div>
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button 
          className="volume-button" 
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          onClick={() => changeVolume(volume === 0 ? 0.7 : 0)}
        >
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </button>
        <div 
          className="volume-slider" 
          onClick={handleVolumeClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="volume-fill" style={{ width: `${volumePercent}%` }}></div>
        </div>
        <button className="extras-button" aria-label="More options">
          ⋯
        </button>
      </div>
    </div>
  );
}

export default BottomPlayerBar;
