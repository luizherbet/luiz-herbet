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
import CardService from './CardService';

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
    <div className="bg-gradient-to-b from-stone-200 to-indigo-100 rounded-xl mt-8 w-full h-[800px]">
      <h1 className='text-4xl text-blue-900 mt-10 flex justify-center'>Serviços</h1>
      <div>
        <CardService/>
      </div>
    </div>
  );
});

export default Services;
