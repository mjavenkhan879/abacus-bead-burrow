import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import { FADE_MS, LOADER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';
import ScreenBackground from '../components/ScreenBackground';

type Props = { onDone: () => void };

const SPECKS = [
  { top: 90, left: 40, size: 8 },
  { top: 150, left: 300, size: 5 },
  { top: 210, left: 120, size: 10 },
  { top: 260, left: 250, size: 6 },
  { top: 330, left: 60, size: 4 },
  { top: 400, left: 330, size: 9 },
  { top: 470, left: 170, size: 5 },
  { top: 530, left: 50, size: 7 },
  { top: 600, left: 290, size: 6 },
  { top: 660, left: 140, size: 4 },
  { top: 710, left: 240, size: 8 },
  { top: 760, left: 80, size: 5 },
];

/**
 * Dusk burrow splash — deliberately dark so it can never be confused with the
 * pale menu. Holds for LOADER_DURATION_MS (8000) before handing over.
 */
export default function LoaderScreen({ onDone }: Props) {
  const plate = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const subtitle = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(plate, {
      toValue: 1,
      tension: 34,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(breathe, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    Animated.timing(title, {
      toValue: 1,
      duration: 460,
      delay: 240,
      useNativeDriver: true,
    }).start();

    Animated.timing(subtitle, {
      toValue: 1,
      duration: 460,
      delay: 520,
      useNativeDriver: true,
    }).start();

    // width animation -> native driver must stay off here
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [plate, breathe, title, subtitle, bar, fade, onDone]);

  const plateScale = Animated.multiply(
    plate.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }),
    breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }),
  );

  const titleShift = title.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <ScreenBackground variant="loader">
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {SPECKS.map((s, i) => (
            <View
              key={`speck-${i}`}
              style={[
                styles.speck,
                {
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.body}>
          <Animated.View
            style={[
              styles.plate,
              { opacity: plate, transform: [{ scale: plateScale }] },
            ]}>
            <View pointerEvents="none" style={styles.plateRing} />
            <Image source={assets.logo} style={styles.logo} />
          </Animated.View>

          <Animated.View
            style={{ opacity: title, transform: [{ translateY: titleShift }] }}>
            <Text style={styles.line1}>ABACUS BEAD</Text>
            <Text style={styles.line2}>BURROW</Text>
          </Animated.View>

          <Animated.Text style={[styles.subtitle, { opacity: subtitle }]}>
            COUNT WITH THE RABBIT
          </Animated.Text>

          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={[...theme.gradients.progress]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>

        <Text style={styles.footer}>AGES 3+ . NO ADS . NO PURCHASES</Text>
      </ScreenBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.loaderA },
  speck: { position: 'absolute', backgroundColor: 'rgba(244,132,95,0.10)' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  plate: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
  plateRing: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 99,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  logo: { width: 190, height: 190, resizeMode: 'contain' },
  line1: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: theme.colors.surfaceAlt,
    textAlign: 'center',
  },
  line2: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.colors.accent,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#CFE1B9',
    opacity: 0.9,
    textAlign: 'center',
  },
  track: {
    marginTop: 34,
    width: 212,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(246,251,238,0.16)',
    overflow: 'hidden',
  },
  fillWrap: { height: 12, borderRadius: 6, overflow: 'hidden' },
  fill: { flex: 1, borderRadius: 6 },
  loading: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#5A6B4A',
  },
});
