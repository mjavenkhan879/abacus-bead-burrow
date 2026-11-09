import React, { memo, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import Bead from './Bead';

type Props = {
  wireIndex: number;
  unit: number;
  beadCount: number;
  counted: number;
  innerWidth: number;
  slot: number;
  beadSize: number;
  rowHeight: number;
  colors: string[];
  disabled?: boolean;
  /** Index of the bead currently lit by the recount walkthrough, -1 = none. */
  highlightIndex?: number;
  onChange: (wireIndex: number, next: number) => void;
};

/**
 * Counted beads rest packed against the LEFT end cap, untouched beads against
 * the right one. Bead `i` is counted when `i < counted`.
 */
function BeadWireBase({
  wireIndex,
  unit,
  beadCount,
  counted,
  innerWidth,
  slot,
  beadSize,
  rowHeight,
  colors,
  disabled = false,
  highlightIndex = -1,
  onChange,
}: Props) {
  const countedRef = useRef(counted);

  useEffect(() => {
    countedRef.current = counted;
  }, [counted]);

  const xFor = useCallback(
    (index: number, count: number) => {
      const pad = (slot - beadSize) / 2;
      if (index < count) {
        return index * slot + pad;
      }
      return innerWidth - (beadCount - index) * slot + pad;
    },
    [beadCount, beadSize, innerWidth, slot],
  );

  const resolveDrop = useCallback(
    (index: number, dx: number) => {
      const current = countedRef.current;
      const threshold = Math.max(8, slot * 0.3);
      let next = current;

      if (Math.abs(dx) < 8) {
        // a plain poke toggles this bead's group
        next = index < current ? index : index + 1;
      } else if (dx <= -threshold) {
        next = index + 1;
      } else if (dx >= threshold) {
        next = index;
      }

      next = Math.min(Math.max(next, 0), beadCount);
      if (next !== current) {
        countedRef.current = next;
        onChange(wireIndex, next);
      }
      return xFor(index, next);
    },
    [beadCount, onChange, slot, wireIndex, xFor],
  );

  const beads = [];
  for (let i = 0; i < beadCount; i += 1) {
    beads.push(
      <Bead
        key={`bead-${wireIndex}-${i}`}
        index={i}
        size={beadSize}
        rowHeight={rowHeight}
        color={unit === 10 ? theme.colors.accentDark : colors[i % colors.length]}
        targetX={xFor(i, counted)}
        label={unit === 10 ? '10' : undefined}
        disabled={disabled}
        highlighted={highlightIndex === i}
        resolveDrop={resolveDrop}
      />,
    );
  }

  return (
    <View style={[styles.row, { width: innerWidth, height: rowHeight }]}>
      <View style={[styles.rail, { top: rowHeight / 2 - 3 }]}>
        <View pointerEvents="none" style={styles.railGloss} />
      </View>
      <View style={[styles.cap, styles.capLeft, { height: rowHeight - 16 }]} />
      <View style={[styles.cap, styles.capRight, { height: rowHeight - 16 }]} />
      {beads}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'relative', justifyContent: 'center' },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.wood,
  },
  railGloss: {
    position: 'absolute',
    top: 1,
    left: 6,
    right: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cap: {
    position: 'absolute',
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.woodDark,
  },
  capLeft: { left: -4 },
  capRight: { right: -4 },
});

export const BeadWire = memo(BeadWireBase);
export default BeadWire;
