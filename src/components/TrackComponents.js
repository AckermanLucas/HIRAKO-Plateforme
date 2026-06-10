import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import '../styles/TrackComponents.css';

function formatTime(s) {
  if (!s || isNaN(s)) return '—';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ---- TrackCard (grid) ---- */
export function TrackCard({ track, queue }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else playTrack(track, queue);
  };

  return (
    <div className={`track-card ${isActive ? 'active' : ''}`} onClick={handleClick}>
      {isActive && isPlaying && (
        <div className="track-card__equalizer">
          <span /><span /><span />
        </div>
      )}
      <div className="track-card__cover-wrap">
        {track.cover
          ? <img className="track-card__cover" src={track.cover} alt={track.title} />
          : <div className="track-card__cover-placeholder"><Music size={32} /></div>
        }
        <div className="track-card__play-overlay">
          <div className="track-card__play-btn">
            {isActive && isPlaying
              ? <Pause size={18} fill="white" />
              : <Play size={18} fill="white" />
            }
          </div>
        </div>
      </div>
      <div className="track-card__title">{track.title}</div>
      <div className="track-card__artist">{track.artist}</div>
    </div>
  );
}

/* ---- TrackRow (list) ---- */
export function TrackRow({ track, index, queue }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else playTrack(track, queue);
  };

  return (
    <div className={`track-row ${isActive ? 'active' : ''}`} onClick={handleClick}>
      <div className="track-row__num">
        {isActive && isPlaying ? <Pause size={14} fill="currentColor" /> : (index + 1)}
      </div>
      <div className="track-row__info">
        {track.cover
          ? <img className="track-row__cover" src={track.cover} alt={track.title} />
          : <div className="track-row__cover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music size={16} color="var(--text-muted)" /></div>
        }
        <div className="track-row__text">
          <div className="track-row__title">{track.title}</div>
          <div className="track-row__artist">{track.artist}</div>
        </div>
      </div>
      <div className="track-row__album">
        {track.album}
        {track.previewOnly && <span className="track-row__badge">Aperçu</span>}
      </div>
      <div className="track-row__duration">{formatTime(track.duration)}</div>
    </div>
  );
}

/* ---- Section Header ---- */
export function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {action && (
        <button onClick={onAction} style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', transition: 'color var(--transition)' }}
          onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ---- Grid ---- */
export function TrackGrid({ tracks, queue }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 16,
    }}>
      {tracks.map(t => <TrackCard key={t.id} track={t} queue={queue || tracks} />)}
    </div>
  );
}
