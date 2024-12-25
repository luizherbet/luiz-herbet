import React from 'react';
import logoImg from '../assets/img/logo.png';
import qrcode from '../assets/img/qrcode.png';

const BusinessCard = () => {
  return (
    <div className=" bg-gradient-to-b from-amber-200 from-30% to-blue-200 to-10%... flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Cartão de Visita */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {/* Imagem no Topo */}
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt="Logo" className="w-32 h-32 object-contain" />
        </div>

        {/* Conteúdo do Cartão */}
        <div className="text-center border-b pb-6 mb-4">
          <p className="text-gray-500">
            Desenvolvedor Web & Criador de Conteúdo
          </p>
          <p className="text-gray-600 mt-2">
            📍 Atendimento Online e Presencial
          </p>
        </div>

        {/* Verso do Cartão */}
        <div className="text-left">
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>💻 Criação de Sites:</strong> Sites responsivos e
              personalizados.
            </li>
            <li>
              <strong>📱 Redes Sociais:</strong> Estratégias para aumentar seu
              alcance.
            </li>
            <li>
              <strong>🎨 Edição de Imagem, Áudio e Vídeo:</strong> Conteúdo
              visual e sonoro de alta qualidade.
            </li>
          </ul>
        </div>

        {/* Contatos */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            📞 <strong>Telefone:</strong> (45) 9994-7050
          </p>
          <p className="text-gray-600">
            ✉️ <strong>E-mail:</strong> luizherbetsouza@gmail.com
          </p>
          <p className="text-gray-600">
            🌐 <strong>Site:</strong> www.luizherbet.com
          </p>
        </div>

        {/* QR Code ou Ação */}
        <div className="mt-4 flex justify-center">
          <img className="w-32" src={qrcode} alt="" />
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
