import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  ArrowLeft,
  Carrot,
  Circle,
  DoorOpen,
  Pause,
  Rabbit,
  Sticker,
} from 'lucide-react-native';
import theme from '../constants/theme';

/**
 * Vector stand-in for the sprite set. Takes the old Image style so every
 * call site keeps its exact box (size, margins, absolute offsets) and only
 * the pixels inside change.
 */
export type AssetIconName =
  | 'rabbit'
  | 'carrot'
  | 'bead'
  | 'door'
  | 'sticker'
  | 'home'
  | 'pause';

type Glyph = React.ComponentType<any>;

const GLYPHS: Record<AssetIconName, Glyph> = {
  rabbit: Rabbit,
  carrot: Carrot,
  bead: Circle,
  door: DoorOpen,
  sticker: Sticker,
  home: ArrowLeft,
  pause: Pause,
};

const TINTS: Record<AssetIconName, string> = {
  rabbit: theme.colors.woodDark,
  carrot: theme.colors.accent,
  bead: theme.colors.primary,
  door: theme.colors.primaryDark,
  sticker: theme.colors.gold,
  home: theme.colors.text,
  pause: theme.colors.text,
};

/** Beads read as solid dots; the outline ring is too thin to count. */
const FILLED: Record<AssetIconName, boolean> = {
  rabbit: false,
  carrot: false,
  bead: true,
  door: false,
  sticker: false,
  home: false,
  pause: true,
};

type Props = {
  name: AssetIconName;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

function AssetIconBase({ name, style, color }: Props) {
  const flat: any = StyleSheet.flatten(style) || {};
  // resizeMode / tintColor are Image-only keys — never hand them to a View.
  const box: any = { ...flat };
  delete box.resizeMode;
  delete box.tintColor;
  const w = typeof box.width === 'number' ? box.width : 24;
  const h = typeof box.height === 'number' ? box.height : w;
  const size = Math.max(12, Math.round(Math.min(w, h) * 0.86));
  const tint = color || flat.tintColor || TINTS[name];
  // lucide strokes live in a 24-unit viewBox, so a flat width would render
  // ~5x thicker on a 120px glyph than on a 24px one. Keep the on-screen
  // weight roughly even instead.
  const stroke = Math.max(1, Math.min(2.4, 52 / size));
  const Icon = GLYPHS[name];

  return (
    <View pointerEvents="none" style={[box, styles.center]}>
      {Icon ? (
        <Icon
          size={size}
          color={tint}
          fill={FILLED[name] ? tint : 'transparent'}
          strokeWidth={stroke}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: tint,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});

export const AssetIcon = memo(AssetIconBase);
export default AssetIcon;
