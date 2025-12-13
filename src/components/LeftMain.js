import React, { memo } from 'react';
import Typing from './Typing';
import Fading from './Fading';

const LeftMain = memo(() => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
        <Typing time={100} text="Revolucione sua Identidade Digital" />
      </h1>
      <div className="w-full mb-6 max-w-3xl">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          <Fading time={400}>
            Transforme sua presença digital com soluções completas para o seu
            negócio ou marca. Criação de sites profissionais, produção de
            conteúdo para redes sociais, e edição de áudio, imagens e vídeos
            animados para engajar seu público e alavancar o seu crescimento
            online.
          </Fading>
        </p>
      </div>
      <div className="w-full mb-10 max-w-3xl">
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          <Fading time={800}>
            Ofereço soluções criativas e personalizadas que vão além do
            convencional. Impulsionando o crescimento da sua marca de forma
            autêntica.
          </Fading>
        </p>
      </div>
      <Fading time={1200}>
        <div className="w-full flex justify-center">
          <a
            href="https://wa.me/554599947050"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Entre em contato!
          </a>
        </div>
      </Fading>
    </div>
  );
});

export default LeftMain;
