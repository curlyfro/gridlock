import { PlayerState, Difficulty } from '../../types/game';
import { RobotAvatar } from './RobotAvatar';

interface AIPanelProps {
  aiState: PlayerState;
  difficulty: Difficulty;
  thinking: boolean;
}

function getAiMood(ai: PlayerState, thinking: boolean) {
  if (thinking) return 'thinking' as const;
  if (ai.onFire) return 'happy' as const;
  if (ai.pendingJunk >= 3) return 'panicked' as const;
  if (ai.pendingJunk > 0) return 'angry' as const;
  return 'idle' as const;
}

const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  easy: 'EASY BOT',
  medium: 'MEDIUM BOT',
  hard: 'HARD BOT',
};

export function AIPanel({ aiState, difficulty, thinking }: AIPanelProps) {
  const mood = getAiMood(aiState, thinking);

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <RobotAvatar mood={mood} size={48} />
        <span className="ai-name">{DIFFICULTY_NAMES[difficulty]}</span>
      </div>
      {thinking && <div className="ai-thinking-dots">thinking<span className="dots" /></div>}
    </div>
  );
}
