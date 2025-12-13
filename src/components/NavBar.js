import React, { memo } from 'react';

const NavBar = memo(() => {
  return (
    <nav className="hidden md:flex w-[450px] justify-evenly items-center">
      <a href="#services" className={styles.link}>
        Serviços
      </a>
      <a href="#clients" className={styles.link}>
        Clientes
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
