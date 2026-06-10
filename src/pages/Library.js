import React, { UseState } from 'react';
import { DEMO_TRACKS } from '../utils/demoData';
import { TrackRow, TrackGrid, SectionHeader } from '../components/TrackComponents';
import { usePlayer } from '../context/PlayerContext';
import { LayoutGrid, List } from 'lucide-react';

export default function Library({ spotify }) {
  const { localLibrary } = usePlayer();
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  //const [spotifyLibrary, setSpotifyLibrary] = useState([]);

  const allTracks = [...localLibrary, ...DEMO_TRACKS];

  const style = {
    padding: '24px',
    animation: 'fadeIn 0.3s ease',
  };

  const toolbar = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  };

  return (
    <div style={style}>
      <div style={toolbar}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Bibliothèque</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('grid')} style={{ padding: 8, borderRadius: 8, background: view === 'grid' ? 'var(--bg-elevated)' : 'transparent', color: view === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
            <LayoutGrid size={18} />
          </button>
          <button onClick={() => setView('list')} style={{ padding: 8, borderRadius: 8, background: view === 'list' ? 'var(--bg-elevated)' : 'transparent', color: view === 'list' ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
            <List size={18} />
          </button>
        </div>
      </div>

      {localLibrary.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionHeader title={`Musique locale (${localLibrary.length})`} />
          {view === 'grid'
            ? <TrackGrid tracks={localLibrary} queue={allTracks} />
            : <div className="track-list">
                <div className="track-list__header"><span>#</span><span>Titre</span><span>Album</span><span>Durée</span></div>
                {localLibrary.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={allTracks} />)}
              </div>
          }
        </div>
      )}

      <div>
        <SectionHeader title="Catalogue Hirako" />
        {view === 'grid'
          ? <TrackGrid tracks={DEMO_TRACKS} queue={allTracks} />
          : <div className="track-list">
              <div className="track-list__header"><span>#</span><span>Titre</span><span>Album</span><span>Durée</span></div>
              {DEMO_TRACKS.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={allTracks} />)}
            </div>
        }
      </div>
    </div>
  );
}
