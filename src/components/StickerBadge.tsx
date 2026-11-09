import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import AssetIcon from './AssetIcon';
import { PANTRY_TILE } from '../constants/config';
import theme from '../constants/theme';

type Props = { number: number; earned: boolean; index: number };

function StickerBadgeBase({ number, earned, index }: Props) {
  const scale = useRef(new Animated.Value(earned ? 0 : 1)).current;

  useEffect(() => {
    if (!earned) {
      scale.setValue(1);
      return;
    }
    scale.setValue(0);
    Animated.spring(scale, {
      toValue: 1,
      tension: 150,
      friction: 7,
      delay: Math.min(index, 10) * 45,
      useNativeDriver: true,
    }).start();
  }, [earned, index, scale]);

  return (
    <Animated.View
      style={[
        styles.tile,
        earned ? styles.earned : styles.empty,
        { transform: [{ scale }] },
      ]}>
      {earned ? (
        <AssetIcon name="sticker" style={styles.sticker} />
      ) : null}
      <Text style={[styles.num, earned ? styles.numOn : styles.numOff]}>
        {number}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: PANTRY_TILE,
    height: PANTRY_TILE,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earned: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  empty: {
    backgroundColor: theme.colors.bg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
  },
  sticker: {
    width: Math.round(PANTRY_TILE * 0.56),
    height: Math.round(PANTRY_TILE * 0.56),
  },
  num: { fontSize: 15, lineHeight: 18, fontWeight: '900' },
  numOn: { color: theme.colors.primary },
  numOff: { color: theme.colors.bgDark },
});

export const StickerBadge = memo(StickerBadgeBase);
export default StickerBadge;
