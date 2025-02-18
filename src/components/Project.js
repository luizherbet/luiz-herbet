import React, { useState } from 'react';

function Project() {
  const [text, setText] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [result, setResult] = useState('');
  const [newText, setNewText] = useState('');

  // Função para recortar o texto (exibe o recorte no campo de resultado, mas não modifica o texto original)
  const handleCut = () => {
    if (start < 0 || start >= text.length) return; // Verifica se o índice inicial é válido
    const finalIndex = end ? end + 1 : text.length; // Se o final não for informado, usa o resto do texto
    setResult(text.slice(start, finalIndex)); // Exibe o recorte no resultado
  };

  // Função para substituir o texto no intervalo especificado
  const handleReplace = () => {
    if (start < 0 || start >= text.length) return; // Verifica se o índice inicial é válido
    const finalIndex = end ? end + 1 : text.length; // Se o final não for informado, usa o resto do texto
    const updatedText = text.slice(0, start) + newText + text.slice(finalIndex); // Substitui o texto
    setResult(updatedText); // Exibe o novo texto no resultado
  };

  // Função para apagar o texto no intervalo especificado
  const handleDelete = () => {
    if (start < 0 || start >= text.length) return; // Verifica se o índice inicial é válido
    const finalIndex = end ? end + 1 : text.length; // Se o final não for informado, usa o resto do texto
    const updatedText = text.slice(0, start) + text.slice(finalIndex); // Remove o intervalo
    setResult(updatedText); // Exibe o texto com a exclusão no resultado
  };

  return (
    <div className="max-w-4xl mx-auto bg-yellow-100 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        APRENDO COM A PALAVRA
      </h1>

      <div className="mb-4">
        <label
          htmlFor="textInput"
          className="block text-lg font-medium text-gray-700"
        >
          Digite o texto:
        </label>
        <textarea
          id="textInput"
          value={text}
          onChange={e => setText(e.target.value)}
          rows="4"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="start"
            className="block text-lg font-medium text-gray-700"
          >
            Índice Início:
          </label>
          <input
            type="number"
            id="start"
            value={start}
            onChange={e => setStart(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label
            htmlFor="end"
            className="block text-lg font-medium text-gray-700"
          >
            Índice Fim:
          </label>
          <input
            type="number"
            id="end"
            value={end}
            onChange={e => setEnd(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="newText"
          className="block text-lg font-medium text-gray-700"
        >
          Novo Texto (para Substituir):
        </label>
        <input
          type="text"
          id="newText"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={handleCut}
          className="w-full sm:w-auto py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Recortar
        </button>

        <button
          onClick={handleReplace}
          className="w-full sm:w-auto py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Substituir
        </button>

        <button
          onClick={handleDelete}
          className="w-full sm:w-auto py-3 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Apagar
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="result"
          className="block text-lg font-medium text-gray-700"
        >
          Resultado:
        </label>
        <textarea
          id="result"
          value={result}
          readOnly
          rows="4"
          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>
  );
}

export default Project;
