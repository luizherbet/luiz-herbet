import React, { memo } from 'react';
import Fading from './Fading';
import rightImg from '../assets/img/right-img.png';

const RightMain = memo(() => {
  return (
    <div className="flex items-center justify-center w-full">
      <section className="w-full flex justify-center">
        <Fading time={1600}>
          <div className="relative -mt-8 md:-mt-12">
            <img
              className="w-full max-w-[650px] md:max-w-[700px] h-auto mx-auto rounded-lg"
              src={rightImg}
              alt="Desenvolvimento Web e Design"
            />
          </div>
        </Fading>
      </section>
    </div>
  );
});

export default RightMain;
