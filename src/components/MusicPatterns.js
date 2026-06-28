import React, { memo, useCallback, useEffect, useState } from 'react';
import Fading from './Fading';
import { MUSIC_NOTES, getNoteById } from '../data/musicNotes';
import { useNotePlayer } from '../hooks/useNotePlayer';

const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouch(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isTouch;
};

const NoteSquare = memo(({ note, onTap, selected, draggable }) => (
  <button
    type="button"
    draggable={draggable}
    onDragStart={(event) => {
      event.dataTransfer.setData('text/note-id', note.id);
      event.dataTransfer.effectAllowed = 'copy';
    }}
    onClick={() => onTap(note)}
    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md flex items-center justify-center text-lg sm:text-xl font-semibold transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-stone-400 touch-manipulation ${
      selected ? 'ring-4 ring-stone-900 scale-105' : ''
    }`}
    style={{ backgroundColor: note.color, color: note.textColor }}
    aria-label={`Nota ${note.label}`}
    aria-pressed={selected}
  >
    {note.label}
  </button>
));

const PatternSlot = memo(
  ({
    index,
    noteId,
    active,
    targeted,
    isTouch,
    onSlotTap,
    onDropNote,
    onClear,
  }) => {
    const note = noteId ? getNoteById(noteId) : null;

    return (
      <button
        type="button"
        disabled={!active}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all touch-manipulation disabled:cursor-default ${
          active
            ? targeted
              ? 'border-violet-600 bg-violet-50 ring-4 ring-violet-300 scale-105'
              : note
                ? 'border-amber-400 bg-amber-50/80'
                : 'border-amber-500 bg-amber-50/80'
            : 'border-stone-300 bg-stone-100/60 opacity-60'
        }`}
        onDragOver={(event) => {
          if (!active || isTouch) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(event) => {
          if (!active || isTouch) return;
          event.preventDefault();
          const droppedId = event.dataTransfer.getData('text/note-id');
          if (droppedId) onDropNote(index, droppedId);
        }}
        onClick={() => active && onSlotTap(index)}
        aria-label={
          note
            ? `Posição ${index + 1}: ${note.label}. Toque para remover.`
            : `Posição ${index + 1} vazia. Toque para escolher esta caixa.`
        }
      >
        {note ? (
          <>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow flex items-center justify-center text-lg font-semibold pointer-events-none"
              style={{ backgroundColor: note.color, color: note.textColor }}
            >
              {note.label}
            </div>
            <span
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-800 text-white text-xs leading-6 text-center pointer-events-none"
              aria-hidden="true"
            >
              ×
            </span>
          </>
        ) : (
          <span className="text-xs text-stone-500 text-center px-2 pointer-events-none">
            {active ? (targeted ? 'Agora toque uma nota' : 'Toque aqui') : ''}
          </span>
        )}
      </button>
    );
  }
);

