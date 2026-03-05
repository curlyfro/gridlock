import { Piece, PieceShape } from '../types/game';
import { PIECE_SHAPES, PIECE_WEIGHTS } from '../constants/pieces';

let pieceCounter = 0;

export function generatePieceId(): string {
  return `p_${++pieceCounter}_${Date.now()}`;
}

export function pickRandomShape(): PieceShape {
  const totalWeight = PIECE_WEIGHTS.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < PIECE_SHAPES.length; i++) {
    roll -= PIECE_WEIGHTS[i];
    if (roll <= 0) return PIECE_SHAPES[i];
  }
  return PIECE_SHAPES[0];
}

export function drawPieces(count: number = 3): Piece[] {
  return Array.from({ length: count }, () => ({
    id: generatePieceId(),
    shape: pickRandomShape(),
  }));
}
