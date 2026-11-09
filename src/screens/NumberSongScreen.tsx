import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AssetIcon from '../components/AssetIcon';
import { NUMBER_WORDS, SONG_STEP_MS } from '../constants/config';
import theme from '../constants/theme';
import ClayButton from '../components/ClayButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import usePressScale from '../hooks/usePressScale';

type Props = {
  onBack: () => void;
  onCarrots: (n: number) => void;
};

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const STEPS = 10;

function SongBead({ index, active }: { index: number; active: boolean }) {
  const grow = useRef(new Animated.Value(active ? 1.2 : 1)).current;

  useEffect(() => {
    Animated.spring(grow, {
      toValue: active ? 1.2 : 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [active, grow]);

  return (
    <Animated.View
      style={[
        styles.songBead,
        {
          backgroundColor: active
            ? theme.beads[index % theme.beads.length]
            : theme.colors.bgDeep,
          transform: [{ scale: grow }],
        },
      ]}
    />
  );
}

/** Tap-along counting song. Auto-advances so the song keeps going by itself. */
export default function NumberSongScreen({ onBack, onCarrots }: Props) {
  const [current, setCurrent] = useState(1);
  const [playing, setPlaying] = useState(true);
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  const advance = useCallback(() => {
    setCurrent(prev => (prev >= STEPS ? 1 : prev + 1));
  }, []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = setInterval(advance, SONG_STEP_MS);
    return () => clearInterval(id);
  }, [playing, advance]);

  const handleTap = useCallback(() => {
    advance();
    onCarrots(1);
  }, [advance, onCarrots]);

  const beads = [];
  for (let i = 0; i < STEPS; i += 1) {
    beads.push(
      <SongBead key={`song-${i}`} index={i} active={i < current} />,
    );
  }

  return (
    <ScreenBackground variant="plain">
      <ScreenHeader
        title="NUMBER SONG"
        subtitle="TAP ALONG TO COUNT"
        leftSlot={
          <Pressable
            onPress={onBack}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="BACK TO BURROW"
            style={styles.iconButton}>
            <AssetIcon name="home" style={styles.iconImage} />
          </Pressable>
        }
        rightSlot={
          <View style={styles.badge}>
            <AssetIcon name="bead" style={styles.badgeIcon} />
            <Text style={styles.badgeValue}>{current}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.stage}>
          <View style={styles.wire}>{beads}</View>
          <View style={styles.numberBlock}>
            <Text style={styles.bigNumber}>{current}</Text>
            <Text style={styles.word}>{NUMBER_WORDS[current]}</Text>
          </View>
        </View>

        <Pressable
          onPress={handleTap}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="TAP"
          style={styles.tapSlot}>
          <Animated.View
            pointerEvents="box-none"
            style={[styles.tapButton, { transform: [{ scale }] }]}>
            <AssetIcon name="bead" style={styles.tapIcon} />
            <Text style={styles.tapLabel}>TAP</Text>
          </Animated.View>
        </Pressable>

        <View style={styles.buttons}>
          <ClayButton
            title={playing ? 'PAUSE SONG' : 'START SONG'}
            variant="primary"
            gradient={[...theme.gradients.greenShort]}
            onPress={() => setPlaying(prev => !prev)}
          />
          <ClayButton
            title="BACK TO BURROW"
            variant="secondary"
            onPress={onBack}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stage: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  wire: {
    width: 44,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(200,177,138,0.35)',
  },
  songBead: { width: 22, height: 22, borderRadius: 11 },
  numberBlock: { flex: 1, alignItems: 'center' },
  bigNumber: {
    fontSize: 88,
    lineHeight: 100,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  word: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textSecondary,
  },
  tapSlot: { width: 112, height: 112, alignItems: 'center' },
  tapButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 3,
    borderColor: theme.colors.accentDark,
    shadowColor: '#D9603C',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  tapIcon: { width: 40, height: 40 },
  tapLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.onPrimary,
  },
  buttons: { width: '100%', gap: 10 },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: { width: 24, height: 24 },
  badge: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.violet,
  },
  badgeIcon: { width: 24, height: 24 },
  badgeValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.violet,
  },
});
