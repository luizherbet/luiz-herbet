import { useEffect } from 'react';

const CANVA_SLIDE_URL =
  'https://www.canva.com/design/DAHVjjF_c2c/3i2pdLOY2NpBCEpHcFdtbw/edit';

const SlideRedirect = () => {
  useEffect(() => {
    window.location.replace(CANVA_SLIDE_URL);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center bg-[#0c1f1a] text-[#e8f0ec]">
      <p>
        Redirecionando para o slide…
        <br />
        <a href={CANVA_SLIDE_URL} className="underline underline-offset-4 mt-3 inline-block">
          Abrir no Canva
        </a>
      </p>
    </main>
  );
};

export default SlideRedirect;
