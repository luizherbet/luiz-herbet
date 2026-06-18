import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-stone-900 text-amber-50 rounded-t-xl mt-8 w-full py-10">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-2xl font-light mb-4">Luiz Pipa</p>
        <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Se você escreve, pinta ou faz música — ou se quiser falar comigo — esse
          é meu e-mail e meu telefone.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
          <a
            href="mailto:luizherbetsouza@gmail.com"
            className="text-amber-100/80 hover:text-amber-50 transition-colors"
          >
            luizherbetsouza@gmail.com
          </a>
          <a
            href="tel:+5545999947050"
            className="text-amber-100/80 hover:text-amber-50 transition-colors"
          >
            (45) 99994-7050
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
