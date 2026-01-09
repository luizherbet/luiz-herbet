import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fading from './Fading';
import django from '../assets/img/lab/django.png';
import fastapi from '../assets/img/lab/fastapi-logo.CrXoa3Er_Ztc4GC.webp';
import javascript from '../assets/img/lab/img_javascript_480.jpg';
import python from '../assets/img/lab/MmY2NTNiNzQtMjIwYy00MjAyLWEyNzQtZWRmNjg4YzVjODhl_duoccivosu7mybnh2tejuzplkppqmvadhwb7vdctki-kl8j0g6bgaows2-0gmdsa8cthxkip4icnhvi27fmlpibuptrd6v7ukj4vhda3sewjs-vbollou6tdwpjkmoclislvgop-qqv8q2ozog.png';
import nodejs from '../assets/img/lab/nodejs-new-pantone-black.png';
import react from '../assets/img/lab/React_Logo_SVG.svg.png';
import vue from '../assets/img/lab/Vue.js_Logo_2.svg.png';

const Lab = memo(() => {
  const navigate = useNavigate();

  const languages = [
    {
      id: 1,
      name: 'Python',
      description: 'Estudos sobre Python, estruturas de dados, algoritmos e frameworks.',
      image: python,
      path: '/lab/python',
    },
    {
      id: 2,
      name: 'FastAPI',
      description: 'Documentação sobre FastAPI, APIs modernas, async/await e desenvolvimento rápido.',
      image: fastapi,
      path: '/lab/fastapi',
    },
    {
      id: 3,
      name: 'Django',
      description: 'Estudos sobre Django, ORM, autenticação, APIs e desenvolvimento web com Python.',
      image: django,
      path: '/lab/django',
    },
    {
      id: 4,
      name: 'JavaScript',
      description: 'Aprendizados e documentação sobre JavaScript, ES6+, async/await, promises e muito mais.',
      image: javascript,
      path: '/lab/javascript',
    },
    {
      id: 5,
      name: 'Node.js',
      description: 'Aprendizados sobre Node.js, Express, APIs RESTful e desenvolvimento backend.',
      image: nodejs,
      path: '/lab/nodejs',
    },
    {
      id: 6,
      name: 'React',
      description: 'Documentação sobre React, hooks, context API, performance e boas práticas.',
      image: react,
      path: '/lab/react',
    },
    {
      id: 7,
      name: 'Vue.js',
      description: 'Aprendizados sobre Vue.js, composition API, Vuex e desenvolvimento frontend.',
      image: vue,
      path: '/lab/vue',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div
      id="lab"
      className="bg-gradient-to-b from-orange-100 to-red-100 rounded-xl mt-8 w-full py-20"
    >
      <Fading time={1500}>
        <h1 className="text-4xl md:text-5xl text-blue-900 mb-4 flex justify-center">
          Laboratório de Código
        </h1>
        <p className="text-lg text-blue-800 text-center mb-[70px] max-w-2xl mx-auto px-6">
          Diário de bordo com documentação dos meus estudos e aprendizados em diferentes tecnologias
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-16 justify-items-center max-w-6xl mx-auto">
          {languages.map((language) => (
            <div
              key={language.id}
              onClick={() => handleCardClick(language.path)}
              className="bg-white rounded-2xl overflow-hidden w-full max-w-[300px] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
            >
              <div className="w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={language.image}
                  alt={language.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {language.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {language.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Fading>
    </div>
  );
});

export default Lab;
