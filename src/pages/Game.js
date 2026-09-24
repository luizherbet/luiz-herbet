import React, { memo } from 'react';

const Game = memo(() => {
  return (
    <main className="fixed inset-0 m-0 p-0 overflow-hidden bg-[#d9e4ec]">
      <iframe
        title="Contração Muscular — Guia Didático"
        src="/game/index.html"
        className="block w-full h-full border-0"
        allow="fullscreen"
      />
    </main>
  );
});

export default Game;
