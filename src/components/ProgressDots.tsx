import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

type Props = { total: number; done: number };

function ProgressDotsBase({ total, done }: Props) {
  const dots = [];
  for (let i = 0; i < total; i += 1) {
    dots.push(
      <View
        key={`dot-${i}`}
        style={[
          styles.dot,
          i < done ? styles.done : styles.pending,
          i < done ? styles.grown : null,
        ]}
      />,
    );
  }
  return <View style={styles.row}>{dots}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  grown: { width: 10, height: 10, borderRadius: 5 },
  done: { backgroundColor: theme.colors.primary },
  pending: { backgroundColor: theme.colors.border },
});

export const ProgressDots = memo(ProgressDotsBase);
export default ProgressDots;
