import capaDisco from '../assets/Nas entrelinhas - disco/cover.jpeg';
import foto from '../assets/img/Foto.jpeg';

import quadro01 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 16.22.11.jpeg';
import quadro02 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 16.22.10.jpeg';
import quadro03 from '../assets/Quadros/WhatsApp Image 2026-02-16 at 16.26.30.jpeg';
import quadro04 from '../assets/Quadros/WhatsApp Image 2026-04-30 at 21.19.23 (1).jpeg';
import quadro05 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 12.30.53.jpeg';
import quadro06 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 16.22.10 (1).jpeg';
import quadro07 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 16.22.11 (1).jpeg';
import quadro08 from '../assets/Quadros/WhatsApp Image 2026-06-18 at 16.22.11 (2).jpeg';
import quadro09 from '../assets/Quadros/WhatsApp Image 2026-06-21 at 13.29.37.jpeg';
import quadro10 from '../assets/Quadros/WhatsApp Image 2026-06-21 at 17.05.55.jpeg';
import quadro12 from '../assets/Quadros/WhatsApp Image 2026-06-24 at 18.32.40.jpeg';

export const profile = {
  name: 'Luiz Pipa',
  photo: foto,
  tagline: 'Música · Literatura · Artes visuais',
  bio: 'Entre sons, palavras e cores. Neste espaço você encontra o disco Nas entrelinhas, o livro e a coleção de pinturas.',
};

export const album = {
  title: 'Nas entrelinhas',
  year: 2026,
  description:
    'Canções que habitam o espaço entre o dito, o não dito e o sentido.',
  cover: capaDisco,
  spotifyUrl: 'https://open.spotify.com/album/5sdzn6dfbb1Js1JwjwWGwu',
  spotifyEmbedId: '5sdzn6dfbb1Js1JwjwWGwu',
  tracks: [
    {
      id: 1,
      title: 'Entrelinhas',
      duration: '1:47',
      onSpotify: true,
    },
    {
      id: 2,
      title: 'Navegante',
      duration: '1:22',
      onSpotify: true,
    },
    {
      id: 3,
      title: 'Eco',
      duration: '2:18',
      onSpotify: true,
    },
    {
      id: 4,
      title: 'Novela',
      duration: '3:14',
      onSpotify: true,
    },
    {
      id: 5,
      title: 'Paisagem',
      duration: 'em breve',
    },
    {
      id: 6,
      title: 'Canção do Peregrino',
      duration: '2:41',
      onSpotify: true,
    },
    {
      id: 7,
      title: 'Solidão',
      duration: '1:36',
      onSpotify: true,
    },
    {
      id: 8,
      title: 'Repaginada',
      duration: 'em breve',
    },
    {
      id: 9,
      title: 'Sem saber',
      duration: 'em breve',
    },
    {
      id: 10,
      title: 'Tus ojos',
      duration: 'em breve',
    },
    {
      id: 11,
      title: 'Poetas',
      duration: 'em breve',
    },
  ],
};

export { book } from './book';

export const paintings = [
  {
    id: 1,
    title: 'O flautista e a pipa',
    technique: 'Óleo sobre tela',
    image: quadro01,
  },
  {
    id: 2,
    title: 'Rosto sob a lua',
    technique: 'Óleo sobre tela',
    image: quadro02,
  },
  {
    id: 3,
    title: 'Casa e pipa',
    technique: 'Óleo sobre tela',
    image: quadro03,
  },
  {
    id: 4,
    title: 'A janela e a multidão',
    technique: 'Óleo sobre tela',
    image: quadro04,
  },
  {
    id: 5,
    title: 'Composição abstrata',
    technique: 'Mista sobre tela',
    image: quadro05,
  },
  {
    id: 6,
    title: 'Barco e sol',
    technique: 'Óleo sobre tela',
    image: quadro06,
  },
  {
    id: 7,
    title: 'Quadrados e linha',
    technique: 'Desenho a lápis e cor',
    image: quadro07,
  },
  {
    id: 8,
    title: 'Pipas e janelas',
    technique: 'Óleo sobre tela',
    image: quadro08,
  },
  {
    id: 9,
    title: 'Luiz Pipa',
    technique: 'Mista sobre tela',
    image: quadro09,
  },
  {
    id: 10,
    title: 'Olhos de pipa',
    technique: 'Desenho e cor sobre papel',
    image: quadro10,
  },
  {
    id: 12,
    title: 'Particula arte',
    technique: 'Óleo sobre tela',
    image: quadro12,
  },
];
