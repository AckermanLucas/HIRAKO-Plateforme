import React from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, Volume1, VolumeX, Heart, Music2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import '../styles/Player.css';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function VolumeIcon({ volume }) {
  if (volume === 0) return <VolumeX size={18} />;
  if (volume < 0.5) return <Volume1 size={18} />;
  return <Volume2 size={18} />;
}

export default function Player() {
  const {
    currentTrack, isPlaying, currentTime, duration,
    volume, isShuffle, repeatMode, isLiked,
    togglePlay, handleNext, handlePrev,
    seek, setVolume, setIsShuffle, setRepeatMode, toggleLike,
  } = usePlayer();

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    seek((val / 100) * duration);
  };

  const handleVolume = (e) => setVolume(parseFloat(e.target.value));

  const seekStyle = {
    background: `linear-gradient(to right, var(--accent) ${progress}%, var(--bg-elevated) ${progress}%)`,
  };

  const volPercent = volume * 100;
  const volStyle = {
    background: `linear-gradient(to right, var(--text-secondary) ${volPercent}%, var(--bg-elevated) ${volPercent}%)`,
  };

  return (
    <div className="player">
      {/* Track info */}
      <div className="player__track">
        {currentTrack?.cover
          ? <img className="player__cover" src={currentTrack.cover} alt={currentTrack.title} />
          : <div className="player__cover-placeholder"><Music2 size={20} /></div>
        }
        <div className="player__track-info">
          <div className="player__title">{currentTrack?.title || '—'}</div>
          <div className="player__artist">{currentTrack?.artist || ''}</div>
          {currentTrack?.previewOnly && <span className="player__preview-badge">Aperçu 30s</span>}
        </div>
        <button className={`player__like-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike} title="J'aime">
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className="player__controls">
        <div className="player__buttons">
          <button className={`player__btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(s => !s)} title="Aléatoire">
            <Shuffle size={16} />
          </button>

          <button className="player__btn player__btn--always" onClick={handlePrev} title="Précédent">
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button className="player__play-btn player__btn--always" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Lecture'}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>

          <button className="player__btn player__btn--always" onClick={handleNext} title="Suivant">
            <SkipForward size={20} fill="currentColor" />
          </button>

          <button
            className={`player__btn ${repeatMode !== 'none' ? 'active' : ''}`}
            onClick={cycleRepeat}
            title={`Répéter: ${repeatMode}`}
          >
            <Repeat size={16} />
            {repeatMode === 'one' && <span style={{ fontSize: 8, position: 'absolute', fontWeight: 700 }}>1</span>}
          </button>
        </div>

        {/* Seek bar */}
        <div className="player__progress">
          <span className="player__time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="player__seek"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            style={seekStyle}
          />
          <span className="player__time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right — Volume */}
      <div className="player__right">
        <div className="player__volume">
          <button className="player__btn" onClick={() => setVolume(v => v > 0 ? 0 : 0.8)}>
            <VolumeIcon volume={volume} />
          </button>
          <input
            type="range"
            className="player__volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            style={volStyle}
          />
        </div>
      </div>
    </div>
  );
}
