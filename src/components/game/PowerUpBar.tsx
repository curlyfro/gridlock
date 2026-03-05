import { PowerUp, PowerUpType } from '../../types/game';

interface PowerUpBarProps {
  powerUps: PowerUp[];
  activePowerUp: PowerUpType | null;
  onActivate: (type: PowerUpType) => void;
}

const ICONS: Record<PowerUpType, string> = {
  bomb: '\u{1F4A3}',
  rowZap: '\u26A1',
  wildcard: '\u2B50',
};

const LABELS: Record<PowerUpType, string> = {
  bomb: 'BOMB',
  rowZap: 'ZAP',
  wildcard: 'WILD',
};

export function PowerUpBar({ powerUps, activePowerUp, onActivate }: PowerUpBarProps) {
  if (powerUps.length === 0) return null;

  return (
    <div className="power-up-bar">
      {powerUps.map(pu => (
        <button
          key={pu.type}
          className={`power-up-btn ${activePowerUp === pu.type ? 'active' : ''}`}
          onClick={() => onActivate(pu.type)}
          title={`${LABELS[pu.type]} (${pu.charges})`}
        >
          <span className="power-up-icon">{ICONS[pu.type]}</span>
          <span className="power-up-charges">{pu.charges}</span>
        </button>
      ))}
    </div>
  );
}
