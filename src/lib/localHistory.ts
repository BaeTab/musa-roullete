export interface LocalPick {
  id: string;
  typeId: string;
  typeName: string;
  typeEmoji: string;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  menu: string;
  pickedAt: number;
}

type PickInput = Omit<LocalPick, 'id' | 'pickedAt'>;

const HISTORY_KEY = 'roulette:history';
const FAVORITES_KEY = 'roulette:favorites';
const MAX_HISTORY = 30;

function read(key: string): LocalPick[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LocalPick[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: LocalPick[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) */
  }
}

function makeEntry(pick: PickInput): LocalPick {
  return { ...pick, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, pickedAt: Date.now() };
}

export function addHistory(pick: PickInput): LocalPick {
  const entry = makeEntry(pick);
  write(HISTORY_KEY, [entry, ...read(HISTORY_KEY)].slice(0, MAX_HISTORY));
  return entry;
}

export function getHistory(): LocalPick[] {
  return read(HISTORY_KEY);
}

export function getRecentMenuNames(count: number): string[] {
  return getHistory()
    .slice(0, count)
    .map((h) => h.menu);
}

export function clearHistory(): void {
  write(HISTORY_KEY, []);
}

export function getFavorites(): LocalPick[] {
  return read(FAVORITES_KEY);
}

export function isFavorite(menu: string): boolean {
  return getFavorites().some((f) => f.menu === menu);
}

export function toggleFavorite(pick: PickInput): boolean {
  const favorites = read(FAVORITES_KEY);
  const idx = favorites.findIndex((f) => f.menu === pick.menu);
  if (idx >= 0) {
    favorites.splice(idx, 1);
    write(FAVORITES_KEY, favorites);
    return false;
  }
  write(FAVORITES_KEY, [makeEntry(pick), ...favorites]);
  return true;
}

export function removeFavorite(menu: string): void {
  write(FAVORITES_KEY, read(FAVORITES_KEY).filter((f) => f.menu !== menu));
}
