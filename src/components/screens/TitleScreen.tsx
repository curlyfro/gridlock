import { GameMode } from '../../types/game';
import { loadSaveData } from '../../utils/localStorage';

interface TitleScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const MODES: { mode: GameMode; label: string; desc: string }[] = [
  { mode: 'gridlock', label: 'GRIDLOCK', desc: 'No valid moves = you lose' },
  { mode: 'scoreRace', label: 'SCORE RACE', desc: 'First to 500 wins' },
  { mode: 'timed', label: 'TIMED', desc: '3 min - highest score wins' },
  { mode: 'bestOf3', label: 'BEST OF 3', desc: 'Win 2 rounds to claim victory' },
];

export function TitleScreen({ onSelectMode }: TitleScreenProps) {
  const saves = loadSaveData();

  return (
    <div className="title-screen">
      <div className="title-logo">
        <h1 className="title-text">GRIDLOCK</h1>
        <div className="title-subtitle">BLOCK WARFARE</div>
      </div>

      <div className="mode-select">
        <div className="mode-select-label">SELECT MODE</div>
        <div className="mode-grid">
          {MODES.map(m => (
            <button
              key={m.mode}
              className="mode-card"
              onClick={() => onSelectMode(m.mode)}
            >
              <span className="mode-card-label">{m.label}</span>
              <span className="mode-card-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="title-high-scores">
        <div className="high-score-title">HIGH SCORES</div>
        <div className="high-score-row">
          <span>Easy</span><span>{saves.highScores.easy.toLocaleString()}</span>
        </div>
        <div className="high-score-row">
          <span>Medium</span><span>{saves.highScores.medium.toLocaleString()}</span>
        </div>
        <div className="high-score-row">
          <span>Hard</span><span>{saves.highScores.hard.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
