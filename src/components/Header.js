import React, { memo } from 'react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import NavBar from './NavBar';
import NavMobile from './NavMobile';

const Header = memo(() => {
  return (
    <header className="bg-white text-black">
      <div className="container mx-auto px-5 py-4 flex justify-evenly items-center">
        <Logo />
        <NavMobile />
        <NavBar />
        <SocialLinks />
      </div>
    </header>
  );
});

export default Header;
