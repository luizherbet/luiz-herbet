import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/media/notes');
const SAMPLE_RATE = 44100;

const NOTES = [
  { id: 'do', frequency: 261.63 },
  { id: 're', frequency: 293.66 },
  { id: 'mi', frequency: 329.63 },
  { id: 'fa', frequency: 349.23 },
  { id: 'sol', frequency: 392.0 },
  { id: 'la', frequency: 440.0 },
  { id: 'si', frequency: 493.88 },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildKarplusLayer = (frequency, durationSec, damping, brightness) => {
  const period = Math.max(2, Math.round(SAMPLE_RATE / frequency));
  const totalSamples = Math.round(durationSec * SAMPLE_RATE);
  const data = new Float32Array(totalSamples);

  for (let index = 0; index < period; index += 1) {
    const window = Math.sin((Math.PI * index) / period);
    data[index] = (Math.random() * 2 - 1) * window * brightness;
  }

  for (let index = period; index < totalSamples; index += 1) {
    const previous = data[index - period];
    const next = data[index - period + 1] ?? previous;
    data[index] = damping * 0.5 * (previous + next);
  }

  return data;
};

const mixLayers = (layers) => {
  const length = Math.max(...layers.map((layer) => layer.length));
  const mixed = new Float32Array(length);

  layers.forEach((layer) => {
    for (let index = 0; index < layer.length; index += 1) {
      mixed[index] += layer[index];
    }
  });

  return mixed;
};

const applyReverb = (data, decay = 0.34, delayMs = 42) => {
  const delaySamples = Math.round((delayMs / 1000) * SAMPLE_RATE);
  const output = new Float32Array(data.length);

  for (let index = 0; index < data.length; index += 1) {
    const wet =
      (index >= delaySamples ? output[index - delaySamples] * decay : 0) +
      (index >= delaySamples * 2 ? output[index - delaySamples * 2] * decay * 0.55 : 0);
    output[index] = data[index] + wet * 0.42;
  }

  return output;
};

const applyEnvelope = (data, attackMs = 4, releaseMs = 520) => {
  const attackSamples = Math.round((attackMs / 1000) * SAMPLE_RATE);
  const releaseSamples = Math.round((releaseMs / 1000) * SAMPLE_RATE);
  const releaseStart = Math.max(attackSamples, data.length - releaseSamples);

  for (let index = 0; index < data.length; index += 1) {
    let envelope = 1;

    if (index < attackSamples) {
      envelope = index / attackSamples;
    } else if (index >= releaseStart) {
      envelope = 1 - (index - releaseStart) / releaseSamples;
    }

    data[index] *= clamp(envelope, 0, 1);
  }

  return data;
};

const normalize = (data, targetPeak = 0.92) => {
  const peak = data.reduce((max, sample) => Math.max(max, Math.abs(sample)), 0.0001);
  const gain = targetPeak / peak;

  for (let index = 0; index < data.length; index += 1) {
    data[index] *= gain;
  }

  return data;
};

const writeWav = (filePath, data) => {
  const buffer = Buffer.alloc(44 + data.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + data.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(data.length * 2, 40);

  for (let index = 0; index < data.length; index += 1) {
    const sample = clamp(data[index], -1, 1);
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + index * 2);
  }

  fs.writeFileSync(filePath, buffer);
};

const buildNoteSample = (frequency) => {
  const durationSec = 1.35;
  const layers = [
    buildKarplusLayer(frequency, durationSec, 0.9962, 1),
    buildKarplusLayer(frequency * 2.002, durationSec * 0.82, 0.9935, 0.34),
    buildKarplusLayer(frequency * 0.998, durationSec * 1.05, 0.9968, 0.42),
    buildKarplusLayer(frequency * 3.01, durationSec * 0.55, 0.991, 0.16),
  ];

  let sample = mixLayers(layers);
  sample = applyReverb(sample);
  sample = applyEnvelope(sample);
  sample = normalize(sample);

  return sample;
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

NOTES.forEach(({ id, frequency }) => {
  const sample = buildNoteSample(frequency);
  const filePath = path.join(OUTPUT_DIR, `${id}.wav`);
  writeWav(filePath, sample);
  console.log(`generated ${filePath}`);
});
