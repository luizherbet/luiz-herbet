import React, { memo } from 'react';
import Logo from './Logo';
import NavBar from './NavBar';
import SocialLinks from './SocialLinks';

const Header = memo(() => {
  return (
    <header className="bg-blue-50 text-black">
      <div className="container mx-auto px-5 py-4 flex justify-evenly items-center">
        <Logo />
        <NavBar />
        <SocialLinks />
      </div>
    </header>
  );
});

export default Header;
