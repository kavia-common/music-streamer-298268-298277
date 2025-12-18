import React from 'react';
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

  // Mocked data for "Good afternoon" section
  const recentlyPlayed = [
    { title: 'Liked Songs', description: '50 songs', icon: '❤️' },
    { title: 'Chill Vibes', description: 'Playlist', icon: '🎧' },
    { title: 'Workout Mix', description: 'Playlist', icon: '💪' },
    { title: 'Road Trip', description: 'Playlist', icon: '🚗' },
    { title: 'Focus Flow', description: 'Playlist', icon: '🎯' },
    { title: 'Party Hits', description: 'Playlist', icon: '🎉' },
  ];

  // Mocked data for "Made for you" section
  const madeForYou = [
    { title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', icon: '🎵' },
    { title: 'Release Radar', description: 'New releases from artists you follow', icon: '📡' },
    { title: 'Daily Mix 1', description: 'The Weeknd, Drake, and more', icon: '🎼' },
    { title: 'Daily Mix 2', description: 'Pop hits and feel-good tracks', icon: '🎤' },
    { title: 'On Repeat', description: 'Songs you can\'t stop playing', icon: '🔁' },
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
              <div key={index} className="quick-pick-card">
                <div className="quick-pick-image">{item.icon}</div>
                <span className="quick-pick-title">{item.title}</span>
                <button className="quick-pick-play" aria-label={`Play ${item.title}`}>
                  ▶
                </button>
              </div>
            ))}
          </div>

          <SectionHeader title="Made for you" link="/section/made-for-you" />
          <CardGrid items={madeForYou} type="playlist" />

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
