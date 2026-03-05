import { PlayerState, Difficulty, GameMode, RoundState } from '../../types/game';
import { Button } from '../ui/Button';
import { saveHighScore } from '../../utils/localStorage';
import { useEffect } from 'react';

interface GameOverScreenProps {
  winner: 'human' | 'ai';
  human: PlayerState;
  ai: PlayerState;
  difficulty: Difficulty;
  mode: GameMode;
  rounds: RoundState;
  onReplay: () => void;
  onTitle: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  gridlock: 'GRIDLOCK',
  scoreRace: 'SCORE RACE',
  timed: 'TIME UP',
  bestOf3: 'BEST OF 3',
};

function getSubtitle(won: boolean, mode: GameMode): string {
  if (mode === 'gridlock') {
    return won
      ? 'The AI ran out of moves - gridlocked!'
      : 'You ran out of valid moves - gridlocked!';
  }
  if (mode === 'scoreRace') {
    return won ? 'You hit the target first!' : 'The AI hit the target first!';
  }
  if (mode === 'timed') {
    return won ? 'You scored higher before time ran out!' : 'The AI scored higher before time ran out!';
  }
  return won ? 'You won the match!' : 'The AI won the match!';
}

export function GameOverScreen({ winner, human, ai, difficulty, mode, rounds, onReplay, onTitle }: GameOverScreenProps) {
  useEffect(() => {
    saveHighScore(difficulty, human.score);
  }, [difficulty, human.score]);

  const won = winner === 'human';

  return (
    <div className="game-over-screen">
      <div className="game-over-mode-tag">{MODE_LABELS[mode]}</div>
      <h1 className={`game-over-title ${won ? 'win' : 'lose'}`}>
        {won ? 'YOU WIN!' : 'DEFEATED'}
      </h1>
      <p className="game-over-subtitle">
        {getSubtitle(won, mode)}
      </p>

      {mode === 'bestOf3' && (
        <div className="round-tracker">
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
      )}

      <div className="game-over-scores">
        <div className={`score-column ${won ? 'winner' : 'loser'}`}>
          <div className="score-column-label">YOU</div>
          <div className="score-column-value">{human.score.toLocaleString()}</div>
          <div className="score-stat">Blocks: {human.blocksPlaced}</div>
          <div className="score-stat">Lines: {human.linesCleared}</div>
          <div className="score-stat">Max Combo: x{human.maxCombo}</div>
          <div className="score-stat">Level: {human.level}</div>
        </div>
        <div className="score-divider" />
        <div className={`score-column ${won ? 'loser' : 'winner'}`}>
          <div className="score-column-label">AI</div>
          <div className="score-column-value">{ai.score.toLocaleString()}</div>
          <div className="score-stat">Blocks: {ai.blocksPlaced}</div>
          <div className="score-stat">Lines: {ai.linesCleared}</div>
          <div className="score-stat">Max Combo: x{ai.maxCombo}</div>
          <div className="score-stat">Level: {ai.level}</div>
        </div>
      </div>

      <div className="game-over-actions">
        <Button onClick={onReplay} variant="primary" size="lg">PLAY AGAIN</Button>
        <Button onClick={onTitle} variant="secondary" size="md">MAIN MENU</Button>
      </div>
    </div>
  );
}
