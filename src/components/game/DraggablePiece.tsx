import { useCallback, useRef } from 'react';
import { Piece, CellState } from '../../types/game';
import { COLORS } from '../../constants/theme';

interface DraggablePieceProps {
  piece: Piece;
  cellSize: number;
  onDragStart: (piece: Piece, clientX: number, clientY: number, mobile: boolean) => void;
  disabled?: boolean;
}

export function DraggablePiece({ piece, cellSize, onDragStart, disabled }: DraggablePieceProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const miniCellSize = Math.max(12, cellSize * 0.55);
  const { matrix, color } = piece.shape;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const isMobile = e.pointerType === 'touch';
    onDragStart(piece, e.clientX, e.clientY, isMobile);
  }, [piece, onDragStart, disabled]);

  return (
    <div
      ref={elRef}
      className="draggable-piece"
      onPointerDown={handlePointerDown}
      style={{
        display: 'inline-grid',
        gridTemplateRows: `repeat(${matrix.length}, ${miniCellSize}px)`,
        gridTemplateColumns: `repeat(${matrix[0].length}, ${miniCellSize}px)`,
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: disabled ? 0.4 : 1,
        touchAction: 'none',
        userSelect: 'none',
        padding: 4,
      }}
    >
      {matrix.map((row, r) =>
        row.map((filled, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: miniCellSize,
              height: miniCellSize,
              backgroundColor: filled ? COLORS.cells[color as CellState] : 'transparent',
              borderRadius: 2,
              boxShadow: filled ? `0 0 6px ${COLORS.cells[color as CellState]}` : 'none',
              border: filled ? `1px solid ${COLORS.cells[color as CellState]}` : 'none',
              opacity: filled ? 0.9 : 0,
            }}
          />
        ))
      )}
    </div>
  );
}
