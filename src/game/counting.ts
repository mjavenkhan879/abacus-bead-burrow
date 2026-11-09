import { MAX_NUMBER } from '../constants/config';
import { GameMode, levelConfig, rangeForLevel } from './levels';

export type Round = {
  index: number;
  target: number;
  a: number;
  b: number;
  mode: GameMode;
};

function randomInt(lo: number, hi: number): number {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Builds the next round. `easier` pulls the target from the lower half of the
 * range (used right after the child needed a recount).
 */
export function generateRound(
  level: number,
  index: number,
  lastTarget: number,
  mode: GameMode,
  easier: boolean,
): Round {
  const cfg = levelConfig(level);
  const roundMode: GameMode = mode === 'free' ? 'free' : cfg.mode;
  let [lo, hi] = rangeForLevel(level);
  if (easier) {
    hi = Math.max(lo, lo + Math.floor((hi - lo) / 2));
  }

  let target = randomInt(lo, hi);
  let guard = 0;
  while (target === lastTarget && hi > lo && guard < 12) {
    target = randomInt(lo, hi);
    guard += 1;
  }

  let a = 0;
  let b = 0;
  if (roundMode === 'sums') {
    a = randomInt(1, Math.max(1, target - 1));
    b = target - a;
    if (b < 1) {
      a = Math.max(1, target - 1);
      b = target - a;
    }
  }

  return { index, target, a, b, mode: roundMode };
}

export type AnswerCheck = {
  ok: boolean;
  reason: 'total' | 'groups' | 'none';
};

/**
 * `counted` is the board total; `groups` the per-wire unit counts in the order
 * the wires are rendered. In sums mode the two ones wires must hold a and b.
 */
export function checkAnswer(
  counted: number,
  groups: number[],
  round: Round,
): AnswerCheck {
  if (counted !== round.target) {
    return { ok: false, reason: 'total' };
  }
  if (round.mode === 'sums') {
    const first = groups[0] ?? 0;
    const second = groups[1] ?? 0;
    const matched =
      (first === round.a && second === round.b) ||
      (first === round.b && second === round.a);
    if (!matched) {
      return { ok: false, reason: 'groups' };
    }
  }
  return { ok: true, reason: 'none' };
}

export function starsForSession(correct: number, rounds: number): number {
  if (rounds <= 0) {
    return 0;
  }
  const pct = correct / rounds;
  if (pct >= 0.95) {
    return 3;
  }
  if (pct >= 0.6) {
    return 2;
  }
  if (correct > 0) {
    return 1;
  }
  return 0;
}

export type PantryRoom = { index: number; label: string; capacity: number };

export const PANTRY_ROOMS: PantryRoom[] = [
  { index: 0, label: '1-5', capacity: 5 },
  { index: 1, label: '6-10', capacity: 5 },
  { index: 2, label: '11-20', capacity: 10 },
];

export function roomForNumber(n: number): number {
  if (n <= 5) {
    return 0;
  }
  if (n <= 10) {
    return 1;
  }
  return 2;
}

export function roomFill(mastered: number[], room: number): number {
  return mastered.filter(n => roomForNumber(n) === room).length;
}

export function masteredPct(mastered: number[]): number {
  return Math.round((mastered.length / MAX_NUMBER) * 100);
}
