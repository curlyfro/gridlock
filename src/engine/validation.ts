import { Grid, PieceShape, GridPosition } from '../types/game';
import { GRID_SIZE } from '../constants/pieces';

export function canPlacePiece(
  grid: Grid,
  shape: PieceShape,
  pos: GridPosition
): boolean {
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (!shape.matrix[r][c]) continue;
      const gr = pos.row + r;
      const gc = pos.col + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) return false;
      if (grid[gr][gc] !== 0) return false;
    }
  }
  return true;
}

export function findAllValidPlacements(
  grid: Grid,
  shape: PieceShape
): GridPosition[] {
  const placements: GridPosition[] = [];
  for (let r = 0; r <= GRID_SIZE - shape.matrix.length; r++) {
    for (let c = 0; c <= GRID_SIZE - shape.matrix[0].length; c++) {
      if (canPlacePiece(grid, shape, { row: r, col: c })) {
        placements.push({ row: r, col: c });
      }
    }
  }
  return placements;
}

export function hasAnyValidPlacement(
  grid: Grid,
  shapes: PieceShape[]
): boolean {
  return shapes.some(shape => findAllValidPlacements(grid, shape).length > 0);
}
