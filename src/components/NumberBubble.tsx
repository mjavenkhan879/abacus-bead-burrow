import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: number;
  /** Bumped by the parent on every counted bead to replay the pop. */
  trigger: number;
  visible: boolean;
};

/**
 * The visual stand-in for "counted aloud" — no audio ships with this app, so
 * the running total pops as a big numeral instead.
 */
function NumberBubbleBase({ value, trigger, visible }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || trigger <= 0) {
      opacity.setValue(0);
      return;
    }
    scale.setValue(0.6);
    opacity.setValue(1);
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 9,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }, 600);
    return () => clearTimeout(timer);
  }, [trigger, visible, scale, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.bubble, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.text}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    alignSelf: 'center',
    top: -16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    color: theme.colors.text,
  },
});

export const NumberBubble = memo(NumberBubbleBase);
export default NumberBubble;
