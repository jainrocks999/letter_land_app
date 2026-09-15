import { Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  state: 'standing' | 'feed' | 'enjoy' | 'oops' | 'speaking';
}

const AnimatedCharacter = ({ state }: Props) => {
  const [isHungry, setIsHungry] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const translateY = useSharedValue(0);

  const image =
    // state === 'feed'
    //   ? require('../../../assets/images/character/feedme.png')
    //   : state === 'enjoy'
    //   ? require('../../../assets/images/character/yummy.png')
    //   : state === 'oops'
    //   ? require('../../../assets/images/character/uhha.png')
    //   : require('../../../assets/images/character/standing.png');
    state === 'feed'
      ? require('../../../assets/images/character/feedme.gif')
      : state === 'enjoy'
      ? require('../../../assets/images/character/yummy.gif')
      : state === 'oops'
      ? require('../../../assets/images/character/uhha.gif')
      : state === 'speaking'
      ? require('../../../assets/images/character/speaking.png')
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
      withTiming(-25, { duration: 150 }),
      withTiming(0, { duration: 180 }),
    );
  };

  const onPress = () => {
    jump();
    if (!isHungry) {
      setIsHungry(true);
    }
    setTimeout(() => {
      setIsPressed(false);
      setIsHungry(false);
    }, 4000);
  };

  return (
    <Pressable onPress={jump}>
      <Animated.Image
        key={state}
        source={image}
        style={[{ width: 200, height: 200 }, animatedStyle]}
      />
    </Pressable>
  );
};

export default AnimatedCharacter;

const styles = StyleSheet.create({});
