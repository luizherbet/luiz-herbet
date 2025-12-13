import React, { memo } from 'react';
import Fading from './Fading';
import {
  FaGlobe,
  FaChartLine,
  FaBrush,
  FaVideo,
  FaHeadphones,
  FaImage,
} from 'react-icons/fa';

const servicesData = [
  {
    title: 'Criação de Sites',
    description: 'Sites responsivos e otimizados para o seu negócio.',
    icon: <FaGlobe />,
  },
  {
    title: 'Gestão de Redes Sociais',
    description: 'Planejamento e execução para aumentar o engajamento.',
    icon: <FaChartLine />,
  },
  {
    title: 'Branding',
    description: 'Identidade visual para destacar sua marca.',
    icon: <FaBrush />,
  },
  {
    title: 'Edição de Áudio',
    description:
      'Produção e edição de áudio para podcasts e músicas, com qualidade profissional.',
    icon: <FaHeadphones />,
  },
  {
    title: 'Edição de Vídeo',
    description:
      'Edição de vídeos para YouTube, Instagram, e outras plataformas digitais.',
    icon: <FaVideo />,
  },
  {
    title: 'Edição de Imagens',
    description:
      'Criação e edição de imagens para thumbnails, posts e materiais promocionais.',
    icon: <FaImage />,
  },
];

const Services = memo(() => {
  return (
    <div
      id="services"
      className="flex flex-col justify-center items-center bg-gradient-to-b from-slate-200 from-15% via-slate-300 via-35% to-slate-400 to-75% py-24 md:py-28"
    >
      <Fading time={2000}>
        <section className="w-full max-w-[1400px] mx-auto">
          <div className="px-6 md:px-8">
            {/* Título da Seção */}
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5">
                Nossos Serviços
              </h2>
              <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed">
                Soluções completas para transformar sua presença digital
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center items-center mx-auto max-w-6xl pt-8">
              {servicesData.map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-10 flex flex-col items-center justify-center min-h-[300px] w-full max-w-[340px] mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-indigo-400 group"
                >
                  <div className="text-indigo-600 text-5xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-700">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-indigo-600">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Fading>
    </div>
  );
});

export default Services;
