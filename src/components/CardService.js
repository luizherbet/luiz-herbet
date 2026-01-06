import React from 'react';
import services01 from '../assets/img/services01.png';
import services02 from '../assets/img/services02.png';
import services03 from '../assets/img/services03.png';
import services04 from '../assets/img/services04.png';
import services05 from '../assets/img/services05.png';
import services06 from '../assets/img/services06.png';

const servicesData = [
  {
    id: 1,
    title: 'Pacotes de Posts para Redes Sociais',
    description: 'Transforme sua presença digital com conteúdo visual estratégico e profissional. Posts criativos e otimizados que engajam seu público e elevam sua marca no Instagram, Facebook, LinkedIn e outras plataformas.',
    image: services01,
  },
  {
    id: 2,
    title: 'Landing Pages de Alta Conversão',
    description: 'Páginas estrategicamente desenvolvidas para converter visitantes em clientes. Design moderno, responsivo e otimizado para SEO, maximizando suas vendas e captação de leads qualificados.',
    image: services02,
  },
  {
    id: 3,
    title: 'Edição de Vídeo Profissional',
    description: 'Eleve seu conteúdo com edições cinematográficas de alta qualidade. Especializado em YouTube, TikTok, Instagram Reels e Shorts. Transições suaves, correção de cor e efeitos que fazem seu vídeo se destacar.',
    image: services03,
  },
  {
    id: 4,
    title: 'Produção de Áudio para Podcasts',
    description: 'Qualidade sonora profissional que impressiona seus ouvintes. Remoção de ruídos, equalização, mixagem e masterização. Seu podcast com a qualidade que ele merece.',
    image: services04,
  },
  {
    id: 5,
    title: 'Identidade Visual & Branding',
    description: 'Crie uma marca memorável e impactante. Desenvolvimento completo de logomarcas únicas, identidade visual consistente e edição profissional de imagens que comunicam a essência do seu negócio.',
    image: services05,
  },
  {
    id: 6,
    title: 'Desenvolvimento Full Stack',
    description: 'Soluções web completas e escaláveis. Aplicações modernas com tecnologias de ponta, integrando front-end responsivo, back-end robusto e banco de dados otimizado. Do conceito à entrega.',
    image: services06,
  },
];

export default function CardService() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-3 gap-y-6 md:gap-y-8 mt-12 px-11 justify-items-center">
      {servicesData.map((service) => (
        <div
          key={service.id}
          className="bg-white rounded-xl  overflow-hidden w-full max-w-[300px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
        >
          <div className="w-full h-48 overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 min-h-[180px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {service.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">
              {service.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
