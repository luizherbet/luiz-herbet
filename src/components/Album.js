import React, { memo, useRef, useState, useEffect } from 'react';
import Fading from './Fading';
import { album } from '../data/content';

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const isTrackAvailable = (item) => item.available !== false && Boolean(item.src);

const findAdjacentTrack = (fromIndex, direction) => {
  let index = fromIndex + direction;
  while (index >= 0 && index < album.tracks.length) {
    if (isTrackAvailable(album.tracks[index])) return index;
    index += direction;
  }
  return fromIndex;
};

const Album = memo(() => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = album.tracks[currentTrack];
  const canPlay = isTrackAvailable(track);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      const nextIndex = findAdjacentTrack(currentTrack, 1);
      if (nextIndex !== currentTrack) {
        setCurrentTrack(nextIndex);
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
  }, [currentTrack, canPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying, canPlay]);

  const togglePlay = () => {
    if (!canPlay) return;
    setIsPlaying((prev) => !prev);
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
    if (isTrackAvailable(album.tracks[index])) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !canPlay) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const previousIndex = findAdjacentTrack(currentTrack, -1);
  const nextIndex = findAdjacentTrack(currentTrack, 1);

  return (
    <Fading time={800}>
      <section
        id="disco"
        className="bg-white rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Disco</h2>
          <p className="text-stone-600 max-w-xl mx-auto">Safra de canções</p>
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
            <p className="text-stone-500 text-sm text-center mt-2 px-2">
              {album.description}
            </p>
            <p className="text-stone-500 text-sm text-center mt-1">{album.year}</p>
          </div>

          <div className="flex-1 w-full">
            {canPlay && (
              <audio ref={audioRef} src={track.src} preload="metadata" />
            )}

            <div className="bg-stone-50 rounded-xl p-6 mb-6">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">
                {canPlay ? 'Tocando agora' : 'Faixa selecionada'}
              </p>
              <p className="text-lg font-medium text-stone-900 mb-4">
                {track.title}
              </p>

              {canPlay ? (
                <>
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
                      onClick={() => setCurrentTrack(previousIndex)}
                      disabled={previousIndex === currentTrack}
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
                      onClick={() => setCurrentTrack(nextIndex)}
                      disabled={nextIndex === currentTrack}
                      className="text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      aria-label="Próxima faixa"
                    >
                      ⏭
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500">
                  <span className="inline-block uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-stone-300/60 text-stone-600 font-medium mr-2">
                    em breve
                  </span>
                  Gravação em andamento.
                </p>
              )}
            </div>

            <ol className="space-y-1">
              {album.tracks.map((item, index) => {
                const available = isTrackAvailable(item);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectTrack(index)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
                        index === currentTrack
                          ? available
                            ? 'bg-stone-900 text-amber-50'
                            : 'bg-stone-200 text-stone-700'
                          : available
                            ? 'hover:bg-stone-100 text-stone-800'
                            : 'text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-sm w-6 opacity-70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-medium flex items-center gap-2 flex-wrap">
                        {item.title}
                        {!available && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-300/60 text-stone-600 font-medium">
                            em breve
                          </span>
                        )}
                      </span>
                      <span className="text-sm opacity-70 shrink-0">
                        {available ? item.duration : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default Album;
