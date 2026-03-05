import { useRef, useEffect, useCallback } from 'react';
import { Grid, GridPosition, PieceShape } from '../../types/game';
import { GRID_SIZE } from '../../constants/pieces';
import { renderGrid } from './GameBoardCanvas';

interface GameBoardProps {
  grid: Grid;
  cellSize: number;
  ghostPos: GridPosition | null;
  ghostShape: PieceShape | null;
  ghostValid: boolean;
  onFire: boolean;
  clearingRows?: number[];
  clearingCols?: number[];
  onCellClick?: (pos: GridPosition) => void;
  onRowClick?: (index: number) => void;
  onColClick?: (index: number) => void;
  showRowColHeaders?: boolean;
  boardRef?: React.RefObject<HTMLDivElement | null>;
  dimmed?: boolean;
  label?: string;
}

export function GameBoard({
  grid, cellSize, ghostPos, ghostShape, ghostValid, onFire,
  clearingRows = [], clearingCols = [],
  onCellClick, onRowClick, onColClick, showRowColHeaders,
  boardRef, dimmed, label,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = cellSize * GRID_SIZE;
  const headerSize = showRowColHeaders ? 24 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    renderGrid(ctx, grid, cellSize, ghostPos, ghostShape, ghostValid, clearingRows, clearingCols);
  }, [grid, cellSize, ghostPos, ghostShape, ghostValid, clearingRows, clearingCols, size]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!onCellClick) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / cellSize);
    const row = Math.floor((e.clientY - rect.top) / cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      onCellClick({ row, col });
    }
  }, [onCellClick, cellSize]);

  return (
    <div
      ref={boardRef}
      className={`game-board${onFire ? ' on-fire' : ''}`}
      style={{
        width: size + headerSize,
        height: size + headerSize,
        position: 'relative',
        opacity: dimmed ? 0.6 : 1,
        transition: 'opacity 0.3s',
      }}
    >
      {label && (
        <div className="board-label">{label}</div>
      )}

      {/* Column headers for Row Zap */}
      {showRowColHeaders && (
        <div className="board-col-headers" style={{ marginLeft: headerSize, display: 'flex' }}>
          {Array.from({ length: GRID_SIZE }, (_, i) => (
            <button
              key={`col-${i}`}
              className="zap-header zap-col-header"
              style={{ width: cellSize, height: headerSize }}
              onClick={() => onColClick?.(i)}
              title={`Zap column ${i + 1}`}
            >
              &#x25BC;
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {/* Row headers for Row Zap */}
        {showRowColHeaders && (
          <div className="board-row-headers" style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: GRID_SIZE }, (_, i) => (
              <button
                key={`row-${i}`}
                className="zap-header zap-row-header"
                style={{ width: headerSize, height: cellSize }}
                onClick={() => onRowClick?.(i)}
                title={`Zap row ${i + 1}`}
              >
                &#x25B6;
              </button>
            ))}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            style={{ display: 'block', borderRadius: 4 }}
          />
          {/* Transparent overlay for pointer events */}
          <div
            onClick={handleClick}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: size, height: size,
              cursor: onCellClick ? 'crosshair' : 'default',
            }}
          />
        </div>
      </div>
    </div>
  );
}
