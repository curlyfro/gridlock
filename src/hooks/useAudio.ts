import { useCallback, useEffect, useRef } from 'react';
import { initAudio, setMuted, isMuted } from '../audio/audioEngine';
import { startMusic, stopMusic } from '../audio/music';

export function useAudio(shouldPlayMusic: boolean) {
  const initialized = useRef(false);

  const init = useCallback(() => {
    if (!initialized.current) {
      initAudio();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (shouldPlayMusic && initialized.current) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => stopMusic();
  }, [shouldPlayMusic]);

  const toggleMute = useCallback(() => {
    init();
    setMuted(!isMuted());
  }, [init]);

  return { init, toggleMute, isMuted: isMuted() };
}
