import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AssetIcon from './AssetIcon';
import {
  EAR_TWITCH_MS,
  REQUEST_H,
  REQUEST_MAX_PICS,
  REQUEST_PIC,
} from '../constants/config';
import theme from '../constants/theme';
import ClayCard from './ClayCard';

type Props = {
  mode: 'count' | 'sums' | 'free';
  target: number;
  a: number;
  b: number;
  message?: string;
  /** Bumped by the parent to replay the ear twitch. */
  twitchKey: number;
};

function CarrotRow({ n }: { n: number }) {
  const shown = Math.min(n, REQUEST_MAX_PICS);
  const pics = [];
  for (let i = 0; i < shown; i += 1) {
    pics.push(
      <AssetIcon key={`pic-${i}`} name="carrot" style={styles.pic} />,
    );
  }
  return <View style={styles.pics}>{pics}</View>;
}

function RabbitRequestBase({ mode, target, a, b, message, twitchKey }: Props) {
  const tilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(tilt, {
        toValue: -1,
        duration: EAR_TWITCH_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(tilt, {
        toValue: 1,
        duration: EAR_TWITCH_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(tilt, {
        toValue: 0,
        duration: EAR_TWITCH_MS / 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [twitchKey, tilt]);

  const rotate = tilt.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <ClayCard style={styles.card}>
      <Animated.View
        accessibilityLabel="rabbit"
        style={[styles.rabbit, { transform: [{ rotate }] }]}>
        <AssetIcon name="rabbit" style={styles.rabbitGlyph} />
      </Animated.View>
      <View style={styles.bubble}>
        <View pointerEvents="none" style={styles.tail} />
        {message ? (
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        ) : mode === 'free' ? (
          <Text style={styles.message} numberOfLines={2}>
            COUNT WHATEVER YOU LIKE
          </Text>
        ) : mode === 'sums' ? (
          <View style={styles.sums}>
            <CarrotRow n={a} />
            <Text style={styles.plus}>+</Text>
            <CarrotRow n={b} />
            <View style={styles.chip}>
              <Text style={styles.chipText}>{target}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.count}>
            <CarrotRow n={target} />
            <View style={styles.chip}>
              <Text style={styles.chipText}>{target}</Text>
            </View>
          </View>
        )}
      </View>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: {
    height: REQUEST_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  rabbit: { width: 80, height: 80 },
  rabbitGlyph: { width: 80, height: 80 },
  bubble: {
    flex: 1,
    minHeight: REQUEST_H - 28,
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  tail: {
    position: 'absolute',
    left: -7,
    top: 30,
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: theme.colors.bg,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.border,
    transform: [{ rotate: '45deg' }],
  },
  count: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sums: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pics: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 3,
  },
  pic: { width: REQUEST_PIC, height: REQUEST_PIC },
  plus: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  chip: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surfaceWarm,
    borderWidth: 2,
    borderColor: theme.colors.borderWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    color: theme.colors.accentDark,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text,
  },
});

export const RabbitRequest = memo(RabbitRequestBase);
export default RabbitRequest;
