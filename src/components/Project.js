import React, { useState } from 'react';

const Project = () => {
  const [text, setText] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [newText, setNewText] = useState('');
  const [result, setResult] = useState('');

  // Função para substituir o texto
  const handleReplace = () => {
    if (start >= 0 && end <= text.length && newText !== '') {
      const updatedText = text.slice(0, start) + newText + text.slice(end);
      setText(updatedText);
      setResult(updatedText);
    } else {
      alert('Índices inválidos ou novo texto não fornecido');
    }
  };

  // Função para recortar o texto
  const handleCut = () => {
    if (start >= 0 && end <= text.length) {
      setResult(text.slice(start, end));
      setText(text.slice(0, start) + text.slice(end)); // Remove o trecho recortado
    } else {
      alert('Índices inválidos');
    }
  };

  // Função para apagar o texto
  const handleDelete = () => {
    if (start >= 0 && end <= text.length) {
      const updatedText = text.slice(0, start) + text.slice(end);
      setText(updatedText);
      setResult(updatedText);
    } else {
      alert('Índices inválidos');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Manipulação de Texto
      </h1>

      <div className="mb-4">
        <textarea
          placeholder="Digite seu texto aqui"
          value={text}
          onChange={e => setText(e.target.value)}
          rows="6"
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Índice inicial"
          value={start}
          onChange={e => setStart(e.target.value)}
          className="w-full md:w-1/2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Índice final"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="w-full md:w-1/2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Novo texto"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-x-4 mb-4 text-center">
        <button
          onClick={handleReplace}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
        >
          Substituir
        </button>
        <button
          onClick={handleCut}
          className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
        >
          Recortar
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        >
          Apagar
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-600">Resultado:</h3>
        <textarea
          value={result}
          readOnly
          rows="6"
          className="w-full p-3 border-2 border-gray-300 rounded-md bg-gray-100 text-gray-700"
        />
      </div>
    </div>
  );
};

export default Project;
