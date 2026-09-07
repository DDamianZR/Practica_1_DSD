import * as Tone from 'tone';

let initialized = false;
let clockSynth: Tone.MembraneSynth | null = null;
let bitSynth: Tone.Synth | null = null;
let resetSynth: Tone.NoiseSynth | null = null;

async function ensureInit() {
  if (initialized) return;
  await Tone.start();
  clockSynth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 6,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
    volume: -18,
  }).toDestination();

  bitSynth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.05 },
    volume: -22,
  }).toDestination();

  resetSynth = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 },
    volume: -20,
  }).toDestination();

  initialized = true;
}

export async function playClockTick() {
  await ensureInit();
  clockSynth?.triggerAttackRelease('C2', '32n');
}

export async function playBitEnter() {
  await ensureInit();
  bitSynth?.triggerAttackRelease('E5', '64n');
}

export async function playReset() {
  await ensureInit();
  resetSynth?.triggerAttackRelease('8n');
}
