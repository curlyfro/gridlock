import { useRef, useEffect } from 'react';
import { CellState } from '../../types/game';
import { COLORS } from '../../constants/theme';
import { DragState } from '../../hooks/useDragAndDrop';

interface FloatingPieceProps {
  dragState: DragState;
  positionRef: React.RefObject<{ x: number; y: number }>;
  cellSize: number;
}

export function FloatingPiece({ dragState, positionRef, cellSize }: FloatingPieceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!dragState.dragging || !dragState.piece) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const { matrix } = dragState.piece.shape;
    const miniCellSize = cellSize * 0.8;
    const widthPx = matrix[0].length * miniCellSize;
    const heightPx = matrix.length * miniCellSize;

    const update = () => {
      const { x, y } = positionRef.current;
      el.style.transform = `translate3d(${x - widthPx / 2}px, ${y - heightPx / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafRef.current);
  }, [dragState.dragging, dragState.piece, cellSize, positionRef]);

  if (!dragState.dragging || !dragState.piece) return null;

  const { piece } = dragState;
  const { matrix, color } = piece.shape;
  const miniCellSize = cellSize * 0.8;

  return (
    <div
      ref={containerRef}
      className="floating-piece"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
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
              border: filled ? `1px solid ${COLORS.cells[color as CellState]}` : 'none',
              opacity: filled ? 1 : 0,
            }}
          />
        ))
      )}
    </div>
  );
}
