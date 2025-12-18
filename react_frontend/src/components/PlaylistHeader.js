import React from 'react';
import './PlaylistHeader.css';

/**
 * PUBLIC_INTERFACE
 * Playlist header component displaying cover art, title, description, owner, and action buttons.
 * Styled with Spotify-like green theme.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.playlist - Playlist data object
 * @param {string} props.playlist.title - Playlist title
 * @param {string} props.playlist.description - Playlist description
 * @param {string} props.playlist.owner - Playlist owner/creator
 * @param {number} props.playlist.likeCount - Number of likes
 * @param {number} props.playlist.trackCount - Number of tracks
 * @param {string} props.playlist.coverIcon - Emoji or icon for cover
 * @param {string} props.playlist.totalDuration - Total duration string
 */
function PlaylistHeader({ playlist }) {
  return (
    <div className="playlist-header">
      <div className="playlist-cover">
        <span className="playlist-cover-icon">{playlist.coverIcon || '🎵'}</span>
      </div>
      
      <div className="playlist-info">
        <span className="playlist-type">PLAYLIST</span>
        <h1 className="playlist-title">{playlist.title}</h1>
        <p className="playlist-description">{playlist.description}</p>
        
        <div className="playlist-metadata">
          <span className="playlist-owner">{playlist.owner}</span>
          <span className="metadata-separator">•</span>
          <span className="playlist-likes">{playlist.likeCount} likes</span>
          <span className="metadata-separator">•</span>
          <span className="playlist-track-count">{playlist.trackCount} songs</span>
          <span className="metadata-separator">•</span>
          <span className="playlist-duration">{playlist.totalDuration}</span>
        </div>
      </div>
    </div>
  );
}

export default PlaylistHeader;
