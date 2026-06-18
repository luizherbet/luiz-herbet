import React, { memo } from 'react';
import Fading from './Fading';

const Hero = memo(() => {
  return (
    <Fading time={600}>
      <section
        id="inicio"
        className="rounded-xl mt-4 w-full py-16 md:py-24 px-6 text-center"
      >
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-800/80 mb-4">
          Música · Literatura · Artes visuais
        </p>
        <h1 className="text-5xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight">
          Luiz Pipa
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Disco, livro e quadros reunidos em um só lugar. Ouça as faixas, conheça
          a obra escrita e explore a pintura.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#disco"
            className="bg-stone-900 text-amber-50 px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Ouvir o disco
          </a>
          <a
            href="#livro"
            className="border border-stone-400 text-stone-800 px-6 py-3 rounded-full text-sm font-medium hover:border-stone-600 transition-colors"
          >
            Ler sobre o livro
          </a>
          <a
            href="#quadros"
            className="border border-stone-400 text-stone-800 px-6 py-3 rounded-full text-sm font-medium hover:border-stone-600 transition-colors"
          >
            Ver os quadros
          </a>
        </div>
      </section>
    </Fading>
  );
});

export default Hero;
