import React, { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Tone = 'surface' | 'alt' | 'warm';

type Props = {
  tone?: Tone;
  radius?: number;
  deep?: boolean;
  highlight?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
};

const TONES: Record<Tone, string> = {
  surface: theme.colors.surface,
  alt: theme.colors.surfaceAlt,
  warm: theme.colors.surfaceWarm,
};

/**
 * Claymorphism surface: solid fill, fat radius, tinted outer shadow and a thin
 * inner top highlight bar (pointerEvents none so it never eats a tap).
 */
function ClayCardBase({
  tone = 'surface',
  radius = theme.radius.xl,
  deep = false,
  highlight = true,
  style,
  children,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        deep ? theme.shadows.clayDeep : theme.shadows.clay,
        { backgroundColor: TONES[tone], borderRadius: radius },
        style,
      ]}>
      {highlight ? (
        <View
          pointerEvents="none"
          style={[styles.highlight, { borderRadius: radius }]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'visible',
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 14,
    right: 14,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export const ClayCard = memo(ClayCardBase);
export default ClayCard;
