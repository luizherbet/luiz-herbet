import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-white text-gray-900 rounded-t-xl mt-8 w-full py-6">
      <div className="mx-auto max-w-7xl px-6 w-full">
        {/* Seção Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-3">
          {/* Informações de Contato */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-5 text-blue-900">Contato</h3>
            <div className="space-y-4">
              <a 
                href="tel:+554598511412" 
                className="text-gray-700 hover:text-blue-900 transition-colors flex items-center justify-center md:justify-start group"
              >
                <span className="mr-3 text-lg">📞</span>
                <span className="group-hover:underline">(45) 9851-1412</span>
              </a>
              <a 
                href="mailto:luizherbetsouza@gmail.com" 
                className="text-gray-700 hover:text-blue-900 transition-colors flex items-center justify-center md:justify-start group break-all"
              >
                <span className="mr-3 text-lg">✉️</span>
                <span className="group-hover:underline">luizherbetsouza@gmail.com</span>
              </a>
              <a 
                href="https://www.luizherbet.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-blue-900 transition-colors flex items-center justify-center md:justify-start group"
              >
                <span className="mr-3 text-lg">🌐</span>
                <span className="group-hover:underline">www.luizherbet.com.br</span>
              </a>
            </div>
          </div>

          {/* Localização */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-5 text-blue-900">Atendimento</h3>
            <div className="space-y-3">
              <p className="text-gray-700 flex items-center justify-center md:justify-start">
                <span className="mr-3 text-xl">📍</span>
                <span className="font-medium">Atendimento em todo Brasil</span>
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Serviços online disponíveis em todo o território nacional
              </p>
            </div>
          </div>

          {/* Botão de Contato */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-5 text-blue-900">Vamos conversar?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Entre em contato e descubra como podemos ajudar seu negócio
            </p>
            <a
              href="https://wa.me/554598511412?text=Olá!%20Gostaria%20de%20conversar%20sobre%20como%20vocês%20podem%20ajudar%20meu%20negócio%20a%20crescer%20digitalmente."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-95 inline-block text-center w-full md:w-auto"
            >
              Entre em contato!
            </a>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-300 pt-6">
          <div className="text-center">
            <p className="text-sm md:text-base font-medium text-gray-800 ">
              &copy; 2026 Luiz Herbet - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
