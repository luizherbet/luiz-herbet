import React, { memo } from 'react';
import Fading from './Fading';

const Clients = memo(() => {
  // Array de clientes - você pode substituir por dados reais
  const clients = [
    {
      id: 1,
      name: 'Empresa Tech Solutions',
      logo: '🏢',
      testimonial: 'Excelente trabalho na criação do nosso site. Profissionalismo e qualidade excepcionais.',
      industry: 'Tecnologia',
    },
    {
      id: 2,
      name: 'Studio Criativo',
      logo: '🎨',
      testimonial: 'A gestão das nossas redes sociais aumentou significativamente nosso engajamento.',
      industry: 'Design',
    },
    {
      id: 3,
      name: 'Podcast Digital',
      logo: '🎙️',
      testimonial: 'Edição de áudio impecável. Nossos ouvintes notaram a diferença na qualidade.',
      industry: 'Mídia',
    },
    {
      id: 4,
      name: 'E-commerce Plus',
      logo: '🛒',
      testimonial: 'Site responsivo e otimizado. Nossas vendas online aumentaram 40%.',
      industry: 'Varejo',
    },
    {
      id: 5,
      name: 'Agência Marketing',
      logo: '📊',
      testimonial: 'Conteúdo visual de alta qualidade que representa perfeitamente nossa marca.',
      industry: 'Marketing',
    },
    {
      id: 6,
      name: 'Canal YouTube',
      logo: '📹',
      testimonial: 'Edição de vídeos profissional que elevou a qualidade do nosso canal.',
      industry: 'Entretenimento',
    },
  ];

  return (
    <div
      id="clients"
      className="flex flex-col justify-center items-center bg-gradient-to-b from-slate-500 from-15% via-slate-400 via-35% to-white to-65% py-24 md:py-28"
    >
      <Fading time={1500}>
        <section className="w-full max-w-[1400px] mx-auto">
          <div className="px-6 md:px-8">
            {/* Título da Seção */}
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
                Nossos Clientes
              </h2>
              <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed opacity-95">
                Empresas que confiam em nosso trabalho e transformaram sua presença digital
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Grid de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mx-auto max-w-6xl justify-items-center pt-8">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl shadow-lg p-7 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 w-full max-w-[420px]"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-5xl mr-4">{client.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">{client.industry}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{client.testimonial}"
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

export default Clients;

