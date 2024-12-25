import React, { useState, useEffect } from 'react';

const FadingText = ({ children, time = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), time);
    return () => clearTimeout(timer);
  }, [time]);

  return (
    <div
      className={`text-center transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default FadingText;
