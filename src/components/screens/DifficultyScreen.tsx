import { Difficulty, GameMode } from '../../types/game';
import { Button } from '../ui/Button';

interface DifficultyScreenProps {
  mode: GameMode;
  onStart: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  gridlock: 'GRIDLOCK',
  scoreRace: 'SCORE RACE',
  timed: 'TIMED',
  bestOf3: 'BEST OF 3',
};

export function DifficultyScreen({ mode, onStart, onBack }: DifficultyScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-logo">
        <h1 className="title-text" style={{ fontSize: 'clamp(24px, 5vw, 48px)' }}>
          {MODE_LABELS[mode]}
        </h1>
      </div>

      <div className="title-menu">
        <div className="mode-select-label">SELECT DIFFICULTY</div>
        <Button onClick={() => onStart('easy')} variant="secondary" size="lg">
          EASY
        </Button>
        <Button onClick={() => onStart('medium')} variant="primary" size="lg">
          MEDIUM
        </Button>
        <Button onClick={() => onStart('hard')} variant="danger" size="lg">
          HARD
        </Button>
      </div>

      <Button onClick={onBack} variant="secondary" size="sm">
        BACK
      </Button>
    </div>
  );
}
