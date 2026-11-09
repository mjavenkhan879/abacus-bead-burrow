import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AssetIcon from './AssetIcon';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  enabled: boolean;
  onPress: () => void;
  /** Bumped on a wrong answer to replay the gentle shake. */
  shakeKey: number;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/** The primary check CTA. Icon 28x28, label lineHeight 28, gap 10 (rule #20). */
function BurrowDoorButtonBase({ label, enabled, onPress, shakeKey }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shakeKey <= 0) {
      return;
    }
    Animated.sequence([
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeKey, shake]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-6, 6],
  });

  const content = (
    <View style={styles.row}>
      <AssetIcon
        name="door"
        style={styles.icon}
        color={enabled ? theme.colors.onPrimary : theme.colors.textMuted}
      />
      <Text numberOfLines={1} style={[styles.label, !enabled && styles.off]}>
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }, { translateX }] }]}>
        {enabled ? (
          <LinearGradient
            colors={[...theme.gradients.carrot]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fill, theme.shadows.carrot]}>
            <View pointerEvents="none" style={styles.innerTop} />
            {content}
          </LinearGradient>
        ) : (
          <View style={[styles.fill, styles.flat]}>{content}</View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 64 },
  fill: {
    width: '100%',
    height: 64,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flat: { backgroundColor: theme.colors.disabled },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  icon: { width: 28, height: 28 },
  label: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: theme.colors.onPrimary,
  },
  off: { color: theme.colors.textMuted },
  innerTop: {
    position: 'absolute',
    top: 3,
    left: 18,
    right: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export const BurrowDoorButton = memo(BurrowDoorButtonBase);
export default BurrowDoorButton;
