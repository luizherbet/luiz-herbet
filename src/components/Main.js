import React, { memo } from 'react';
import Typing from './Typing';
import FadingText from './FadingText';
import program from '../assets/img/program.svg';

const Main = memo(() => {
  return (
    <main className="flex flex-col sm:flex-row flex-wrap justify-evenly bg-gradient-to-b from-blue-50 from-30% to-blue-200 to-10%... p-8 min-h-[520px]">
      <section className="basis-full sm:basis-6/12 text-center mb-8 sm:mb-0">
        <h2 className="text-3xl font-bold text-gray-800 mb-7 mt-7">
          <Typing time={100} text="Transforme sua Presença Online" />
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          <FadingText time={400}>
            <p>
              Ofereço soluções completas para o seu negócio ou marca crescer na
              web. Se você precisa de um site profissional ou de uma gestão
              eficaz das suas redes sociais, estou aqui para ajudar!
            </p>
          </FadingText>
        </p>
        <p className="text-md mt-2 text-gray-500 mb-6">
          <FadingText time={800}>
            <p>
              Com meu serviço, você terá um site responsivo e otimizado,
              acompanhado de uma estratégia de redes sociais que vai aumentar o
              alcance e engajamento de sua marca.
            </p>
          </FadingText>
        </p>

        <FadingText time={1200}>
          <a
            href="https://wa.me/554599947050"
            className="inline-block mt-7 bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300"
          >
            Entre em contato!
          </a>
        </FadingText>
      </section>
      <section className="basis-full sm:basis-4/12 text-center">
        <FadingText time={1600}>
          <img
            className="w-[300px] sm:w-[400px] mt-10 mx-auto"
            src={program}
            alt=""
          />
        </FadingText>
      </section>
    </main>
  );
});

export default Main;
