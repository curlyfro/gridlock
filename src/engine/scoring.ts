import { PieceShape } from '../types/game';
import {
  POINTS_PER_CELL,
  CLEAR_BONUS,
  COMBO_MULTIPLIER,
  ON_FIRE_SCORE_MULTIPLIER,
  JUNK_ROWS,
  JUNK_PER_EXTRA_CLEAR,
} from '../constants/scoring';

export function countPieceCells(shape: PieceShape): number {
  let count = 0;
  for (const row of shape.matrix) {
    for (const cell of row) {
      if (cell) count++;
    }
  }
  return count;
}

export function calculatePlacementScore(
  shape: PieceShape,
  linesCleared: number,
  combo: number,
  onFire: boolean
): number {
  let score = countPieceCells(shape) * POINTS_PER_CELL;

  if (linesCleared > 0) {
    const bonus = CLEAR_BONUS[Math.min(linesCleared, 4)] ?? CLEAR_BONUS[4]!;
    score += bonus;
  }

  // Combo multiplier
  if (combo > 1) {
    score = Math.floor(score * Math.pow(COMBO_MULTIPLIER, combo - 1));
  }

  // ON FIRE multiplier
  if (onFire) {
    score = Math.floor(score * ON_FIRE_SCORE_MULTIPLIER);
  }

  return score;
}

export function calculateJunkRows(linesCleared: number): number {
  if (linesCleared < 2) return 0;
  if (linesCleared <= 4) return JUNK_ROWS[linesCleared] ?? 0;
  return (JUNK_ROWS[4] ?? 3) + (linesCleared - 4) * JUNK_PER_EXTRA_CLEAR;
}
