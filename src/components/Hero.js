import React, { memo } from 'react';
import Fading from './Fading';
import { profile } from '../data/content';

const Hero = memo(() => {
  return (
    <Fading time={600}>
      <section
        id="inicio"
        className="rounded-xl mt-4 w-full py-12 md:py-16 px-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
          <div className="w-full max-w-[280px] shrink-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-stone-200">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-800/80 mb-4">
              {profile.tagline}
            </p>
            <h1 className="text-5xl md:text-6xl font-light text-stone-900 mb-5 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              {profile.bio}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
                Conhecer o livro
              </a>
              <a
                href="#quadros"
                className="border border-stone-400 text-stone-800 px-6 py-3 rounded-full text-sm font-medium hover:border-stone-600 transition-colors"
              >
                Ver os quadros
              </a>
            </div>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default Hero;
