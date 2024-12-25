import React, { memo } from 'react';
import Typing from './Typing';
import Fading from './Fading';

const LeftMain = memo(() => {
  return (
    <div className="text-center">
      <h2 className="text-[24px] font-bold text-gray-800 mb-7 mt-7">
        <Typing time={100} text="Revolucione sua Identidade Digital" />
      </h2>
      <p className="text-lg text-gray-800 mb-6">
        <Fading time={400}>
          <p>
            Transforme sua presença digital com soluções completas para o seu
            negócio ou marca. Criação de sites profissionais, produção de
            conteúdo para redes sociais, e edição de áudio, imagens e vídeos
            animados para engajar seu público e impulsionar o seu crescimento
            online.
          </p>
        </Fading>
      </p>
      <p className="text-md mt-2 text-gray-700 mb-6">
        <Fading time={800}>
          <p>
            Ofereço soluções criativas e personalizadas que vão além do
            convencional. Impulsionando o crescimento da sua marca de forma
            autêntica.
          </p>
        </Fading>
      </p>
      <Fading time={1200}>
        <a
          href="https://wa.me/554599947050"
          className="inline-block mt-7 bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300"
        >
          Entre em contato!
        </a>
      </Fading>
    </div>
  );
});

export default LeftMain;
