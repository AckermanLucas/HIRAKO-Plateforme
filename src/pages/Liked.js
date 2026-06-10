import React from 'react';
import { Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackComponents';

export default function Liked() {
  const { likedSongs, playTrack } = usePlayer();

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(124,106,247,0.1))',
        borderRadius: 20,
        padding: '40px 32px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 16,
          background: 'linear-gradient(135deg, #f472b6, #7c6af7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Heart size={36} fill="white" color="white" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Playlist</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>Titres aimés</h1>
          <div style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
            {likedSongs.length} titre{likedSongs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {likedSongs.length > 0 ? (
        <>
          <button
            onClick={() => playTrack(likedSongs[0], likedSongs)}
            style={{
              background: 'var(--neon-pink)',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              padding: '12px 28px',
              borderRadius: '999px',
              marginBottom: 24,
              transition: 'all 0.2s',
            }}
          >
            ▶ Lecture aléatoire
          </button>

          <div className="track-list">
            <div className="track-list__header">
              <span>#</span><span>Titre</span><span>Album</span><span>Durée</span>
            </div>
            {likedSongs.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} queue={likedSongs} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💜</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Aucun titre aimé
          </div>
          <div style={{ fontSize: 14 }}>
            Appuyez sur ♥ pendant la lecture pour ajouter des titres ici.
          </div>
        </div>
      )}
    </div>
  );
}
