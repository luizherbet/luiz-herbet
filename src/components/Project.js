import React, { useState } from 'react';

function Project() {
  const [text, setText] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState('');
  const [newText, setNewText] = useState('');

  // Função para recortar o texto (exibe o recorte no campo de resultado, mas não modifica o texto original)
  const handleCut = () => {
    if (start !== '' && end !== '' && start < end && end <= text.length) {
      setResult(text.slice(start, end)); // Exibe o trecho recortado no campo de resultado
    }
  };

  // Função para substituir o texto no intervalo especificado
  const handleReplace = () => {
    if (
      start !== '' &&
      end !== '' &&
      start < end &&
      end <= text.length &&
      newText !== ''
    ) {
      const newTextFinal = text.slice(0, start) + newText + text.slice(end); // Substitui o trecho do texto original
      setResult(newTextFinal); // Exibe o novo texto no campo de resultado
    }
  };

  // Função para apagar o texto no intervalo especificado
  const handleDelete = () => {
    if (start !== '' && end !== '' && start < end && end <= text.length) {
      const newTextFinal = text.slice(0, start) + text.slice(end); // Apaga o trecho do texto original
      setResult(newTextFinal); // Exibe o texto sem o trecho apagado
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Manipulação de Texto
      </h1>

      {/* Campo de texto original */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Digite seu texto aqui..."
        className="w-full h-32 p-4 rounded-md mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      {/* Campo para o índice de início */}
      <div className="mb-4">
        <label className="text-white font-medium">Início (índice):</label>
        <input
          type="number"
          value={start}
          onChange={e => setStart(e.target.value)}
          className="w-full p-3 rounded-md mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          min="0"
        />
      </div>

      {/* Campo para o índice de fim */}
      <div className="mb-6">
        <label className="text-white font-medium">Fim (índice):</label>
        <input
          type="number"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="w-full p-3 rounded-md mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          min="0"
        />
      </div>

      {/* Campo para inserir o novo texto para substituição */}
      <div className="mb-4">
        <label className="text-white font-medium">
          Novo Texto para Substituição:
        </label>
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Digite o novo texto aqui"
          className="w-full p-3 rounded-md mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Botões de ação */}
      <div className="space-y-4 mb-6">
        <button
          onClick={handleCut}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Recortar
        </button>

        <button
          onClick={handleReplace}
          className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Substituir
        </button>

        <button
          onClick={handleDelete}
          className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Apagar
        </button>
      </div>

      {/* Exibe o resultado da operação */}
      <div className="mb-4">
        <label className="text-white font-medium">Resultado:</label>
        <textarea
          value={result}
          readOnly
          className="w-full h-32 p-4 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );
}

export default Project;
