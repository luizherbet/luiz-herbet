import React, { memo } from 'react';
import Fading from './Fading';
import team01 from '../assets/img/team01.jpeg';
import team02 from '../assets/img/team02.png';

const Team = memo(() => {
  const team = [
    {
      id: 1,
      name: 'Luiz Herbet',
      role: 'Engenheiro da Computação e Desenvolvedor Full Stack',
      description: 'Desenvolvedor full stack, criação de sites responsivos e aplicações web modernas. Com experiência em front-end, back-end e banco de dados, transforma ideias em soluções digitais funcionais e escaláveis.',
      image: team01,
    },
    {
      id: 2,
      name: 'Chesly Rodrigues',
      role: 'Designer & Editor de Conteúdo',
      description: 'Responsável por transformar ideias em estratégias digitais. Tem atuação na criação de posts, desenvolvimento visual, design de sites e soluções de marketing para alavancar negócios no meio digital.',
      image: team02,
    },
  ];

  return (
    <div
      id="team"
      className="bg-gradient-to-b from-stone-200 to-violet-100 rounded-xl mt-8 w-full py-12 md:py-16"
    >
      <Fading time={1500}>
        <h1 className="text-5xl text-blue-900 mb-2 flex justify-center">
          Equipe
        </h1>
        <p className="text-lg text-blue-800 text-center mb-[50px] max-w-2xl mx-auto px-6">
          Profissionais especializados prontos para transformar suas ideias em realidade
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 px-6 md:px-12 justify-items-center max-w-[900px] mx-auto">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-8 md:p-10 md:w-[400px] sm:w-[200px]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Fading>
    </div>
  );
});

export default Team;

