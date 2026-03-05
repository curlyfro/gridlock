import { CellState, Grid, PieceShape, GridPosition } from '../types/game';
import { GRID_SIZE } from '../constants/pieces';

export function createGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0 as CellState)
  );
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

export function placePieceOnGrid(
  grid: Grid,
  shape: PieceShape,
  pos: GridPosition
): Grid {
  const newGrid = cloneGrid(grid);
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (shape.matrix[r][c]) {
        newGrid[pos.row + r][pos.col + c] = shape.color as CellState;
      }
    }
  }
  return newGrid;
}

export function findFullRows(grid: Grid): number[] {
  const rows: number[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(cell => cell !== 0)) {
      rows.push(r);
    }
  }
  return rows;
}

export function findFullCols(grid: Grid): number[] {
  const cols: number[] = [];
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] === 0) { full = false; break; }
    }
    if (full) cols.push(c);
  }
  return cols;
}

export function clearLines(grid: Grid, rows: number[], cols: number[]): Grid {
  const newGrid = cloneGrid(grid);
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = 0;
    }
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r][c] = 0;
    }
  }
  return newGrid;
}

export function addJunkRows(grid: Grid, count: number): Grid {
  if (count <= 0) return grid;
  const newGrid = cloneGrid(grid);
  // Shift existing rows up
  for (let r = 0; r < GRID_SIZE - count; r++) {
    newGrid[r] = newGrid[r + count] ? [...newGrid[r + count]] : Array(GRID_SIZE).fill(0);
  }
  // Add junk rows at bottom
  for (let r = Math.max(0, GRID_SIZE - count); r < GRID_SIZE; r++) {
    const gap = Math.floor(Math.random() * GRID_SIZE);
    newGrid[r] = Array.from({ length: GRID_SIZE }, (_, c) =>
      c === gap ? (0 as CellState) : (7 as CellState) // gray-ish junk color
    );
  }
  return newGrid;
}

export function clearArea(grid: Grid, center: GridPosition, radius: number): { grid: Grid; cellsCleared: number } {
  const newGrid = cloneGrid(grid);
  let cellsCleared = 0;
  for (let r = center.row - radius; r <= center.row + radius; r++) {
    for (let c = center.col - radius; c <= center.col + radius; c++) {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && newGrid[r][c] !== 0) {
        newGrid[r][c] = 0;
        cellsCleared++;
      }
    }
  }
  return { grid: newGrid, cellsCleared };
}

export function clearRow(grid: Grid, row: number): { grid: Grid; cellsCleared: number } {
  const newGrid = cloneGrid(grid);
  let cellsCleared = 0;
  for (let c = 0; c < GRID_SIZE; c++) {
    if (newGrid[row][c] !== 0) {
      newGrid[row][c] = 0;
      cellsCleared++;
    }
  }
  return { grid: newGrid, cellsCleared };
}

export function clearCol(grid: Grid, col: number): { grid: Grid; cellsCleared: number } {
  const newGrid = cloneGrid(grid);
  let cellsCleared = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    if (newGrid[r][col] !== 0) {
      newGrid[r][col] = 0;
      cellsCleared++;
    }
  }
  return { grid: newGrid, cellsCleared };
}

export function countOccupiedCells(grid: Grid): number {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== 0) count++;
    }
  }
  return count;
}
