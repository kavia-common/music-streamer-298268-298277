import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import './BottomPlayerBar.css';

/**
 * PUBLIC_INTERFACE
 * Bottom player bar component with functional playback controls and interactive progress bar.
 * Displays currently playing track info and playback controls with Spotify-like styling.
 * Consumes PlayerContext to control and display playback state.
 * Supports click-to-seek and drag-to-seek with mouse and touch events.
 */
function BottomPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    metadataLoaded,
    togglePlayPause,
    setProgress,
    changeVolume,
    getFormattedCurrentTime,
    getFormattedDuration,
  } = usePlayer();

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!currentTrack || !metadataLoaded || isNaN(duration) || duration === 0) {
      return;
    }

    const bar = progressBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setProgress(percent);
  };

  // Handle progress bar mouse down (start dragging)
  const handleProgressMouseDown = (e) => {
    if (!currentTrack || !metadataLoaded || isNaN(duration) || duration === 0) {
      return;
    }

    setIsDraggingProgress(true);
    handleProgressClick(e);
  };

  // Handle progress bar mouse move (during drag)
  const handleProgressMouseMove = (e) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    // Update hover time for display
    if (metadataLoaded && !isNaN(duration) && duration > 0) {
      setHoverTime(percent * duration);
    }

    if (isDraggingProgress) {
      setProgress(percent);
    }
  };

  // Handle progress bar mouse up (end dragging)
  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  // Handle progress bar mouse leave
  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  // Handle volume bar click
  const handleVolumeClick = (e) => {
    const bar = volumeBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    changeVolume(percent);
  };

  // Handle volume bar mouse down (start dragging)
  const handleVolumeMouseDown = (e) => {
    setIsDraggingVolume(true);
    handleVolumeClick(e);
  };

  // Handle volume bar mouse move (during drag)
  const handleVolumeMouseMove = (e) => {
    if (isDraggingVolume && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      changeVolume(percent);
    }
  };

  // Handle volume bar mouse up (end dragging)
  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  // Global mouse move and mouse up handlers for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingProgress) {
        handleProgressMouseMove(e);
      }
      if (isDraggingVolume) {
        handleVolumeMouseMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingProgress) {
        handleProgressMouseUp();
      }
      if (isDraggingVolume) {
        handleVolumeMouseUp();
      }
    };

    if (isDraggingProgress || isDraggingVolume) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingProgress, isDraggingVolume]);

  // Touch event handlers for mobile support
  const handleProgressTouchStart = (e) => {
    if (!currentTrack || !metadataLoaded || isNaN(duration) || duration === 0) {
      return;
    }

    setIsDraggingProgress(true);
    const touch = e.touches[0];
    const bar = progressBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    setProgress(percent);
  };

  const handleProgressTouchMove = (e) => {
    if (isDraggingProgress && progressBarRef.current) {
      const touch = e.touches[0];
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      setProgress(percent);
    }
  };

  const handleProgressTouchEnd = () => {
    setIsDraggingProgress(false);
  };

  // Calculate progress percentage
  const progressPercent = metadataLoaded && duration > 0 ? ((currentTime || 0) / duration) * 100 : 0;
  const volumePercent = volume * 100;

  // Check if seeking is disabled
  const isSeekDisabled = !currentTrack || !metadataLoaded || isNaN(duration) || duration === 0;

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
          <span className="progress-time">{getFormattedCurrentTime()}</span>
          <div 
            ref={progressBarRef}
            className="progress-bar" 
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
            onTouchStart={handleProgressTouchStart}
            onTouchMove={handleProgressTouchMove}
            onTouchEnd={handleProgressTouchEnd}
            style={{ 
              cursor: isSeekDisabled ? 'default' : 'pointer',
              opacity: isSeekDisabled ? 0.5 : 1
            }}
            role="slider"
            aria-label="Seek slider"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime || 0}
            aria-valuetext={`${getFormattedCurrentTime()} of ${getFormattedDuration()}`}
            aria-disabled={isSeekDisabled}
            tabIndex={isSeekDisabled ? -1 : 0}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            >
              <div 
                className="progress-handle"
                style={{ 
                  opacity: (isDraggingProgress || (!isSeekDisabled && hoverTime !== null)) ? 1 : undefined 
                }}
              ></div>
            </div>
          </div>
          <span className="progress-time">{getFormattedDuration()}</span>
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
          ref={volumeBarRef}
          className="volume-slider" 
          onClick={handleVolumeClick}
          onMouseDown={handleVolumeMouseDown}
          role="slider"
          aria-label="Volume slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
          tabIndex={0}
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
