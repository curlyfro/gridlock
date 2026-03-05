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
    minDelay: 800,
    maxDelay: 1500,
    clearEfficiency: 0.8,
    lookaheadDepth: 1,
    usePowerUps: true,
  },
  hard: {
    minDelay: 300,
    maxDelay: 700,
    clearEfficiency: 0.95,
    lookaheadDepth: 2,
    usePowerUps: true,
  },
};
