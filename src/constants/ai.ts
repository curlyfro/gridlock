import { Difficulty } from '../types/game';

export interface AiConfig {
  minDelay: number;
  maxDelay: number;
  clearEfficiency: number; // 0-1, chance of picking optimal move
  lookaheadDepth: number;
  usePowerUps: boolean;
}

export const AI_CONFIGS: Record<Difficulty, AiConfig> = {
  easy: {
    minDelay: 1500,
    maxDelay: 2500,
    clearEfficiency: 0.6,
    lookaheadDepth: 0,
    usePowerUps: false,
  },
  medium: {
    minDelay: 1000,
    maxDelay: 1800,
    clearEfficiency: 0.72,
    lookaheadDepth: 1,
    usePowerUps: true,
  },
  hard: {
    minDelay: 500,
    maxDelay: 1000,
    clearEfficiency: 0.80,
    lookaheadDepth: 1,
    usePowerUps: true,
  },
};
