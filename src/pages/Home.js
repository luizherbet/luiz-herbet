import React, { memo } from 'react';

const COVER_SRC = '/media/books/narciso-em-ferias.jpg';

const Home = memo(() => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <img
        src={COVER_SRC}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35" />

      <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 md:px-12 pb-14 md:pb-20">
        <p className="mb-4 text-xs md:text-sm uppercase tracking-[0.4em] text-white/70">
          Caetano Veloso
        </p>
        <h1 className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]">
          Narciso em férias
        </h1>
        <p className="mt-5 text-sm text-white/60">Companhia das Letras · 2020</p>
      </div>
    </main>
  );
});

export default Home;
