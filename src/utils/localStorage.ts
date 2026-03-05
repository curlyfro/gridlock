const STORAGE_KEY = 'gridlock';

interface SaveData {
  highScores: { easy: number; medium: number; hard: number };
  settings: { sfxVolume: number; musicVolume: number; muted: boolean };
}

const defaultData: SaveData = {
  highScores: { easy: 0, medium: 0, hard: 0 },
  settings: { sfxVolume: 0.5, musicVolume: 0.3, muted: false },
};

export function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {}
  return defaultData;
}

export function saveSaveData(data: Partial<SaveData>) {
  try {
    const existing = loadSaveData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {}
}

export function saveHighScore(difficulty: 'easy' | 'medium' | 'hard', score: number) {
  const data = loadSaveData();
  if (score > data.highScores[difficulty]) {
    data.highScores[difficulty] = score;
    saveSaveData(data);
  }
}
