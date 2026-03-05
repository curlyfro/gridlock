export type CellState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 0=empty, 1-7=color indices
export type Grid = CellState[][];

export interface PieceShape {
  matrix: boolean[][];
  color: number; // 1-7
}

export interface Piece {
  id: string;
  shape: PieceShape;
}

export type PowerUpType = 'bomb' | 'rowZap' | 'wildcard';

export interface PowerUp {
  type: PowerUpType;
  charges: number;
}

export interface PlayerState {
  grid: Grid;
  score: number;
  pieces: Piece[];
  combo: number;
  onFire: boolean;
  consecutiveClears: number;
  powerUps: PowerUp[];
  linesCleared: number;
  blocksPlaced: number;
  maxCombo: number;
  pendingJunk: number;
  level: number;
}

export type GamePhase = 'title' | 'modeSelect' | 'playing' | 'roundOver' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'gridlock' | 'scoreRace' | 'timed' | 'bestOf3';
export type ActivePowerUp = { type: PowerUpType; owner: 'human' } | null;

export interface RoundState {
  humanWins: number;
  aiWins: number;
  currentRound: number;
  totalRounds: number;
}

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  mode: GameMode;
  human: PlayerState;
  ai: PlayerState;
  turn: 'human' | 'ai';
  winner: 'human' | 'ai' | null;
  activePowerUp: ActivePowerUp;
  aiThinking: boolean;
  level: number;
  // Score Race
  scoreTarget: number;
  // Timed
  timeRemaining: number; // seconds
  timerRunning: boolean;
  // Best of 3
  rounds: RoundState;
}

export interface PlacementResult {
  grid: Grid;
  clearedRows: number[];
  clearedCols: number[];
  totalCleared: number;
  scoreGained: number;
}

export interface GridPosition {
  row: number;
  col: number;
}
