// Coloque seus arquivos em public/media/ — veja as pastas album, livro e quadros.

export const album = {
  title: 'Nome do Disco',
  year: 2026,
  description:
    'Uma coletânea de canções que atravessam territórios sonoros, memória e imaginação.',
  cover: '/media/album/capa.jpg',
  tracks: [
  {
    id: 1,
    title: 'Faixa 01',
    duration: '3:42',
    src: '/media/album/faixa-01.mp3',
  },
  {
    id: 2,
    title: 'Faixa 02',
    duration: '4:15',
    src: '/media/album/faixa-02.mp3',
  },
  {
    id: 3,
    title: 'Faixa 03',
    duration: '3:58',
    src: '/media/album/faixa-03.mp3',
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
