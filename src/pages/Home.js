import React, { memo } from 'react';
import Header from '../components/Header';
import Main from '../components/Main'
import Services from '../components/Services'
import Clients from '../components/Clients'
import Card from '../components/Card'

import Footer from '../components/Footer';

const Home = memo(() => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <Main />
      <Services />
      <Clients />
      <Card />
      <Footer />
    </div>
  );
});

export default Home;
