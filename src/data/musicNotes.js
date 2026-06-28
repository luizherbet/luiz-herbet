export const MUSIC_NOTES = [
  { id: 'do', label: 'Dó', color: '#3B82F6', textColor: '#FFFFFF', frequency: 261.63 },
  { id: 're', label: 'Ré', color: '#FACC15', textColor: '#422006', frequency: 293.66 },
  { id: 'mi', label: 'Mi', color: '#EF4444', textColor: '#FFFFFF', frequency: 329.63 },
  { id: 'fa', label: 'Fá', color: '#22C55E', textColor: '#FFFFFF', frequency: 349.23 },
  { id: 'sol', label: 'Sol', color: '#F472B6', textColor: '#FFFFFF', frequency: 392.0 },
  { id: 'la', label: 'Lá', color: '#A78BFA', textColor: '#FFFFFF', frequency: 440.0 },
  { id: 'si', label: 'Si', color: '#9CA3AF', textColor: '#1F2937', frequency: 493.88 },
];

export const getNoteById = (id) => MUSIC_NOTES.find((note) => note.id === id);
