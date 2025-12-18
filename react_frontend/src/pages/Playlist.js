import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PlaylistHeader from '../components/PlaylistHeader';
import TrackList from '../components/TrackList';
import BottomPlayerBar from '../components/BottomPlayerBar';
import { useAuth } from '../context/AuthContext';
import './Playlist.css';

/**
 * PUBLIC_INTERFACE
 * Playlist page component displaying a Spotify-like playlist layout.
 * Shows cover art, metadata, action buttons, and track list using mocked data.
 */
function Playlist() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();

  // Mocked playlist data
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
        { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
        { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
        { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
        { title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:59' },
        { title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration: '2:47' },
        { title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20' },
        { title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: '3:20' },
        { title: 'Shivers', artist: 'Ed Sheeran', album: '=', duration: '3:27' },
        { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*ck Love 3', duration: '2:21' },
        { title: 'Ghost', artist: 'Justin Bieber', album: 'Justice', duration: '2:33' },
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
        { title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', duration: '3:49' },
        { title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', duration: '3:57' },
        { title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', duration: '3:42' },
        { title: 'Somebody Told Me', artist: 'The Killers', album: 'Hot Fuss', duration: '3:17' },
        { title: 'Time to Pretend', artist: 'MGMT', album: 'Oracular Spectacular', duration: '4:21' },
        { title: 'Feel It Still', artist: 'Portugal. The Man', album: 'Woodstock', duration: '2:43' },
        { title: 'Pumped Up Kicks', artist: 'Foster the People', album: 'Torches', duration: '3:59' },
        { title: 'Tongue Tied', artist: 'Grouplove', album: 'Never Trust a Happy Song', duration: '3:37' },
        { title: 'Safe and Sound', artist: 'Capital Cities', album: 'In a Tidal Wave of Mystery', duration: '3:12' },
        { title: 'Ways to Go', artist: 'Grouplove', album: 'Spreading Rumours', duration: '3:32' },
      ],
    },
  };

  // Get playlist data or default
  const playlist = playlists[slug] || playlists['liked-songs'];

  return (
    <div className="playlist-layout">
      <Sidebar />
      
      <main className="playlist-main">
        <TopBar user={isAuthenticated ? user : null} />
        
        <div className="playlist-content">
          <PlaylistHeader playlist={playlist} />
          <TrackList tracks={playlist.tracks} />
        </div>
      </main>

      <BottomPlayerBar />
    </div>
  );
}

export default Playlist;
