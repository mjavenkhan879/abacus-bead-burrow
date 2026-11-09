import { BEADS_PER_WIRE, TENS_BEADS } from '../constants/config';

export type GameMode = 'count' | 'sums' | 'free';
export type WireId = 'tens' | 'onesA' | 'onesB';

export type WireConfig = {
  id: WireId;
  unit: number;
  beadCount: number;
};

export type LevelConfig = {
  id: number;
  range: [number, number];
  wires: WireId[];
  mode: GameMode;
};

export const WIRES: Record<WireId, WireConfig> = {
  tens: { id: 'tens', unit: 10, beadCount: TENS_BEADS },
  onesA: { id: 'onesA', unit: 1, beadCount: BEADS_PER_WIRE },
  onesB: { id: 'onesB', unit: 1, beadCount: BEADS_PER_WIRE },
};

export const LEVELS: LevelConfig[] = [
  { id: 1, range: [1, 5], wires: ['onesA'], mode: 'count' },
  { id: 2, range: [1, 10], wires: ['onesA', 'onesB'], mode: 'count' },
  { id: 3, range: [2, 10], wires: ['onesA', 'onesB'], mode: 'sums' },
  { id: 4, range: [11, 20], wires: ['tens', 'onesA', 'onesB'], mode: 'count' },
];

export const MIN_LEVEL = 1;
export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const idx = Math.min(Math.max(level, MIN_LEVEL), MAX_LEVEL) - 1;
  return LEVELS[idx];
}

export function rangeForLevel(level: number): [number, number] {
  return levelConfig(level).range;
}

/** Free play always offers the full three-wire board. */
export function wiresForLevel(level: number, mode: GameMode): WireConfig[] {
  if (mode === 'free') {
    return [WIRES.tens, WIRES.onesA, WIRES.onesB];
  }
  return levelConfig(level).wires.map(id => WIRES[id]);
}

export function modeForLevel(level: number): GameMode {
  return levelConfig(level).mode;
}
