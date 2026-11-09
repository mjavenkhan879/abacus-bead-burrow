import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  options: string[];
  value: string;
  onChange: (next: string) => void;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function SegmentedChipsBase({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map(option => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option}
            style={[styles.chip, active ? styles.on : styles.off]}>
            <Text style={[styles.text, active ? styles.textOn : styles.textOff]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    width: 48,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  on: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  off: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.border,
  },
  text: { fontSize: 13, lineHeight: 16, fontWeight: '900', letterSpacing: 1 },
  textOn: { color: theme.colors.onPrimary },
  textOff: { color: theme.colors.textSecondary },
});

export const SegmentedChips = memo(SegmentedChipsBase);
export default SegmentedChips;
