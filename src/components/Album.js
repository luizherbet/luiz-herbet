import React, { memo, useRef, useState, useEffect } from 'react';
import Fading from './Fading';
import { album } from '../data/content';

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Album = memo(() => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = album.tracks[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (currentTrack < album.tracks.length - 1) {
        setCurrentTrack((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const selectTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <Fading time={800}>
      <section
        id="disco"
        className="bg-white rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Disco</h2>
          <p className="text-stone-600 max-w-xl mx-auto">{album.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start max-w-4xl mx-auto">
          <div className="w-full max-w-[280px] shrink-0">
            <div className="aspect-square rounded-lg overflow-hidden bg-stone-200 shadow-lg">
              <img
                src={album.cover}
                alt={`Capa de ${album.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add(
                    'flex',
                    'items-center',
                    'justify-center',
                    'bg-gradient-to-br',
                    'from-amber-100',
                    'to-stone-300'
                  );
                  e.target.parentElement.innerHTML =
                    '<span class="text-stone-500 text-sm text-center px-4">Adicione a capa em<br/>public/media/album/capa.jpg</span>';
                }}
              />
            </div>
            <h3 className="text-xl font-medium text-stone-900 mt-4 text-center">
              {album.title}
            </h3>
            <p className="text-stone-500 text-sm text-center">{album.year}</p>
          </div>

          <div className="flex-1 w-full">
            <audio ref={audioRef} src={track.src} preload="metadata" />

            <div className="bg-stone-50 rounded-xl p-6 mb-6">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">
                Tocando agora
              </p>
              <p className="text-lg font-medium text-stone-900 mb-4">
                {track.title}
              </p>

              <div
                className="h-1.5 bg-stone-200 rounded-full cursor-pointer mb-2"
                onClick={handleProgressClick}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso da faixa"
              >
                <div
                  className="h-full bg-stone-800 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-stone-500 mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration) || track.duration}</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentTrack((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentTrack === 0}
                  className="text-stone-600 hover:text-stone-900 disabled:opacity-30"
                  aria-label="Faixa anterior"
                >
                  ⏮
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-stone-900 text-amber-50 flex items-center justify-center hover:bg-stone-800 transition-colors text-lg"
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentTrack((prev) =>
                      Math.min(album.tracks.length - 1, prev + 1)
                    )
                  }
                  disabled={currentTrack === album.tracks.length - 1}
                  className="text-stone-600 hover:text-stone-900 disabled:opacity-30"
                  aria-label="Próxima faixa"
                >
                  ⏭
                </button>
              </div>
            </div>

            <ol className="space-y-1">
              {album.tracks.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
                      index === currentTrack
                        ? 'bg-stone-900 text-amber-50'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="text-sm w-6 opacity-70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-medium">{item.title}</span>
                    <span className="text-sm opacity-70">{item.duration}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default Album;
