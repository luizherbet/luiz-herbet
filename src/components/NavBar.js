import React, { memo, useState } from 'react';

const NavBar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="container mx-auto px-4 py-2 flex justify-evenly items-center">
        {/* Menu para telas grandes */}
        <nav className="hidden md:flex space-x-6">
          <a
            href="#about"
            className="hover:text-amber-900 transition-all duration-300"
          >
            Sobre
          </a>
          <a
            href="#works"
            className="hover:text-amber-900 transition-all duration-300"
          >
            Projetos
          </a>
          <a
            href="#contact"
            className="hover:text-amber-900 transition-all duration-300"
          >
            Contato
          </a>
        </nav>
      </div>
      {/* Botão do menu mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black hover:text-amber-900 focus:outline-none md:hidden"
      >
        {/* Ícone de hambúrguer */}
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      {/* Menu Mobile */}
      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } bg-gray-700 md:hidden px-4 py-2 space-y-2`}
      >
        <a href="#about" className="block text-gray-300 hover:text-white">
          Sobre
        </a>
        <a href="#works" className="block text-gray-300 hover:text-white">
          Projetos
        </a>
        <a
          href="https://wa.me/554599947050"
          className="block text-gray-300 hover:text-white"
        >
          Contato
        </a>
      </nav>
    </div>
  );
});

export default NavBar;
