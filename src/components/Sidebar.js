import React from 'react';
import { Home, Search, Library, Heart, Music, Plus } from 'lucide-react';
import { DEMO_PLAYLISTS } from '../utils/demoData';
import '../styles/Sidebar.css';

export default function Sidebar({ page, setPage, sidebarOpen, setSidebarOpen, spotifyConnected, onConnectSpotify }) {

  const navItems = [
    { id: 'home',    label: 'Accueil',     Icon: Home },
    { id: 'search',  label: 'Recherche',   Icon: Search },
    { id: 'library', label: 'Bibliothèque', Icon: Library },
    { id: 'liked',   label: 'Titres aimés', Icon: Heart },
    { id: 'import',  label: 'Importer',    Icon: Plus },
  ];

  const navigate = (id) => {
    setPage(id);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">♪</div>
          <span className="sidebar__logo-text">Hirako</span>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sidebar__nav-item ${page === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
            >
              <Icon className="nav-icon" size={20} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar__divider" />

        {/* Playlists */}
        <div className="sidebar__section-title">Playlists</div>
        <div className="sidebar__playlists">
          {DEMO_PLAYLISTS.map(pl => (
            <div key={pl.id} className="sidebar__playlist-item" onClick={() => navigate('playlist-' + pl.id)}>
              <img src={pl.cover} alt={pl.name} />
              <div className="sidebar__playlist-info">
                <div className="sidebar__playlist-name">{pl.name}</div>
              </div>
            </div>
          ))}

          {/* Local playlists placeholder */}
          <div className="sidebar__playlist-item" onClick={() => navigate('import')}>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Music size={16} color="var(--text-muted)" />
            </div>
            <div className="sidebar__playlist-info">
              <div className="sidebar__playlist-name">Musique locale</div>
            </div>
          </div>
        </div>

        {/* Spotify Connect */}
        <button
          className={`sidebar__spotify-btn ${spotifyConnected ? 'connected' : ''}`}
          onClick={onConnectSpotify}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          {spotifyConnected ? '✓ Spotify connecté' : 'Connecter Spotify'}
        </button>

      </aside>
    </>
  );
}
