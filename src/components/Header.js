import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const navItems = [
  { label: 'Disco', href: '/#disco' },
  { label: 'Livro', href: '/#livro' },
  { label: 'Quadros', href: '/#quadros' },
];

const Header = memo(() => {
  return (
    <header className="text-stone-900 sticky top-0 z-50 bg-[#faf7f2]/90 backdrop-blur-sm">
      <div className="mx-auto py-4 px-2">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl md:text-3xl font-light tracking-tight hover:opacity-80 transition-opacity"
          >
            <img
              src="/pipa.svg"
              alt=""
              className="h-8 w-8 md:h-9 md:w-9 shrink-0"
              aria-hidden="true"
            />
            Luiz Pipa
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <SocialLinks />
        </div>
      </div>
    </header>
  );
});

export default Header;
