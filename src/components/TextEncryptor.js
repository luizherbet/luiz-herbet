import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const TextEncryptor = () => {
  const [text, setText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [decryptionTime, setDecryptionTime] = useState(null);
  const password = 'minha-senha-secreta'; // Pode usar um estado para senha dinâmica

  const handleEncrypt = () => {
    const encrypted = CryptoJS.AES.encrypt(text, password).toString();
    setEncryptedText(encrypted);
    setText('');
    setIsEncrypted(true);
  };

  const handleDecrypt = () => {
    const start = performance.now();
    const bytes = CryptoJS.AES.decrypt(encryptedText, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const end = performance.now();
    setText(decrypted);
    setDecryptionTime((end - start).toFixed(2)); // Tempo em milissegundos
    setIsEncrypted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-100 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        Criptografar e Descriptografar meu Nome
      </h2>

      {/* Campo de texto */}
      {!isEncrypted && (
        <input
          type="text"
          placeholder="Digite algo aqui"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full p-4 rounded-md bg-white text-gray-800 border border-gray-300 mb-4"
        />
      )}

      {/* Exibir texto criptografado */}
      {isEncrypted && (
        <div className="p-4 bg-gray-200 rounded-md text-left text-sm overflow-x-auto">
          <strong>Texto Criptografado:</strong>
          <p className="break-all">{encryptedText}</p>
        </div>
      )}

      {/* Botão de criptografar/descriptografar */}
      <button
        onClick={isEncrypted ? handleDecrypt : handleEncrypt}
        className="mt-4 py-2 px-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
      >
        {isEncrypted ? 'Descriptografar' : 'Criptografar'}
      </button>

      {/* Tempo de descriptografia */}
      {decryptionTime && (
        <p className="mt-4 text-sm text-gray-600">
          Tempo de descriptografia: {decryptionTime} ms
        </p>
      )}
    </div>
  );
};

export default TextEncryptor;
