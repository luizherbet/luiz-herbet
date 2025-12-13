import React from 'react';
import logoImg from '../assets/img/logo.png';
import qrcode from '../assets/img/qrcode.png';

const BusinessCard = () => {
  return (
    <div id="contact" className="bg-gradient-to-b from-slate-600 from-25% via-slate-700 via-50% to-slate-800 to-75% flex flex-col items-center justify-center min-h-screen p-6 md:p-8 py-24 md:py-28">
      {/* Cartão de Visita */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-lg mx-auto border border-gray-200">
        {/* Imagem no Topo */}
        <div className="flex justify-center mb-8">
          <img src={logoImg} alt="Logo" className="w-40 h-40 object-contain rounded-xl" />
        </div>

        {/* Conteúdo do Cartão */}
        <div className="text-center border-b border-gray-200 pb-7 mb-7">
          <p className="text-gray-800 font-bold text-xl mb-2">
            Desenvolvedor Web & Criador de Conteúdo
          </p>
          <p className="text-gray-600 text-sm">
            📍 Atendimento em todo Brasil
          </p>
        </div>

        {/* Verso do Cartão */}
        <div className="text-left mb-7">
          <ul className="list-none space-y-4">
            <li className="flex items-start">
              <span className="text-2xl mr-3 flex-shrink-0">💻</span>
              <div className="flex-1">
                <strong className="text-gray-900 text-base block">Criação de Sites:</strong>
                <p className="text-gray-600 text-sm mt-1">Sites responsivos e personalizados.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 flex-shrink-0">📱</span>
              <div className="flex-1">
                <strong className="text-gray-900 text-base block">Redes Sociais:</strong>
                <p className="text-gray-600 text-sm mt-1">Estratégias para aumentar seu alcance.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 flex-shrink-0">🎨</span>
              <div className="flex-1">
                <strong className="text-gray-900 text-base block">Edição de Imagem, Áudio e Vídeo:</strong>
                <p className="text-gray-600 text-sm mt-1">Conteúdo visual e sonoro de alta qualidade.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contatos */}
        <div className="mt-8 text-center space-y-3 bg-gray-50 rounded-xl p-5">
          <p className="text-gray-700 break-words">
            📞 <strong>Telefone:</strong> <a href="tel:+554599947050" className="text-indigo-600 hover:text-indigo-800">(45) 9994-7050</a>
          </p>
          <p className="text-gray-700 break-words">
            ✉️ <strong>E-mail:</strong> <a href="mailto:luizherbetsouza@gmail.com" className="text-indigo-600 hover:text-indigo-800 break-all">luizherbetsouza@gmail.com</a>
          </p>
          <p className="text-gray-700 break-words">
            🌐 <strong>Site:</strong> <a href="https://www.luizherbet.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 break-all">www.luizherbet.com</a>
          </p>
        </div>

        {/* QR Code ou Ação */}
        <div className="mt-6 flex justify-center">
          <img className="w-32" src={qrcode} alt="QR Code" />
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
