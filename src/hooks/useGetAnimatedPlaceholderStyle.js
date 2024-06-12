import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const useGetAnimatedPlaceholderStyle = (shouldStartAnimation) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const stopAnimation = useCallback(() => pulseAnim.stopAnimation(), [pulseAnim]);

  useEffect(() => {
    if (shouldStartAnimation) {
      const sharedAnimationConfig = {
        duration: 1000,
        useNativeDriver: true,
      };
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            toValue: 1,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            toValue: 0,
            easing: Easing.in(Easing.ease),
          }),
        ]),
      ).start();
    }

    return () => {
      stopAnimation();
    };
  }, [shouldStartAnimation, pulseAnim, stopAnimation]);

  useEffect(() => {
    if (!shouldStartAnimation) {
      stopAnimation();
    }
  }, [stopAnimation, shouldStartAnimation]);

  const opacityAnimation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.55],
  });

  return opacityAnimation;
};

export default useGetAnimatedPlaceholderStyle;
