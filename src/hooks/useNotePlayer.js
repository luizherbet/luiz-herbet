import { useCallback, useEffect, useRef } from 'react';
import { MUSIC_NOTES } from '../data/musicNotes';

const NOTE_DURATION_MS = 900;
const PATTERN_NOTE_DURATION_MS = 340;
const GAP_BETWEEN_NOTES_MS = 18;
const GAP_BETWEEN_LOOPS_MS = 300;

const NOTE_ID_BY_FREQUENCY = Object.fromEntries(
  MUSIC_NOTES.map((note) => [note.frequency, note.id])
);

const SAMPLE_URLS = Object.fromEntries(
  MUSIC_NOTES.map((note) => [note.id, `${process.env.PUBLIC_URL || ''}/media/notes/${note.id}.wav`])
);

const createOutputChain = (context) => {
  const master = context.createGain();
  master.gain.value = 0.95;
  master.connect(context.destination);
  return master;
};

const getNoteIdFromFrequency = (frequency) => NOTE_ID_BY_FREQUENCY[frequency];

export const useNotePlayer = () => {
  const audioContextRef = useRef(null);
  const masterRef = useRef(null);
  const buffersRef = useRef({});
  const loadingRef = useRef(null);
  const playingRef = useRef(false);
  const loopTimeoutRef = useRef(null);
  const activeSourcesRef = useRef([]);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      masterRef.current = createOutputChain(audioContextRef.current);
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const loadSamples = useCallback(async () => {
    if (loadingRef.current) return loadingRef.current;

    loadingRef.current = (async () => {
      const context = getContext();
      const entries = await Promise.all(
        MUSIC_NOTES.map(async (note) => {
          const response = await fetch(SAMPLE_URLS[note.id]);
          if (!response.ok) {
            throw new Error(`Falha ao carregar o som da nota ${note.label}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          return [note.id, audioBuffer];
        })
      );

      buffersRef.current = Object.fromEntries(entries);
    })();

    return loadingRef.current;
  }, [getContext]);

  const playSample = useCallback(
    async (frequency, durationMs = NOTE_DURATION_MS) => {
      await loadSamples();

      const noteId = getNoteIdFromFrequency(frequency);
      const buffer = noteId ? buffersRef.current[noteId] : null;

      if (!buffer) return;

      const context = getContext();
      const source = context.createBufferSource();
      const gain = context.createGain();
      const start = context.currentTime;
      const end = start + durationMs / 1000;

      source.buffer = buffer;

      gain.gain.setValueAtTime(0.98, start);
      gain.gain.setValueAtTime(0.98, Math.max(start, end - 0.08));
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      source.connect(gain);
      gain.connect(masterRef.current);

      activeSourcesRef.current.push(source);

      return new Promise((resolve) => {
        source.onended = () => {
          activeSourcesRef.current = activeSourcesRef.current.filter((item) => item !== source);
          resolve();
        };
        source.start(start);
        source.stop(end);
      });
    },
    [getContext, loadSamples]
  );

  const playNote = useCallback(
    (frequency) => playSample(frequency),
    [playSample]
  );

  const wait = (ms) =>
    new Promise((resolve) => {
      loopTimeoutRef.current = window.setTimeout(resolve, ms);
    });

  const stopLoop = useCallback(() => {
    playingRef.current = false;
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // source may already be stopped
      }
    });
    activeSourcesRef.current = [];

    if (loopTimeoutRef.current) {
      window.clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  }, []);

  const playPatternLoop = useCallback(
    async (frequencies) => {
      stopLoop();
      playingRef.current = true;

      while (playingRef.current) {
        for (const frequency of frequencies) {
          if (!playingRef.current) break;
          await playSample(frequency, PATTERN_NOTE_DURATION_MS);
          if (!playingRef.current) break;
          await wait(GAP_BETWEEN_NOTES_MS);
        }

        if (!playingRef.current) break;
        await wait(GAP_BETWEEN_LOOPS_MS);
      }
    },
    [playSample, stopLoop]
  );

  useEffect(() => {
    loadSamples().catch(() => {
      // samples load on first interaction if prefetch fails
    });

    return () => stopLoop();
  }, [loadSamples, stopLoop]);

  return { playNote, playPatternLoop, stopLoop, isPlayingRef: playingRef };
};
