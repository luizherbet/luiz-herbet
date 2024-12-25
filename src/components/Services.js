import React, { memo } from 'react';
import FadingText from './FadingText';

const servicesData = [
  {
    title: 'Criação de Sites',
    description: 'Sites responsivos e otimizados para o seu negócio.',
  },
  {
    title: 'Gestão de Redes Sociais',
    description: 'Planejamento e execução para aumentar o engajamento.',
  },

  {
    title: 'E-commerce',
    description: 'Loja virtual personalizada para o seu negócio.',
  },
  {
    title: 'Branding',
    description: 'Identidade visual para destacar sua marca.',
  },

  {
    title: 'Marketing Digital',
    description: 'Aumente suas vendas com campanhas eficazes.',
  },
  {
    title: 'Otimização de Performance',
    description: 'Seu site mais rápido e eficiente.',
  },
];

const Services = memo(() => {
  return (
    <div className="flex flex-row flex-wrap justify-evenly bg-gradient-to-b from-blue-200 from-30% to-amber-200 to-10%... p-8 min-h-[600px] ">
      <FadingText time={2000}>
        <section className="bg-rose-800 py-16 rounded-md">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-white mb-10">
              Meus Serviços
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadingText>
    </div>
  );
});

export default Services;
