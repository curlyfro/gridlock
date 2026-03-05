import { useRef, useCallback, useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useGameLoop } from '../../hooks/useGameLoop';
import { GameBoard } from '../game/GameBoard';
import { PieceTray } from '../game/PieceTray';
import { FloatingPiece } from '../game/FloatingPiece';
import { ScorePanel } from '../game/ScorePanel';
import { PowerUpBar } from '../game/PowerUpBar';
import { JunkIndicator } from '../game/JunkIndicator';
import { AIPanel } from '../ai/AIPanel';
import { VSCenter } from '../vs/VSCenter';
import { ScreenShake } from '../effects/ScreenShake';
import { Piece, GridPosition } from '../../types/game';
import { sfxPlace, sfxClear, sfxMultiClear, sfxInvalid, sfxSnap, sfxPowerUp } from '../../audio/sfx';
import { spawnParticles } from '../effects/ParticleCanvas';
import { COLORS } from '../../constants/theme';
import { findFullRows, findFullCols, placePieceOnGrid } from '../../engine/grid';

export function GameScreen() {
  const humanBoardRef = useRef<HTMLDivElement>(null);
  const humanContainerRef = useRef<HTMLDivElement>(null);
  const aiBoardRef = useRef<HTMLDivElement>(null);
  const aiContainerRef = useRef<HTMLDivElement>(null);

  const { cellSize: humanCellSize } = useResponsiveGrid(humanContainerRef);
  const { cellSize: aiCellSize } = useResponsiveGrid(aiContainerRef);

  const human = useGameStore(s => s.human);
  const ai = useGameStore(s => s.ai);
  const difficulty = useGameStore(s => s.difficulty);
  const mode = useGameStore(s => s.mode);
  const aiThinking = useGameStore(s => s.aiThinking);
  const activePowerUp = useGameStore(s => s.activePowerUp);
  const placePiece = useGameStore(s => s.placePiece);
  const activatePowerUp = useGameStore(s => s.activatePowerUp);
  const useBomb = useGameStore(s => s.useBomb);
  const useRowZap = useGameStore(s => s.useRowZap);
  const checkGameOver = useGameStore(s => s.checkGameOver);
  const tickTimer = useGameStore(s => s.tickTimer);
  const timeRemaining = useGameStore(s => s.timeRemaining);
  const scoreTarget = useGameStore(s => s.scoreTarget);
  const rounds = useGameStore(s => s.rounds);

  const [shakeTrigger, setShakeTrigger] = useState(0);

  useGameLoop();

  // Timer tick for timed mode
  useEffect(() => {
    if (mode !== 'timed') return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [mode, tickTimer]);

  const handleDrop = useCallback((piece: Piece, pos: GridPosition) => {
    // Check what clearing will happen
    const newGrid = placePieceOnGrid(human.grid, piece.shape, pos);
    const rows = findFullRows(newGrid);
    const cols = findFullCols(newGrid);
    const totalCleared = rows.length + cols.length;

    placePiece('human', piece.id, pos);

    if (totalCleared > 0) {
      totalCleared >= 2 ? sfxMultiClear() : sfxClear();
      setShakeTrigger(s => s + 1);

      // Spawn particles at board center
      const board = humanBoardRef.current;
      if (board) {
        const rect = board.getBoundingClientRect();
        spawnParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          COLORS.neonGreen,
          totalCleared * 8
        );
      }
    } else {
      sfxPlace();
    }

    // Check game over after placement
    setTimeout(() => checkGameOver('human'), 50);
  }, [human.grid, placePiece, checkGameOver]);

  const handleInvalidDrop = useCallback(() => {
    sfxInvalid();
  }, []);

  const isWildcard = activePowerUp?.type === 'wildcard';

  const { dragState, startDrag, moveDrag, endDrag } = useDragAndDrop({
    grid: human.grid,
    cellSize: humanCellSize,
    boardRef: humanBoardRef,
    onDrop: handleDrop,
    onInvalidDrop: handleInvalidDrop,
    isWildcard,
  });

  const handleBoardClick = useCallback((pos: GridPosition) => {
    if (activePowerUp?.type === 'bomb') {
      useBomb(pos);
      sfxPowerUp();
      const board = humanBoardRef.current;
      if (board) {
        const rect = board.getBoundingClientRect();
        spawnParticles(
          rect.left + pos.col * humanCellSize + humanCellSize / 2,
          rect.top + pos.row * humanCellSize + humanCellSize / 2,
          COLORS.neonPink,
          20
        );
      }
    }
  }, [activePowerUp, useBomb, humanCellSize]);

  const handleRowZapRow = useCallback((index: number) => {
    if (activePowerUp?.type === 'rowZap') {
      useRowZap(index, 'row');
      sfxPowerUp();
      setShakeTrigger(s => s + 1);
    }
  }, [activePowerUp, useRowZap]);

  const handleRowZapCol = useCallback((index: number) => {
    if (activePowerUp?.type === 'rowZap') {
      useRowZap(index, 'col');
      sfxPowerUp();
      setShakeTrigger(s => s + 1);
    }
  }, [activePowerUp, useRowZap]);

  // Track last grid position for snap SFX
  const lastSnapPos = useRef<string | null>(null);

  // Global pointer move/up handlers for drag
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      moveDrag(e.clientX, e.clientY);
    };
    const handleUp = () => endDrag();

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [moveDrag, endDrag]);

  // Play snap SFX only when grid position changes
  useEffect(() => {
    const key = dragState.gridPos ? `${dragState.gridPos.row},${dragState.gridPos.col}` : null;
    if (dragState.dragging && key && key !== lastSnapPos.current) {
      sfxSnap();
    }
    lastSnapPos.current = key;
  }, [dragState.gridPos, dragState.dragging]);

  const ghostShape = dragState.dragging && dragState.piece ? dragState.piece.shape : null;
  const isPowerUpMode = activePowerUp !== null && activePowerUp.type !== 'wildcard';

  return (
    <div className="game-screen">
      <ScreenShake trigger={shakeTrigger} intensity={human.onFire ? 8 : 4}>
        <div className="game-layout">
          {/* Human side */}
          <div className="player-side human-side">
            <ScorePanel
              score={human.score}
              level={human.level}
              combo={human.combo}
              onFire={human.onFire}
              label="YOU"
              linesCleared={human.linesCleared}
            />
            <div className="board-container" ref={humanContainerRef}>
              <JunkIndicator pendingJunk={human.pendingJunk} />
              <GameBoard
                grid={human.grid}
                cellSize={humanCellSize}
                ghostPos={dragState.gridPos}
                ghostShape={ghostShape}
                ghostValid={dragState.valid}
                onFire={human.onFire}
                boardRef={humanBoardRef}
                onCellClick={isPowerUpMode ? handleBoardClick : undefined}
                showRowColHeaders={activePowerUp?.type === 'rowZap'}
                onRowClick={handleRowZapRow}
                onColClick={handleRowZapCol}
              />
            </div>
            <PowerUpBar
              powerUps={human.powerUps}
              activePowerUp={activePowerUp?.type ?? null}
              onActivate={activatePowerUp}
            />
            <PieceTray
              pieces={human.pieces}
              cellSize={humanCellSize}
              onDragStart={startDrag}
              disabled={isPowerUpMode}
            />
          </div>

          {/* VS Center */}
          <div className="vs-column">
            <VSCenter />
            {mode === 'timed' && (
              <div className={`mode-hud timer-hud ${timeRemaining <= 30 ? 'timer-warning' : ''}`}>
                <div className="hud-label">TIME</div>
                <div className="hud-value">
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </div>
            )}
            {mode === 'scoreRace' && (
              <div className="mode-hud target-hud">
                <div className="hud-label">TARGET</div>
                <div className="hud-value">{scoreTarget}</div>
              </div>
            )}
            {mode === 'bestOf3' && (
              <div className="mode-hud round-hud">
                <div className="hud-label">ROUND {rounds.currentRound}</div>
                <div className="hud-value">{rounds.humanWins} - {rounds.aiWins}</div>
              </div>
            )}
          </div>

          {/* AI side */}
          <div className="player-side ai-side">
            <AIPanel aiState={ai} difficulty={difficulty} thinking={aiThinking} />
            <ScorePanel
              score={ai.score}
              level={ai.level}
              combo={ai.combo}
              onFire={ai.onFire}
              label="AI"
              linesCleared={ai.linesCleared}
            />
            <div className="board-container ai-board-container" ref={aiContainerRef}>
              <JunkIndicator pendingJunk={ai.pendingJunk} />
              <GameBoard
                grid={ai.grid}
                cellSize={aiCellSize}
                ghostPos={null}
                ghostShape={null}
                ghostValid={false}
                onFire={ai.onFire}
                boardRef={aiBoardRef}
                dimmed={false}
                label="AI BOARD"
              />
            </div>
          </div>
        </div>
      </ScreenShake>

      <FloatingPiece dragState={dragState} cellSize={humanCellSize} />
    </div>
  );
}
