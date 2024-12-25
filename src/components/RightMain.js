import React, { memo } from 'react';
import Fading from './Fading';
import program from '../assets/img/program.svg';

const RightMain = memo(() => {
  return (
    <div>
      <section>
        <Fading time={1600}>
          <img
            className="w-[300px] sm:w-[400px] my-auto mx-auto"
            src={program}
            alt=""
          />
        </Fading>
      </section>
    </div>
  );
});

export default RightMain;
