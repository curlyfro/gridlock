export const LEVEL_SCORE_TARGETS = [
  100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000,
];

export function getLevelTarget(level: number): number {
  if (level <= LEVEL_SCORE_TARGETS.length) {
    return LEVEL_SCORE_TARGETS[level - 1];
  }
  // Beyond defined levels, scale linearly
  const last = LEVEL_SCORE_TARGETS[LEVEL_SCORE_TARGETS.length - 1];
  return last + (level - LEVEL_SCORE_TARGETS.length) * 1000;
}

// AI speed modifier per level (multiplied with base delay)
export function getAiSpeedModifier(level: number): number {
  return Math.max(0.5, 1 - (level - 1) * 0.05);
}
