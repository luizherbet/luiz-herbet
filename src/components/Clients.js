import React, { memo } from 'react';
import Fading from './Fading';
import portfolio01 from '../assets/img/portfolio01.png';

const Clients = memo(() => {
  return (
    <div
      id="clients"
      className="mt-1 py-16"
    >
      <Fading time={1500}>
        <h1 className="text-4xl md:text-5xl text-blue-900 mb-4 flex justify-center">
          Portfólio
        </h1>
        <p className="text-lg text-blue-800 text-center mb-8 max-w-2xl mx-auto px-6">
          Conheça alguns dos projetos que desenvolvemos com excelência e dedicação
        </p>
        <div className="flex justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-[500px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl">
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img
                src={portfolio01}
                alt="Lua Ambiental"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Lua Ambiental
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Landing Page com serviço de newsletters.
              </p>
            </div>
          </div>
        </div>
      </Fading>
    </div>
  );
});

export default Clients;


