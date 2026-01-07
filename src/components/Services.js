import React, { memo } from 'react';
import CardService from './CardService';
import Fading from './Fading';

const Services = memo(() => {
  return (
    <Fading time={1000}>
    <div
      id="services"
      className="bg-gradient-to-b from-stone-200 to-indigo-100 rounded-xl mt-8 w-full py-12 md:py-16"
    >
      
      <h1 className="text-4xl md:text-5xl  text-blue-900  mb-8 flex justify-center">
        Serviços
      </h1>
      <p className="text-lg text-blue-800 text-center mb-8 max-w-2xl mx-auto px-6">
        Soluções completas para transformar sua presença digital
      </p>
      <CardService />
      
    </div>
    </Fading>
  );
});

export default Services;
