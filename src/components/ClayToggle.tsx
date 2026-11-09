import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

type Props = { value: boolean; onChange: (next: boolean) => void; label: string };

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function ClayToggleBase({ value, onChange, label }: Props) {
  const slide = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: value ? 1 : 0,
      tension: 180,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [value, slide]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 24],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT_SLOP}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.press}>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? theme.colors.primary : theme.colors.border },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.knob, { transform: [{ translateX }] }]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 52, height: 48, alignItems: 'center', justifyContent: 'center' },
  track: {
    width: 52,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surface,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export const ClayToggle = memo(ClayToggleBase);
export default ClayToggle;
