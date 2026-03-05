import { useRef, useCallback, useState } from 'react';
import { Piece, GridPosition, PieceShape } from '../types/game';
import { canPlacePiece } from '../engine/validation';
import { Grid } from '../types/game';
import { GRID_SIZE } from '../constants/pieces';

export interface DragState {
  piece: Piece | null;
  x: number;
  y: number;
  gridPos: GridPosition | null;
  valid: boolean;
  dragging: boolean;
}

interface UseDragAndDropOpts {
  grid: Grid;
  cellSize: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (piece: Piece, pos: GridPosition) => void;
  onInvalidDrop: () => void;
  isWildcard?: boolean;
}

export function useDragAndDrop({ grid, cellSize, boardRef, onDrop, onInvalidDrop, isWildcard }: UseDragAndDropOpts) {
  const [dragState, setDragState] = useState<DragState>({
    piece: null, x: 0, y: 0, gridPos: null, valid: false, dragging: false,
  });

  const dragRef = useRef<DragState>(dragState);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const updateDragState = useCallback((update: Partial<DragState>) => {
    dragRef.current = { ...dragRef.current, ...update };
    setDragState(prev => ({ ...prev, ...update }));
  }, []);

  const snapToGrid = useCallback((clientX: number, clientY: number, shape: PieceShape): { pos: GridPosition | null; valid: boolean } => {
    const board = boardRef.current;
    if (!board) return { pos: null, valid: false };

    const rect = board.getBoundingClientRect();
    // Offset for piece center
    const pieceWidthPx = shape.matrix[0].length * cellSize;
    const pieceHeightPx = shape.matrix.length * cellSize;
    const offsetY = isMobileRef.current ? 60 : 0;

    const x = clientX - rect.left - pieceWidthPx / 2;
    const y = clientY - rect.top - pieceHeightPx / 2 - offsetY;

    const col = Math.round(x / cellSize);
    const row = Math.round(y / cellSize);

    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return { pos: null, valid: false };
    }

    const pos = { row, col };
    const valid = isWildcard || canPlacePiece(grid, shape, pos);
    return { pos, valid };
  }, [grid, cellSize, boardRef, isWildcard]);

  const startDrag = useCallback((piece: Piece, clientX: number, clientY: number, mobile: boolean) => {
    isMobileRef.current = mobile;
    updateDragState({
      piece,
      x: clientX,
      y: clientY - (mobile ? 60 : 0),
      gridPos: null,
      valid: false,
      dragging: true,
    });
  }, [updateDragState]);

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current.dragging || !dragRef.current.piece) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const offsetY = isMobileRef.current ? 60 : 0;
      const { pos, valid } = snapToGrid(clientX, clientY, dragRef.current.piece!.shape);
      updateDragState({
        x: clientX,
        y: clientY - offsetY,
        gridPos: pos,
        valid,
      });
    });
  }, [snapToGrid, updateDragState]);

  const endDrag = useCallback(() => {
    if (!dragRef.current.dragging || !dragRef.current.piece) {
      updateDragState({ piece: null, dragging: false, gridPos: null, valid: false });
      return;
    }

    const { piece, gridPos, valid } = dragRef.current;
    if (gridPos && valid && piece) {
      onDrop(piece, gridPos);
      if (navigator.vibrate) navigator.vibrate(10);
    } else {
      onInvalidDrop();
      if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
    }

    updateDragState({ piece: null, dragging: false, gridPos: null, valid: false });
  }, [onDrop, onInvalidDrop, updateDragState]);

  return { dragState, startDrag, moveDrag, endDrag };
}
