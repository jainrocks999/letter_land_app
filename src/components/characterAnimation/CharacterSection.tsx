import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CharacterSectionProps {
  isSpeaking: boolean;
}

const CharacterSection: React.FC<CharacterSectionProps> = ({ isSpeaking }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    characterAnimation();
  }, [isSpeaking]);

  const characterAnimation = () => {
    if (isSpeaking) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 180 }),
          withTiming(0.96, { duration: 120 }),
          withTiming(1.08, { duration: 180 }),
          withTiming(1, { duration: 250 }),
          withDelay(250, withTiming(1)),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 200 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: '75%',
    width: '100%',
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <Image
          source={
            isSpeaking
              ? require('../../assets/images/character/speaking.png')
              : require('../../assets/images/character/standing.png')
          }
          style={styles.img}
        />
      </Animated.View>
      <Text style={styles.title}>Learning Buddy</Text>
    </View>
  );
};

export default CharacterSection;
const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    justifyContent: 'space-between',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 5,
    textAlign: 'center',
    borderRadius: 50,
    color: '#d84d16ce',
    fontSize: 12,
  },
});
