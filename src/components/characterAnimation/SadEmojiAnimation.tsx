import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LottieAnimation from '../LottieAnimation/LottieAnimation';
import { rf } from '../../utils/responsive';

const SLIDE_DISTANCE = rf(30);

const SadEmojiAnimation = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      }),
      withDelay(600, withTiming(1, { duration: 0 })),
      withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      }),
      withDelay(150, withTiming(0, { duration: 0 })),
    );
  }, [progress]);

  const animationStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateX: SLIDE_DISTANCE * (1 - progress.value),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animationStyle]}>
      <LottieAnimation
        animation={require('../../assets/animations/Sad - Failed.json')}
        style={{
          height: '70%',
          width: '70%',
        }}
        loop={true}
      />
    </Animated.View>
  );
};

export default SadEmojiAnimation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    left: '18%',
    top: '10%',
    height: rf(50),
    width: rf(65),
    borderTopLeftRadius: rf(20),
    borderBottomLeftRadius: rf(20),
    borderTopRightRadius: rf(20),
    borderWidth: 2,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eb5757',
  },
});
