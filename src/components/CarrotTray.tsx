import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AssetIcon from './AssetIcon';
import { CARROT_POP_MS, CARROT_SIZE, TRAY_H } from '../constants/config';
import theme from '../constants/theme';

type Props = { count: number; label: string };

function Carrot({ index }: { index: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 150,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: CARROT_POP_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, lift]);

  return (
    <Animated.View
      accessibilityLabel={`carrot ${index + 1}`}
      style={[
        styles.carrot,
        { transform: [{ scale }, { translateY: lift }] },
      ]}>
      <AssetIcon name="carrot" style={styles.carrotGlyph} />
    </Animated.View>
  );
}

/** The counted beads turn into carrots here, one overshooting pop each. */
function CarrotTrayBase({ count, label }: Props) {
  const carrots = [];
  for (let i = 0; i < count; i += 1) {
    carrots.push(<Carrot key={`carrot-${i}`} index={i} />);
  }

  return (
    <View style={styles.tray}>
      <View pointerEvents="none" style={styles.highlight} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {count > 0 ? (
          carrots
        ) : (
          <Text style={styles.empty}>SLIDE A BEAD TO FILL THE TRAY</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    height: TRAY_H,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceWarm,
    borderWidth: 2,
    borderColor: theme.colors.borderWarm,
    paddingHorizontal: 12,
    paddingTop: 7,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 14,
    right: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  carrot: {
    width: CARROT_SIZE,
    height: CARROT_SIZE,
  },
  carrotGlyph: { width: CARROT_SIZE, height: CARROT_SIZE },
  empty: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
});

export const CarrotTray = memo(CarrotTrayBase);
export default CarrotTray;
