import React, { memo } from 'react';
import fotoAvatar from '../assets/img/Foto-avatar.jpeg';

const WHATSAPP =
  'https://wa.me/554599947050?text=Olá!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20desenvolvimento%20web.';
const EMAIL = 'mailto:luizherbetsouza@gmail.com';

const services = [
  {
    title: 'Sites e landing pages',
    text: 'Páginas rápidas, responsivas e feitas para converter — do site institucional à campanha.',
  },
  {
    title: 'Aplicações web',
    text: 'Front-end e back-end sob medida: painéis, sistemas e produtos digitais que crescem com o negócio.',
  },
  {
    title: 'Integrações e APIs',
    text: 'Conecto ferramentas, pagamentos, automações e dados para o fluxo do seu time funcionar de verdade.',
  },
  {
    title: 'Manutenção e evolução',
    text: 'Melhorias contínuas, performance, SEO técnico e ajustes sem perder o ritmo do projeto.',
  },
];

const stack = [
  'React',
  'JavaScript',
  'Python',
  'Node.js',
  'APIs REST',
  'SQL',
  'HTML & CSS',
  'Tailwind',
];

const Home = memo(() => {
  return (
    <div className="freelancer-page min-h-screen text-[#1c1917]">
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-10 py-6">
        <a href="#inicio" className="text-lg md:text-xl tracking-tight text-white font-medium">
          Luiz Herbet
        </a>
        <nav className="flex items-center gap-6 text-sm text-white/85">
          <a href="#servicos" className="hover:text-white transition-colors hidden sm:inline">
            Serviços
          </a>
          <a href="#contato" className="hover:text-white transition-colors">
            Contato
          </a>
        </nav>
      </header>

      <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-[#0c1f1a]">
        <img
          src="/media/freelancer-hero-bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover freelancer-hero-bg"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0c1f1a]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1f1a]/80 via-[#0c1f1a]/45 to-[#0c1f1a]/20" />

        <div className="relative z-10 min-h-[100svh] flex flex-col justify-end px-6 md:px-10 pb-14 md:pb-20 max-w-5xl pt-28">
          <div className="freelancer-fade freelancer-delay-1 mb-6 h-28 w-28 md:h-40 md:w-40 lg:h-44 lg:w-44 rounded-full overflow-hidden ring-2 ring-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.35)] shrink-0">
            <img
              src={fotoAvatar}
              alt="Luiz Herbet"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <p className="freelancer-fade freelancer-delay-2 mb-4 text-xs md:text-sm uppercase tracking-[0.35em] text-teal-100/90">
            Desenvolvedor freelancer
          </p>
          <h1 className="freelancer-fade freelancer-delay-3 text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] mb-5">
            Luiz Herbet
          </h1>
          <p className="freelancer-fade freelancer-delay-4 max-w-xl text-base md:text-lg text-white/80 leading-relaxed mb-8">
            Eu construo experiências digitais claras e úteis — sites, sistemas e
            automações que ajudam o seu negócio a aparecer e vender melhor.
          </p>
          <div className="freelancer-fade freelancer-delay-5 flex flex-wrap gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#e8f0ec] text-[#0c1f1a] px-6 py-3 text-sm font-medium hover:bg-white transition-colors"
            >
              Pedir um orçamento
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center border border-white/40 text-white px-6 py-3 text-sm font-medium hover:border-white transition-colors"
            >
              Ver serviços
            </a>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-[#e8f0ec] px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0c1f1a]/55 mb-3">
            O que eu faço
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#0c1f1a] mb-4 max-w-2xl">
            Soluções digitais do zero à entrega
          </h2>
          <p className="text-[#1c1917]/70 max-w-2xl mb-14 leading-relaxed">
            Do primeiro rascunho ao ar no ar: desenvolvimento web com foco em
            clareza, performance e resultado de negócio.
          </p>

          <ul className="divide-y divide-[#0c1f1a]/15 border-y border-[#0c1f1a]/15">
            {services.map((service, index) => (
              <li
                key={service.title}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[4rem_1fr_1.2fr] gap-4 md:gap-8 py-8 md:py-10 items-start"
              >
                <span className="text-sm text-[#0c1f1a]/45 pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-[#0c1f1a] tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[#1c1917]/70 leading-relaxed md:pt-2 col-span-2 md:col-span-1 md:col-start-3">
                  {service.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#0c1f1a] text-[#e8f0ec] px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-200/70 mb-3">
            Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">
            Tecnologias que uso no dia a dia
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-lg md:text-xl text-[#e8f0ec]/85">
            {stack.map((item) => (
              <span key={item} className="border-b border-teal-300/30 pb-1">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="relative overflow-hidden bg-[#e7efe9] px-6 md:px-10 py-20 md:py-28">
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0c1f1a]/55 mb-3">
            Contato
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#0c1f1a] mb-5 max-w-2xl">
            Vamos conversar sobre o seu próximo projeto
          </h2>
          <p className="text-[#1c1917]/70 max-w-xl mb-10 leading-relaxed">
            Me conta o que você precisa. Respondo com uma proposta objetiva —
            escopo, prazo e investimento.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#0c1f1a] text-[#e8f0ec] px-7 py-3.5 text-sm font-medium hover:bg-[#16352c] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={EMAIL}
              className="inline-flex items-center justify-center border border-[#0c1f1a]/30 text-[#0c1f1a] px-7 py-3.5 text-sm font-medium hover:border-[#0c1f1a] transition-colors"
            >
              luizherbetsouza@gmail.com
            </a>
            <a
              href="tel:+5545999947050"
              className="inline-flex items-center justify-center text-[#0c1f1a] px-2 py-3.5 text-sm font-medium underline underline-offset-4 decoration-[#0c1f1a]/30 hover:decoration-[#0c1f1a]"
            >
              (45) 99994-7050
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0c1f1a] text-[#e8f0ec]/55 px-6 md:px-10 py-8 text-sm flex flex-col sm:flex-row justify-between gap-3">
        <span>© {new Date().getFullYear()} Luiz Herbet</span>
        <span>Desenvolvimento web · remoto</span>
      </footer>
    </div>
  );
});

export default Home;
