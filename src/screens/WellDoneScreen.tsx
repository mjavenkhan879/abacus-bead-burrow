import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { DoorOpen, Sparkles } from 'lucide-react-native';
import assets from '../assets';
import AssetIcon from '../components/AssetIcon';
import theme from '../constants/theme';
import {
  masteredPct,
  PANTRY_ROOMS,
  roomFill,
  roomForNumber,
  starsForSession,
} from '../game/counting';
import ClayButton from '../components/ClayButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import StatPill from '../components/StatPill';

type Props = {
  correct: number;
  rounds: number;
  sessionCarrots: number;
  best: number;
  lastNumber: number;
  mastered: number[];
  onPlayAgain: () => void;
  onPantry: () => void;
  onMenu: () => void;
};

const SPECKS = [
  { left: 24, top: 10 },
  { left: 96, top: 54 },
  { left: 168, top: 22 },
  { left: 236, top: 70 },
  { left: 300, top: 18 },
  { left: 348, top: 62 },
  { left: 56, top: 120 },
  { left: 268, top: 132 },
];

function StarBadge({ index, earned }: { index: number; earned: boolean }) {
  const pop = useRef(new Animated.Value(earned ? 0 : 1)).current;

  useEffect(() => {
    if (!earned) {
      pop.setValue(1);
      return;
    }
    pop.setValue(0);
    Animated.sequence([
      Animated.delay(index * 220),
      Animated.spring(pop, {
        toValue: 1,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [earned, index, pop]);

  const scale = pop.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  return (
    <Animated.View
      accessibilityLabel={earned ? 'star earned' : 'star locked'}
      style={[
        styles.starBadge,
        earned ? null : styles.starLocked,
        { transform: [{ scale }] },
      ]}>
      <AssetIcon name="sticker" style={styles.starGlyph} />
    </Animated.View>
  );
}

/** Rule #12's discrete result screen — the brief's "Well Done". */
export default function WellDoneScreen({
  correct,
  rounds,
  sessionCarrots,
  best,
  lastNumber,
  mastered,
  onPlayAgain,
  onPantry,
  onMenu,
}: Props) {
  const title = useRef(new Animated.Value(0)).current;
  const dance = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(title, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dance, {
          toValue: 1,
          duration: 260,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dance, {
          toValue: -1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dance, {
          toValue: 0,
          duration: 260,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(hop, {
          toValue: 1,
          duration: 310,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(hop, {
          toValue: 0,
          duration: 310,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [title, dance, hop]);

  const earned = starsForSession(correct, rounds);
  const room = roomForNumber(lastNumber > 0 ? lastNumber : 1);
  const roomCfg = PANTRY_ROOMS[room];
  const filled = roomFill(mastered, room);
  const pct = Math.round((filled / roomCfg.capacity) * 100);

  const titleScale = title.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const rotate = dance.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg'],
  });
  const translateY = hop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <ScreenBackground variant="win">
      <ScreenHeader
        title="WELL DONE"
        subtitle={`${masteredPct(mastered)}% OF THE PANTRY LEARNED`}
        leftSlot={<Image source={assets.logo} style={styles.headerLogo} />}
        rightSlot={
          <View style={styles.headerBadge}>
            <AssetIcon name="carrot" style={styles.headerCarrot} />
            <Text style={styles.headerValue}>{sessionCarrots}</Text>
          </View>
        }
      />

      <View pointerEvents="none" style={styles.speckLayer}>
        {SPECKS.map((s, i) => (
          <View key={`spark-${i}`} style={[styles.speck, s]} />
        ))}
      </View>

      <View style={styles.body}>
        <Animated.View
          accessibilityLabel="rabbit"
          style={[styles.rabbit, { transform: [{ rotate }, { translateY }] }]}>
          <AssetIcon name="rabbit" style={styles.rabbitGlyph} />
        </Animated.View>

        <View style={styles.titleRow}>
          <AssetIcon name="bead" style={styles.sprig} />
          <Animated.Text
            style={[styles.title, { transform: [{ scale: titleScale }] }]}>
            WELL DONE!
          </Animated.Text>
          <AssetIcon name="bead" style={styles.sprig} />
        </View>

        <View style={styles.stars}>
          <StarBadge index={0} earned={earned >= 1} />
          <StarBadge index={1} earned={earned >= 2} />
          <StarBadge index={2} earned={earned >= 3} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatPill
              value={sessionCarrots}
              label="CARROTS"
              valueColor={theme.colors.accentDark}
            />
          </View>
          <View style={styles.statSlot}>
            <StatPill
              value={`${correct}/${rounds}`}
              label="CORRECT"
              valueColor={theme.colors.primary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatPill
              value={best}
              label="BEST"
              valueColor={theme.colors.gold}
            />
          </View>
        </View>

        <View style={styles.pantryCard}>
          <Text style={styles.pantryText}>
            PANTRY ROOM {roomCfg.label} IS {pct}% FULL
          </Text>
          <View style={styles.pantryTrack}>
            <View style={[styles.pantryFill, { width: `${pct}%` }]} />
          </View>
        </View>

        <View style={styles.buttons}>
          <ClayButton
            title="COUNT AGAIN"
            variant="primary"
            Icon={DoorOpen}
            gradient={[...theme.gradients.greenShort]}
            onPress={onPlayAgain}
          />
          <ClayButton
            title="STICKER PANTRY"
            variant="secondary"
            Icon={Sparkles}
            iconColor={theme.colors.gold}
            onPress={onPantry}
          />
          <ClayButton
            title="BACK TO BURROW"
            variant="tertiary"
            onPress={onMenu}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  headerLogo: { width: 40, height: 40, resizeMode: 'contain' },
  headerBadge: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  headerCarrot: { width: 24, height: 24 },
  headerValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.accentDark,
  },

  speckLayer: { ...StyleSheet.absoluteFillObject, top: 120 },
  speck: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: theme.colors.gold,
    opacity: 0.5,
    transform: [{ rotate: '45deg' }],
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rabbit: { width: 140, height: 140 },
  rabbitGlyph: { width: 140, height: 140 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  sprig: { width: 26, height: 26, opacity: 0.85 },
  title: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.primary,
    textAlign: 'center',
  },

  stars: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  starBadge: { width: 54, height: 54 },
  starGlyph: { width: 54, height: 54 },
  starLocked: { opacity: 0.25 },

  statsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  statSlot: { flex: 1 },

  pantryCard: {
    width: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pantryText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  pantryTrack: {
    marginTop: 8,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.bgDeep,
    overflow: 'hidden',
  },
  pantryFill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
  },

  buttons: { width: '100%', gap: 10 },
});