const MusicPatterns = memo(() => {
  const isTouch = useTouchDevice();
  const [patternSize, setPatternSize] = useState(3);
  const [slots, setSlots] = useState([null, null, null]);
  const [targetSlotIndex, setTargetSlotIndex] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playNote, playPatternLoop, stopLoop } = useNotePlayer();

  const activeSlots = slots.slice(0, patternSize);
  const filledCount = activeSlots.filter(Boolean).length;
  const canPlay = filledCount >= patternSize;

  const placeNoteAt = useCallback((index, noteId) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = noteId;
      return next;
    });
    setTargetSlotIndex(null);
    setSelectedNoteId(null);
  }, []);

  const handleNoteTap = useCallback(
    (note) => {
      playNote(note.frequency);
      setSelectedNoteId(note.id);

      if (targetSlotIndex !== null) {
        placeNoteAt(targetSlotIndex, note.id);
        return;
      }

      const firstEmptyIndex = slots.findIndex(
        (slot, index) => index < patternSize && !slot
      );

      if (firstEmptyIndex !== -1) {
        placeNoteAt(firstEmptyIndex, note.id);
        return;
      }

      placeNoteAt(patternSize - 1, note.id);
    },
    [patternSize, placeNoteAt, playNote, slots, targetSlotIndex]
  );

  const handleSlotTap = useCallback(
    (index) => {
      if (slots[index]) {
        setSlots((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
        setTargetSlotIndex(index);
        setSelectedNoteId(null);
        return;
      }

      setTargetSlotIndex(index);
      setSelectedNoteId(null);
    },
    [slots]
  );

  const handleDropNote = useCallback(
    (index, noteId) => {
      placeNoteAt(index, noteId);
    },
    [placeNoteAt]
  );

  const handleClearAll = useCallback(() => {
    stopLoop();
    setIsPlaying(false);
    setSlots([null, null, null]);
    setTargetSlotIndex(null);
    setSelectedNoteId(null);
  }, [stopLoop]);

  const handlePlay = useCallback(async () => {
    if (!canPlay || isPlaying) return;

    const frequencies = activeSlots
      .map((noteId) => getNoteById(noteId)?.frequency)
      .filter(Boolean);

    setIsPlaying(true);
    await playPatternLoop(frequencies);
    setIsPlaying(false);
  }, [activeSlots, canPlay, isPlaying, playPatternLoop]);

  const handleStop = useCallback(() => {
    stopLoop();
    setIsPlaying(false);
  }, [stopLoop]);

  const selectedNote = selectedNoteId ? getNoteById(selectedNoteId) : null;

  return (
    <Fading time={800}>
      <section
        id="bncc-musica"
        className="bg-gradient-to-b from-violet-50 to-amber-50 rounded-xl mt-8 w-full py-12 md:py-16 px-6 md:px-10"
      >
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-700/80 mb-3">
            BNCC · Computação · Educação Infantil
          </p>
          <h2 className="text-4xl md:text-5xl text-stone-900 mb-3">Padrões musicais</h2>
          <p className="text-stone-600 leading-relaxed">
            Monte um padrão de 2 ou 3 notas e ouça a repetição em loop. Ideal para
            treinar sequências, cores e o pensamento computacional com música.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-10">
          <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-violet-100">
            <h3 className="text-lg font-medium text-stone-900 mb-2">1. Escolha o tamanho do padrão</h3>
            <div className="flex flex-wrap gap-3">
              {[2, 3].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    handleStop();
                    setPatternSize(size);
                    setSlots((prev) => prev.map((note, index) => (index < size ? note : null)));
                    setTargetSlotIndex(null);
                    setSelectedNoteId(null);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                    patternSize === size
                      ? 'bg-violet-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {size} notas
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-violet-100">
            <h3 className="text-lg font-medium text-stone-900 mb-2">2. Escolha as notas</h3>
            <p className="text-sm text-stone-500 mb-3">
              {isTouch
                ? 'Toque numa nota para ouvir e preencher a próxima caixa. Toque numa caixa vazia para escolher onde colocar; toque numa caixa cheia para apagar.'
                : 'Toque numa nota para ouvir e preencher a próxima caixa, ou arraste até o player.'}
            </p>

            {(targetSlotIndex !== null || selectedNote) && (
              <p className="text-sm font-medium text-violet-800 bg-violet-100 rounded-xl px-4 py-2 mb-5 text-center">
                {targetSlotIndex !== null && !selectedNote
                  ? `Caixa ${targetSlotIndex + 1} selecionada — agora toque uma nota colorida`
                  : selectedNote
                    ? `Nota ${selectedNote.label} — toque uma caixa do player`
                    : ''}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              {MUSIC_NOTES.map((note) => (
                <NoteSquare
                  key={note.id}
                  note={note}
                  selected={selectedNoteId === note.id}
                  draggable={!isTouch}
                  onTap={handleNoteTap}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-medium text-stone-900">Player de padrões</h3>
                <p className="text-sm text-stone-500 mt-1">
                  Preencha {patternSize} notas para ativar o play
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={isPlaying ? handleStop : handlePlay}
                  disabled={!canPlay && !isPlaying}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors touch-manipulation ${
                    isPlaying
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : canPlay
                        ? 'bg-stone-900 text-amber-50 hover:bg-stone-800'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {isPlaying ? 'Parar' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-3 rounded-full text-sm font-medium border border-stone-300 text-stone-700 hover:border-stone-500 transition-colors touch-manipulation"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {slots.map((noteId, index) => (
                <PatternSlot
                  key={index}
                  index={index}
                  noteId={noteId}
                  active={index < patternSize}
                  targeted={targetSlotIndex === index}
                  isTouch={isTouch}
                  onSlotTap={handleSlotTap}
                  onDropNote={handleDropNote}
                />
              ))}
            </div>

            {canPlay && (
              <p className="text-center text-sm text-emerald-700 mt-6">
                Padrão pronto:{' '}
                {activeSlots.map((id) => getNoteById(id)?.label).join(' → ')} (em loop)
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-violet-900 text-violet-50 p-6 text-sm leading-relaxed">
            <p className="font-medium mb-2">Para professoras e professores</p>
            <p>
              Esta atividade trabalha <strong>padrões de repetição</strong> (sequências que se
              repetem), <strong>causa e efeito</strong> (cada cor/nota produz um som) e
              <strong> resolução de problemas</strong> (montar e testar combinações). Alinham-se à
              BNCC de Computação na Educação Infantil: reconhecer padrões, seguir instruções e
              expressar ideias de forma lúdica.
            </p>
          </div>
        </div>
      </section>
    </Fading>
  );
});

export default MusicPatterns;
