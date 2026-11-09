import React, { memo } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

export type ClayButtonVariant = 'primary' | 'secondary' | 'tertiary';

/** lucide icons take many SVG props; only the three below are ever passed. */
type LucideIcon = React.ComponentType<any>;

type Props = {
  title: string;
  onPress: () => void;
  variant?: ClayButtonVariant;
  /** Sprite icon — forced to the exact button icon size. */
  iconSource?: ImageSourcePropType;
  /** lucide icon — same size contract as the sprite. */
  Icon?: LucideIcon;
  iconColor?: string;
  disabled?: boolean;
  gradient?: string[];
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/** Rule #20: 28px icon on primary, 24px everywhere else, lineHeight == icon. */
const ICON_SIZE: Record<ClayButtonVariant, number> = {
  primary: 28,
  secondary: 24,
  tertiary: 24,
};

const HEIGHT: Record<ClayButtonVariant, number> = {
  primary: 64,
  secondary: 48,
  tertiary: 48,
};

const FONT_SIZE: Record<ClayButtonVariant, number> = {
  primary: 18,
  secondary: 14,
  tertiary: 14,
};

function ClayButtonBase({
  title,
  onPress,
  variant = 'primary',
  iconSource,
  Icon,
  iconColor,
  disabled = false,
  gradient,
  style,
  accessibilityLabel,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  const icon = ICON_SIZE[variant];
  const height = HEIGHT[variant];
  const isPrimary = variant === 'primary';

  const labelColor = disabled
    ? theme.colors.textMuted
    : isPrimary
    ? theme.colors.onPrimary
    : variant === 'secondary'
    ? theme.colors.text
    : theme.colors.textSecondary;

  const tint = iconColor || labelColor;

  const inner = (
    <View style={[styles.row, { gap: 10 }]}>
      {iconSource ? (
        <Image
          source={iconSource}
          style={{ width: icon, height: icon, resizeMode: 'contain' }}
        />
      ) : null}
      {Icon ? <Icon size={icon} color={tint} strokeWidth={2.4} /> : null}
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          {
            fontSize: FONT_SIZE[variant],
            lineHeight: icon,
            color: labelColor,
          },
        ]}>
        {title}
      </Text>
    </View>
  );

  const shell: ViewStyle = {
    height,
    borderRadius: isPrimary ? theme.radius.lg : theme.radius.md,
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={[styles.press, shell, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, shell, { transform: [{ scale }] }]}>
        {isPrimary && !disabled ? (
          <LinearGradient
            colors={gradient || [...theme.gradients.carrot]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fill, shell, theme.shadows.carrot]}>
            <View pointerEvents="none" style={styles.innerTop} />
            {inner}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.fill,
              shell,
              variant === 'tertiary' ? styles.tertiary : styles.secondary,
              disabled ? styles.disabled : theme.shadows.soft,
            ]}>
            {inner}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', overflow: 'visible' },
  fill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  label: {
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  tertiary: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  innerTop: {
    position: 'absolute',
    top: 3,
    left: 16,
    right: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export const ClayButton = memo(ClayButtonBase);
export default ClayButton;
