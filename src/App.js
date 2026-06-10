import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

import { PlayerProvider } from './context/PlayerContext';
import { useSpotify } from './hooks/useSpotify';

import Sidebar from './components/Sidebar';
import Player from './components/Player';

import Home from './pages/Home';
import SearchPage from './pages/Search';
import Library from './pages/Library';
import Liked from './pages/Liked';
import Import from './pages/Import';

import './styles/global.css';
import './styles/App.css';
import './styles/TrackComponents.css';

function AppInner() {
  const [page, setPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const spotify = useSpotify();

  /* Handle Spotify OAuth callback */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) spotify.handleCallback(code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Load Spotify user on connect */
  useEffect(() => {
    if (spotify.isConnected) spotify.getMe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotify.isConnected]);

  const renderPage = () => {
    const p = page;
    if (p === 'home')    return <Home spotify={spotify} onConnectSpotify={spotify.connect} />;
    if (p === 'search')  return <SearchPage spotify={spotify} />;
    if (p === 'library') return <Library spotify={spotify} />;
    if (p === 'liked')   return <Liked />;
    if (p === 'import')  return <Import />;
    return <Home spotify={spotify} onConnectSpotify={spotify.connect} />;
  };

  return (
    <div className="app-layout">

      {/* Mobile topbar */}
      <header className="topbar">
        <button className="topbar__menu-btn" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="topbar__logo">Hirako</span>
        <div style={{ width: 38 }} />
      </header>

      <Sidebar
        page={page}
        setPage={setPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        spotifyConnected={spotify.isConnected}
        onConnectSpotify={spotify.connect}
      />

      <main className="main-content">
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </main>

      <Player />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppInner />
    </PlayerProvider>
  );
}
