import entrelinhas from '../assets/Nas entrelinhas - disco/Entrelinhas.wav';
import navegante from '../assets/Nas entrelinhas - disco/Navegante.wav';
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

export const profile = {
  name: 'Luiz Pipa',
  photo: foto,
  tagline: 'Música · Literatura · Artes visuais',
  bio: 'Artista entre sons, palavras e cores. Neste espaço você encontra o disco Nas entrelinhas, o livro e a coleção de pinturas.',
};

export const album = {
  title: 'Nas entrelinhas',
  year: 2026,
  description:
    'Canções que habitam o espaço entre o dito e o sentido — memória, mar e imaginação.',
  cover: capaDisco,
  tracks: [
    {
      id: 1,
      title: 'Entrelinhas',
      duration: '1:47',
      src: entrelinhas,
    },
    {
      id: 2,
      title: 'Navegante',
      duration: '1:22',
      src: navegante,
    },
  ],
};

export { book } from './book';

export const paintings = [
  {
    id: 1,
    title: 'O flautista e a pipa',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro01,
  },
  {
    id: 2,
    title: 'Rosto sob a lua',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro02,
  },
  {
    id: 3,
    title: 'Casa e pipa',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro03,
  },
  {
    id: 4,
    title: 'A janela e a multidão',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro04,
  },
  {
    id: 5,
    title: 'Composição abstrata',
    year: 2026,
    technique: 'Mista sobre tela',
    image: quadro05,
  },
  {
    id: 6,
    title: 'Barco e sol',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro06,
  },
  {
    id: 7,
    title: 'Quadrados e linha',
    year: 2026,
    technique: 'Desenho a lápis e cor',
    image: quadro07,
  },
  {
    id: 8,
    title: 'Pipas e janelas',
    year: 2026,
    technique: 'Óleo sobre tela',
    image: quadro08,
  },
];
