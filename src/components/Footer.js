import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-10 w-full">
      <div className="mx-auto text-center max-w-7xl px-6 w-full">
        <p className="text-sm md:text-base font-medium">
          &copy; 2025 Luiz Herbet - Todos os direitos reservados
        </p>
        <p className="text-xs md:text-sm text-gray-400 mt-3">
          Desenvolvido com dedicação e paixão pela tecnologia
        </p>
      </div>
    </footer>
  );
});

export default Footer;
