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
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      // Set up event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
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
   * Seek to a specific time
   * @param {number} time - Time in seconds
   */
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
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
    playTrack,
    togglePlayPause,
    seekTo,
    changeVolume,
    stop,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
