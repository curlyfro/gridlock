export const POINTS_PER_CELL = 1;

export const CLEAR_BONUS: Record<number, number> = {
  1: 10,
  2: 25,
  3: 50,
  4: 80,
};

export const COMBO_MULTIPLIER = 1.5;
export const ON_FIRE_THRESHOLD = 3; // consecutive clears to activate
export const ON_FIRE_SCORE_MULTIPLIER = 2;

// Junk rows sent based on lines cleared
export const JUNK_ROWS: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
};

// Extra junk for 5+ clears
export const JUNK_PER_EXTRA_CLEAR = 1;

export const POWER_UP_BOMB_RADIUS = 1; // 3x3 (center +/- 1)
export const POWER_UP_BOMB_POINTS = 5;
export const POWER_UP_ROW_ZAP_POINTS = 15;
export const MAX_POWER_UP_CHARGES = 2;
