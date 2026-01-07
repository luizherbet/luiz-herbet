import React, { memo } from 'react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';

const Header = memo(() => {
  return (
    <header className="text-black sticky top-0 z-50">
      <div className="mx-auto py-3 md:py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <div className="w-full md:w-auto">
            <div className="flex justify-end md:hidden mb-2">
              <SocialLinks />
            </div>
            <Logo />
          </div>
          <div className="hidden md:block">
            <SocialLinks />
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
