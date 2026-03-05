import { useEffect, useRef, useState } from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  combo: number;
  onFire: boolean;
  label: string;
  linesCleared: number;
}

export function ScorePanel({ score, level, combo, onFire, label, linesCleared }: ScorePanelProps) {
  const [displayScore, setDisplayScore] = useState(score);
  const targetRef = useRef(score);

  useEffect(() => {
    targetRef.current = score;
    const animate = () => {
      setDisplayScore(prev => {
        if (prev >= targetRef.current) return targetRef.current;
        const diff = targetRef.current - prev;
        return prev + Math.max(1, Math.ceil(diff * 0.15));
      });
    };
    const id = setInterval(animate, 16);
    return () => clearInterval(id);
  }, [score]);

  return (
    <div className={`score-panel ${onFire ? 'on-fire' : ''}`}>
      <div className="score-label">{label}</div>
      <div className="score-value">{displayScore.toLocaleString()}</div>
      <div className="score-details">
        <span>LVL {level}</span>
        <span>{linesCleared} lines</span>
        {combo > 1 && <span className="combo-badge">x{combo} COMBO</span>}
      </div>
      {onFire && <div className="on-fire-badge">ON FIRE</div>}
    </div>
  );
}
