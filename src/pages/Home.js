import React, { useEffect, useState } from 'react';
import { DEMO_TRACKS, DEMO_PLAYLISTS } from '../utils/demoData';
import { TrackGrid, SectionHeader } from '../components/TrackComponents';
import { usePlayer } from '../context/PlayerContext';
import '../styles/Home.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function Home({ spotify, onConnectSpotify }) {
  const { playTrack, setQueue } = usePlayer();
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  const [spotifyNewReleases, setSpotifyNewReleases] = useState([]);

  useEffect(() => {
    if (!spotify.isConnected) return;
    // Load Spotify data
    spotify.getTopTracks().then(data => {
      if (data?.items) setSpotifyTracks(data.items.map(spotify.mapTrack));
    });
    spotify.getNewReleases().then(data => {
      if (data?.albums?.items) {
        const mapped = data.albums.items.map(album => ({
          id: `album-${album.id}`,
          spotifyId: album.id,
          title: album.name,
          artist: album.artists?.map(a => a.name).join(', '),
          album: album.name,
          cover: album.images?.[0]?.url || null,
          src: null,
          isSpotify: true,
          isAlbum: true,
        }));
        setSpotifyNewReleases(mapped);
      }
    });
    spotify.getMe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotify.isConnected]);

  const handleQuickPlay = (pl) => {
    const tracks = DEMO_TRACKS.filter(t => pl.tracks.includes(t.id));
    if (tracks.length) { setQueue(tracks); playTrack(tracks[0], tracks); }
  };

  return (
    <div className="home">
      {/* Hero */}
      <div className="home__hero">
        <div className="home__hero-bg" />
        <div className="home__hero-noise" />
        <h1 className="home__greeting">
          {getGreeting()},<br />
          <em>prêt à écouter ?</em>
        </h1>
        <p className="home__subtitle">Découvrez votre musique préférée sur Hirako.</p>
      </div>

      {/* Spotify connect banner */}
      {!spotify.isConnected && !spotify.hasClientId && (
        <div className="home__spotify-banner">
          <div style={{ fontSize: 32 }}>🎵</div>
          <div className="home__spotify-banner-text">
            <h3>Connectez Spotify pour plus de musique</h3>
            <p>Ajoutez votre Client ID Spotify dans .env pour accéder à des millions de titres.</p>
          </div>
        </div>
      )}

      {!spotify.isConnected && spotify.hasClientId && (
        <div className="home__spotify-banner">
          <div style={{ fontSize: 32 }}>🎧</div>
          <div className="home__spotify-banner-text">
            <h3>Connectez votre compte Spotify</h3>
            <p>Accédez à vos playlists, tops titres et plus encore.</p>
          </div>
          <button className="home__spotify-connect-btn" onClick={onConnectSpotify}>
            Connecter Spotify
          </button>
        </div>
      )}

      {/* Quick playlists */}
      <div className="home__section">
        <SectionHeader title="Accès rapide" />
        <div className="home__quick">
          {DEMO_PLAYLISTS.map(pl => (
            <div key={pl.id} className="home__quick-item" onClick={() => handleQuickPlay(pl)}>
              <img className="home__quick-img" src={pl.cover} alt={pl.name} />
              <span className="home__quick-name">{pl.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spotify top tracks */}
      {spotify.isConnected && spotifyTracks.length > 0 && (
        <div className="home__section">
          <SectionHeader title="Vos tops titres (Spotify)" />
          <TrackGrid tracks={spotifyTracks.slice(0, 8)} queue={spotifyTracks} />
        </div>
      )}

      {/* Demo tracks */}
      <div className="home__section">
        <SectionHeader title="Nouveautés Hirako" />
        <TrackGrid tracks={DEMO_TRACKS} queue={DEMO_TRACKS} />
      </div>

      {/* New releases */}
      {spotify.isConnected && spotifyNewReleases.length > 0 && (
        <div className="home__section">
          <SectionHeader title="Nouvelles sorties (Spotify)" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}>
            {spotifyNewReleases.slice(0, 8).map(item => (
              <div key={item.id} style={{ cursor: 'pointer' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', background: 'var(--bg-elevated)', marginBottom: 8 }}>
                  {item.cover && <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artist}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
