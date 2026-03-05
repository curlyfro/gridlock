import { CellState } from '../../types/game';
import { COLORS } from '../../constants/theme';
import { DragState } from '../../hooks/useDragAndDrop';

interface FloatingPieceProps {
  dragState: DragState;
  cellSize: number;
}

export function FloatingPiece({ dragState, cellSize }: FloatingPieceProps) {
  if (!dragState.dragging || !dragState.piece) return null;

  const { piece, x, y } = dragState;
  const { matrix, color } = piece.shape;
  const miniCellSize = cellSize * 0.8;
  const widthPx = matrix[0].length * miniCellSize;
  const heightPx = matrix.length * miniCellSize;

  return (
    <div
      className="floating-piece"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${x - widthPx / 2}px, ${y - heightPx / 2}px, 0)`,
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'inline-grid',
        gridTemplateRows: `repeat(${matrix.length}, ${miniCellSize}px)`,
        gridTemplateColumns: `repeat(${matrix[0].length}, ${miniCellSize}px)`,
        opacity: 0.85,
        filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.3))',
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
              boxShadow: filled ? `0 0 10px ${COLORS.cells[color as CellState]}` : 'none',
              border: filled ? `1px solid ${COLORS.cells[color as CellState]}` : 'none',
              opacity: filled ? 1 : 0,
            }}
          />
        ))
      )}
    </div>
  );
}
