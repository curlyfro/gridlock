import { useEffect, useState } from 'react';
import { GRID_SIZE } from '../constants/pieces';

export function useResponsiveGrid(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const maxSize = Math.min(width, height);
        const newCellSize = Math.floor(maxSize / GRID_SIZE);
        setCellSize(Math.max(20, Math.min(64, newCellSize)));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return { cellSize, gridPixelSize: cellSize * GRID_SIZE };
}
