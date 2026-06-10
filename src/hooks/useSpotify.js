import { useState, useCallback } from 'react';

/* ================================================================
   Spotify Web API integration
   ----------------------------------------------------------------
   Flux :
   1. L'utilisateur clique "Connecter Spotify"
   2. Redirection vers Spotify Authorization (PKCE)
   3. Spotify redirige vers /?code=...
   4. Échange du code contre un access_token
   5. Utilisation de l'API Spotify
   ================================================================ */

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || window.location.origin;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
].join(' ');

/* ---- PKCE helpers ---- */
function generateCodeVerifier(length = 128) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  values.forEach(v => (result += charset[v % charset.length]));
  return result;
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/* ---- Token storage ---- */
const TOKEN_KEY = 'hirako_spotify_token';
const VERIFIER_KEY = 'hirako_spotify_verifier';

function saveToken(data) {
  const expires = Date.now() + data.expires_in * 1000;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ ...data, expires }));
}

function loadToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() > data.expires) { localStorage.removeItem(TOKEN_KEY); return null; }
    return data;
  } catch { return null; }
}

/* ---- Hook ---- */
export function useSpotify() {
  const [token, setToken] = useState(() => loadToken()?.access_token || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isConnected = !!token;
  const hasClientId = !!CLIENT_ID;

  /* Redirect to Spotify Auth */
  const connect = useCallback(async () => {
    if (!CLIENT_ID) {
      setError('CLIENT_ID Spotify manquant. Ajoutez REACT_APP_SPOTIFY_CLIENT_ID dans .env');
      return;
    }
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }, []);

  /* Exchange code for token (called on page load if ?code= present) */
  const handleCallback = useCallback(async (code) => {
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (!verifier || !CLIENT_ID) return;

    setLoading(true);
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        saveToken(data);
        setToken(data.access_token);
        sessionStorage.removeItem(VERIFIER_KEY);
        window.history.replaceState({}, '', '/');
      } else {
        setError(data.error_description || 'Erreur auth Spotify');
      }
    } catch (e) {
      setError('Impossible de se connecter à Spotify');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Fetch wrapper */
  const spotifyFetch = useCallback(async (endpoint) => {
    if (!token) return null;
    try {
      const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { setToken(null); localStorage.removeItem(TOKEN_KEY); return null; }
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }, [token]);

  const getMe = useCallback(async () => {
    const data = await spotifyFetch('/me');
    if (data) setUser(data);
    return data;
  }, [spotifyFetch]);

  const getFeatured = useCallback(() => spotifyFetch('/browse/featured-playlists?limit=10'), [spotifyFetch]);
  const getTopTracks = useCallback(() => spotifyFetch('/me/top/tracks?limit=20&time_range=short_term'), [spotifyFetch]);
  const getRecentlyPlayed = useCallback(() => spotifyFetch('/me/player/recently-played?limit=20'), [spotifyFetch]);
  const getNewReleases = useCallback(() => spotifyFetch('/browse/new-releases?limit=20'), [spotifyFetch]);
  const getPlaylistTracks = useCallback((id) => spotifyFetch(`/playlists/${id}/tracks?limit=50`), [spotifyFetch]);
  const search = useCallback((q, types = 'track,artist,album') =>
    spotifyFetch(`/search?q=${encodeURIComponent(q)}&type=${types}&limit=20`), [spotifyFetch]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /* Map Spotify track → Hirako track format */
  const mapTrack = (item) => {
    const track = item.track || item;
    return {
      id: `spotify-${track.id}`,
      spotifyId: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Inconnu',
      album: track.album?.name || '',
      cover: track.album?.images?.[0]?.url || null,
      src: track.preview_url || null, // 30-sec preview (free tier)
      duration: track.duration_ms / 1000,
      isSpotify: true,
      previewOnly: !track.preview_url,
    };
  };

  return {
    isConnected, hasClientId, user, loading, error,
    connect, handleCallback, disconnect,
    getMe, getFeatured, getTopTracks, getRecentlyPlayed,
    getNewReleases, getPlaylistTracks, search, mapTrack,
  };
}
