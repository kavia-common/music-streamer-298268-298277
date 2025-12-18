import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SectionHeader from '../components/SectionHeader';
import CardGrid from '../components/CardGrid';
import BottomPlayerBar from '../components/BottomPlayerBar';
import { useAuth } from '../context/AuthContext';
import './Home.css';

/**
 * PUBLIC_INTERFACE
 * Home dashboard page with Spotify-like layout and green theme.
 * Displays personalized content with mocked data and client-side state.
 */
function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Handle playlist navigation
  const handlePlaylistClick = (slug) => {
    navigate(`/playlist/${slug}`);
  };

  // Mocked data for "Good afternoon" section
  const recentlyPlayed = [
    { title: 'Liked Songs', description: '50 songs', icon: '❤️', slug: 'liked-songs' },
    { title: 'Chill Vibes', description: 'Playlist', icon: '🎧', slug: 'chill-vibes' },
    { title: 'Workout Mix', description: 'Playlist', icon: '💪', slug: 'workout-mix' },
    { title: 'Road Trip', description: 'Playlist', icon: '🚗', slug: 'road-trip' },
    { title: 'Focus Flow', description: 'Playlist', icon: '🎯', slug: 'focus-flow' },
    { title: 'Party Hits', description: 'Playlist', icon: '🎉', slug: 'party-hits' },
  ];

  // Mocked data for "Made for you" section
  const madeForYou = [
    { title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', icon: '🎵', slug: 'discover-weekly' },
    { title: 'Release Radar', description: 'New releases from artists you follow', icon: '📡', slug: 'release-radar' },
    { title: 'Daily Mix 1', description: 'The Weeknd, Drake, and more', icon: '🎼', slug: 'daily-mix-1' },
    { title: 'Daily Mix 2', description: 'Pop hits and feel-good tracks', icon: '🎤', slug: 'daily-mix-2' },
    { title: 'On Repeat', description: 'Songs you can\'t stop playing', icon: '🔁', slug: 'on-repeat' },
  ];

  // Mocked data for "Recently played" section
  const recentTracks = [
    { title: 'Blinding Lights', description: 'The Weeknd', icon: '🌟' },
    { title: 'Levitating', description: 'Dua Lipa', icon: '✨' },
    { title: 'Good 4 U', description: 'Olivia Rodrigo', icon: '🎸' },
    { title: 'Heat Waves', description: 'Glass Animals', icon: '🌊' },
    { title: 'As It Was', description: 'Harry Styles', icon: '🎙️' },
  ];

  // Mocked data for "Popular artists" section
  const popularArtists = [
    { title: 'Taylor Swift', description: 'Artist', icon: '👩‍🎤' },
    { title: 'Drake', description: 'Artist', icon: '🎤' },
    { title: 'Ed Sheeran', description: 'Artist', icon: '🎸' },
    { title: 'Billie Eilish', description: 'Artist', icon: '🖤' },
    { title: 'Post Malone', description: 'Artist', icon: '🎵' },
  ];

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-layout">
      <Sidebar />
      
      <main className="home-main">
        <TopBar user={isAuthenticated ? user : null} />
        
        <div className="home-content">
          <SectionHeader title={getGreeting()} />
          <div className="quick-picks-grid">
            {recentlyPlayed.map((item, index) => (
              <div 
                key={index} 
                className="quick-pick-card"
                onClick={() => handlePlaylistClick(item.slug)}
              >
                <div className="quick-pick-image">{item.icon}</div>
                <span className="quick-pick-title">{item.title}</span>
                <button 
                  className="quick-pick-play" 
                  aria-label={`Play ${item.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle play action separately if needed
                  }}
                >
                  ▶
                </button>
              </div>
            ))}
          </div>

          <SectionHeader title="Made for you" link="/section/made-for-you" />
          <CardGrid items={madeForYou} type="playlist" onCardClick={handlePlaylistClick} />

          <SectionHeader title="Recently played" link="/section/recently-played" />
          <CardGrid items={recentTracks} type="album" />

          <SectionHeader title="Popular artists" link="/section/artists" />
          <CardGrid items={popularArtists} type="artist" />
        </div>
      </main>

      <BottomPlayerBar />
    </div>
  );
}

export default Home;
