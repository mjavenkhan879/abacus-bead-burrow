import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AssetIcon from './AssetIcon';
import theme from '../constants/theme';

type Props = {
  label: string;
  filled: number;
  capacity: number;
  height: number;
};

/**
 * A cutaway pantry room. The orange column grows from the shelf line — a height
 * animation, so useNativeDriver stays false here (it is illegal on height).
 */
function PantryRoomTileBase({ label, filled, capacity, height }: Props) {
  const pct = capacity > 0 ? Math.min(filled / capacity, 1) : 0;
  const grow = useRef(new Animated.Value(0)).current;
  const maxFill = height - 26;

  useEffect(() => {
    Animated.timing(grow, {
      toValue: pct * maxFill,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pct, maxFill, grow]);

  return (
    <View style={[styles.room, { height }]}>
      <View pointerEvents="none" style={styles.highlight} />
      <Animated.View pointerEvents="none" style={[styles.fill, { height: grow }]} />
      <View pointerEvents="none" style={styles.shelf} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {filled}/{capacity}
      </Text>
      {pct >= 1 ? (
        <AssetIcon name="sticker" style={styles.sticker} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  room: {
    flex: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    backgroundColor: 'rgba(244,132,95,0.38)',
  },
  shelf: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    backgroundColor: theme.colors.bgDark,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text,
  },
  value: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: theme.colors.accentDark,
  },
  sticker: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
  },
});

export const PantryRoomTile = memo(PantryRoomTileBase);
export default PantryRoomTile;
