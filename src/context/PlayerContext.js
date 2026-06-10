import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none | one | all
  const [isLiked, setIsLiked] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [localLibrary, setLocalLibrary] = useState([]);

  const currentTrack = queue[currentIndex] || null;

  /* ---- Audio events ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => handleNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, isShuffle, repeatMode]);

  /* ---- Sync src ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.src) return;
    audio.src = currentTrack.src;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    setIsLiked(likedSongs.some(s => s.id === currentTrack.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  /* ---- Volume ---- */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ---- Play / Pause ---- */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }, [isPlaying, currentTrack]);

  /* ---- Play a specific track ---- */
  const playTrack = useCallback((track, newQueue = null) => {
    if (newQueue) setQueue(newQueue);
    const targetQueue = newQueue || queue;
    const idx = targetQueue.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setIsPlaying(true);
      const audio = audioRef.current;
      if (audio) {
        audio.src = track.src;
        audio.volume = volume;
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [queue, volume]);

  /* ---- Next ---- */
  const handleNext = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (audio) { audio.currentTime = 0; audio.play(); }
      return;
    }
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = currentIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') nextIdx = 0;
        else { setIsPlaying(false); return; }
      }
    }
    setCurrentIndex(nextIdx);
    setIsPlaying(true);
    const audio = audioRef.current;
    if (audio && queue[nextIdx]) {
      audio.src = queue[nextIdx].src;
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [queue, currentIndex, isShuffle, repeatMode]);

  /* ---- Previous ---- */
  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    setCurrentIndex(prevIdx);
    setIsPlaying(true);
    if (audio && queue[prevIdx]) {
      audio.src = queue[prevIdx].src;
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, queue]);

  /* ---- Seek ---- */
  const seek = useCallback((time) => {
    if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
  }, []);

  /* ---- Like ---- */
  const toggleLike = useCallback(() => {
    if (!currentTrack) return;
    setLikedSongs(prev => {
      const exists = prev.some(s => s.id === currentTrack.id);
      const next = exists ? prev.filter(s => s.id !== currentTrack.id) : [...prev, currentTrack];
      setIsLiked(!exists);
      return next;
    });
  }, [currentTrack]);

  /* ---- Import local files ---- */
  const importFiles = useCallback((files) => {
    const newTracks = Array.from(files).map((file, i) => ({
      id: `local-${Date.now()}-${i}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Artiste inconnu',
      album: 'Bibliothèque locale',
      src: URL.createObjectURL(file),
      cover: null,
      duration: 0,
      isLocal: true,
    }));
    setLocalLibrary(prev => [...prev, ...newTracks]);
    return newTracks;
  }, []);

  /* ---- Add to queue ---- */
  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, isPlaying, currentTime, duration,
      volume, isShuffle, repeatMode, isLiked, likedSongs, localLibrary,
      togglePlay, playTrack, handleNext, handlePrev, seek,
      setVolume, setIsShuffle, setRepeatMode,
      toggleLike, importFiles, addToQueue, setQueue, setCurrentIndex,
    }}>
      <audio ref={audioRef} preload="auto" />
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
};
