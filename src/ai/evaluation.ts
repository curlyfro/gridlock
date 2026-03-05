import { Grid, PieceShape, GridPosition } from '../types/game';
import { GRID_SIZE } from '../constants/pieces';
import { placePieceOnGrid, findFullRows, findFullCols, countOccupiedCells } from '../engine/grid';
import { findAllValidPlacements } from '../engine/validation';

export interface PlacementScore {
  pieceIndex: number;
  position: GridPosition;
  score: number;
}

export function evaluateBoard(grid: Grid): number {
  let score = 0;

  // Penalize occupied cells (fewer is better)
  const occupied = countOccupiedCells(grid);
  score -= occupied * 2;

  // Reward rows/cols close to full
  for (let r = 0; r < GRID_SIZE; r++) {
    const filled = grid[r].filter(c => c !== 0).length;
    if (filled >= 6) score += filled * 3;
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    let filled = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] !== 0) filled++;
    }
    if (filled >= 6) score += filled * 3;
  }

  // Penalize holes (empty cells surrounded by filled cells)
  for (let r = 1; r < GRID_SIZE - 1; r++) {
    for (let c = 1; c < GRID_SIZE - 1; c++) {
      if (grid[r][c] === 0) {
        const neighbors = [
          grid[r - 1][c], grid[r + 1][c],
          grid[r][c - 1], grid[r][c + 1],
        ].filter(n => n !== 0).length;
        if (neighbors >= 3) score -= 5;
      }
    }
  }

  // Reward edge placement
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][0] !== 0) score += 1;
    if (grid[r][GRID_SIZE - 1] !== 0) score += 1;
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[0][c] !== 0) score += 1;
    if (grid[GRID_SIZE - 1][c] !== 0) score += 1;
  }

  return score;
}

export function evaluatePlacement(
  grid: Grid,
  shape: PieceShape,
  pos: GridPosition
): number {
  const newGrid = placePieceOnGrid(grid, shape, pos);
  const fullRows = findFullRows(newGrid);
  const fullCols = findFullCols(newGrid);
  const linesCleared = fullRows.length + fullCols.length;

  let score = 0;

  // Big reward for clearing lines
  score += linesCleared * 50;
  if (linesCleared >= 2) score += linesCleared * 30; // bonus for multi-clear

  // Evaluate resulting board state
  score += evaluateBoard(newGrid);

  return score;
}

export function scoreAllPlacements(
  grid: Grid,
  pieces: { shape: PieceShape }[],
  lookaheadDepth: number = 0
): PlacementScore[] {
  const results: PlacementScore[] = [];

  for (let i = 0; i < pieces.length; i++) {
    const positions = findAllValidPlacements(grid, pieces[i].shape);
    for (const pos of positions) {
      let score = evaluatePlacement(grid, pieces[i].shape, pos);

      // Simple lookahead: simulate placing and evaluate remaining pieces
      if (lookaheadDepth > 0 && pieces.length > 1) {
        const newGrid = placePieceOnGrid(grid, pieces[i].shape, pos);
        const remaining = pieces.filter((_, idx) => idx !== i);
        const futureScores = scoreAllPlacements(newGrid, remaining, lookaheadDepth - 1);
        if (futureScores.length > 0) {
          score += Math.max(...futureScores.map(s => s.score)) * 0.5;
        }
      }

      results.push({ pieceIndex: i, position: pos, score });
    }
  }

  return results;
}
