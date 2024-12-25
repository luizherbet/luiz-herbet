import React, { memo } from 'react';
import logoImg from '../assets/img/logo.png';

const Logo = memo(() => {
  return (
    <div className="box-content">
      <img
        src={logoImg}
        alt="Logo"
        className="w-20 h-20 md:w-24 md:h-24 lg:w-24 lg:h-24 object-contain"
      />
    </div>
  );
});

export default Logo;
