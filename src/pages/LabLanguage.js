import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Fading from '../components/Fading';

const LabLanguage = memo(() => {
  const { language } = useParams();
  const navigate = useNavigate();

  const languageNames = {
    javascript: 'JavaScript',
    python: 'Python',
    react: 'React',
    nodejs: 'Node.js',
    django: 'Django',
    fastapi: 'FastAPI',
    vue: 'Vue.js',
  };

  const languageName = languageNames[language] || language;

  return (
    <div className="max-w-[1100px] mx-auto min-h-screen flex flex-col">
      <Header />
      <Fading time={500}>
        <main className="flex-grow px-6 py-12">
          <div className="bg-white rounded-xl p-8 md:p-12">
            <button
              onClick={() => navigate('/')}
              className="mb-6 text-blue-900 hover:text-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">←</span>
              Voltar ao Laboratório
            </button>
            
            <h1 className="text-4xl md:text-5xl text-blue-900 mb-4">
              {languageName}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Documentação e aprendizados sobre {languageName}
            </p>

            <div className="border-t border-gray-200 pt-8">
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">
                  📚 Conteúdo em desenvolvimento
                </p>
                <p className="text-gray-400">
                  As aulas e documentações serão adicionadas em breve.
                </p>
              </div>
            </div>
          </div>
        </main>
      </Fading>
      <Footer />
    </div>
  );
});

export default LabLanguage;
