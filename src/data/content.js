import entrelinhas from '../assets/Nas entrelinhas - disco/Entrelinhas.wav';
import navegante from '../assets/Nas entrelinhas - disco/Navegante.wav';
import capa from '../assets/Nas entrelinhas - disco/cover.jpeg';

export const album = {
  title: 'Nas entrelinhas',
  year: 2026,
  description:
    'Canções que habitam o espaço entre o dito e o sentido — memória, mar e imaginação.',
  cover: capa,
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

export const book = {
  title: 'Título do Livro',
  subtitle: 'Subtítulo ou gênero',
  year: 2026,
  cover: '/media/livro/capa.jpg',
  synopsis:
    'Um livro que nasce do encontro entre palavra, imagem e experiência vivida. Aqui você pode contar a história da obra, o que a motivou e o que o leitor vai encontrar nas páginas.',
  excerpt:
    'Trecho de abertura ou citação representativa do livro. Substitua este texto pelo trecho que melhor apresenta sua escrita ao visitante do site.',
  purchaseLink: '',
};

export const paintings = [
  {
    id: 1,
    title: 'Quadro 01',
    year: 2025,
    technique: 'Óleo sobre tela',
    dimensions: '60 × 80 cm',
    image: '/media/quadros/quadro-01.jpg',
  },
  {
    id: 2,
    title: 'Quadro 02',
    year: 2025,
    technique: 'Acrílica sobre tela',
    dimensions: '50 × 70 cm',
    image: '/media/quadros/quadro-02.jpg',
  },
  {
    id: 3,
    title: 'Quadro 03',
    year: 2026,
    technique: 'Mista sobre papel',
    dimensions: '40 × 60 cm',
    image: '/media/quadros/quadro-03.jpg',
  },
];
