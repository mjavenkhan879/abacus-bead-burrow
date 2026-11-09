import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

type Props = { playing: boolean };

const COUNT = 12;
const SEEDS = [8, 26, 44, 62, 80, 18, 36, 54, 72, 90, 12, 68];

function Particle({ index, playing }: { index: number; playing: boolean }) {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!playing) {
      rise.setValue(0);
      return;
    }
    rise.setValue(0);
    const anim = Animated.timing(rise, {
      toValue: 1,
      duration: 900,
      delay: index * 40,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [playing, index, rise]);

  const translateY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });
  const opacity = rise.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });
  const scale = rise.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.5, 1.1, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${SEEDS[index % SEEDS.length]}%`,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
}

/** 12 star specks rising out of the carrot tray on a correct answer. */
function CelebrationStarsBase({ playing }: Props) {
  const items = [];
  for (let i = 0; i < COUNT; i += 1) {
    items.push(<Particle key={`spark-${i}`} index={i} playing={playing} />);
  }
  return (
    <View pointerEvents="none" style={styles.layer}>
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  star: {
    position: 'absolute',
    bottom: 10,
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: theme.colors.gold,
    transform: [{ rotate: '45deg' }],
  },
});

export const CelebrationStars = memo(CelebrationStarsBase);
export default CelebrationStars;
