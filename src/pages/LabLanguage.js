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

  // Posts por linguagem
  const posts = {
    fastapi: [
      {
        id: 1,
        title: 'Do dado à funcionalidade: como eu penso?!',
        date: '2026-01-15',
        content: `A primeira vez que alguém me falou sobre a possibilidade de transformar isso em uma espécie de jogo, eu confesso que duvidei. Sempre me pareceu algo distante, e eu mal conseguia enxergar a lógica por trás de tudo aquilo.

Com o tempo, percebi que, quando começo a pensar em uma funcionalidade — ou seja lá como queiram chamar —, gosto sempre de partir dos dados. Normalmente começo por uma tabela, visualizando as informações de forma quase imagética. Pensar dessa maneira exige um pouco mais de esforço no início, mas, aos poucos, tudo começa a ficar mais claro.

Por exemplo, se quero modelar um sistema que possui usuários, começo pensando na entidade Usuário: quais são suas características? O que define esse usuário dentro do sistema?

**Nome**

**E-mail**

**Senha**

No contexto do sistema em que trabalho atualmente, o Oito, que é uma plataforma de agendamento para profissionais independentes, o objetivo principal é reduzir a dor de cabeça que muitas pessoas têm ao agendar, remarcar ou gerenciar compromissos.

Nesse cenário, sei que um usuário pode assumir dois papéis distintos: cliente ou profissional. Portanto, o modelo de dados precisa refletir isso. Assim, começo a pensar em algo como:

**Nome**

**E-mail**

**Senha**

**É profissional (boolean)**

**CEP**

**Endereço**

Nesse ponto, já tenho uma estrutura inicial bem definida e começo a dar forma ao sistema.

Toda tabela precisa de um identificador único para cada instância daquela entidade. Por isso, adiciono um campo id, que geralmente é um número inteiro. A partir daí, defino os tipos de cada coluna:

- **id**: inteiro
- **nome**: string
- **email**: string
- **senha**: string
- **is_professional**: boolean

E assim por diante.

Nesse momento, já tenho uma tabela, com colunas bem definidas e tipos de dados claros.

Pensando no ecossistema do FastAPI (assim como em outros frameworks), o processo segue uma lógica semelhante: começo pela camada de models, que é responsável por representar e, de fato, criar a tabela no banco de dados.

Com o modelo mais ou menos pronto, passo a pensar nas operações que existirão sobre essa tabela, ou seja, como os dados serão manipulados e trocados.

Então, começo a definir as rotas. Sei, por exemplo, que se quero uma rota para obter todos os usuários, ela deve ser um GET e deve retornar uma lista (array) de objetos, onde cada objeto representa uma linha da tabela.

Nesse ponto, a ideia de "jogo" começa a fazer sentido: cada decisão leva naturalmente à próxima, e o sistema vai se construindo passo a passo, de forma lógica e previsível.`,
      },
    ],
  };

  const languagePosts = posts[language] || [];

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
              {languagePosts.length > 0 ? (
                <div className="space-y-12">
                  {languagePosts.map((post) => (
                    <article key={post.id} className="prose prose-lg max-w-none">
                      <h2 className="text-3xl md:text-4xl text-blue-900 mb-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        {new Date(post.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="text-gray-700 leading-relaxed">
                        {(() => {
                          const lines = post.content.split('\n');
                          const result = [];
                          let i = 0;
                          
                          while (i < lines.length) {
                            const line = lines[i];
                            
                            if (line.trim() === '') {
                              result.push(<br key={i} />);
                              i++;
                              continue;
                            }
                            
                            // Detecta início de bloco de código (linha que começa com - ** e tem :)
                            if (line.trim().startsWith('- **') && line.includes(':')) {
                              const codeLines = [];
                              let j = i;
                              
                              // Coleta todas as linhas consecutivas do bloco de código
                              while (j < lines.length && lines[j].trim().startsWith('- **') && lines[j].includes(':')) {
                                const codeLine = lines[j].replace(/^-\s*\*\*|\*\*/g, '').trim();
                                const [key, value] = codeLine.split(':').map(s => s.trim());
                                codeLines.push({ key, value });
                                j++;
                              }
                              
                              // Renderiza o bloco de código
                              result.push(
                                <div key={`code-${i}`} className="flex justify-center my-4">
                                  <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-sm w-auto inline-block border border-gray-200">
                                    <code className="text-gray-800">
                                      {codeLines.map((item, idx) => (
                                        <div key={idx} className="mb-1 last:mb-0 whitespace-nowrap">
                                          <span className="text-blue-600 font-semibold">{item.key}</span>
                                          <span className="text-gray-700">: </span>
                                          <span className="text-purple-600">{item.value}</span>
                                        </div>
                                      ))}
                                    </code>
                                  </pre>
                                </div>
                              );
                              
                              i = j;
                              continue;
                            }
                            
                            if (line.startsWith('**') && line.endsWith('**')) {
                              const text = line.replace(/\*\*/g, '');
                              result.push(
                                <p key={i} className="font-semibold text-gray-900 my-1">
                                  {text}
                                </p>
                              );
                              i++;
                              continue;
                            }
                            
                            result.push(
                              <p key={i} className="mb-4">
                                {line}
                              </p>
                            );
                            i++;
                          }
                          
                          return result;
                        })()}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-4">
                    📚 Conteúdo em desenvolvimento
                  </p>
                  <p className="text-gray-400">
                    As aulas e documentações serão adicionadas em breve.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </Fading>
      <Footer />
    </div>
  );
});

export default LabLanguage;
