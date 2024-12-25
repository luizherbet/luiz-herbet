import React, { memo } from 'react';

const NavBar = memo(() => {
  return (
    <nav className="hidden md:flex w-[400px] justify-evenly items-center">
      <a href="#sevices" className={styles.link}>
        Serviços
      </a>
      <a href="#about" className={styles.link}>
        Sobre
      </a>
      <a href="#contact" className={styles.link}>
        Contato
      </a>
    </nav>
  );
});

export default NavBar;

const styles = {
  link: 'text-base hover:text-blue-900 hover:scale-110 hover:transition-all duration-300',
};
