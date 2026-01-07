import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-gray-900 text-white rounded-xl mt-8 w-full py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Informações de Contato */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4 text-indigo-400">Contato</h3>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center justify-center md:justify-start">
                <span className="mr-2">📞</span>
                <a href="tel:+554599947050" className="hover:text-indigo-400 transition-colors">
                  (45) 9994-7050
                </a>
              </p>
              <p className="text-gray-300 flex items-center justify-center md:justify-start">
                <span className="mr-2">✉️</span>
                <a href="mailto:luizherbetsouza@gmail.com" className="hover:text-indigo-400 transition-colors break-all">
                  luizherbetsouza@gmail.com
                </a>
              </p>
              <p className="text-gray-300 flex items-center justify-center md:justify-start">
                <span className="mr-2">🌐</span>
                <a href="https://www.luizherbet.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  www.luizherbet.com
                </a>
              </p>
            </div>
          </div>

          {/* Endereço */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4 text-indigo-400">Localização</h3>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center justify-center md:justify-start">
                <span className="mr-2">📍</span>
                Atendimento em todo Brasil
              </p>
              <p className="text-gray-300 text-sm">
                Serviços online e presenciais disponíveis em todo o território nacional
              </p>
            </div>
          </div>

          {/* Botão de Contato */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 text-indigo-400">Vamos conversar?</h3>
            <a
              href="https://wa.me/554599947050"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Entre em contato!
            </a>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="text-center">
            <p className="text-sm md:text-base font-medium text-gray-300">
              &copy; 2025 Luiz Herbet - Todos os direitos reservados
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Desenvolvido com dedicação e paixão pela tecnologia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
