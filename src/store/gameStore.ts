import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  GameState,
  PlayerState,
  Difficulty,
  GameMode,
  GridPosition,
  Piece,
  PowerUpType,
  ActivePowerUp,
  RoundState,
} from '../types/game';
import { createGrid, placePieceOnGrid, findFullRows, findFullCols, clearLines, addJunkRows, clearArea, clearRow, clearCol } from '../engine/grid';
import { drawPieces } from '../engine/pieces';
import { canPlacePiece } from '../engine/validation';
import { hasAnyValidPlacement } from '../engine/validation';
import { calculatePlacementScore, calculateJunkRows } from '../engine/scoring';
import { ON_FIRE_THRESHOLD, MAX_POWER_UP_CHARGES, POWER_UP_BOMB_RADIUS, POWER_UP_BOMB_POINTS, POWER_UP_ROW_ZAP_POINTS } from '../constants/scoring';
import { getLevelTarget } from '../constants/levels';

const SCORE_RACE_TARGET = 500;
const TIMED_DURATION = 180; // 3 minutes

function createPlayer(): PlayerState {
  return {
    grid: createGrid(),
    score: 0,
    pieces: drawPieces(3),
    combo: 0,
    onFire: false,
    consecutiveClears: 0,
    powerUps: [],
    linesCleared: 0,
    blocksPlaced: 0,
    maxCombo: 0,
    pendingJunk: 0,
    level: 1,
  };
}

function createRounds(): RoundState {
  return { humanWins: 0, aiWins: 0, currentRound: 1, totalRounds: 3 };
}

export interface GameActions {
  selectMode: (mode: GameMode) => void;
  startGame: (difficulty: Difficulty) => void;
  placePiece: (owner: 'human' | 'ai', pieceId: string, pos: GridPosition) => void;
  activatePowerUp: (type: PowerUpType) => void;
  useBomb: (pos: GridPosition) => void;
  useRowZap: (index: number, mode: 'row' | 'col') => void;
  aiUsePowerUp: () => boolean;
  setAiThinking: (thinking: boolean) => void;
  goToTitle: () => void;
  checkGameOver: (owner: 'human' | 'ai') => boolean;
  tickTimer: () => void;
  nextRound: () => void;
}

const initialState: GameState = {
  phase: 'title',
  difficulty: 'medium',
  mode: 'gridlock',
  human: createPlayer(),
  ai: createPlayer(),
  turn: 'human',
  winner: null,
  activePowerUp: null,
  aiThinking: false,
  level: 1,
  scoreTarget: SCORE_RACE_TARGET,
  timeRemaining: TIMED_DURATION,
  timerRunning: false,
  rounds: createRounds(),
};

