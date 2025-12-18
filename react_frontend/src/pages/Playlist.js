import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PlaylistHeader from '../components/PlaylistHeader';
import TrackList from '../components/TrackList';
import BottomPlayerBar from '../components/BottomPlayerBar';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import './Playlist.css';

/**
 * PUBLIC_INTERFACE
 * Playlist page component displaying a Spotify-like playlist layout.
 * Shows cover art, metadata, action buttons, and track list.
 * For 'discover-weekly', fetches live data from Audius API.
 * For other playlists, uses mocked data.
 */
function Playlist() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { playTrack } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch Audius trending tracks for discover-weekly
  useEffect(() => {
    const fetchAudiusTracks = async () => {
      if (slug !== 'discover-weekly') {
        // Load mocked data for other playlists
        loadMockedPlaylist();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://discoveryprovider.audius.co/v1/tracks/trending?limit=20');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tracks: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid response format from Audius API');
        }

        const appName = process.env.REACT_APP_AUDIUS_APP_NAME || 'music-streamer';

        // Transform Audius tracks to our format
        const tracks = data.data.map((track) => ({
          id: track.id,
          title: track.title || 'Unknown Title',
          artist: track.user?.name || 'Unknown Artist',
          album: track.mood || 'Single',
          duration: formatDuration(track.duration),
          streamUrl: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=${appName}`,
        }));

        const totalDuration = data.data.reduce((acc, track) => acc + (track.duration || 0), 0);
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
        const durationStr = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        setPlaylist({
          title: 'Discover Weekly',
          description: 'Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you. Updates every Monday.',
          owner: 'Audius',
          likeCount: 12543,
          trackCount: tracks.length,
          totalDuration: durationStr,
          coverIcon: '🎵',
          tracks: tracks,
        });
      } catch (err) {
        console.error('Error fetching Audius tracks:', err);
        setError(err.message || 'Failed to load tracks from Audius');
        // Fallback to mocked data on error
        loadMockedPlaylist();
      } finally {
        setLoading(false);
      }
    };

    fetchAudiusTracks();
  }, [slug]);

  // Load mocked playlist data
  const loadMockedPlaylist = () => {
    const playlists = {
      'liked-songs': {
        title: 'Liked Songs',
        description: 'Your collection of favorite tracks',
        owner: 'Your Library',
        likeCount: 50,
        trackCount: 50,
        totalDuration: '3 hr 25 min',
        coverIcon: '❤️',
        tracks: [
          { id: 'mock-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
          { id: 'mock-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
          { id: 'mock-3', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
          { id: 'mock-4', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:59' },
          { id: 'mock-5', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration: '2:47' },
          { id: 'mock-6', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20' },
          { id: 'mock-7', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: '3:20' },
          { id: 'mock-8', title: 'Shivers', artist: 'Ed Sheeran', album: '=', duration: '3:27' },
          { id: 'mock-9', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*ck Love 3', duration: '2:21' },
          { id: 'mock-10', title: 'Ghost', artist: 'Justin Bieber', album: 'Justice', duration: '2:33' },
        ],
      },
      'discover-weekly': {
        title: 'Discover Weekly',
        description: 'Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you. Updates every Monday.',
        owner: 'Spotify',
        likeCount: 12543,
        trackCount: 30,
        totalDuration: '2 hr 10 min',
        coverIcon: '🎵',
        tracks: [
          { id: 'mock-11', title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', duration: '3:49' },
          { id: 'mock-12', title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', duration: '3:57' },
          { id: 'mock-13', title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', duration: '3:42' },
          { id: 'mock-14', title: 'Somebody Told Me', artist: 'The Killers', album: 'Hot Fuss', duration: '3:17' },
          { id: 'mock-15', title: 'Time to Pretend', artist: 'MGMT', album: 'Oracular Spectacular', duration: '4:21' },
          { id: 'mock-16', title: 'Feel It Still', artist: 'Portugal. The Man', album: 'Woodstock', duration: '2:43' },
          { id: 'mock-17', title: 'Pumped Up Kicks', artist: 'Foster the People', album: 'Torches', duration: '3:59' },
          { id: 'mock-18', title: 'Tongue Tied', artist: 'Grouplove', album: 'Never Trust a Happy Song', duration: '3:37' },
          { id: 'mock-19', title: 'Safe and Sound', artist: 'Capital Cities', album: 'In a Tidal Wave of Mystery', duration: '3:12' },
          { id: 'mock-20', title: 'Ways to Go', artist: 'Grouplove', album: 'Spreading Rumours', duration: '3:32' },
        ],
      },
    };

    const selectedPlaylist = playlists[slug] || playlists['liked-songs'];
    setPlaylist(selectedPlaylist);
  };

  // Handle track play
  const handleTrackPlay = (track) => {
    playTrack(track);
  };

  if (loading) {
    return (
      <div className="playlist-layout">
        <Sidebar />
        <main className="playlist-main">
          <TopBar user={isAuthenticated ? user : null} />
          <div style={{ padding: '48px 32px', textAlign: 'center', color: '#b3b3b3' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading tracks...</div>
          </div>
        </main>
        <BottomPlayerBar />
      </div>
    );
  }

  if (error && slug === 'discover-weekly') {
    return (
      <div className="playlist-layout">
        <Sidebar />
        <main className="playlist-main">
          <TopBar user={isAuthenticated ? user : null} />
          <div style={{ padding: '48px 32px', textAlign: 'center', color: '#ef4444' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️ Error Loading Tracks</div>
            <div style={{ fontSize: '16px', color: '#b3b3b3' }}>{error}</div>
            <div style={{ fontSize: '14px', color: '#b3b3b3', marginTop: '8px' }}>
              Showing fallback data instead.
            </div>
          </div>
          {playlist && (
            <div className="playlist-content">
              <PlaylistHeader playlist={playlist} />
              <TrackList tracks={playlist.tracks} onPlay={handleTrackPlay} />
            </div>
          )}
        </main>
        <BottomPlayerBar />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-layout">
        <Sidebar />
        <main className="playlist-main">
          <TopBar user={isAuthenticated ? user : null} />
          <div style={{ padding: '48px 32px', textAlign: 'center', color: '#b3b3b3' }}>
            <div style={{ fontSize: '24px' }}>Playlist not found</div>
          </div>
        </main>
        <BottomPlayerBar />
      </div>
    );
  }

  return (
    <div className="playlist-layout">
      <Sidebar />
      
      <main className="playlist-main">
        <TopBar user={isAuthenticated ? user : null} />
        
        <div className="playlist-content">
          <PlaylistHeader playlist={playlist} />
          <TrackList tracks={playlist.tracks} onPlay={handleTrackPlay} />
        </div>
      </main>

      <BottomPlayerBar />
    </div>
  );
}

export default Playlist;
