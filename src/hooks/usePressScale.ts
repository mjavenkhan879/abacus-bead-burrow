import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Shared press-feedback helper. The Pressable is always the PARENT and the
 * Animated.View the CHILD — an Animated.View wrapping a Pressable swallows
 * onPress on Android release builds.
 */
export function usePressScale(pressed = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed,
      tension: theme.animation.button.tension,
      friction: theme.animation.button.friction,
      useNativeDriver: true,
    }).start();
  }, [pressed, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.button.tension,
      friction: theme.animation.button.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
