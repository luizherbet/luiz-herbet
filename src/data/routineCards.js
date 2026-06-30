export const ROUTINE_CARDS = [
  {
    id: 'acordar',
    title: 'Acordar',
    image: '/media/routine/acordar.svg',
    tint: '#FEF3C7',
  },
  {
    id: 'levantar',
    title: 'Levantar da cama',
    image: '/media/routine/levantar.svg',
    tint: '#FFEDD5',
  },
  {
    id: 'banho',
    title: 'Tomar banho',
    image: '/media/routine/banho.svg',
    tint: '#DBEAFE',
  },
  {
    id: 'dentes',
    title: 'Escovar os dentes',
    image: '/media/routine/dentes.svg',
    tint: '#E0F2FE',
  },
  {
    id: 'vestir',
    title: 'Vestir-se',
    image: '/media/routine/vestir.svg',
    tint: '#FCE7F3',
  },
  {
    id: 'cafe',
    title: 'Tomar café da manhã',
    image: '/media/routine/cafe.svg',
    tint: '#FEE2E2',
  },
  {
    id: 'mochila',
    title: 'Arrumar a mochila',
    image: '/media/routine/mochila.svg',
    tint: '#EDE9FE',
  },
  {
    id: 'sapatos',
    title: 'Calçar os sapatos',
    image: '/media/routine/sapatos.svg',
    tint: '#F3F4F6',
  },
  {
    id: 'caminho',
    title: 'Ir para a escola',
    image: '/media/routine/caminho.svg',
    tint: '#D1FAE5',
  },
  {
    id: 'escola',
    title: 'Chegar na escola',
    image: '/media/routine/escola.svg',
    tint: '#FEF9C3',
  },
];

export const getRoutineCardById = (id) => ROUTINE_CARDS.find((card) => card.id === id);

export const shuffleIds = (ids) => {
  const next = [...ids];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};
