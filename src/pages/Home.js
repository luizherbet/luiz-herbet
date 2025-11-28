import React, { memo } from 'react';
import Header from '../components/Header';
import Main from '../components/Main'
import Services from '../components/Services'
import Card from '../components/Card'

import Footer from '../components/Footer';

const Home = memo(() => {
  return (
    <div>
      <Header />
      <Main />
      <Services />
      <Card />
      <Footer />
    </div>
  );
});

export default Home;
