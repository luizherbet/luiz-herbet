import React, { memo } from 'react';
import Fading from './Fading';
import {
  FaGlobe,
  FaChartLine,
  FaShoppingCart,
  FaBrush,
  FaBullhorn,
  FaTachometerAlt,
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
    title: 'E-commerce',
    description: 'Loja virtual personalizada para o seu negócio.',
    icon: <FaShoppingCart />,
  },
  {
    title: 'Branding',
    description: 'Identidade visual para destacar sua marca.',
    icon: <FaBrush />,
  },
  {
    title: 'Marketing Digital',
    description: 'Aumente suas vendas com campanhas eficazes.',
    icon: <FaBullhorn />,
  },
  {
    title: 'Otimização de Performance',
    description: 'Seu site mais rápido e eficiente.',
    icon: <FaTachometerAlt />,
  },
];

const Services = memo(() => {
  return (
    <div
      id="services"
      className="flex flex-col justify-center items-center bg-gradient-to-b from-slate-300 from-30% to-slate-500 to-10%... min-h-screen"
    >
      <Fading time={2000}>
        <section className=" w-[90%] max-w-[1400px] py-16 ">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
              {servicesData.map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-black rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-[250px] w-[250px] transition duration-300"
                >
                  <div className="text-black text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-800 text-sm">{service.description}</p>
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
