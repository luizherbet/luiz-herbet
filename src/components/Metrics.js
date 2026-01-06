import React, { memo } from 'react';

const Metrics = memo(() => {
  const items = [
    {
      label: 'Projetos entregues',
      value: '100+',
    },
    {
      label: 'Clientes atendidos',
      value: '50+',
    },
    {
      label: 'Anos de experiência',
      value: '5+',
    },
  ];

  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-3xl md:text-4xl font-bold text-slate-900">
              {item.value}
            </span>
            <span className="mt-2 text-sm md:text-base text-slate-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
});

export default Metrics;
