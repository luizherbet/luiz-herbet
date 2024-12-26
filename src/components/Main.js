import React, { memo } from 'react';
import LeftMain from './LeftMain';
import RightMain from './RightMain';

const Main = memo(() => {
  return (
    <main className="h-auto bg-gradient-to-b from-white from-30% to-slate-300 to-10%...">
      <div className="flex flex-col md:flex-row sm:flex-row gap-4 p-4 mx-auto w-full sm:w-[900px]">
        <section className=" text-black p-4 flex-1 h-auto">
          <LeftMain />
        </section>
        <section className=" p-4 flex-1 h-auto">
          <RightMain />
        </section>
      </div>
    </main>
  );
});

export default Main;
