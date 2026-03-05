import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/screens/TitleScreen';
import { DifficultyScreen } from './components/screens/DifficultyScreen';
import { GameScreen } from './components/screens/GameScreen';
import { RoundOverScreen } from './components/screens/RoundOverScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { ParticleCanvas } from './components/effects/ParticleCanvas';
import { Scanlines } from './components/effects/Scanlines';
import { CityBackground } from './components/effects/CityBackground';
import { useAudio } from './hooks/useAudio';
import { initAudio } from './audio/audioEngine';
import { Difficulty, GameMode } from './types/game';
import { useCallback } from 'react';

export default function App() {
  const phase = useGameStore(s => s.phase);
  const winner = useGameStore(s => s.winner);
  const human = useGameStore(s => s.human);
  const ai = useGameStore(s => s.ai);
  const difficulty = useGameStore(s => s.difficulty);
  const mode = useGameStore(s => s.mode);
  const rounds = useGameStore(s => s.rounds);
  const selectMode = useGameStore(s => s.selectMode);
  const startGame = useGameStore(s => s.startGame);
  const goToTitle = useGameStore(s => s.goToTitle);
  const nextRound = useGameStore(s => s.nextRound);

  useAudio(phase === 'playing');

  const handleSelectMode = useCallback((m: GameMode) => {
    selectMode(m);
  }, [selectMode]);

  const handleStart = useCallback((diff: Difficulty) => {
    initAudio();
    startGame(diff);
  }, [startGame]);

  const handleReplay = useCallback(() => {
    startGame(difficulty);
  }, [startGame, difficulty]);

  return (
    <div className="app">
      <CityBackground />
      <Scanlines />
      <ParticleCanvas />

      <div className="app-content">
        {phase === 'title' && (
          <TitleScreen onSelectMode={handleSelectMode} />
        )}

        {phase === 'modeSelect' && (
          <DifficultyScreen
            mode={mode}
            onStart={handleStart}
            onBack={goToTitle}
          />
        )}

        {phase === 'playing' && (
          <GameScreen />
        )}

        {phase === 'roundOver' && winner && (
          <RoundOverScreen
            winner={winner}
            rounds={rounds}
            onNextRound={nextRound}
          />
        )}

        {phase === 'gameOver' && winner && (
          <GameOverScreen
            winner={winner}
            human={human}
            ai={ai}
            difficulty={difficulty}
            mode={mode}
            rounds={rounds}
            onReplay={handleReplay}
            onTitle={goToTitle}
          />
        )}
      </div>
    </div>
  );
}
