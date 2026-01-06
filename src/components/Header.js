import React, { memo } from 'react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import NavBar from './NavBar';
import NavMobile from './NavMobile';

const Header = memo(() => {
  return (
    <header className=" text-black sticky top-0 z-50 ">
      <div className="mx-auto py-3 md:py-4 flex justify-between items-center">
        <Logo />
        <SocialLinks />
      </div>
    </header>
  );
});

export default Header;
