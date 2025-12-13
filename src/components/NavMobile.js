import React, { memo, useState } from 'react';

const NavMobile = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block md:hidden relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-label="Menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute right-0 top-12 bg-white shadow-2xl rounded-lg border border-gray-200 md:hidden px-6 py-4 space-y-3 min-w-[200px] z-50`}
      >
        <a 
          href="#services" 
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          Serviços
        </a>
        <a 
          href="#clients" 
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          Clientes
        </a>
        <a 
          href="#contact" 
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          Contato
        </a>
      </nav>
    </div>
  );
});

export default NavMobile;

const styles = {
  links: 'block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors duration-200',
};
