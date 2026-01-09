import React, { memo } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Services from '../components/Services';
import Lab from '../components/Lab';
import Clients from '../components/Clients';
import Footer from '../components/Footer';
import Team from '../components/Team';

const Home = memo(() => {
  return (
    <div className="max-w-[1100px] mx-auto min-h-screen flex flex-col">
      <Header />
      <Main />
      <Services />
      <Lab />
      <Clients />
      <Team/>
      <Footer />
    </div>
  );
});

export default Home;
