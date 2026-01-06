import React, { memo, useEffect, useState } from "react";
import video from "../assets/img/left.mp4";

const textos = [
  "Você precisa de uma página web para sua empresa ou negócio?",
  "Um site responsivo, adaptado para mobile, tablet e desktop.",
  "Landing pages, catálogos online, newsletters e chatbots.",
  "Aplicações web completas com front-end, back-end e banco de dados.",
  "Conteúdo digital com áudio e vídeo para redes sociais.",
];

const Main = memo(() => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // inicia saída

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % textos.length);
        setVisible(true); // entra novo texto
      }, 300); // tempo da transição
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white rounded-xl min-h-[450px] flex flex-wrap justify-evenly w-sm:justify-center items-center gap-y-6 px-6">
      {/* TEXTO SLIDE */}
      <div>
        <div
          className={`mt-6 w-[350px] h-[250px]
                      text-4xl 
                      font-semibold 
                      leading-snug 
                      transition-all duration-500
                      text-blue-900
                      ${
                        visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
        >
          {textos[index]}
        </div>
        <button
          className="
  bg-blue-900 
  text-white 
  text-[20px] 
  px-5 
  py-3 
  rounded-xl
  hover:bg-black
  transition
"
        >
          Entre em contato!
        </button>
      </div>

      {/* VÍDEO */}
      <div className="w-[350px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto rounded-lg"
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </main>
  );
});

export default Main;
