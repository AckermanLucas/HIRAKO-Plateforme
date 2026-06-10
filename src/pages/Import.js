import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackRow } from '../components/TrackComponents';
import '../styles/Import.css';

const SUPPORTED = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.opus'];

export default function Import() {
  const fileInputRef = useRef(null);
  const { importFiles, localLibrary, playTrack } = usePlayer();
  const [dragOver, setDragOver] = useState(false);
  const [justImported, setJustImported] = useState(0);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('audio/'));
    if (!valid.length) return;
    const newTracks = importFiles(valid);
    setJustImported(valid.length);
    if (newTracks.length) playTrack(newTracks[0], newTracks);
    setTimeout(() => setJustImported(0), 4000);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Importer de la musique
      </h1>

      {justImported > 0 && (
        <div className="import__success">
          ✓ {justImported} fichier(s) importé(s) et ajouté(s) à votre bibliothèque !
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`import__zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="import__zone-icon">🎵</div>
        <div className="import__zone-title">
          {dragOver ? 'Déposez vos fichiers ici' : 'Glissez vos fichiers audio'}
        </div>
        <div className="import__zone-sub">ou cliquez pour parcourir vos fichiers</div>

        <div className="import__zone-formats">
          {SUPPORTED.map(f => (
            <span key={f} className="import__format-badge">{f.slice(1).toUpperCase()}</span>
          ))}
        </div>

        <div className="import__btn">
          <Upload size={16} style={{ display: 'inline', marginRight: 8 }} />
          Choisir des fichiers
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        className="import__file-input"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Local library */}
      {localLibrary.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Musique locale ({localLibrary.length} titre{localLibrary.length > 1 ? 's' : ''})
          </h2>
          <div className="track-list">
            <div className="track-list__header">
              <span>#</span><span>Titre</span><span>Album</span><span>Durée</span>
            </div>
            {localLibrary.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} queue={localLibrary} />
            ))}
          </div>
        </div>
      )}

      {localLibrary.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Votre bibliothèque locale est vide</div>
          <div style={{ marginTop: 8, fontSize: 13 }}>Importez des fichiers audio pour les écouter sans connexion.</div>
        </div>
      )}
    </div>
  );
}
