import React, { memo } from 'react';
import Fading from './Fading';
import { paintings } from '../data/content';

const Paintings = memo(() => {
  return (
    <Fading time={1200}>
      <section
        id="quadros"
        className="bg-white rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Quadros</h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Safra de pinturas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {paintings.map((item) => (
            <article
              key={item.id}
              className="group rounded-xl overflow-hidden bg-stone-50"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-stone-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500">{item.technique}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Fading>
  );
});

export default Paintings;
