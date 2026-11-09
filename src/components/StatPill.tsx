import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string | number;
  label: string;
  valueColor: string;
};

/**
 * Rule #21 pattern: accent dot + big coloured numeral + caption. No raster
 * icons — three AI sprites in a row never line up.
 * Width comes from the parent slot (`flex:1`), height from the content —
 * never `flex:1` inside `flex:1` (rule #19a).
 */
function StatPillBase({ value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export const StatPill = memo(StatPillBase);
export default StatPill;
