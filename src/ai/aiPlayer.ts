import { Difficulty, PlayerState, GridPosition } from '../types/game';
import { AI_CONFIGS } from '../constants/ai';
import { getAiSpeedModifier } from '../constants/levels';
import { scoreAllPlacements } from './evaluation';
import { findAllValidPlacements } from '../engine/validation';

export interface AiMove {
  pieceIndex: number;
  position: GridPosition;
}

export function computeAiMove(
  player: PlayerState,
  difficulty: Difficulty
): AiMove | null {
  const config = AI_CONFIGS[difficulty];

  if (player.pieces.length === 0) return null;

  // Check if any piece can be placed at all
  const anyValid = player.pieces.some(
    p => findAllValidPlacements(player.grid, p.shape).length > 0
  );
  if (!anyValid) return null;

  // Score all possible placements
  const allScores = scoreAllPlacements(
    player.grid,
    player.pieces,
    config.lookaheadDepth
  );

  if (allScores.length === 0) return null;

  // Sort by score descending
  allScores.sort((a, b) => b.score - a.score);

  // Apply efficiency - chance to pick suboptimal move
  let chosen;
  if (Math.random() < config.clearEfficiency) {
    chosen = allScores[0]; // best move
  } else {
    // Pick a random move from top 50%
    const topHalf = allScores.slice(0, Math.max(1, Math.floor(allScores.length / 2)));
    chosen = topHalf[Math.floor(Math.random() * topHalf.length)];
  }

  return {
    pieceIndex: chosen.pieceIndex,
    position: chosen.position,
  };
}

export function getAiDelay(difficulty: Difficulty, level: number): number {
  const config = AI_CONFIGS[difficulty];
  const modifier = getAiSpeedModifier(level);
  const base = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
  return Math.floor(base * modifier);
}
