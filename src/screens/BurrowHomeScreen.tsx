import React, { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Award, Circle, Music, Sparkles, Star } from 'lucide-react-native';
import assets from '../assets';
import AssetIcon from '../components/AssetIcon';
import theme from '../constants/theme';
import { PANTRY_ROOMS, roomFill } from '../game/counting';
import { rangeForLevel } from '../game/levels';
import usePressScale from '../hooks/usePressScale';
import ClayCard from '../components/ClayCard';
import PantryRoomTile from '../components/PantryRoomTile';
import ParentGateButton from '../components/ParentGateButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  carrots: number;
  stars: number;
  mastered: number[];
  level: number;
  onPlay: () => void;
  onFreeBeads: () => void;
  onSong: () => void;
  onPantry: () => void;
  onGrownUp: () => void;
};

/** lucide icons take many SVG props; only the three below are ever passed. */
type LucideIcon = React.ComponentType<any>;

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function Stagger({ index, children }: { index: number; children: ReactNode }) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 380,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ opacity: enter, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function CarrotBadge({ carrots }: { carrots: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pulse.setValue(1);
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.14,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 1,
        tension: 150,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [carrots, pulse]);

  return (
    <Animated.View style={[styles.badge, { transform: [{ scale: pulse }] }]}>
      <AssetIcon name="carrot" style={styles.badgeIcon} />
      <Text style={styles.badgeValue}>{carrots}</Text>
    </Animated.View>
  );
}

function MiniTile({
  Icon,
  color,
  value,
  label,
}: {
  Icon: LucideIcon;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <ClayCard radius={theme.radius.lg} style={styles.miniTile}>
      <Icon size={24} color={color} strokeWidth={2.4} />
      <Text style={[styles.miniValue, { color }]}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </ClayCard>
  );
}

function NavTile({
  Icon,
  color,
  label,
  onPress,
}: {
  Icon: LucideIcon;
  color: string;
  label: string;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.navSlot}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.navTile, { transform: [{ scale }] }]}>
        <Icon size={24} color={color} strokeWidth={2.4} />
        <Text style={styles.navLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** M3 Bento-Hub: the cutaway burrow read as a grid of pantry rooms. */
export default function BurrowHomeScreen({
  carrots,
  stars,
  mastered,
  level,
  onPlay,
  onFreeBeads,
  onSong,
  onPantry,
  onGrownUp,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const range = rangeForLevel(level);

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="ABACUS BEAD BURROW"
        leftSlot={<Image source={assets.logo} style={styles.headerLogo} />}
        rightSlot={<CarrotBadge carrots={carrots} />}
      />

      <View style={styles.body}>
        <Stagger index={0}>
          <ClayCard style={styles.greeting}>
            <AssetIcon name="rabbit" style={styles.rabbit} />
            <View style={styles.speech}>
              <View pointerEvents="none" style={styles.tail} />
              <Text style={styles.speechTitle} numberOfLines={1}>
                LET US FILL THE PANTRY!
              </Text>
              <View style={styles.speechRow}>
                <AssetIcon name="bead" style={styles.speechBead} />
                <Text style={styles.speechSub} numberOfLines={1}>
                  LEVEL {level} . UP TO {range[1]}
                </Text>
              </View>
            </View>
          </ClayCard>
        </Stagger>

        <Stagger index={1}>
          <View style={styles.rowA}>
            <Pressable
              onPress={onPlay}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="START COUNTING"
              style={styles.playSlot}>
              <Animated.View
                pointerEvents="box-none"
                style={[styles.playFill, { transform: [{ scale }] }]}>
                <LinearGradient
                  colors={[...theme.gradients.green]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.playGradient, theme.shadows.green]}>
                  <View pointerEvents="none" style={styles.playTop} />
                  <AssetIcon
                    name="door"
                    style={styles.playIcon}
                    color={theme.colors.onPrimary}
                  />
                  <Text style={styles.playLabel}>START COUNTING</Text>
                  <Text style={styles.playHint}>TAP TO HELP THE RABBIT</Text>
                </LinearGradient>
              </Animated.View>
            </Pressable>

            <View style={styles.rowASide}>
              <MiniTile
                Icon={Award}
                color={theme.colors.primary}
                value={`${mastered.length}/20`}
                label="NUMBERS"
              />
              <MiniTile
                Icon={Star}
                color={theme.colors.gold}
                value={`${stars}`}
                label="STARS"
              />
            </View>
          </View>
        </Stagger>

        <Stagger index={2}>
          <View style={styles.rowB}>
            {PANTRY_ROOMS.map(room => (
              <PantryRoomTile
                key={room.label}
                label={room.label}
                filled={roomFill(mastered, room.index)}
                capacity={room.capacity}
                height={96}
              />
            ))}
          </View>
        </Stagger>

        <Stagger index={3}>
          <View style={styles.rowC}>
            <NavTile
              Icon={Music}
              color={theme.colors.violet}
              label="SONG"
              onPress={onSong}
            />
            <NavTile
              Icon={Circle}
              color={theme.colors.sky}
              label="FREE BEADS"
              onPress={onFreeBeads}
            />
            <NavTile
              Icon={Sparkles}
              color={theme.colors.gold}
              label="STICKERS"
              onPress={onPantry}
            />
          </View>
        </Stagger>

        <Stagger index={4}>
          <ParentGateButton
            onUnlock={onGrownUp}
            label="GROWN-UP CORNER . HOLD 3s"
          />
        </Stagger>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  headerLogo: { width: 40, height: 40, resizeMode: 'contain' },

  badge: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: '#D9603C',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  badgeIcon: { width: 24, height: 24 },
  badgeValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.accentDark,
  },

  greeting: {
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  rabbit: { width: 84, height: 84 },
  speech: {
    flex: 1,
    minHeight: 76,
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tail: {
    position: 'absolute',
    left: -7,
    top: 28,
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: theme.colors.bg,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.border,
    transform: [{ rotate: '45deg' }],
  },
  speechTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text,
  },
  speechRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speechBead: { width: 24, height: 24 },
  speechSub: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
  },

  rowA: { flexDirection: 'row', gap: 12, height: 186 },
  playSlot: { flex: 2, height: 186 },
  playFill: { width: '100%', height: '100%' },
  playGradient: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  playTop: {
    position: 'absolute',
    top: 4,
    left: 22,
    right: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  playIcon: { width: 76, height: 76 },
  playLabel: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: theme.colors.onPrimary,
    textAlign: 'center',
  },
  playHint: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  rowASide: { flex: 1, gap: 12 },
  miniTile: {
    width: '100%',
    height: 87,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  miniValue: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },
  miniLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },

  rowB: { flexDirection: 'row', gap: 12, height: 96 },

  rowC: { flexDirection: 'row', gap: 12, height: 72 },
  navSlot: { flex: 1, height: 72 },
  navTile: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  navLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
