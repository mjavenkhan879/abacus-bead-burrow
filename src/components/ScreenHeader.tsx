import React, { memo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  /** Rendered under the title — e.g. the round ProgressDots. */
  belowSlot?: ReactNode;
};

/**
 * One header for every non-loader screen. Different slots per screen, identical
 * padding / surface / border so the screens never drift apart visually.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  belowSlot,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {belowSlot}
      </View>
      <View style={[styles.side, styles.right]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    minHeight: 116,
    paddingBottom: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  side: {
    minWidth: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: { alignItems: 'flex-end' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
