import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { computeAiMove, getAiDelay } from '../ai/aiPlayer';
import { sfxPlace, sfxClear, sfxMultiClear, sfxGameOver, sfxPowerUp } from '../audio/sfx';
import { findFullRows, findFullCols } from '../engine/grid';
import { placePieceOnGrid } from '../engine/grid';
import { AI_CONFIGS } from '../constants/ai';

export function useGameLoop() {
  const phase = useGameStore(s => s.phase);
  const difficulty = useGameStore(s => s.difficulty);
  const level = useGameStore(s => s.level);
  const placePiece = useGameStore(s => s.placePiece);
  const setAiThinking = useGameStore(s => s.setAiThinking);
  const checkGameOver = useGameStore(s => s.checkGameOver);
  const aiUsePowerUp = useGameStore(s => s.aiUsePowerUp);

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiRunningRef = useRef(false);

  const scheduleAiMove = useCallback(() => {
    if (aiRunningRef.current) return;
    const state = useGameStore.getState();
    if (state.phase !== 'playing') return;
    if (state.ai.pieces.length === 0) return;

    aiRunningRef.current = true;
    setAiThinking(true);
    const delay = getAiDelay(difficulty, level);

    aiTimerRef.current = setTimeout(() => {
      const current = useGameStore.getState();
      if (current.phase !== 'playing') {
        aiRunningRef.current = false;
        setAiThinking(false);
        return;
      }

      // AI tries to use power-ups first (on medium/hard)
      if (AI_CONFIGS[difficulty].usePowerUps && current.ai.powerUps.length > 0) {
        const used = aiUsePowerUp();
        if (used) {
          sfxPowerUp();
          aiRunningRef.current = false;
          setAiThinking(false);
          // Schedule next move
          scheduleAiMove();
          return;
        }
      }

      const move = computeAiMove(current.ai, difficulty);

      if (move) {
        const piece = current.ai.pieces[move.pieceIndex];
        if (piece) {
          const newGrid = placePieceOnGrid(current.ai.grid, piece.shape, move.position);
          const rows = findFullRows(newGrid);
          const cols = findFullCols(newGrid);
          const totalCleared = rows.length + cols.length;

          placePiece('ai', piece.id, move.position);

          if (totalCleared > 0) {
            totalCleared >= 2 ? sfxMultiClear() : sfxClear();
          } else {
            sfxPlace();
          }
        }
      }

      aiRunningRef.current = false;
      setAiThinking(false);

      // Check AI game over
      const afterState = useGameStore.getState();
      if (afterState.phase === 'playing') {
        const gameOver = checkGameOver('ai');
        if (gameOver) {
          sfxGameOver();
          return;
        }
        // Schedule next move
        scheduleAiMove();
      }
    }, delay);
  }, [difficulty, level, placePiece, setAiThinking, checkGameOver, aiUsePowerUp]);

  // Start AI loop when game begins, restart when pieces refresh
  useEffect(() => {
    if (phase !== 'playing') {
      aiRunningRef.current = false;
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      return;
    }

    scheduleAiMove();

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      aiRunningRef.current = false;
    };
  }, [phase, scheduleAiMove]);

  // Also check human game over whenever human state changes
  useEffect(() => {
    if (phase !== 'playing') return;
    const gameOver = checkGameOver('human');
    if (gameOver) sfxGameOver();
  }, [phase, checkGameOver]);
}
