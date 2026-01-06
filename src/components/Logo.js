import React, { memo } from 'react';
import logoImg from '../assets/img/logo2.png';

const Logo = memo(() => {
  return (
    <div className="box-content">
      <img
        src={logoImg}
        alt="Logo"
        className=""
      />
    </div>
  );
});

export default Logo;
