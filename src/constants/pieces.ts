import { PieceShape } from '../types/game';

// All piece shapes as boolean matrices
// Colors: 1=cyan, 2=magenta, 3=yellow, 4=green, 5=orange, 6=blue, 7=red

export const PIECE_SHAPES: PieceShape[] = [
  // Single
  { matrix: [[true]], color: 1 },

  // Dominos
  { matrix: [[true, true]], color: 2 },
  { matrix: [[true], [true]], color: 2 },

  // Triominos
  { matrix: [[true, true, true]], color: 3 },
  { matrix: [[true], [true], [true]], color: 3 },
  { matrix: [[true, true], [true, false]], color: 4 },
  { matrix: [[true, true], [false, true]], color: 4 },
  { matrix: [[true, false], [true, true]], color: 5 },
  { matrix: [[false, true], [true, true]], color: 5 },

  // Tetrominoes
  { matrix: [[true, true, true, true]], color: 1 },
  { matrix: [[true], [true], [true], [true]], color: 1 },
  { matrix: [[true, true], [true, true]], color: 3 },
  { matrix: [[true, true, true], [true, false, false]], color: 6 },
  { matrix: [[true, true, true], [false, false, true]], color: 5 },
  { matrix: [[true, false], [true, false], [true, true]], color: 6 },
  { matrix: [[false, true], [false, true], [true, true]], color: 5 },
  { matrix: [[true, true, false], [false, true, true]], color: 7 },
  { matrix: [[false, true, true], [true, true, false]], color: 4 },
  { matrix: [[true, true, true], [false, true, false]], color: 2 },

  // Pentominoes (larger, rarer)
  { matrix: [[true, true, true, true, true]], color: 7 },
  { matrix: [[true], [true], [true], [true], [true]], color: 7 },
  { matrix: [[true, true, true], [true, false, false], [true, false, false]], color: 6 },
  { matrix: [[true, true, true], [false, false, true], [false, false, true]], color: 5 },
  { matrix: [[true, false], [true, true], [false, true]], color: 2 },

  // 2x3 and 3x3 blocks
  { matrix: [[true, true], [true, true], [true, true]], color: 3 },
  { matrix: [[true, true, true], [true, true, true]], color: 3 },
  { matrix: [[true, true, true], [true, true, true], [true, true, true]], color: 1 },
];

// Weights for piece selection (smaller pieces more common)
export const PIECE_WEIGHTS: number[] = [
  10,     // single
  8, 8,   // dominos
  7, 7, 6, 6, 6, 6, // triominos
  5, 5, 5, 4, 4, 4, 4, 4, 4, 4, // tetrominoes
  2, 2, 2, 2, 2, // pentominoes
  3, 3, 1, // large blocks
];

export const GRID_SIZE = 8;
