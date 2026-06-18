import React, { memo } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Album from '../components/Album';
import Book from '../components/Book';
import Paintings from '../components/Paintings';
import Footer from '../components/Footer';

const Home = memo(() => {
  return (
    <div className="max-w-[1100px] mx-auto min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Album />
      <Book />
      <Paintings />
      <Footer />
    </div>
  );
});

export default Home;
