import { Piece } from '../../types/game';
import { DraggablePiece } from './DraggablePiece';

interface PieceTrayProps {
  pieces: Piece[];
  cellSize: number;
  onDragStart: (piece: Piece, clientX: number, clientY: number, mobile: boolean) => void;
  disabled?: boolean;
}

export function PieceTray({ pieces, cellSize, onDragStart, disabled }: PieceTrayProps) {
  return (
    <div className="piece-tray">
      {pieces.map(piece => (
        <DraggablePiece
          key={piece.id}
          piece={piece}
          cellSize={cellSize}
          onDragStart={onDragStart}
          disabled={disabled}
        />
      ))}
      {/* Empty slots */}
      {Array.from({ length: 3 - pieces.length }).map((_, i) => (
        <div key={`empty-${i}`} className="piece-tray-empty" />
      ))}
    </div>
  );
}
