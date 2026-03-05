import { RoundState } from '../../types/game';
import { Button } from '../ui/Button';

interface RoundOverScreenProps {
  winner: 'human' | 'ai';
  rounds: RoundState;
  onNextRound: () => void;
}

export function RoundOverScreen({ winner, rounds, onNextRound }: RoundOverScreenProps) {
  const won = winner === 'human';

  return (
    <div className="game-over-screen">
      <h1 className={`game-over-title ${won ? 'win' : 'lose'}`} style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>
        {won ? 'ROUND WON!' : 'ROUND LOST'}
      </h1>

      <div className="round-tracker">
        <div className="round-label">ROUND {rounds.currentRound} OF {rounds.totalRounds}</div>
        <div className="round-scores">
          <div className="round-score-col">
            <span className="round-who">YOU</span>
            <span className="round-wins">{rounds.humanWins}</span>
          </div>
          <span className="round-dash">-</span>
          <div className="round-score-col">
            <span className="round-who">AI</span>
            <span className="round-wins">{rounds.aiWins}</span>
          </div>
        </div>
      </div>

      <Button onClick={onNextRound} variant="primary" size="lg">
        NEXT ROUND
      </Button>
    </div>
  );
}