export const useGameStore = create<GameState & GameActions>()(
  immer((set, get) => ({
    ...initialState,

    selectMode: (mode) => {
      set(state => {
        state.mode = mode;
        state.phase = 'modeSelect';
      });
    },

    startGame: (difficulty) => {
      set(state => {
        state.phase = 'playing';
        state.difficulty = difficulty;
        state.human = createPlayer();
        state.ai = createPlayer();
        state.turn = 'human';
        state.winner = null;
        state.activePowerUp = null;
        state.aiThinking = false;
        state.level = 1;

        // Mode-specific init
        if (state.mode === 'scoreRace') {
          state.scoreTarget = SCORE_RACE_TARGET;
        } else if (state.mode === 'timed') {
          state.timeRemaining = TIMED_DURATION;
          state.timerRunning = true;
        } else if (state.mode === 'bestOf3') {
          // Only reset rounds on fresh start, not between rounds
          if (state.rounds.currentRound === 1 || state.phase !== 'playing') {
            state.rounds = createRounds();
          }
        }
      });
    },

    placePiece: (owner, pieceId, pos) => {
      set(state => {
        const player = state[owner];
        const pieceIndex = player.pieces.findIndex(p => p.id === pieceId);
        if (pieceIndex === -1) return;

        const piece = player.pieces[pieceIndex];
        if (!canPlacePiece(player.grid, piece.shape, pos)) return;

        // Place piece
        player.grid = placePieceOnGrid(player.grid, piece.shape, pos);
        player.blocksPlaced++;

        // Remove piece from tray
        player.pieces.splice(pieceIndex, 1);

        // Check for line clears
        const fullRows = findFullRows(player.grid);
        const fullCols = findFullCols(player.grid);
        const totalCleared = fullRows.length + fullCols.length;

        if (totalCleared > 0) {
          player.grid = clearLines(player.grid, fullRows, fullCols);
          player.linesCleared += totalCleared;
          player.consecutiveClears++;
          player.combo++;
          player.maxCombo = Math.max(player.maxCombo, player.combo);

          // ON FIRE check
          if (player.consecutiveClears >= ON_FIRE_THRESHOLD) {
            player.onFire = true;
          }

          // Award power-up charge on multi-clear
          const totalPowerCharges = player.powerUps.reduce((sum, p) => sum + p.charges, 0);
          if (totalCleared >= 2 && totalPowerCharges < MAX_POWER_UP_CHARGES) {
            const types: PowerUpType[] = ['bomb', 'rowZap', 'wildcard'];
            const type = types[Math.floor(Math.random() * types.length)];
            const existing = player.powerUps.find(p => p.type === type);
            if (existing) {
              existing.charges = Math.min(existing.charges + 1, MAX_POWER_UP_CHARGES);
            } else {
              player.powerUps.push({ type, charges: 1 });
            }
          }

          // Queue junk to opponent
          const junkCount = calculateJunkRows(totalCleared);
          if (junkCount > 0) {
            const opponent = owner === 'human' ? state.ai : state.human;
            opponent.pendingJunk += junkCount;
          }
        } else {
          player.consecutiveClears = 0;
          player.combo = 0;
          player.onFire = false;
        }

        // Calculate score
        const scoreGained = calculatePlacementScore(
          piece.shape,
          totalCleared,
          player.combo,
          player.onFire
        );
        player.score += scoreGained;

        // Level up check
        const target = getLevelTarget(player.level);
        if (player.score >= target) {
          player.level++;
          state.level = Math.max(state.human.level, state.ai.level);
        }

        // Score Race win check
        if (state.mode === 'scoreRace' && player.score >= state.scoreTarget) {
          state.winner = owner;
          state.phase = 'gameOver';
          state.timerRunning = false;
          return;
        }

        // If all pieces placed, draw new ones and apply pending junk
        if (player.pieces.length === 0) {
          if (player.pendingJunk > 0) {
            player.grid = addJunkRows(player.grid, player.pendingJunk);
            player.pendingJunk = 0;
          }
          player.pieces = drawPieces(3);
        }
      });
    },

    checkGameOver: (owner) => {
      const state = get();
      if (state.phase !== 'playing') return false;
      const player = state[owner];
      if (player.pieces.length === 0) return false;
      const remainingShapes = player.pieces.map(p => p.shape);
      if (!hasAnyValidPlacement(player.grid, remainingShapes)) {
        const loser = owner;
        const winner = owner === 'human' ? 'ai' : 'human';

        set(s => {
          if (s.mode === 'bestOf3') {
            // Award round win
            if (winner === 'human') s.rounds.humanWins++;
            else s.rounds.aiWins++;

            // Check if match is decided
            const needed = Math.ceil(s.rounds.totalRounds / 2);
            if (s.rounds.humanWins >= needed || s.rounds.aiWins >= needed) {
              s.winner = s.rounds.humanWins >= needed ? 'human' : 'ai';
              s.phase = 'gameOver';
            } else {
              s.winner = winner;
              s.phase = 'roundOver';
            }
          } else {
            s.phase = 'gameOver';
            s.winner = winner;
          }
          s.timerRunning = false;
        });
        return true;
      }
      return false;
    },

    tickTimer: () => {
      set(state => {
        if (!state.timerRunning || state.phase !== 'playing') return;
        state.timeRemaining = Math.max(0, state.timeRemaining - 1);
        if (state.timeRemaining <= 0) {
          state.timerRunning = false;
          // Highest score wins
          if (state.human.score > state.ai.score) {
            state.winner = 'human';
          } else if (state.ai.score > state.human.score) {
            state.winner = 'ai';
          } else {
            // Tie: whoever has fewer occupied cells wins
            state.winner = 'human'; // slight favor to human on tie
          }
          state.phase = 'gameOver';
        }
      });
    },

    nextRound: () => {
      set(state => {
        state.rounds.currentRound++;
        state.human = createPlayer();
        state.ai = createPlayer();
        state.turn = 'human';
        state.winner = null;
        state.activePowerUp = null;
        state.aiThinking = false;
        state.level = 1;
        state.phase = 'playing';
      });
    },

    activatePowerUp: (type) => {
      set(state => {
        const pu = state.human.powerUps.find(p => p.type === type);
        if (!pu || pu.charges <= 0) return;

        if (type === 'wildcard') {
          pu.charges--;
          if (pu.charges <= 0) {
            state.human.powerUps = state.human.powerUps.filter(p => p.type !== type);
          }
          state.activePowerUp = { type: 'wildcard', owner: 'human' };
        } else {
          state.activePowerUp = { type, owner: 'human' };
        }
      });
    },

    useBomb: (pos) => {
      set(state => {
        if (state.activePowerUp?.type !== 'bomb') return;
        const pu = state.human.powerUps.find(p => p.type === 'bomb');
        if (!pu || pu.charges <= 0) return;

        const result = clearArea(state.human.grid, pos, POWER_UP_BOMB_RADIUS);
        state.human.grid = result.grid;
        state.human.score += result.cellsCleared * POWER_UP_BOMB_POINTS;
        pu.charges--;
        if (pu.charges <= 0) {
          state.human.powerUps = state.human.powerUps.filter(p => p.type !== 'bomb');
        }
        state.activePowerUp = null;
      });
    },

    useRowZap: (index, mode) => {
      set(state => {
        if (state.activePowerUp?.type !== 'rowZap') return;
        const pu = state.human.powerUps.find(p => p.type === 'rowZap');
        if (!pu || pu.charges <= 0) return;

        const result = mode === 'row'
          ? clearRow(state.human.grid, index)
          : clearCol(state.human.grid, index);
        state.human.grid = result.grid;
        state.human.score += result.cellsCleared * POWER_UP_ROW_ZAP_POINTS;
        pu.charges--;
        if (pu.charges <= 0) {
          state.human.powerUps = state.human.powerUps.filter(p => p.type !== 'rowZap');
        }
        state.activePowerUp = null;
      });
    },

    aiUsePowerUp: () => {
      let used = false;
      set(state => {
        const ai = state.ai;
        if (ai.powerUps.length === 0) return;

        const bombPu = ai.powerUps.find(p => p.type === 'bomb');
        if (bombPu && bombPu.charges > 0) {
          let bestPos = { row: 3, col: 3 };
          let bestCount = 0;
          for (let r = 1; r < 7; r++) {
            for (let c = 1; c < 7; c++) {
              let count = 0;
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  if (ai.grid[r + dr][c + dc] !== 0) count++;
                }
              }
              if (count > bestCount) { bestCount = count; bestPos = { row: r, col: c }; }
            }
          }
          if (bestCount >= 5) {
            const result = clearArea(ai.grid, bestPos, POWER_UP_BOMB_RADIUS);
            ai.grid = result.grid;
            ai.score += result.cellsCleared * POWER_UP_BOMB_POINTS;
            bombPu.charges--;
            if (bombPu.charges <= 0) ai.powerUps = ai.powerUps.filter(p => p.type !== 'bomb');
            used = true;
            return;
          }
        }

        const zapPu = ai.powerUps.find(p => p.type === 'rowZap');
        if (zapPu && zapPu.charges > 0) {
          let bestIndex = 0;
          let bestFill = 0;
          let bestMode: 'row' | 'col' = 'row';
          for (let r = 0; r < 8; r++) {
            const fill = ai.grid[r].filter(c => c !== 0).length;
            if (fill > bestFill) { bestFill = fill; bestIndex = r; bestMode = 'row'; }
          }
          for (let c = 0; c < 8; c++) {
            let fill = 0;
            for (let r = 0; r < 8; r++) { if (ai.grid[r][c] !== 0) fill++; }
            if (fill > bestFill) { bestFill = fill; bestIndex = c; bestMode = 'col'; }
          }
          if (bestFill >= 5) {
            const result = bestMode === 'row'
              ? clearRow(ai.grid, bestIndex)
              : clearCol(ai.grid, bestIndex);
            ai.grid = result.grid;
            ai.score += result.cellsCleared * POWER_UP_ROW_ZAP_POINTS;
            zapPu.charges--;
            if (zapPu.charges <= 0) ai.powerUps = ai.powerUps.filter(p => p.type !== 'rowZap');
            used = true;
          }
        }
      });
      return used;
    },

    setAiThinking: (thinking) => {
      set(state => { state.aiThinking = thinking; });
    },

    goToTitle: () => {
      set(state => {
        state.phase = 'title';
        state.winner = null;
        state.timerRunning = false;
      });
    },
  }))
);
