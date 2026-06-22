import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Fading from './Fading';
import { book } from '../data/book';

const Book = memo(() => {
  return (
    <Fading time={1000}>
      <section
        id="livro"
        className="bg-gradient-to-b from-amber-50 to-stone-100 rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Livro</h2>
          <p className="text-stone-600">Safra de poesia</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 max-w-4xl mx-auto items-center md:items-start">
          <div className="w-full max-w-[220px] shrink-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-stone-200 shadow-lg">
              <img
                src={book.cover}
                alt={`Capa de ${book.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-wider text-amber-800/80 mb-2">
              {book.subtitle} · {book.year} · {book.pages} páginas
            </p>
            <h3 className="text-3xl md:text-4xl font-light text-stone-900 mb-2">
              {book.title}
            </h3>
            <p className="text-stone-500 mb-6">por {book.author}</p>

            <p className="text-stone-700 leading-relaxed mb-4">{book.synopsis}</p>

            <p className="text-sm text-stone-500 mb-6">
              {book.sections.join(' · ')}
            </p>

            <blockquote className="border-l-4 border-amber-700/40 pl-5 italic text-stone-600 mb-8 text-left">
              {book.excerpt}
            </blockquote>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link
                to="/livro"
                className="bg-stone-900 text-amber-50 px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Ler online
              </Link>
              <a
                href={book.pdf}
                download={book.pdfFileName}
                className="border border-stone-400 text-stone-800 px-6 py-3 rounded-full text-sm font-medium hover:border-stone-600 transition-colors"
              >
                Baixar PDF
              </a>
              <a
                href={book.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-amber-700 text-amber-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Amazon
              </a>
            </div>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default Book;
