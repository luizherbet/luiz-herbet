import React, { memo, useState } from 'react';

const NavMobile = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block md:hidden justify-end">
      <button onClick={() => setIsOpen(!isOpen)}>
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

      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } bg-black absolute md:hidden px-4 py-2 space-y-2`}
      >
        <a href="#about" className={styles.links}>
          Sobre
        </a>
        <a href="#works" className={styles.links}>
          Projetos
        </a>
        <a href="https://wa.me/554599947050" className={styles.links}>
          Contato
        </a>
      </nav>
    </div>
  );
});

export default NavMobile;

const styles = {
  links: 'block text-gray-300 hover:text-white',
};
