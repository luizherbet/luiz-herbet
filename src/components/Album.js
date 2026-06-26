import React, { memo } from 'react';
import Fading from './Fading';
import { album } from '../data/content';

const isTrackOnSpotify = (item) => Boolean(item.onSpotify);

const getSpotifyEmbedHeight = (trackCount) => 160 + trackCount * 80;

const Album = memo(() => {
  const spotifyTrackCount = album.tracks.filter(isTrackOnSpotify).length;
  const spotifyEmbedUrl = `https://open.spotify.com/embed/album/${album.spotifyEmbedId}?utm_source=generator`;
  const embedHeight = getSpotifyEmbedHeight(spotifyTrackCount);

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
              />
            </div>
            <h3 className="text-xl font-medium text-stone-900 mt-4 text-center">
              {album.title}
            </h3>
            <p className="text-stone-500 text-sm text-center mt-2 px-2">
              {album.description}
            </p>
            <p className="text-stone-500 text-sm text-center mt-1">{album.year}</p>
            <a
              href={album.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex justify-center text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Abrir no Spotify →
            </a>
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="rounded-xl overflow-hidden mb-6 shadow-sm">
              <iframe
                src={spotifyEmbedUrl}
                title={`${album.title} no Spotify`}
                className="w-full border-0"
                height={embedHeight}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>

            <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">
              Faixas do disco
            </p>
            <ol className="space-y-1">
              {album.tracks.map((item, index) => {
                const onSpotify = isTrackOnSpotify(item);

                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
                      onSpotify ? 'bg-stone-50 text-stone-800' : 'text-stone-500'
                    }`}
                  >
                    <span className="text-sm w-6 opacity-70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-medium flex items-center gap-2 flex-wrap">
                      {item.title}
                      {!onSpotify && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-300/60 text-stone-600 font-medium">
                          em breve
                        </span>
                      )}
                    </span>
                    <span className="text-sm opacity-70 shrink-0">
                      {onSpotify ? item.duration : ''}
                    </span>
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
