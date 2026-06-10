import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { DEMO_TRACKS } from '../utils/demoData';
import { TrackRow, TrackGrid, SectionHeader } from '../components/TrackComponents';
import '../styles/Search.css';

const GENRES = [
  { label: 'Electronic', color: 'linear-gradient(135deg,#7c6af7,#4e3fcf)' },
  { label: 'Hip-Hop', color: 'linear-gradient(135deg,#f472b6,#be185d)' },
  { label: 'Ambient', color: 'linear-gradient(135deg,#22d3ee,#0369a1)' },
  { label: 'Synthwave', color: 'linear-gradient(135deg,#a855f7,#6d28d9)' },
  { label: 'Indie', color: 'linear-gradient(135deg,#fb923c,#c2410c)' },
  { label: 'World', color: 'linear-gradient(135deg,#a3e635,#4d7c0f)' },
  { label: 'Jazz', color: 'linear-gradient(135deg,#fbbf24,#b45309)' },
  { label: 'Rock', color: 'linear-gradient(135deg,#ef4444,#7f1d1d)' },
];

function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

export default function SearchPage({ spotify }) {
  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debQuery = useDebounce(query, 400);

  /* Local search */
  useEffect(() => {
    if (!debQuery.trim()) { setLocalResults([]); return; }
    const q = debQuery.toLowerCase();
    setLocalResults(DEMO_TRACKS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    ));
  }, [debQuery]);

  /* Spotify search */
  useEffect(() => {
    if (!debQuery.trim() || !spotify.isConnected) { setSpotifyResults([]); return; }
    setLoading(true);
    spotify.search(debQuery).then(data => {
      setLoading(false);
      if (data?.tracks?.items) {
        setSpotifyResults(data.tracks.items.map(spotify.mapTrack));
      }
    }).catch(() => setLoading(false));
  }, [debQuery, spotify.isConnected]);

  const handleGenre = (genre) => setQuery(genre.label);

  const hasResults = localResults.length > 0 || spotifyResults.length > 0;
  const hasNoPreview = spotifyResults.some(t => t.previewOnly);

  return (
    <div className="search">
      <div className="search__bar-wrap">
        <SearchIcon className="search__bar-icon" size={20} />
        <input
          ref={inputRef}
          className="search__input"
          type="text"
          placeholder="Titres, artistes, albums…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button className="search__clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
            <X size={18} />
          </button>
        )}
      </div>

      {loading && (
        <div className="search__loading">
          <div className="search__loading-dot" />
          <div className="search__loading-dot" />
          <div className="search__loading-dot" />
        </div>
      )}

      {!query && !loading && (
        <>
          <div className="search__genres-title">Parcourir par genre</div>
          <div className="search__genres">
            {GENRES.map(g => (
              <div key={g.label} className="search__genre-chip" style={{ background: g.color }} onClick={() => handleGenre(g)}>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {query && !loading && !hasResults && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>Aucun résultat pour « {query} »</div>
          <div style={{ marginTop: 8, fontSize: 14 }}>Essayez un autre terme ou importez vos propres fichiers.</div>
        </div>
      )}

      {localResults.length > 0 && (
        <div className="search__results-section">
          <SectionHeader title="Bibliothèque Hirako" />
          <div className="track-list">
            <div className="track-list__header">
              <span>#</span><span>Titre</span><span>Album</span><span>Durée</span>
            </div>
            {localResults.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={localResults} />)}
          </div>
        </div>
      )}

      {spotifyResults.length > 0 && (
        <div className="search__results-section">
          <SectionHeader title="Résultats Spotify" />
          {hasNoPreview && (
            <div className="search__no-preview">
              ℹ️ Certains titres n'ont pas d'aperçu 30s disponible (limitation API Spotify gratuite).
            </div>
          )}
          <TrackGrid tracks={spotifyResults.slice(0, 12)} queue={spotifyResults} />
        </div>
      )}
    </div>
  );
}
