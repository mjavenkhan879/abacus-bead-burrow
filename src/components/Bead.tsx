import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BEAD_SNAP_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  index: number;
  size: number;
  rowHeight: number;
  color: string;
  targetX: number;
  label?: string;
  disabled?: boolean;
  highlighted?: boolean;
  /** Commits the drag and returns the resting X for this bead. */
  resolveDrop: (index: number, dx: number) => number;
};

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.round((n & 255) * (1 - amount)));
  return `rgb(${r},${g},${b})`;
}

/**
 * A single abacus bead. Drag handling is PanResponder only — external gesture
 * libraries are banned on this stack. A short press with almost no travel counts as a tap
 * so small fingers (and the UI test) can also just poke the bead.
 */
function BeadBase({
  index,
  size,
  rowHeight,
  color,
  targetX,
  label,
  disabled = false,
  highlighted = false,
  resolveDrop,
}: Props) {
  const x = useRef(new Animated.Value(targetX)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const targetRef = useRef(targetX);
  const dragging = useRef(false);

  useEffect(() => {
    targetRef.current = targetX;
    if (dragging.current) {
      return;
    }
    Animated.timing(x, {
      toValue: targetX,
      duration: BEAD_SNAP_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [targetX, x]);

  useEffect(() => {
    if (!highlighted) {
      glow.setValue(0);
      return;
    }
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.12,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.sequence([
      Animated.timing(glow, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [highlighted, scale, glow]);

  const thump = () => {
    scale.stopAnimation();
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 45,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          dragging.current = true;
          scale.stopAnimation();
          Animated.timing(scale, {
            toValue: 1.06,
            duration: 70,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: (_evt, gesture) => {
          // 0.92 damping gives the bead a little wooden friction.
          x.setValue(targetRef.current + gesture.dx * 0.92);
        },
        onPanResponderRelease: (_evt, gesture) => {
          dragging.current = false;
          const resting = resolveDrop(index, gesture.dx);
          targetRef.current = resting;
          Animated.timing(x, {
            toValue: resting,
            duration: BEAD_SNAP_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start();
          thump();
        },
        onPanResponderTerminate: () => {
          dragging.current = false;
          Animated.timing(x, {
            toValue: targetRef.current,
            duration: BEAD_SNAP_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, index, resolveDrop],
  );

  const diameter = size;
  const top = (rowHeight - diameter) / 2;

  return (
    <Animated.View
      {...responder.panHandlers}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`bead ${index + 1}`}
      style={[
        styles.wrap,
        {
          width: diameter,
          height: diameter,
          top,
          borderRadius: diameter / 2,
          transform: [{ translateX: x }, { scale }],
        },
      ]}>
      <LinearGradient
        colors={[color, darken(color, 0.14)]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[
          styles.body,
          { borderRadius: diameter / 2, width: diameter, height: diameter },
        ]}>
        <View
          pointerEvents="none"
          style={[
            styles.gloss,
            {
              top: diameter * 0.1,
              left: diameter * 0.18,
              right: diameter * 0.18,
              height: diameter * 0.22,
              borderRadius: diameter * 0.2,
            },
          ]}
        />
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </LinearGradient>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          {
            width: diameter + 10,
            height: diameter + 10,
            borderRadius: (diameter + 10) / 2,
            opacity: glow,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D3A23',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  body: { alignItems: 'center', justifyContent: 'center' },
  gloss: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.onPrimary,
    letterSpacing: 0.5,
  },
  ring: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: theme.colors.gold,
  },
});

export const Bead = memo(BeadBase);
export default Bead;
