import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Custom hook to access player context
 * @returns {Object} Player context value
 */
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

/**
 * PUBLIC_INTERFACE
 * PlayerProvider component that wraps the app and provides playback state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;

      // Set up event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('durationchange', handleDurationChange);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setMetadataLoaded(true);
    }
  };

  // Handle duration change
  const handleDurationChange = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      setMetadataLoaded(true);
    }
  };

  // Handle track ended
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle audio error
  const handleError = (e) => {
    console.error('Audio playback error:', e);
    setIsPlaying(false);
  };

  /**
   * Format time from seconds to MM:SS or H:MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get formatted current time string
   * @returns {string} Formatted current time
   */
  const getFormattedCurrentTime = () => {
    return formatTime(currentTime);
  };

  /**
   * Get formatted duration string
   * @returns {string} Formatted duration
   */
  const getFormattedDuration = () => {
    return formatTime(duration);
  };

  /**
   * Play a track
   * @param {Object} track - Track object with id, title, artist, and streamUrl
   */
  const playTrack = async (track) => {
    if (!track || !track.streamUrl) {
      console.error('Invalid track or missing streamUrl');
      return;
    }

    try {
      // If same track, just toggle play/pause
      if (currentTrack && currentTrack.id === track.id) {
        togglePlayPause();
        return;
      }

      // Reset metadata state for new track
      setMetadataLoaded(false);
      setDuration(0);
      setCurrentTime(0);

      // Set new track
      setCurrentTrack(track);
      
      if (audioRef.current) {
        audioRef.current.src = track.streamUrl;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
    }
  };

  /**
   * Toggle play/pause
   */
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Playback failed:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  /**
   * Seek to a specific time in seconds
   * @param {number} time - Time in seconds
   */
  const seekTo = (time) => {
    if (!audioRef.current || !metadataLoaded || isNaN(duration) || duration === 0) {
      return;
    }
    
    // Clamp time to valid range
    const clampedTime = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  /**
   * Seek to a specific position by percentage
   * @param {number} percent - Position as percentage (0-1)
   */
  const setProgress = (percent) => {
    if (!audioRef.current || !metadataLoaded || isNaN(duration) || duration === 0) {
      return;
    }
    
    // Clamp percent to valid range
    const clampedPercent = Math.max(0, Math.min(1, percent));
    const newTime = clampedPercent * duration;
    seekTo(newTime);
  };

  /**
   * Change volume
   * @param {number} newVolume - Volume level (0-1)
   */
  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  /**
   * Stop playback
   */
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    metadataLoaded,
    playTrack,
    togglePlayPause,
    seekTo,
    setProgress,
    changeVolume,
    stop,
    formatTime,
    getFormattedCurrentTime,
    getFormattedDuration,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
