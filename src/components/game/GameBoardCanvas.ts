import { Grid, GridPosition, PieceShape, CellState } from '../../types/game';
import { GRID_SIZE } from '../../constants/pieces';
import { COLORS, GLOW } from '../../constants/theme';

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  cellSize: number,
  ghostPos: GridPosition | null,
  ghostShape: PieceShape | null,
  ghostValid: boolean,
  clearingRows: number[],
  clearingCols: number[],
  onFire: boolean
) {
  const size = cellSize * GRID_SIZE;
  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = COLORS.gridBg;
  ctx.fillRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(size, i * cellSize);
    ctx.stroke();
  }

  // Placed cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== 0) {
        drawCell(ctx, c * cellSize, r * cellSize, cellSize, grid[r][c], false);
      }
    }
  }

  // Clear animation highlight
  const clearAlpha = 0.4 + Math.sin(Date.now() / 80) * 0.3;
  ctx.fillStyle = `rgba(255, 255, 255, ${clearAlpha})`;
  for (const r of clearingRows) {
    ctx.fillRect(0, r * cellSize, size, cellSize);
  }
  for (const c of clearingCols) {
    ctx.fillRect(c * cellSize, 0, cellSize, size);
  }

  // Ghost preview
  if (ghostPos && ghostShape) {
    const color = ghostValid ? COLORS.valid : COLORS.invalid;
    for (let r = 0; r < ghostShape.matrix.length; r++) {
      for (let c = 0; c < ghostShape.matrix[r].length; c++) {
        if (!ghostShape.matrix[r][c]) continue;
        const gx = (ghostPos.col + c) * cellSize;
        const gy = (ghostPos.row + r) * cellSize;
        ctx.fillStyle = color;
        ctx.fillRect(gx + 1, gy + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = COLORS.ghostOutline;
        ctx.lineWidth = 1;
        ctx.strokeRect(gx + 1, gy + 1, cellSize - 2, cellSize - 2);
      }
    }
  }

  // ON FIRE border
  if (onFire) {
    const pulse = 0.5 + Math.sin(Date.now() / 150) * 0.5;
    ctx.save();
    ctx.shadowColor = COLORS.neonPink;
    ctx.shadowBlur = GLOW.huge * pulse;
    ctx.strokeStyle = COLORS.neonPink;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, size, size);
    ctx.restore();
  }
}

export function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colorIndex: CellState,
  glow = true
) {
  if (colorIndex === 0) return;
  const color = COLORS.cells[colorIndex];
  const darkColor = COLORS.cellsDark[colorIndex];
  const padding = 1;

  // Cell body
  ctx.fillStyle = darkColor;
  ctx.fillRect(x + padding, y + padding, size - padding * 2, size - padding * 2);

  // Inner highlight
  const innerPad = size * 0.15;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(x + innerPad, y + innerPad, size - innerPad * 2, size - innerPad * 2);
  ctx.globalAlpha = 1;

  // Neon glow
  if (glow) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = GLOW.small;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + padding + 1, y + padding + 1, size - padding * 2 - 2, size - padding * 2 - 2);
    ctx.restore();
  }
}
