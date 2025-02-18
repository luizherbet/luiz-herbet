import React, { memo } from 'react';
import Project from '../components/Project';
import Footer from '../components/Footer';

const Home = memo(() => {
  return (
    <div>
      <Project />
      <Footer />
    </div>
  );
});

export default Home;
