let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;

let sfxVolume = 0.5;
let musicVolume = 0.3;
let muted = false;

export function initAudio(): AudioContext {
  if (audioCtx) return audioCtx;
  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);

  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = sfxVolume;
  sfxGain.connect(masterGain);

  musicGain = audioCtx.createGain();
  musicGain.gain.value = musicVolume;
  musicGain.connect(masterGain);

  return audioCtx;
}

export function getAudioContext(): AudioContext | null {
  return audioCtx;
}

export function getSfxGain(): GainNode | null {
  return sfxGain;
}

export function getMusicGain(): GainNode | null {
  return musicGain;
}

export function setMuted(m: boolean) {
  muted = m;
  if (masterGain) masterGain.gain.value = m ? 0 : 1;
}

export function isMuted(): boolean {
  return muted;
}

export function setSfxVolume(v: number) {
  sfxVolume = v;
  if (sfxGain) sfxGain.gain.value = v;
}

export function setMusicVolume(v: number) {
  musicVolume = v;
  if (musicGain) musicGain.gain.value = v;
}
