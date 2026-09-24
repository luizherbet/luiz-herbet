import { useEffect } from 'react';

/**
 * Em produção (Vercel) /game já serve o HTML estático.
 * No CRA local, o Router captura /game — redirecionamos para o arquivo estático.
 */
const Game = () => {
  useEffect(() => {
    window.location.replace('/game/index.html');
  }, []);

  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-[#d9e4ec] text-[#1c2a33] px-6 text-center">
      <p>
        Abrindo o guia…
        <br />
        <a href="/game/index.html" className="underline underline-offset-4 mt-3 inline-block">
          Abrir Contração Muscular
        </a>
      </p>
    </main>
  );
};

export default Game;
