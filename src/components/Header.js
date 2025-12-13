import React, { memo } from 'react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import NavBar from './NavBar';
import NavMobile from './NavMobile';

const Header = memo(() => {
  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="mx-auto px-5 md:px-6 py-3 md:py-4 flex justify-between items-center max-w-7xl w-full">
        <Logo />
        <NavMobile />
        <NavBar />
        <SocialLinks />
      </div>
    </header>
  );
});

export default Header;
