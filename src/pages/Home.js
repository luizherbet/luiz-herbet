import React, { memo } from 'react';
import Project from '../components/Project';
import TextEncryptor from '../components/TextEncryptor';
import Footer from '../components/Footer';

const Home = memo(() => {
  return (
    <div>
      <Project />
      <TextEncryptor />
      <Footer />
    </div>
  );
});

export default Home;
