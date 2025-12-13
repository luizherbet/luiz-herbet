import React, { memo } from 'react';
import LeftMain from './LeftMain';
import RightMain from './RightMain';

const Main = memo(() => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-200 py-16 md:py-24 flex items-center">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 p-6 md:p-8 mx-auto w-full max-w-7xl justify-center items-center">
        <section className="text-black p-4 md:p-6 flex-1 h-auto flex items-center justify-center max-w-2xl w-full mx-auto">
          <div className="w-full">
            <LeftMain />
          </div>
        </section>
        <section className="p-4 md:p-6 flex-1 h-auto flex items-center justify-center max-w-2xl w-full mx-auto">
          <RightMain />
        </section>
      </div>
    </main>
  );
});

export default Main;
