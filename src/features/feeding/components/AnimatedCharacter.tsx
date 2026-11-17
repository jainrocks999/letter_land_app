import { Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { rf } from '../../../utils/responsive';

interface Props {
  state: 'standing' | 'feed' | 'enjoy' | 'oops' | 'speaking';
}

const AnimatedCharacter = ({ state }: Props) => {
  const translateY = useSharedValue(0);

  const image =
    state === 'feed'
      ? require('../../../assets/images/character/feedme.gif')
      : state === 'enjoy'
      ? require('../../../assets/images/character/yummy.gif')
      : state === 'oops'
      ? require('../../../assets/images/character/uhha.gif')
      : state === 'speaking'
      ? require('../../../assets/images/character/speaking.gif')
      : require('../../../assets/images/character/standing.gif');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const jump = () => {
    translateY.value = withSequence(
      withTiming(-rf(25), { duration: 150 }),
      withTiming(0, { duration: 180 }),
    );
  };

  return (
    <Pressable onPress={jump}>
      <Animated.Image
        key={state}
        source={image}
        style={[{ width: rf(200), height: rf(200) }, animatedStyle]}
      />
    </Pressable>
  );
};

export default AnimatedCharacter;
