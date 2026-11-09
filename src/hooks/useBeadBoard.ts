import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameMode, WireConfig, wiresForLevel } from '../game/levels';

export type BeadBoard = {
  wires: WireConfig[];
  /** How many beads are pushed to the counted side, per wire. */
  groups: number[];
  /** Board total, weighted by each wire's unit (1 or 10). */
  counted: number;
  setWire: (index: number, value: number) => void;
  undo: () => void;
  clear: () => void;
};

/**
 * Owns the per-wire bead counts. The live array is mirrored into a ref so the
 * PanResponder callbacks of <Bead> always read the current value (rule #8).
 */
export function useBeadBoard(level: number, mode: GameMode): BeadBoard {
  const wires = useMemo(() => wiresForLevel(level, mode), [level, mode]);

  const [groups, setGroups] = useState<number[]>(() => wires.map(() => 0));
  const groupsRef = useRef<number[]>(groups);
  const history = useRef<number[][]>([]);

  useEffect(() => {
    const fresh = wires.map(() => 0);
    groupsRef.current = fresh;
    history.current = [];
    setGroups(fresh);
  }, [wires]);

  const setWire = useCallback(
    (index: number, value: number) => {
      const current = groupsRef.current;
      if (index < 0 || index >= current.length) {
        return;
      }
      const max = wires[index] ? wires[index].beadCount : 0;
      const next = Math.min(Math.max(value, 0), max);
      if (next === current[index]) {
        return;
      }
      history.current = [...history.current.slice(-24), current];
      const updated = current.slice();
      updated[index] = next;
      groupsRef.current = updated;
      setGroups(updated);
    },
    [wires],
  );

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (!prev) {
      return;
    }
    groupsRef.current = prev;
    setGroups(prev);
  }, []);

  const clear = useCallback(() => {
    const fresh = groupsRef.current.map(() => 0);
    history.current = [];
    groupsRef.current = fresh;
    setGroups(fresh);
  }, []);

  const counted = useMemo(
    () =>
      groups.reduce(
        (sum, value, i) => sum + value * (wires[i] ? wires[i].unit : 0),
        0,
      ),
    [groups, wires],
  );

  return { wires, groups, counted, setWire, undo, clear };
}

export default useBeadBoard;
