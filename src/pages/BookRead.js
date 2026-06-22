import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Fading from '../components/Fading';
import { book } from '../data/book';
import { usePageMeta } from '../hooks/usePageMeta';

const BookRead = memo(() => {
  usePageMeta({
    title: 'Nas Entrelinhas — Livro de poesia do artista Luiz Pipa',
    description:
      'Leia o livro de poesia Nas Entrelinhas, do artista Luiz Pipa. Obra em seis partes — Palavrear, Janelas, As Pipas, Emaranhados, As Musas e As Chuvas.',
    canonical: 'https://www.luizpipa.com.br/livro',
  });

  return (
    <div className="max-w-[1100px] mx-auto min-h-screen flex flex-col">
      <Header />
      <Fading time={400}>
        <main className="flex-grow px-4 md:px-6 py-8">
          <div className="bg-white rounded-xl p-5 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <Link
                  to="/#livro"
                  className="text-stone-600 hover:text-stone-900 transition-colors text-sm flex items-center mb-2"
                >
                  <span className="mr-2">←</span>
                  Voltar ao livro
                </Link>
                <h1 className="text-2xl md:text-3xl text-stone-900 font-light">
                  {book.title}
                </h1>
                <p className="text-stone-500 text-sm">por {book.author}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={book.pdf}
                  download={book.pdfFileName}
                  className="border border-stone-400 text-stone-800 px-5 py-2 rounded-full text-sm font-medium hover:border-stone-600 transition-colors"
                >
                  Baixar PDF
                </a>
                <a
                  href={book.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-900 text-amber-50 px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Amazon
                </a>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
              <iframe
                title={`Leitura de ${book.title}`}
                src={`${book.pdf}#view=FitH`}
                className="w-full h-[80vh] min-h-[600px]"
              />
            </div>

            <p className="text-center text-stone-400 text-xs mt-4">
              Se o leitor não carregar,{' '}
              <a
                href={book.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stone-600"
              >
                abra o PDF em nova aba
              </a>
              .
            </p>
          </div>
        </main>
      </Fading>
      <Footer />
    </div>
  );
});

export default BookRead;
