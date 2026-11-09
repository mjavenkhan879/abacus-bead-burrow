import React, { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'win' | 'plain';

type Props = {
  variant: BackgroundVariant;
  children: ReactNode;
  style?: ViewStyle;
};

const OVERLAYS: Record<BackgroundVariant, string[]> = {
  loader: [...theme.gradients.loader],
  menu: [...theme.gradients.menuOverlay],
  game: [...theme.gradients.gameOverlay],
  win: [...theme.gradients.winOverlay],
  plain: [...theme.gradients.plainOverlay],
};

/** Base tone under the overlay — keeps every screen a different depth. */
const BASE: Record<BackgroundVariant, string> = {
  loader: theme.colors.loaderA,
  menu: theme.colors.bg,
  game: theme.colors.bgDeep,
  win: theme.colors.surfaceAlt,
  plain: theme.colors.bg,
};

const BLOBS: Record<BackgroundVariant, Array<ViewStyle>> = {
  loader: [
    { top: 90, left: -70, width: 220, height: 220, borderRadius: 110 },
    { bottom: 60, right: -80, width: 260, height: 260, borderRadius: 130 },
  ],
  menu: [
    { top: -40, left: -60, width: 240, height: 240, borderRadius: 120 },
    { bottom: -70, right: -70, width: 300, height: 300, borderRadius: 150 },
    { top: 320, right: -50, width: 180, height: 180, borderRadius: 90 },
  ],
  game: [
    { top: 140, left: -70, width: 200, height: 200, borderRadius: 100 },
    { bottom: 40, right: -60, width: 230, height: 230, borderRadius: 115 },
  ],
  win: [
    { top: 60, left: -50, width: 240, height: 240, borderRadius: 120 },
    { bottom: -40, right: -60, width: 280, height: 280, borderRadius: 140 },
  ],
  plain: [
    { top: 120, right: -60, width: 210, height: 210, borderRadius: 105 },
    { bottom: -50, left: -60, width: 240, height: 240, borderRadius: 120 },
  ],
};

const BLOB_COLOR: Record<BackgroundVariant, string> = {
  loader: 'rgba(244,132,95,0.10)',
  menu: 'rgba(106,153,78,0.12)',
  game: 'rgba(106,153,78,0.10)',
  win: 'rgba(244,132,95,0.14)',
  plain: 'rgba(106,153,78,0.10)',
};

function ScreenBackgroundBase({ variant, children, style }: Props) {
  const blobColor = BLOB_COLOR[variant];
  return (
    <View style={[styles.root, { backgroundColor: BASE[variant] }, style]}>
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BLOBS[variant].map((blob, i) => (
          <View
            key={`blob-${i}`}
            style={[styles.blob, blob, { backgroundColor: blobColor }]}
          />
        ))}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  blob: { position: 'absolute' },
});

export const ScreenBackground = memo(ScreenBackgroundBase);
export default ScreenBackground;
