import React, { memo } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Services from '../components/Services';
import Footer from '../components/Footer';
import BusinessCard from '../components/Card';
import NavBarv2 from '../components/NavBar';

const Home = memo(() => {
  return (
    <div>
      <Header />
      <Main />
      <Services />
      <BusinessCard />
      <Footer />
    </div>
  );
});

export default Home;
