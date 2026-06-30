import React, { memo, useCallback, useMemo, useState } from 'react';
import Fading from './Fading';
import { useTouchDevice } from '../hooks/useTouchDevice';
import {
  ROUTINE_CARDS,
  getRoutineCardById,
  shuffleIds,
} from '../data/routineCards';

const ALL_CARD_IDS = ROUTINE_CARDS.map((card) => card.id);

const RoutineCardFace = memo(({ card, compact = false }) => (
  <div className="flex flex-col items-center gap-2 pointer-events-none">
    <div
      className={`${compact ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-xl overflow-hidden shadow-sm`}
      style={{ backgroundColor: card.tint }}
    >
      <img src={card.image} alt="" className="w-full h-full object-cover" />
    </div>
    <span
      className={`text-center font-medium text-stone-800 leading-tight ${
        compact ? 'text-[11px] sm:text-xs max-w-[88px]' : 'text-xs sm:text-sm max-w-[104px]'
      }`}
    >
      {card.title}
    </span>
  </div>
));

const PoolCard = memo(({ card, isTouch, onTap }) => (
  <button
    type="button"
    draggable={!isTouch}
    onDragStart={(event) => {
      event.dataTransfer.setData('text/routine-card-id', card.id);
      event.dataTransfer.effectAllowed = 'copy';
    }}
    onClick={() => onTap(card.id)}
    className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm hover:shadow-md hover:border-sky-300 transition-all touch-manipulation active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
    aria-label={`Adicionar ${card.title} à rotina`}
  >
    <RoutineCardFace card={card} />
  </button>
));

