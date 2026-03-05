import { initAudio, getSfxGain } from './audioEngine';

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.3) {
  const ctx = initAudio();
  const sfx = getSfxGain();
  if (!sfx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(sfx);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function sfxPlace() {
  playTone(440, 0.08, 'square', 0.2);
  playTone(660, 0.06, 'square', 0.15);
}

export function sfxClear() {
  playTone(523, 0.1, 'square', 0.25);
  setTimeout(() => playTone(659, 0.1, 'square', 0.25), 50);
  setTimeout(() => playTone(784, 0.15, 'square', 0.3), 100);
}

export function sfxMultiClear() {
  playTone(523, 0.1, 'sawtooth', 0.3);
  setTimeout(() => playTone(659, 0.1, 'sawtooth', 0.3), 60);
  setTimeout(() => playTone(784, 0.12, 'sawtooth', 0.3), 120);
  setTimeout(() => playTone(1047, 0.2, 'sawtooth', 0.35), 180);
}

export function sfxInvalid() {
  playTone(200, 0.15, 'sawtooth', 0.2);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.2), 80);
}

export function sfxSnap() {
  playTone(880, 0.03, 'sine', 0.1);
}

export function sfxJunkWarning() {
  playTone(220, 0.2, 'sawtooth', 0.3);
  setTimeout(() => playTone(220, 0.2, 'sawtooth', 0.3), 250);
}

export function sfxPowerUp() {
  playTone(440, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(880, 0.1, 'sine', 0.3), 80);
  setTimeout(() => playTone(1320, 0.15, 'sine', 0.35), 160);
}

export function sfxGameOver() {
  playTone(440, 0.3, 'sawtooth', 0.3);
  setTimeout(() => playTone(330, 0.3, 'sawtooth', 0.3), 200);
  setTimeout(() => playTone(220, 0.5, 'sawtooth', 0.35), 400);
}

export function sfxOnFire() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playTone(440 + i * 110, 0.08, 'square', 0.2), i * 40);
  }
}
