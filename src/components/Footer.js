import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-stone-900 text-amber-50 rounded-t-xl mt-8 w-full py-10">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-2xl font-light mb-4">Luiz Pipa</p>
        <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
          Música, literatura e artes visuais. Entre em contato para saber mais
          sobre o disco, o livro ou os quadros.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
          <a
            href="mailto:luizherbetsouza@gmail.com"
            className="text-amber-100/80 hover:text-amber-50 transition-colors"
          >
            luizherbetsouza@gmail.com
          </a>
        </div>
        <div className="border-t border-stone-700 pt-6">
          <p className="text-sm text-stone-500">
            &copy; 2026 Luiz Pipa — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
