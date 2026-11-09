import React, { memo, useCallback, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Lock } from 'lucide-react-native';
import { PARENT_GATE_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = { onUnlock: () => void; label: string };

const RING = 34;
const R = 14;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Hold-to-unlock gate in front of the grown-up corner. A green disc grows
 * inside the ring over 3s; letting go early resets it, so a small child never
 * slips through. Scale only — native driver stays legal.
 */
function ParentGateButtonBase({ onUnlock, label }: Props) {
  const fill = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    fill.stopAnimation();
    Animated.timing(fill, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [fill]);

  const start = useCallback(() => {
    fill.setValue(0);
    Animated.timing(fill, {
      toValue: 1,
      duration: PARENT_GATE_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    timer.current = setTimeout(() => {
      timer.current = null;
      onUnlock();
    }, PARENT_GATE_MS);
  }, [fill, onUnlock]);

  return (
    <Pressable
      onPressIn={start}
      onPressOut={stop}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <View style={styles.pill}>
        <View style={styles.ring}>
          <Animated.View
            pointerEvents="none"
            style={[styles.disc, { transform: [{ scale: fill }] }]}
          />
          <Svg width={RING} height={RING} style={styles.svg}>
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke={theme.colors.border}
              strokeWidth={3}
              fill="none"
            />
          </Svg>
          <View pointerEvents="none" style={styles.lock}>
            <Lock size={16} color={theme.colors.textSecondary} strokeWidth={2.4} />
          </View>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  pill: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ring: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: { position: 'absolute' },
  disc: {
    position: 'absolute',
    width: R * 2,
    height: R * 2,
    borderRadius: R,
    backgroundColor: 'rgba(106,153,78,0.35)',
  },
  lock: { position: 'absolute' },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
});

export const ParentGateButton = memo(ParentGateButtonBase);
export default ParentGateButton;
