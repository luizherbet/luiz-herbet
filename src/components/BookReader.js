import React, { memo } from 'react';
import { bookContent } from '../data/bookContent';

const BookReader = memo(() => {
  return (
    <div className="book-reader">
      <nav
        aria-label="Partes do livro"
        className="mb-10 pb-6 border-b border-stone-200"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">
          Partes
        </p>
        <ul className="flex flex-wrap gap-2">
          {bookContent.map((section) => (
            <li key={section.title}>
              <a
                href={`#parte-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block px-4 py-2 rounded-full text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-16 md:space-y-20">
        {bookContent.map((section) => (
          <section
            key={section.title}
            id={`parte-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            className="scroll-mt-28"
          >
            <header className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-800/70 mb-2">
                Parte
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900">
                {section.title}
              </h2>
            </header>

            <div className="space-y-14 md:space-y-16 max-w-2xl mx-auto">
              {section.poems.map((poem) => (
                <article
                  key={`${section.title}-${poem.title}`}
                  className="poem border-t border-stone-100 pt-10 first:border-t-0 first:pt-0"
                >
                  <h3 className="text-xl md:text-2xl font-light text-stone-900 mb-6 text-center italic">
                    {poem.title}
                  </h3>
                  <div className="text-stone-700 text-base md:text-lg leading-relaxed md:leading-loose font-light text-center">
                    {poem.lines.map((line, index) => (
                      <p key={index} className="mb-1 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

export default BookReader;
