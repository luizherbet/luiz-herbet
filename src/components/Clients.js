import React, { memo } from 'react';
import Fading from './Fading';
import portfolio01 from '../assets/img/portfolio/portfolio01.png';
import capturaTela from '../assets/img/portfolio/Captura de Tela 2024-12-27 às 13.41.21.png';
import brownFlyer from '../assets/img/portfolio/Brown Classic Wellness Flyer.jpg';
import panfleto from '../assets/img/portfolio/Panfleto cursos profissionalizantes geométrico amarelo e azul.jpg';
import unnamed from '../assets/img/portfolio/unnamed.jpg';
import workshop from '../assets/img/portfolio/Workshop Estado, Capacidades Estatais e Desenvolvimento Uma abordagem interdisciplinar.jpg';
import oito from '../assets/img/portfolio/oito.png';
import videoPortfolio from '../assets/img/portfolio/Terça, 09 Dezembro de 2025.mp4';

const portfolioData = [
  {
    id: 1,
    title: 'Lua Ambiental',
    description: 'Landing Page com serviço de newsletters.',
    image: portfolio01,
    type: 'image',
    link: 'https://www.luarambiental.com.br/',
  },
  {
    id: 2,
    title: 'Rafa Moraes',
    description: 'Logomarca.',
    image: capturaTela,
    type: 'image',
  },
  {
    id: 3,
    title: 'Workshop Estado e Desenvolvimento',
    description: 'Folder com material acadêmico sobre capacidades estatais.',
    image: brownFlyer,
    type: 'image',
  },
  {
    id: 4,
    title: 'Hotel Coroados',
    description: 'Folder para impressão.',
    image: panfleto,
    type: 'image',
  },
  {
    id: 5,
    title: 'Desenvolvimento em Debate',
    description: 'Diagramação e design da revista científica.',
    image: unnamed,
    type: 'image',
  },
  {
    id: 6,
    title: 'Workshop Estado e Desenvolvimento',
    description: 'Folder com material acadêmico sobre capacidades estatais.',
    image: workshop,
    type: 'image',
  },
  {
    id: 7,
    title: 'OitO',
    description: 'Aplicação full stack para agendamento de profissionais independentes.',
    image: oito,
    type: 'image',
  },
  {
    id: 8,
    title: 'Luar Ambiental',
    description: 'Post com audio e video para redes sociais.',
    video: videoPortfolio,
    type: 'video',
  },
];

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
        <p className="text-lg text-blue-800 text-center mb-[70px] max-w-2xl mx-auto px-6">
          Conheça alguns dos projetos que desenvolvemos com dedicação
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-6 justify-items-center max-w-6xl mx-auto">
          {portfolioData.map((item) => {
            const CardContent = (
              <>
                {/* Imagem */}
                {item.type === 'image' && (
                  <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Vídeo */}
                {item.type === 'video' && (
                  <div className="w-full h-64 md:h-80 overflow-hidden bg-black">
                    <video
                      controls
                      className="w-full h-full object-contain"
                      preload="metadata"
                    >
                      <source src={item.video} type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                )}
                
                <div className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </>
            );

            if (item.link) {
              return (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden w-full max-w-[400px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer block"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden w-full max-w-[400px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </Fading>
    </div>
  );
});

export default Clients;



