import React, { memo, useState } from 'react';

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="bg-blue-50 text-black">
      {isOpen ? (
        <div> setar para true quando a tela for menor que ? Mobile</div>
      ) : (
        <div className={styles.navbar}>
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <nav>navs e socialmedia</nav>
          </div>
        </div>
      )}
    </header>
  );
});

export default Header;

const styles = {
  navbar: 'container mx-auto px-5 py-4 flex justify-evenly items-center',
};

// <header className="bg-blue-50 text-black">
// <div className="container mx-auto px-5 py-4 flex justify-evenly items-center">
//   <Logo />
//   <NavBar />
//   <SocialLinks />
// </div>
// </header>
