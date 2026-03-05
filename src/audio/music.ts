import { initAudio, getMusicGain } from './audioEngine';

let musicPlaying = false;
let currentOscillators: OscillatorNode[] = [];
let loopTimer: ReturnType<typeof setTimeout> | null = null;

const BASS_NOTES = [55, 55, 73.4, 65.4, 55, 55, 82.4, 73.4];
const LEAD_NOTES = [220, 330, 440, 330, 262, 330, 392, 330];

export function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  playLoop();
}

export function stopMusic() {
  musicPlaying = false;
  if (loopTimer) clearTimeout(loopTimer);
  currentOscillators.forEach(o => { try { o.stop(); } catch {} });
  currentOscillators = [];
}

function playLoop() {
  if (!musicPlaying) return;
  const ctx = initAudio();
  const musicGain = getMusicGain();
  if (!musicGain) return;

  const bpm = 120;
  const stepDuration = 60 / bpm / 2;
  const totalSteps = BASS_NOTES.length;

  for (let i = 0; i < totalSteps; i++) {
    const startTime = ctx.currentTime + i * stepDuration;

    // Bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.value = BASS_NOTES[i];
    bassGain.gain.setValueAtTime(0.15, startTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, startTime + stepDuration * 0.9);
    bassOsc.connect(bassGain);
    bassGain.connect(musicGain);
    bassOsc.start(startTime);
    bassOsc.stop(startTime + stepDuration);
    currentOscillators.push(bassOsc);

    // Lead (every other step)
    if (i % 2 === 0) {
      const leadOsc = ctx.createOscillator();
      const leadGain = ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.value = LEAD_NOTES[i];
      leadGain.gain.setValueAtTime(0.06, startTime);
      leadGain.gain.exponentialRampToValueAtTime(0.001, startTime + stepDuration * 1.8);
      leadOsc.connect(leadGain);
      leadGain.connect(musicGain);
      leadOsc.start(startTime);
      leadOsc.stop(startTime + stepDuration * 2);
      currentOscillators.push(leadOsc);
    }
  }

  const loopDuration = totalSteps * stepDuration * 1000;
  loopTimer = setTimeout(() => {
    currentOscillators = [];
    playLoop();
  }, loopDuration - 50);
}