const RoutineStep = memo(
  ({
    card,
    index,
    total,
    selected,
    isTouch,
    onSelect,
    onRemove,
    onMoveLeft,
    onMoveRight,
    onDropBefore,
  }) => (
    <div className="flex flex-col gap-2">
      {!isTouch && (
        <div
          className="h-2 rounded-full border border-dashed border-transparent hover:border-sky-300 transition-colors"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(event) => {
            event.preventDefault();
            const cardId = event.dataTransfer.getData('text/routine-card-id');
            if (cardId) onDropBefore(index, cardId);
          }}
          aria-hidden="true"
        />
      )}

      <div
        className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
          selected
            ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200'
            : 'border-stone-200 bg-white shadow-sm'
        }`}
      >
        <span className="w-7 h-7 rounded-full bg-stone-900 text-amber-50 text-sm font-semibold flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        <button
          type="button"
          draggable={!isTouch}
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.setData('text/routine-card-id', card.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
          onClick={() => onSelect(index)}
          className="flex-1 flex items-center gap-3 text-left touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-xl"
          aria-label={`Passo ${index + 1}: ${card.title}. Toque para selecionar.`}
          aria-pressed={selected}
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0"
            style={{ backgroundColor: card.tint }}
          >
            <img src={card.image} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-stone-800 text-sm sm:text-base">{card.title}</span>
        </button>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMoveLeft(index)}
            disabled={index === 0}
            className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 disabled:opacity-30 touch-manipulation"
            aria-label={`Mover ${card.title} para cima`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMoveRight(index)}
            disabled={index === total - 1}
            className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 disabled:opacity-30 touch-manipulation"
            aria-label={`Mover ${card.title} para baixo`}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-8 h-8 rounded-lg bg-stone-800 text-white text-sm touch-manipulation"
            aria-label={`Remover ${card.title} da rotina`}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
);

const FinishedRoutinePanel = memo(({ cards, onEdit, onReset }) => (
  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-emerald-200">
    <div className="text-center mb-6">
      <p className="text-xs uppercase tracking-[0.25em] text-emerald-700/80 mb-2">
        Rotina finalizada
      </p>
      <h3 className="text-2xl md:text-3xl text-stone-900">Meu algoritmo da manhã</h3>
      <p className="text-sm text-stone-500 mt-2">
        Esta é a sequência de passos escolhida pelo aluno.
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="relative rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3"
        >
          <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center shadow">
            {index + 1}
          </span>
          <RoutineCardFace card={card} compact />
        </div>
      ))}
    </div>

    <p className="text-center text-sm text-emerald-800 bg-emerald-100 rounded-xl px-4 py-3 mt-6">
      Algoritmo com {cards.length} {cards.length === 1 ? 'passo' : 'passos'}:
      {' '}
      {cards.map((card) => card.title).join(' → ')}
    </p>

    <div className="flex flex-wrap justify-center gap-3 mt-6">
      <button
        type="button"
        onClick={onEdit}
        className="px-5 py-2.5 rounded-full text-sm font-medium bg-stone-900 text-amber-50 hover:bg-stone-800 transition-colors touch-manipulation"
      >
        Editar rotina
      </button>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 rounded-full text-sm font-medium border border-stone-300 text-stone-700 hover:border-stone-500 transition-colors touch-manipulation"
      >
        Fazer outra rotina
      </button>
    </div>
  </div>
));

const RoutineAlgorithm = memo(() => {
  const isTouch = useTouchDevice();
  const [availableIds, setAvailableIds] = useState(() => shuffleIds(ALL_CARD_IDS));
  const [routineIds, setRoutineIds] = useState([]);
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const routineCards = useMemo(
    () => routineIds.map((id) => getRoutineCardById(id)).filter(Boolean),
    [routineIds]
  );

  const resetActivity = useCallback(() => {
    setAvailableIds(shuffleIds(ALL_CARD_IDS));
    setRoutineIds([]);
    setSelectedRoutineIndex(null);
    setIsFinished(false);
  }, []);

  const addCardToRoutine = useCallback((cardId, insertIndex) => {
    setAvailableIds((prev) => prev.filter((id) => id !== cardId));
    setRoutineIds((prev) => {
      if (prev.includes(cardId)) return prev;

      const target = insertIndex === undefined ? prev.length : insertIndex;
      const next = [...prev];
      next.splice(target, 0, cardId);
      return next;
    });
    setSelectedRoutineIndex(null);
    setIsFinished(false);
  }, []);

  const handlePoolTap = useCallback(
    (cardId) => {
      if (selectedRoutineIndex !== null) {
        addCardToRoutine(cardId, selectedRoutineIndex + 1);
        return;
      }
      addCardToRoutine(cardId);
    },
    [addCardToRoutine, selectedRoutineIndex]
  );

  const handleRemove = useCallback((index) => {
    setRoutineIds((prev) => {
      const removedId = prev[index];
      const nextRoutine = prev.filter((_, itemIndex) => itemIndex !== index);

      if (removedId) {
        setAvailableIds((pool) =>
          shuffleIds(
            [...new Set([...pool, removedId])].filter((cardId) => !nextRoutine.includes(cardId))
          )
        );
      }

      return nextRoutine;
    });
    setSelectedRoutineIndex(null);
    setIsFinished(false);
  }, []);

  const moveRoutineItem = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setRoutineIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setSelectedRoutineIndex(toIndex);
    setIsFinished(false);
  }, []);

  const handleSelectRoutine = useCallback((index) => {
    setSelectedRoutineIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleMoveLeft = useCallback(
    (index) => moveRoutineItem(index, index - 1),
    [moveRoutineItem]
  );

  const handleMoveRight = useCallback(
    (index) => moveRoutineItem(index, index + 1),
    [moveRoutineItem]
  );

  const handleDropBefore = useCallback(
    (insertIndex, cardId) => {
      if (routineIds.includes(cardId)) {
        const fromIndex = routineIds.indexOf(cardId);
        const targetIndex = fromIndex < insertIndex ? insertIndex - 1 : insertIndex;
        moveRoutineItem(fromIndex, targetIndex);
        return;
      }

      if (availableIds.includes(cardId)) {
        addCardToRoutine(cardId, insertIndex);
      }
    },
    [addCardToRoutine, availableIds, moveRoutineItem, routineIds]
  );

  const handleRoutineAreaDrop = useCallback(
    (event) => {
      if (isTouch) return;
      event.preventDefault();
      const cardId = event.dataTransfer.getData('text/routine-card-id');
      if (!cardId) return;
      handleDropBefore(routineIds.length, cardId);
    },
    [handleDropBefore, isTouch, routineIds.length]
  );

  const handleFinish = useCallback(() => {
    if (routineIds.length === 0) return;
    setSelectedRoutineIndex(null);
    setIsFinished(true);
  }, [routineIds.length]);

  return (
    <Fading time={800}>
      <section
        id="bncc-rotina"
        className="bg-gradient-to-b from-sky-50 to-emerald-50 rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-700/80 mb-3">
            BNCC · Computação · Algoritmos
          </p>
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Minha rotina da manhã</h2>
          <p className="text-stone-600 leading-relaxed">
            Organize os cartões do momento em que acorda até chegar na escola. Cada pessoa tem uma
            rotina diferente — monte a sua em ordem.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-sky-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-medium text-stone-900">1. Sua sequência</h3>
                <p className="text-sm text-stone-500 mt-1">
                  {isTouch
                    ? 'Toque nos cartões abaixo para adicionar. Use as setas para mudar a ordem.'
                    : 'Arraste os cartões para cá ou toque para adicionar. Reorganize como quiser.'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetActivity}
                className="px-5 py-2.5 rounded-full text-sm font-medium border border-stone-300 text-stone-700 hover:border-stone-500 transition-colors touch-manipulation shrink-0"
              >
                Recomeçar
              </button>
            </div>

            {selectedRoutineIndex !== null && (
              <p className="text-sm font-medium text-sky-800 bg-sky-100 rounded-xl px-4 py-2 mb-4 text-center">
                Passo {selectedRoutineIndex + 1} selecionado — use as setas ou toque outro cartão
                para inserir depois dele
              </p>
            )}

            <div
              className={`min-h-[180px] rounded-2xl border-2 border-dashed p-4 transition-colors ${
                routineIds.length > 0
                  ? 'border-sky-300 bg-sky-50/40'
                  : 'border-stone-300 bg-stone-50/80'
              }`}
              onDragOver={(event) => {
                if (isTouch) return;
                event.preventDefault();
              }}
              onDrop={handleRoutineAreaDrop}
            >
              {routineIds.length === 0 ? (
                <p className="text-center text-stone-500 text-sm py-10">
                  {isTouch
                    ? 'Nenhum passo ainda. Toque nos cartões coloridos para começar sua rotina.'
                    : 'Nenhum passo ainda. Arraste ou toque nos cartões para montar sua rotina.'}
                </p>
              ) : (
                <div className="space-y-1">
                  {routineCards.map((card, index) => (
                    <RoutineStep
                      key={`${card.id}-${index}`}
                      card={card}
                      index={index}
                      total={routineIds.length}
                      selected={selectedRoutineIndex === index}
                      isTouch={isTouch}
                      onSelect={handleSelectRoutine}
                      onRemove={handleRemove}
                      onMoveLeft={handleMoveLeft}
                      onMoveRight={handleMoveRight}
                      onDropBefore={handleDropBefore}
                    />
                  ))}
                </div>
              )}
            </div>

            {routineIds.length > 0 && (
              <div className="flex flex-col items-center gap-4 mt-5">
                <p className="text-center text-sm text-emerald-700">
                  Sua rotina tem {routineIds.length}{' '}
                  {routineIds.length === 1 ? 'passo' : 'passos'} — não existe ordem certa para todos!
                </p>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-3 rounded-full text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors touch-manipulation"
                >
                  Finalizar rotina
                </button>
              </div>
            )}
          </div>

          {isFinished && routineCards.length > 0 && (
            <FinishedRoutinePanel
              cards={routineCards}
              onEdit={() => setIsFinished(false)}
              onReset={resetActivity}
            />
          )}

          <div className="bg-white/90 rounded-2xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-lg font-medium text-stone-900 mb-2">2. Cartões disponíveis</h3>
            <p className="text-sm text-stone-500 mb-5">
              Escolha só o que faz parte da sua manhã. Pode deixar cartões de fora.
            </p>
            {availableIds.length === 0 ? (
              <p className="text-center text-stone-500 text-sm py-6">
                Todos os cartões já estão na sua rotina.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableIds.map((cardId) => {
                  const card = getRoutineCardById(cardId);
                  if (!card) return null;
                  return (
                    <PoolCard
                      key={cardId}
                      card={card}
                      isTouch={isTouch}
                      onTap={handlePoolTap}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-sky-900 text-sky-50 p-6 text-sm leading-relaxed">
            <p className="font-medium mb-2">Para professoras e professores</p>
            <p>
              Esta atividade introduz <strong>algoritmos como sequência ordenada de passos</strong>.
              A criança decide quais ações entram na rotina e em que ordem — reforçando que há
              várias soluções válidas. Trabalha também <strong>decomposição</strong> (dividir a
              manhã em etapas) e <strong>raciocínio lógico</strong>, competências da BNCC de
              Computação na Educação Infantil.
            </p>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default RoutineAlgorithm;
